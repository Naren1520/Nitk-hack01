import { User, Course, Announcement, Event, Complaint, HelpQuestion, LostFoundItem, Achievement, WiFiRequest, StudySession, Facility, ApiResponse, PaginatedResponse, LoginCredentials, SignupData } from '../types/database';

// Mock data storage
let users: User[] = [
  {
    id: '1',
    email: 'CS2021001@student.college.edu',
    role: 'student',
    profile: {
      student_id: 'CS2021001',
      first_name: 'John',
      last_name: 'Doe',
      department: 'Computer Science',
      year: 3,
      gpa: 3.7,
      phone: '+1-555-0123',
      emergency_contact: '+1-555-0124'
    },
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-03-10T00:00:00Z'
  },
  {
    id: '2',
    email: 'FAC001@faculty.college.edu',
    role: 'faculty',
    profile: {
      faculty_id: 'FAC001',
      first_name: 'Dr. Sarah',
      last_name: 'Wilson',
      department: 'Computer Science',
      designation: 'Associate Professor',
      specialization: 'Machine Learning',
      phone: '+1-555-0200',
      office_location: 'CS Building, Room 301'
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-03-05T00:00:00Z'
  },
  {
    id: '3',
    email: 'ADMIN001@admin.college.edu',
    role: 'admin',
    profile: {
      faculty_id: 'ADMIN001',
      first_name: 'Admin',
      last_name: 'User',
      department: 'Administration',
      designation: 'System Administrator',
      specialization: 'Campus Management',
      phone: '+1-555-0300',
      office_location: 'Admin Building, Room 101'
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-03-05T00:00:00Z'
  }
];

let courses: Course[] = [
  {
    id: '1',
    code: 'CS301',
    name: 'Data Structures and Algorithms',
    description: 'Advanced data structures and algorithmic techniques',
    credits: 4,
    department: 'Computer Science',
    semester: 'Spring',
    year: 2024,
    instructor_id: '2',
    max_students: 60,
    enrolled_students: 45,
    prerequisites: ['CS201', 'MATH201'],
    schedule: [
      { day: 'monday', start_time: '09:00', end_time: '10:00', room: 'CS-101', type: 'lecture' },
      { day: 'wednesday', start_time: '09:00', end_time: '10:00', room: 'CS-101', type: 'lecture' },
      { day: 'friday', start_time: '10:00', end_time: '12:00', room: 'Lab-A', type: 'lab' }
    ],
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z'
  }
];

let announcements: Announcement[] = [
  {
    id: '1',
    title: 'Spring 2024 Examination Schedule Released',
    content: 'The examination timetable for all departments has been published. Students are advised to check their individual schedules on the student portal.',
    type: 'academic',
    priority: 'high',
    author_id: '2',
    department: 'All',
    target_audience: ['student'],
    is_pinned: true,
    views: 1250,
    expires_at: '2024-04-30T00:00:00Z',
    created_at: '2024-03-10T00:00:00Z',
    updated_at: '2024-03-10T00:00:00Z'
  }
];

let events: Event[] = [
  {
    id: '1',
    title: 'Career Fair 2024',
    description: '50+ companies participating including tech giants like Google, Microsoft, and Amazon.',
    type: 'career',
    date: '2024-03-22',
    start_time: '10:00',
    end_time: '18:00',
    location: 'Main Auditorium',
    organizer_id: '2',
    max_attendees: 500,
    registered_attendees: 234,
    registration_required: true,
    registration_deadline: '2024-03-20T00:00:00Z',
    status: 'upcoming',
    created_at: '2024-02-15T00:00:00Z'
  }
];

let complaints: Complaint[] = [
  {
    id: '1',
    title: 'WiFi connectivity issues in Computer Lab',
    description: 'Internet connection frequently drops during practical sessions, affecting student work.',
    category: 'it',
    priority: 'medium',
    status: 'in_progress',
    submitted_by: '1',
    assigned_to: '2',
    created_at: '2024-03-08T00:00:00Z',
    updated_at: '2024-03-09T00:00:00Z'
  }
];

let helpQuestions: HelpQuestion[] = [
  {
    id: '1',
    title: 'How to access previous year question papers?',
    content: 'I need help finding previous year question papers for Computer Science subjects.',
    category: 'academic',
    author_id: '1',
    is_solved: true,
    views: 45,
    likes: 12,
    created_at: '2024-03-05T00:00:00Z',
    updated_at: '2024-03-06T00:00:00Z'
  }
];

let lostFoundItems: LostFoundItem[] = [
  {
    id: '1',
    title: 'Black iPhone 13',
    description: 'Lost near the library on March 8th. Has a blue protective case with a crack on the corner.',
    type: 'lost',
    category: 'electronics',
    location: 'Central Library',
    contact_info: 'CS2021001@student.college.edu',
    status: 'active',
    reported_by: '1',
    created_at: '2024-03-08T00:00:00Z',
    updated_at: '2024-03-08T00:00:00Z'
  }
];

let achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Place in National Coding Championship',
    description: 'Secured 1st position among 500+ participants nationwide in the annual coding competition.',
    category: 'academic',
    user_id: '1',
    date_achieved: '2024-03-05',
    verified: true,
    verified_by: '2',
    views: 120,
    likes: 45,
    created_at: '2024-03-05T00:00:00Z'
  }
];

