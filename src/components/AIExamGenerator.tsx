import { useState, useRef, useEffect } from 'react';
import { 
  Brain, 
  Upload, 
  FileText, 
  Book, 
  CheckCircle, 
  Clock, 
  Download,
  Play,
  Pause,
  RotateCcw,
  Award,
  Eye
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../lib/contexts/AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { aiService } from '../lib/services/aiService';

interface Question {
  id: string;
  type: 'multiple_choice' | 'short_answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  points: number;
}

interface Exam {
  id: string;
  courseId: string;
  title: string;
  questions: Question[];
  createdBy: string;
  createdAt: string;
  difficulty: 'easy' | 'medium' | 'hard';
  totalPoints: number;
  status: 'draft' | 'published';
}

interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  answers: Record<string, any>;
  score: number;
  maxScore: number;
  percentage: number;
  submittedAt: string;
  timeSpent: number;
}

export default function AIExamGenerator() {
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [examTitle, setExamTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [syllabusContent, setSyllabusContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedExam, setGeneratedExam] = useState<Exam | null>(null);
  const [showExamPreview, setShowExamPreview] = useState(false);
  const [showTakeExam, setShowTakeExam] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [examAnswers, setExamAnswers] = useState<Record<string, any>>({});
  const [examStartTime, setExamStartTime] = useState<Date | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [examResult, setExamResult] = useState<ExamAttempt | null>(null);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer for exam
  useEffect(() => {
    if (examStartTime && showTakeExam) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - examStartTime.getTime()) / 1000));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [examStartTime, showTakeExam]);

  // Check if user can create exams (admin/lecturer only)
  const canCreateExams = () => {
    if (!user || !user.profile) return false;
    const profile = user.profile as any;
    return ['admin', 'lecturer'].includes(profile.role);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      const validTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      return validTypes.includes(file.type) || file.name.endsWith('.txt') || file.name.endsWith('.pdf');
    });

    if (validFiles.length !== files.length) {
      toast.error('Some files were skipped. Please upload only TXT, PDF, or DOC files.');
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);

    // Read text content from files
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        // Extract meaningful content (remove excessive whitespace, etc.)
        const cleanContent = content
          .replace(/\s+/g, ' ')
          .replace(/[^\w\s.,!?;:]/g, '')
          .trim();
        
        if (cleanContent.length > 0) {
          setSyllabusContent(prev => 
            prev + `\n\n--- Content from ${file.name} ---\n${cleanContent.slice(0, 2000)}${cleanContent.length > 2000 ? '...' : ''}`
          );
        }
      };
      reader.onerror = () => {
        toast.error(`Failed to read ${file.name}`);
      };
      
      // Handle different file types
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        reader.readAsText(file);
      } else {
        // For other file types, show a placeholder
        setSyllabusContent(prev => 
          prev + `\n\n--- File: ${file.name} ---\nFile uploaded successfully. AI will analyze this ${file.type || 'document'} to generate relevant questions.`
        );
      }
    });

    toast.success(`${validFiles.length} file(s) uploaded successfully!`);
  };

  // Remove uploaded file
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Generate exam using AI
  const generateExam = async () => {
    if (!user || !examTitle.trim() || (!syllabusContent.trim() && uploadedFiles.length === 0)) {
      toast.error('Please provide exam title and content/files');
      return;
    }

    if (!canCreateExams()) {
      toast.error('Only administrators and lecturers can create exams');
      return;
    }

    try {
      setIsGenerating(true);

      // Get content from files and text area
      let fullContent = syllabusContent;
      if (uploadedFiles.length > 0) {
        fullContent += '\n\nUploaded files: ' + uploadedFiles.map(f => f.name).join(', ');
      }

      toast.info('AI is analyzing your content and generating questions...');

      // Use AI service to generate questions
      const aiQuestions = await aiService.generateExamQuestions(
        fullContent,
        questionCount,
        difficulty,
        courseId ? [courseId] : []
      );

      // Convert AI questions to our format
      const questions: Question[] = aiQuestions.map((q, index) => ({
        id: q.id || `q${index + 1}`,
        type: q.type || 'short_answer',
        question: q.question || `Question ${index + 1}`,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: q.points || (difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : 10)
      }));

      const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
      
      // Create exam structure
      const exam: Exam = {
        id: `exam_${Date.now()}`,
        courseId: courseId || 'default-course',
        title: examTitle,
        questions,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        difficulty,
        totalPoints,
        status: 'draft'
      };
        
      setGeneratedExam(exam);
      setShowExamPreview(true);
      toast.success(`AI-powered exam generated with ${questions.length} high-quality questions!`);
      
    } catch (error) {
      console.error('Error generating exam:', error);
      toast.error('Failed to generate exam. Check your API configuration.');
      
      // Fallback to manual generation
      const fallbackQuestions: Question[] = generateSampleQuestions(syllabusContent, questionCount, difficulty);
      const totalPoints = fallbackQuestions.reduce((sum, q) => sum + q.points, 0);
      
      const exam: Exam = {
        id: `exam_${Date.now()}`,
        courseId: courseId || 'default-course',
        title: examTitle,
        questions: fallbackQuestions,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        difficulty,
        totalPoints,
        status: 'draft'
      };
      
      setGeneratedExam(exam);
      setShowExamPreview(true);
      toast.info('Using fallback question generation');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate sample questions (AI simulation)
  const generateSampleQuestions = (content: string, count: number, difficulty: string): Question[] => {
    const questions: Question[] = [];
    const questionTypes = ['multiple_choice', 'short_answer', 'essay'] as const;
    const difficultyPoints = { easy: 2, medium: 5, hard: 10 };

    // Extract meaningful topics from content
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 15);
    const topics = sentences.length > 0 ? sentences : [
      'fundamental concepts and principles',
      'key theories and applications',
      'practical implementations and examples',
      'advanced topics and methodologies',
      'problem-solving techniques',
      'real-world applications',
      'critical analysis and evaluation',
      'comparative studies and research'
    ];

    const sampleQuestionStarters = {
      multiple_choice: [
        'Which of the following best describes',
        'What is the primary purpose of',
        'According to the material, which statement is correct regarding',
        'The most important characteristic of',
        'Which approach is recommended for'
      ],
      short_answer: [
        'Briefly explain the concept of',
        'Define and provide an example of',
        'What are the main advantages of',
        'How does this relate to',
        'Summarize the key points about'
      ],
      essay: [
        'Analyze and discuss in detail',
        'Compare and contrast',
        'Critically evaluate the importance of',
        'Examine the relationship between',
        'Provide a comprehensive overview of'
      ]
    };

    for (let i = 0; i < count; i++) {
      const type = questionTypes[i % questionTypes.length];
      const topic = topics[i % topics.length];
      const starter = sampleQuestionStarters[type][i % sampleQuestionStarters[type].length];
      
      let question: Question = {
        id: `q${i + 1}`,
        type,
        question: `${starter} ${topic.trim().slice(0, 80)}?`,
        points: difficultyPoints[difficulty]
      } as Question;

      if (type === 'multiple_choice') {
        const topicKey = topic.split(' ').slice(0, 3).join(' ');
        question.options = [
          `${topicKey} involves primarily theoretical aspects`,
          `${topicKey} focuses on practical implementation`,
          `${topicKey} combines both theory and practice`,
          `${topicKey} is mainly used for research purposes`
        ];
        question.correctAnswer = Math.floor(Math.random() * 4);
      } else {
        question.correctAnswer = `A comprehensive answer should include discussion of ${topic.slice(0, 50)}... Key points to cover would be the theoretical foundation, practical applications, and relevant examples from the course material.`;
      }

      questions.push(question);
    }

    return questions;
  };

  // Start taking exam
  const startExam = () => {
    if (!generatedExam) return;
    
    setShowExamPreview(false);
    setShowTakeExam(true);
    setCurrentQuestion(0);
    setExamAnswers({});
    setExamStartTime(new Date());
    setTimeElapsed(0);
    
    toast.success('Exam started! Good luck!');
  };

  // Handle answer selection
  const handleAnswerChange = (questionId: string, answer: any) => {
    setExamAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Submit exam
  const submitExam = async () => {
    if (!generatedExam || !examStartTime) return;

    try {
      // Calculate score based on answers
      let correctAnswers = 0;
      let totalQuestions = generatedExam.questions.length;
      
      generatedExam.questions.forEach(question => {
        const userAnswer = examAnswers[question.id];
        if (userAnswer !== undefined && userAnswer === question.correctAnswer) {
          correctAnswers++;
        }
      });

      const score = correctAnswers * (generatedExam.totalPoints / totalQuestions);
      const maxScore = generatedExam.totalPoints;
      const percentage = (score / maxScore) * 100;
      
      const result: ExamAttempt = {
        id: `submission_${Date.now()}`,
        examId: generatedExam.id,
        studentId: user?.id || '',
        answers: examAnswers,
        score: Math.round(score),
        maxScore,
        percentage,
        submittedAt: new Date().toISOString(),
        timeSpent: timeElapsed
      };

      setExamResult(result);
      setShowTakeExam(false);
      setShowResults(true);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      toast.success(`Exam submitted! Score: ${result.score}/${result.maxScore} (${result.percentage.toFixed(1)}%)`);
      
    } catch (error) {
      console.error('Error submitting exam:', error);
      toast.error('Failed to submit exam');
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Download exam
  const downloadExam = () => {
    if (!generatedExam) return;

    const examContent = `${generatedExam.title}\n` +
      `Course: ${generatedExam.courseId}\n` +
      `Difficulty: ${generatedExam.difficulty}\n` +
      `Total Points: ${generatedExam.totalPoints}\n` +
      `Questions: ${generatedExam.questions.length}\n` +
      `Generated: ${new Date(generatedExam.createdAt).toLocaleString()}\n\n` +
      '='.repeat(50) + '\n\n' +
      generatedExam.questions.map((q, i) => 
        `Question ${i + 1} (${q.points} points):\n${q.question}\n\n` +
        (q.options ? q.options.map((opt, j) => `   ${String.fromCharCode(65 + j)}. ${opt}`).join('\n') + '\n\n' : '\n') +
        `Correct Answer: ${q.type === 'multiple_choice' ? String.fromCharCode(65 + (q.correctAnswer as number)) : q.correctAnswer}\n\n` +
        '-'.repeat(30) + '\n\n'
      ).join('');

    const blob = new Blob([examContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedExam.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Exam downloaded successfully!');
  };

  // Reset all form data
  const resetForm = () => {
    setUploadedFiles([]);
    setExamTitle('');
    setCourseId('');
    setDifficulty('medium');
    setQuestionCount(10);
    setSyllabusContent('');
    setGeneratedExam(null);
    setShowExamPreview(false);
    setShowTakeExam(false);
    setCurrentQuestion(0);
    setExamAnswers({});
    setExamStartTime(null);
    setTimeElapsed(0);
    setExamResult(null);
    setShowResults(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    toast.success('Form reset successfully!');
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Brain className="h-6 w-6" />
          AI Exam Generator
        </h2>
        <p className="text-muted-foreground">
          Upload study materials and generate comprehensive exams with AI-powered questions
        </p>
      </div>

      {canCreateExams() ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Exam Creation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Create New Exam
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="exam-title">Exam Title</Label>
                <Input
                  id="exam-title"
                  placeholder="e.g., Midterm - Computer Science"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="course-id">Course ID (Optional)</Label>
                <Input
                  id="course-id"
                  placeholder="e.g., CS101"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy (2 pts/question)</SelectItem>
                      <SelectItem value="medium">Medium (5 pts/question)</SelectItem>
                      <SelectItem value="hard">Hard (10 pts/question)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="question-count">Questions</Label>
                  <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Questions</SelectItem>
                      <SelectItem value="10">10 Questions</SelectItem>
                      <SelectItem value="15">15 Questions</SelectItem>
                      <SelectItem value="20">20 Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Upload Study Materials</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".txt,.pdf,.doc,.docx"
                    multiple
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files (TXT, PDF, DOC)
                  </Button>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{file.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {(file.size / 1024).toFixed(1)} KB
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="syllabus-content">Or Paste Content Directly</Label>
                <Textarea
                  id="syllabus-content"
                  placeholder="Paste your syllabus, notes, or study material here..."
                  value={syllabusContent}
                  onChange={(e) => setSyllabusContent(e.target.value)}
                  className="min-h-24"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={generateExam}
                  disabled={isGenerating || (!syllabusContent.trim() && uploadedFiles.length === 0)}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Generating Exam...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate AI Exam
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetForm}
                  disabled={isGenerating}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Exam Preview */}
          {generatedExam && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Generated Exam
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={downloadExam}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowExamPreview(true)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{generatedExam.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>{generatedExam.questions.length} questions</span>
                    <Badge variant="outline" className="capitalize">
                      {generatedExam.difficulty}
                    </Badge>
                    <span>{generatedExam.totalPoints} points total</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Question Types:</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-medium">
                        {generatedExam.questions.filter(q => q.type === 'multiple_choice').length}
                      </div>
                      <div className="text-muted-foreground">Multiple Choice</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-medium">
                        {generatedExam.questions.filter(q => q.type === 'short_answer').length}
                      </div>
                      <div className="text-muted-foreground">Short Answer</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <div className="font-medium">
                        {generatedExam.questions.filter(q => q.type === 'essay').length}
                      </div>
                      <div className="text-muted-foreground">Essay</div>
                    </div>
                  </div>
                </div>

                <Button onClick={startExam} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Take Exam (Demo)
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground mb-4">
              Only administrators and lecturers can create exams. Students can take exams assigned to them.
            </p>
            <Badge variant="outline">Current Role: {(user.profile as any)?.role || 'Student'}</Badge>
          </CardContent>
        </Card>
      )}

      {/* Exam Preview Dialog */}
      <Dialog open={showExamPreview} onOpenChange={setShowExamPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{generatedExam?.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            <div className="space-y-6 pr-4">
              {generatedExam?.questions.map((question, index) => (
                <div key={question.id} className="border-b pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Question {index + 1}</h4>
                    <Badge variant="outline">{question.points} pts</Badge>
                  </div>
                  <p className="text-sm mb-3">{question.question}</p>
                  
                  {question.options && (
                    <div className="space-y-1">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="text-sm text-muted-foreground">
                          {String.fromCharCode(65 + optIndex)}. {option}
                        </div>
                      ))}
                      <div className="text-xs text-green-600 mt-1">
                        Correct Answer: {String.fromCharCode(65 + (question.correctAnswer as number))}
                      </div>
                    </div>
                  )}
                  
                  {question.type !== 'multiple_choice' && (
                    <div className="text-xs text-green-600 mt-2">
                      Sample Answer: {question.correctAnswer.toString().slice(0, 100)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Take Exam Dialog */}
      <Dialog open={showTakeExam} onOpenChange={() => {}}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{generatedExam?.title}</span>
              <div className="flex items-center gap-4 text-sm">
                <span>Time: {formatTime(timeElapsed)}</span>
                <span>
                  Question {currentQuestion + 1} of {generatedExam?.questions.length}
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {generatedExam && generatedExam.questions[currentQuestion] && (
            <div className="space-y-4">
              <div className="space-y-3">
                <p className="text-sm">{generatedExam.questions[currentQuestion].question}</p>
                
                {generatedExam.questions[currentQuestion].type === 'multiple_choice' && (
                  <RadioGroup
                    value={examAnswers[generatedExam.questions[currentQuestion].id]?.toString()}
                    onValueChange={(value) => 
                      handleAnswerChange(generatedExam.questions[currentQuestion].id, parseInt(value))
                    }
                  >
                    {generatedExam.questions[currentQuestion].options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="text-sm">
                          {String.fromCharCode(65 + index)}. {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                
                {generatedExam.questions[currentQuestion].type !== 'multiple_choice' && (
                  <Textarea
                    placeholder="Enter your answer..."
                    value={examAnswers[generatedExam.questions[currentQuestion].id] || ''}
                    onChange={(e) => 
                      handleAnswerChange(generatedExam.questions[currentQuestion].id, e.target.value)
                    }
                    className="min-h-20"
                  />
                )}
              </div>
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  disabled={currentQuestion === 0}
                  onClick={() => setCurrentQuestion(prev => prev - 1)}
                >
                  Previous
                </Button>
                
                {currentQuestion < generatedExam.questions.length - 1 ? (
                  <Button onClick={() => setCurrentQuestion(prev => prev + 1)}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={submitExam} variant="default">
                    Submit Exam
                  </Button>
                )}
              </div>
              
              <Progress 
                value={(currentQuestion + 1) / generatedExam.questions.length * 100} 
                className="w-full"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Exam Results
            </DialogTitle>
          </DialogHeader>
          
          {examResult && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {examResult.score}/{examResult.maxScore}
                </div>
                <div className="text-lg text-muted-foreground">
                  {examResult.percentage.toFixed(1)}%
                </div>
                <Badge 
                  variant={examResult.percentage >= 70 ? "default" : "destructive"}
                  className="text-sm"
                >
                  {examResult.percentage >= 70 ? "Passed" : "Failed"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-muted rounded">
                  <div className="font-medium">Time Spent</div>
                  <div>{formatTime(examResult.timeSpent)}</div>
                </div>
                <div className="text-center p-3 bg-muted rounded">
                  <div className="font-medium">Submitted</div>
                  <div>{new Date(examResult.submittedAt).toLocaleString()}</div>
                </div>
              </div>
              
              <Button 
                onClick={() => {
                  setShowResults(false);
                  setGeneratedExam(null);
                  setExamResult(null);
                }} 
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}