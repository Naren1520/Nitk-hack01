import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to verify user authentication
async function verifyAuth(c: any) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { error: 'Unauthorized', status: 401 };
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return { error: 'Invalid token', status: 401 };
  }

  return { user };
}

// Initialize storage buckets on startup
async function initializeStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    
    const requiredBuckets = [
      'make-51e2cda7-documents',
      'make-51e2cda7-materials',
      'make-51e2cda7-assignments',
      'make-51e2cda7-syllabus'
    ];

    for (const bucketName of requiredBuckets) {
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      if (!bucketExists) {
        await supabase.storage.createBucket(bucketName, { public: false });
        console.log(`Created bucket: ${bucketName}`);
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

// Initialize storage on server start
initializeStorage();

// Health check endpoint
app.get("/make-server-51e2cda7/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// User Registration
app.post("/make-server-51e2cda7/auth/register", async (c) => {
  try {
    const { email, password, firstName, lastName, role = 'student', department } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        first_name: firstName,
        last_name: lastName,
        role,
        department,
        created_at: new Date().toISOString()
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    await kv.set(`user_profile_${data.user.id}`, {
      id: data.user.id,
      email,
      firstName,
      lastName,
      role,
      department,
      avatar_url: null,
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString()
    });

    return c.json({ 
      message: 'User registered successfully', 
      userId: data.user.id 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// Real-time Notifications
app.get("/make-server-51e2cda7/notifications", async (c) => {
  const authResult = await verifyAuth(c);
  if (authResult.error) {
    return c.json({ error: authResult.error }, authResult.status);
  }

  try {
    const notifications = await kv.getByPrefix(`notification_${authResult.user.id}_`);
    const sortedNotifications = notifications
      .map(n => n.value)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return c.json({ notifications: sortedNotifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return c.json({ error: 'Failed to fetch notifications' }, 500);
  }
});

app.post("/make-server-51e2cda7/notifications/send", async (c) => {
  const authResult = await verifyAuth(c);
  if (authResult.error) {
    return c.json({ error: authResult.error }, authResult.status);
  }

  try {
    const { recipientId, title, message, type = 'info', priority = 'normal' } = await c.req.json();
    
    const notification = {
      id: crypto.randomUUID(),
      recipientId,
      title,
      message,
      type,
      priority,
      read: false,
      timestamp: new Date().toISOString(),
      senderId: authResult.user.id
    };

    await kv.set(`notification_${recipientId}_${notification.id}`, notification);
    
    return c.json({ 
      message: 'Notification sent successfully', 
      notificationId: notification.id 
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return c.json({ error: 'Failed to send notification' }, 500);
  }
});

// Content Upload (Admin/Lecturer only)
app.post("/make-server-51e2cda7/content/upload", async (c) => {
  const authResult = await verifyAuth(c);
  if (authResult.error) {
    return c.json({ error: authResult.error }, authResult.status);
  }

  try {
    // Get user profile to check role
    const userProfile = await kv.get(`user_profile_${authResult.user.id}`);
    if (!userProfile || !['admin', 'lecturer'].includes(userProfile.role)) {
      return c.json({ error: 'Unauthorized: Only admins and lecturers can upload content' }, 403);
    }

    const { fileName, fileContent, contentType, category, description, courseId } = await c.req.json();
    
    // Convert base64 to buffer for file upload
    const buffer = new Uint8Array(atob(fileContent).split('').map(c => c.charCodeAt(0)));
    
    const bucketName = `make-51e2cda7-${category}`;
    const filePath = `${courseId}/${Date.now()}_${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return c.json({ error: `Upload failed: ${uploadError.message}` }, 400);
    }

    // Get signed URL for access
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 3600 * 24 * 7); // 7 days

    // Store file metadata
    const fileMetadata = {
      id: crypto.randomUUID(),
      fileName,
      filePath,
      contentType,
      category,
      description,
      courseId,
      uploaderId: authResult.user.id,
      uploaderName: `${userProfile.firstName} ${userProfile.lastName}`,
      uploadedAt: new Date().toISOString(),
      signedUrl: signedUrlData?.signedUrl,
      bucketName
    };

    await kv.set(`content_${fileMetadata.id}`, fileMetadata);
    
    // Add to course content index
    const courseContentKey = `course_content_${courseId}`;
    const existingContent = await kv.get(courseContentKey) || { files: [] };
    existingContent.files.push(fileMetadata.id);
    await kv.set(courseContentKey, existingContent);

    return c.json({ 
      message: 'Content uploaded successfully', 
      fileId: fileMetadata.id,
      signedUrl: signedUrlData?.signedUrl
    });
  } catch (error) {
    console.error('Error uploading content:', error);
    return c.json({ error: 'Content upload failed' }, 500);
  }
});

// Get Course Content
app.get("/make-server-51e2cda7/content/course/:courseId", async (c) => {
  const authResult = await verifyAuth(c);
  if (authResult.error) {
    return c.json({ error: authResult.error }, authResult.status);
  }

  try {
    const courseId = c.req.param('courseId');
    const courseContent = await kv.get(`course_content_${courseId}`);
    
    if (!courseContent) {
      return c.json({ content: [] });
    }

    // Get file metadata for each content item
    const contentItems = await Promise.all(
      courseContent.files.map(async (fileId: string) => {
        const metadata = await kv.get(`content_${fileId}`);
        if (metadata) {
          // Refresh signed URL if needed
          const { data: newSignedUrl } = await supabase.storage
            .from(metadata.bucketName)
            .createSignedUrl(metadata.filePath, 3600 * 24);
          
          return {
            ...metadata,
            signedUrl: newSignedUrl?.signedUrl
          };
        }
        return null;
      })
    );

    const filteredContent = contentItems.filter(item => item !== null);
    
    return c.json({ content: filteredContent });
  } catch (error) {
    console.error('Error fetching course content:', error);
    return c.json({ error: 'Failed to fetch course content' }, 500);
  }
});

// AI Exam Generation
app.post("/make-server-51e2cda7/exam/generate", async (c) => {
  const authResult = await verifyAuth(c);
  if (authResult.error) {
    return c.json({ error: authResult.error }, authResult.status);
  }

  try {
    const userProfile = await kv.get(`user_profile_${authResult.user.id}`);
    if (!userProfile || !['admin', 'lecturer'].includes(userProfile.role)) {
      return c.json({ error: 'Unauthorized: Only admins and lecturers can create exams' }, 403);
    }

    const { courseId, examTitle, syllabusContent, questionCount = 10, difficulty = 'medium' } = await c.req.json();

    // Simulate AI question generation (in real implementation, you'd use OpenAI/Claude API)
    const generateQuestions = (content: string, count: number) => {
      const topics = content.split('.').filter(s => s.trim().length > 10);
      const questions = [];

      for (let i = 0; i < count; i++) {
        const topic = topics[i % topics.length];
        const questionTypes = ['multiple_choice', 'short_answer', 'essay'];
        const type = questionTypes[i % questionTypes.length];

        let question = {
          id: crypto.randomUUID(),
          type,
          question: `Based on the syllabus content, explain: ${topic.trim()}?`,
          options: type === 'multiple_choice' ? [
            `Option A for ${topic.slice(0, 20)}`,
            `Option B for ${topic.slice(0, 20)}`,
            `Option C for ${topic.slice(0, 20)}`,
            `Option D for ${topic.slice(0, 20)}`
          ] : null,
          correctAnswer: type === 'multiple_choice' ? 0 : `Sample answer for: ${topic.trim()}`,
          points: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : 10
        };

        questions.push(question);
      }

      return questions;
    };

    const questions = generateQuestions(syllabusContent, questionCount);
    
    const exam = {
      id: crypto.randomUUID(),
      courseId,
      title: examTitle,
      questions,
      createdBy: authResult.user.id,
      createdAt: new Date().toISOString(),
      difficulty,
      totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
      status: 'draft'
    };

    await kv.set(`exam_${exam.id}`, exam);
    
    // Add to course exams index
    const courseExamsKey = `course_exams_${courseId}`;
    const existingExams = await kv.get(courseExamsKey) || { exams: [] };
    existingExams.exams.push(exam.id);
    await kv.set(courseExamsKey, existingExams);

    return c.json({ 
      message: 'Exam generated successfully', 
      examId: exam.id,
      questionCount: questions.length,
      totalPoints: exam.totalPoints
    });
  } catch (error) {
    console.error('Error generating exam:', error);
    return c.json({ error: 'Exam generation failed' }, 500);
  }
});

// Get Exam
app.get("/make-server-51e2cda7/exam/:examId", async (c) => {
  const authResult = await verifyAuth(c);
  if (authResult.error) {
    return c.json({ error: authResult.error }, authResult.status);
  }

  try {
    const examId = c.req.param('examId');
    const exam = await kv.get(`exam_${examId}`);
    
    if (!exam) {
      return c.json({ error: 'Exam not found' }, 404);
    }

    return c.json({ exam });
  } catch (error) {
    console.error('Error fetching exam:', error);
    return c.json({ error: 'Failed to fetch exam' }, 500);
  }
});

// Submit Exam
app.post("/make-server-51e2cda7/exam/:examId/submit", async (c) => {
  const authResult = await verifyAuth(c);
  if (authResult.error) {
    return c.json({ error: authResult.error }, authResult.status);
  }

  try {
    const examId = c.req.param('examId');
    const { answers } = await c.req.json();
    
    const exam = await kv.get(`exam_${examId}`);
    if (!exam) {
      return c.json({ error: 'Exam not found' }, 404);
    }

    // Calculate score
    let totalScore = 0;
    const results = exam.questions.map((question: any) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) totalScore += question.points;
      
      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: isCorrect ? question.points : 0
      };
    });

    const submission = {
      id: crypto.randomUUID(),
      examId,
      studentId: authResult.user.id,
      answers,
      results,
      totalScore,
      maxScore: exam.totalPoints,
      percentage: (totalScore / exam.totalPoints) * 100,
      submittedAt: new Date().toISOString()
    };

    await kv.set(`submission_${submission.id}`, submission);
    
    return c.json({ 
      message: 'Exam submitted successfully',
      submissionId: submission.id,
      score: totalScore,
      maxScore: exam.totalPoints,
      percentage: submission.percentage
    });
  } catch (error) {
    console.error('Error submitting exam:', error);
    return c.json({ error: 'Exam submission failed' }, 500);
  }
});

// Document Collaboration
app.post("/make-server-51e2cda7/documents", async (c) => {
  const authResult = await verifyAuth(c);
  if (authResult.error) {
    return c.json({ error: authResult.error }, authResult.status);
  }

  try {
    const { title, content = '', collaborators = [], isPublic = false } = await c.req.json();
    
    const document = {
      id: crypto.randomUUID(),
      title,
      content,
      ownerId: authResult.user.id,
      collaborators: [authResult.user.id, ...collaborators],
      isPublic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };

    await kv.set(`document_${document.id}`, document);
    
    return c.json({ 
      message: 'Document created successfully',
      documentId: document.id
    });
  } catch (error) {
    console.error('Error creating document:', error);
    return c.json({ error: 'Document creation failed' }, 500);
  }
});

app.get("/make-server-51e2cda7/documents/:documentId", async (c) => {
  const authResult = await verifyAuth(c);
  if (authResult.error) {
    return c.json({ error: authResult.error }, authResult.status);
  }

  try {
    const documentId = c.req.param('documentId');
    const document = await kv.get(`document_${documentId}`);
    
    if (!document) {
      return c.json({ error: 'Document not found' }, 404);
    }

    // Check access permissions
    if (!document.isPublic && !document.collaborators.includes(authResult.user.id)) {
      return c.json({ error: 'Access denied' }, 403);
    }

    return c.json({ document });
  } catch (error) {
    console.error('Error fetching document:', error);
    return c.json({ error: 'Failed to fetch document' }, 500);
  }
});

app.put("/make-server-51e2cda7/documents/:documentId", async (c) => {
  const authResult = await verifyAuth(c);
  if (authResult.error) {
    return c.json({ error: authResult.error }, authResult.status);
  }

  try {
    const documentId = c.req.param('documentId');
    const { content, title } = await c.req.json();
    
    const document = await kv.get(`document_${documentId}`);
    if (!document) {
      return c.json({ error: 'Document not found' }, 404);
    }

    // Check edit permissions
    if (!document.collaborators.includes(authResult.user.id)) {
      return c.json({ error: 'Edit access denied' }, 403);
    }

    const updatedDocument = {
      ...document,
      content: content || document.content,
      title: title || document.title,
      updatedAt: new Date().toISOString(),
      version: document.version + 1
    };

    await kv.set(`document_${documentId}`, updatedDocument);
    
    return c.json({ 
      message: 'Document updated successfully',
      version: updatedDocument.version
    });
  } catch (error) {
    console.error('Error updating document:', error);
    return c.json({ error: 'Document update failed' }, 500);
  }
});

// Video Call functionality has been removed for hosting optimization

// User Profile Management
app.get("/make-server-51e2cda7/profile", async (c) => {
  const authResult = await verifyAuth(c);
  if (authResult.error) {
    return c.json({ error: authResult.error }, authResult.status);
  }

  try {
    const profile = await kv.get(`user_profile_${authResult.user.id}`);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Courses Management
app.get("/make-server-51e2cda7/courses", async (c) => {
  const authResult = await verifyAuth(c);
  if (authResult.error) {
    return c.json({ error: authResult.error }, authResult.status);
  }

  try {
    const courses = await kv.getByPrefix('course_info_');
    const courseList = courses.map(c => c.value);
    
    return c.json({ courses: courseList });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return c.json({ error: 'Failed to fetch courses' }, 500);
  }
});

// Analytics Endpoint
app.get("/make-server-51e2cda7/analytics", async (c) => {
  const authResult = await verifyAuth(c);
  if (authResult.error) {
    return c.json({ error: authResult.error }, authResult.status);
  }

  try {
    const userProfile = await kv.get(`user_profile_${authResult.user.id}`);
    if (!userProfile || userProfile.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    // Get basic analytics
    const users = await kv.getByPrefix('user_profile_');
    const documents = await kv.getByPrefix('document_');
    const exams = await kv.getByPrefix('exam_');
    const submissions = await kv.getByPrefix('submission_');

    const analytics = {
      totalUsers: users.length,
      totalDocuments: documents.length,
      totalExams: exams.length,
      totalSubmissions: submissions.length,
      lastUpdated: new Date().toISOString()
    };

    return c.json({ analytics });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

Deno.serve(app.fetch);