let wifiRequests: WiFiRequest[] = [
  {
    id: '1',
    device_name: 'MacBook Pro',
    device_type: 'laptop',
    mac_address: '00:1B:44:11:3A:B7',
    owner_type: 'personal',
    justification: 'For academic work and research projects',
    status: 'approved',
    requested_by: '1',
    reviewed_by: '2',
    review_notes: 'Approved for academic use',
    created_at: '2024-03-05T00:00:00Z',
    updated_at: '2024-03-06T00:00:00Z'
  }
];

let studySessions: StudySession[] = [
  {
    id: '1',
    user_id: '1',
    subject: 'Data Structures',
    duration: 120,
    focus_score: 85,
    breaks_taken: 2,
    session_date: '2024-03-10',
    notes: 'Studied binary trees and graph algorithms'
  }
];

let facilities: Facility[] = [
  {
    id: '1',
    name: 'Central Library',
    description: '24/7 access during exams, 200+ study seats, digital resources',
    location: 'Building A, Ground Floor',
    type: 'library',
    capacity: 200,
    current_occupancy: 89,
    operating_hours: {
      monday: { open: '08:00', close: '22:00' },
      tuesday: { open: '08:00', close: '22:00' },
      wednesday: { open: '08:00', close: '22:00' },
      thursday: { open: '08:00', close: '22:00' },
      friday: { open: '08:00', close: '22:00' },
      saturday: { open: '10:00', close: '20:00' },
      sunday: { open: '10:00', close: '20:00' }
    },
    amenities: ['WiFi', 'AC', 'Silent Study Areas', 'Group Study Rooms', 'Printing'],
    contact_info: 'library@college.edu',
    status: 'open'
  }
];

// Utility functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// Helper function to extract USN from email format
const extractUSN = (email: string): string => {
  const parts = email.split('@');
  return parts[0];
};

// Authentication API
export const authApi = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(1000);
    
    // Extract USN from email (for compatibility with USN-based login)
    const usn = extractUSN(credentials.email);
    
    // Find user by USN (checking the profile student_id or faculty_id)
    const user = users.find(u => {
      const profile = u.profile as any;
      return profile.student_id === usn || profile.faculty_id === usn;
    });
    
    if (!user) {
      return {
        data: null as any,
        message: 'Invalid USN or password. Please check your University Serial Number.',
        status: 'error'
      };
    }
    
    // In real implementation, check password hash
    return {
      data: {
        user,
        token: 'mock-jwt-token-' + user.id
      },
      message: 'Login successful',
      status: 'success'
    };
  },

  async signup(data: SignupData): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(1500);
    
    const existingUser = users.find(u => u.email === data.email);
    if (existingUser) {
      return {
        data: null as any,
        message: 'Email already registered',
        status: 'error'
      };
    }

    // Check if USN already exists
    const profile = data.profile as any;
    const usn = profile.student_id || profile.faculty_id;
    const existingUSN = users.find(u => {
      const userProfile = u.profile as any;
      return userProfile.student_id === usn || userProfile.faculty_id === usn;
    });

    if (existingUSN) {
      return {
        data: null as any,
        message: 'USN already registered',
        status: 'error'
      };
    }

    const newUser: User = {
      id: generateId(),
      email: data.email,
      role: data.role,
      profile: data.profile as any,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users.push(newUser);

    return {
      data: {
        user: newUser,
        token: 'mock-jwt-token-' + newUser.id
      },
      message: 'Account created successfully',
      status: 'success'
    };
  },

  async logout(): Promise<ApiResponse<null>> {
    await delay(500);
    return {
      data: null,
      message: 'Logged out successfully',
      status: 'success'
    };
  },

  async getCurrentUser(token: string): Promise<ApiResponse<User>> {
    await delay(800);
    
    const userId = token.replace('mock-jwt-token-', '');
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return {
        data: null as any,
        message: 'Invalid token',
        status: 'error'
      };
    }

    return {
      data: user,
      message: 'User retrieved successfully',
      status: 'success'
    };
  }
};

// Announcements API
export const announcementsApi = {
  async getAnnouncements(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Announcement>>> {
    await delay(800);
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = announcements.slice(start, end);
    
    return {
      data: {
        data: paginatedData,
        total: announcements.length,
        page,
        limit,
        total_pages: Math.ceil(announcements.length / limit)
      },
      message: 'Announcements retrieved successfully',
      status: 'success'
    };
  },

  async createAnnouncement(announcement: Omit<Announcement, 'id' | 'views' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Announcement>> {
    await delay(1000);
    
    const newAnnouncement: Announcement = {
      ...announcement,
      id: generateId(),
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    announcements.unshift(newAnnouncement);
    
    return {
      data: newAnnouncement,
      message: 'Announcement created successfully',
      status: 'success'
    };
  }
};

// Courses API
export const coursesApi = {
  async getCourses(): Promise<ApiResponse<Course[]>> {
    await delay(800);
    return {
      data: courses,
      message: 'Courses retrieved successfully',
      status: 'success'
    };
  },

  async enrollInCourse(studentId: string, courseId: string): Promise<ApiResponse<null>> {
    await delay(1000);
    
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      return {
        data: null,
        message: 'Course not found',
        status: 'error'
      };
    }
    
    if (course.enrolled_students >= course.max_students) {
      return {
        data: null,
        message: 'Course is full',
        status: 'error'
      };
    }
    
    course.enrolled_students += 1;
    
    return {
      data: null,
      message: 'Successfully enrolled in course',
      status: 'success'
    };
  }
};

// Events API
export const eventsApi = {
  async getEvents(): Promise<ApiResponse<Event[]>> {
    await delay(800);
    return {
      data: events,
      message: 'Events retrieved successfully',
      status: 'success'
    };
  },

  async registerForEvent(userId: string, eventId: string): Promise<ApiResponse<null>> {
    await delay(1000);
    
    const event = events.find(e => e.id === eventId);
    if (!event) {
      return {
        data: null,
        message: 'Event not found',
        status: 'error'
      };
    }
    
    if (event.max_attendees && event.registered_attendees >= event.max_attendees) {
      return {
        data: null,
        message: 'Event is full',
        status: 'error'
      };
    }
    
    event.registered_attendees += 1;
    
    return {
      data: null,
      message: 'Successfully registered for event',
      status: 'success'
    };
  }
};

// Complaints API
export const complaintsApi = {
  async getComplaints(userId: string): Promise<ApiResponse<Complaint[]>> {
    await delay(800);
    const userComplaints = complaints.filter(c => c.submitted_by === userId);
    return {
      data: userComplaints,
      message: 'Complaints retrieved successfully',
      status: 'success'
    };
  },

  async submitComplaint(complaint: Omit<Complaint, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Complaint>> {
    await delay(1200);
    
    const newComplaint: Complaint = {
      ...complaint,
      id: generateId(),
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    complaints.push(newComplaint);
    
    return {
      data: newComplaint,
      message: 'Complaint submitted successfully',
      status: 'success'
    };
  }
};

// Help Questions API
export const helpApi = {
  async getQuestions(): Promise<ApiResponse<HelpQuestion[]>> {
    await delay(800);
    return {
      data: helpQuestions,
      message: 'Questions retrieved successfully',
      status: 'success'
    };
  },

  async submitQuestion(question: Omit<HelpQuestion, 'id' | 'is_solved' | 'views' | 'likes' | 'created_at' | 'updated_at'>): Promise<ApiResponse<HelpQuestion>> {
    await delay(1000);
    
    const newQuestion: HelpQuestion = {
      ...question,
      id: generateId(),
      is_solved: false,
      views: 0,
      likes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    helpQuestions.unshift(newQuestion);
    
    return {
      data: newQuestion,
      message: 'Question submitted successfully',
      status: 'success'
    };
  }
};

// Lost & Found API
export const lostFoundApi = {
  async getItems(): Promise<ApiResponse<LostFoundItem[]>> {
    await delay(800);
    return {
      data: lostFoundItems,
      message: 'Items retrieved successfully',
      status: 'success'
    };
  },

  async reportItem(item: Omit<LostFoundItem, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<ApiResponse<LostFoundItem>> {
    await delay(1000);
    
    const newItem: LostFoundItem = {
      ...item,
      id: generateId(),
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    lostFoundItems.unshift(newItem);
    
    return {
      data: newItem,
      message: 'Item reported successfully',
      status: 'success'
    };
  }
};

// Achievements API
export const achievementsApi = {
  async getAchievements(): Promise<ApiResponse<Achievement[]>> {
    await delay(800);
    return {
      data: achievements,
      message: 'Achievements retrieved successfully',
      status: 'success'
    };
  },

  async submitAchievement(achievement: Omit<Achievement, 'id' | 'verified' | 'views' | 'likes' | 'created_at'>): Promise<ApiResponse<Achievement>> {
    await delay(1200);
    
    const newAchievement: Achievement = {
      ...achievement,
      id: generateId(),
      verified: false,
      views: 0,
      likes: 0,
      created_at: new Date().toISOString()
    };
    
    achievements.unshift(newAchievement);
    
    return {
      data: newAchievement,
      message: 'Achievement submitted for review',
      status: 'success'
    };
  }
};

// WiFi Requests API
export const wifiApi = {
  async getRequests(userId: string): Promise<ApiResponse<WiFiRequest[]>> {
    await delay(800);
    const userRequests = wifiRequests.filter(r => r.requested_by === userId);
    return {
      data: userRequests,
      message: 'WiFi requests retrieved successfully',
      status: 'success'
    };
  },

  async submitRequest(request: Omit<WiFiRequest, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<ApiResponse<WiFiRequest>> {
    await delay(1000);
    
    const newRequest: WiFiRequest = {
      ...request,
      id: generateId(),
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    wifiRequests.push(newRequest);
    
    return {
      data: newRequest,
      message: 'WiFi request submitted successfully',
      status: 'success'
    };
  }
};

// Study Sessions API
export const studyApi = {
  async getSessions(userId: string): Promise<ApiResponse<StudySession[]>> {
    await delay(600);
    const userSessions = studySessions.filter(s => s.user_id === userId);
    return {
      data: userSessions,
      message: 'Study sessions retrieved successfully',
      status: 'success'
    };
  },

  async createSession(session: Omit<StudySession, 'id'>): Promise<ApiResponse<StudySession>> {
    await delay(800);
    
    const newSession: StudySession = {
      ...session,
      id: generateId()
    };
    
    studySessions.push(newSession);
    
    return {
      data: newSession,
      message: 'Study session recorded successfully',
      status: 'success'
    };
  }
};

// Facilities API
export const facilitiesApi = {
  async getFacilities(): Promise<ApiResponse<Facility[]>> {
    await delay(800);
    return {
      data: facilities,
      message: 'Facilities retrieved successfully',
      status: 'success'
    };
  },

  async updateOccupancy(facilityId: string, occupancy: number): Promise<ApiResponse<null>> {
    await delay(500);
    
    const facility = facilities.find(f => f.id === facilityId);
    if (facility) {
      facility.current_occupancy = occupancy;
    }
    
    return {
      data: null,
      message: 'Occupancy updated successfully',
      status: 'success'
    };
  }
};