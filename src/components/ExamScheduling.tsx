import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Send, 
  Edit, 
  Trash2,
  Eye,
  Bell,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Target,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { useAuth } from '../lib/contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface ScheduledExam {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  examId: string;
  scheduledFor: string;
  duration: number; // in minutes
  instructions: string;
  assignedTo: string[]; // student IDs
  createdBy: string;
  createdAt: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';
  settings: {
    allowRetakes: boolean;
    showResultsImmediately: boolean;
    randomizeQuestions: boolean;
    timeLimit: number;
  };
}

interface ExamAssignment {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  assignedAt: string;
  startedAt?: string;
  submittedAt?: string;
  score?: number;
  status: 'assigned' | 'in_progress' | 'submitted' | 'overdue';
}

export default function ExamScheduling() {
  const { user } = useAuth();
  const [scheduledExams, setScheduledExams] = useState<ScheduledExam[]>([]);
  const [assignments, setAssignments] = useState<ExamAssignment[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schedule');

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    courseName: '',
    scheduledFor: '',
    duration: 60,
    instructions: '',
    allowRetakes: false,
    showResultsImmediately: true,
    randomizeQuestions: false,
    timeLimit: 120
  });

  // Mock data for available courses and students
  const courses = [
    { id: 'CS101', name: 'Computer Science Fundamentals' },
    { id: 'MATH201', name: 'Advanced Mathematics' },
    { id: 'PHY301', name: 'Physics Laboratory' },
    { id: 'CHEM101', name: 'General Chemistry' }
  ];

  const students = [
    { id: 'student1', name: 'John Doe', email: 'john@university.edu' },
    { id: 'student2', name: 'Jane Smith', email: 'jane@university.edu' },
    { id: 'student3', name: 'Mike Johnson', email: 'mike@university.edu' },
    { id: 'student4', name: 'Sarah Wilson', email: 'sarah@university.edu' }
  ];

  // Check if user can schedule exams (admin/lecturer)
  const canScheduleExams = () => {
    if (!user || !user.profile) return false;
    const profile = user.profile as any;
    return ['admin', 'lecturer'].includes(profile.role);
  };

  useEffect(() => {
    loadScheduledExams();
    loadAssignments();
  }, []);

  const loadScheduledExams = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockExams: ScheduledExam[] = [
        {
          id: 'schedule1',
          title: 'Midterm Examination - CS101',
          courseId: 'CS101',
          courseName: 'Computer Science Fundamentals',
          examId: 'exam1',
          scheduledFor: '2024-01-25T10:00:00Z',
          duration: 90,
          instructions: 'This is a comprehensive midterm exam covering chapters 1-5.',
          assignedTo: ['student1', 'student2', 'student3'],
          createdBy: user?.id || 'lecturer1',
          createdAt: new Date().toISOString(),
          status: 'scheduled',
          settings: {
            allowRetakes: false,
            showResultsImmediately: true,
            randomizeQuestions: true,
            timeLimit: 90
          }
        },
        {
          id: 'schedule2',
          title: 'Physics Lab Practical',
          courseId: 'PHY301',
          courseName: 'Physics Laboratory',
          examId: 'exam2',
          scheduledFor: '2024-01-28T14:00:00Z',
          duration: 120,
          instructions: 'Practical examination on wave mechanics and optics.',
          assignedTo: ['student1', 'student4'],
          createdBy: user?.id || 'lecturer1',
          createdAt: new Date().toISOString(),
          status: 'draft',
          settings: {
            allowRetakes: true,
            showResultsImmediately: false,
            randomizeQuestions: false,
            timeLimit: 120
          }
        }
      ];

      setScheduledExams(mockExams);
    } catch (error) {
      console.error('Error loading scheduled exams:', error);
      toast.error('Failed to load scheduled exams');
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async () => {
    try {
      // Simulate API call
      const mockAssignments: ExamAssignment[] = [
        {
          id: 'assign1',
          examId: 'schedule1',
          studentId: 'student1',
          studentName: 'John Doe',
          assignedAt: '2024-01-20T08:00:00Z',
          status: 'assigned'
        },
        {
          id: 'assign2',
          examId: 'schedule1',
          studentId: 'student2',
          studentName: 'Jane Smith',
          assignedAt: '2024-01-20T08:00:00Z',
          startedAt: '2024-01-25T10:05:00Z',
          status: 'in_progress'
        },
        {
          id: 'assign3',
          examId: 'schedule1',
          studentId: 'student3',
          studentName: 'Mike Johnson',
          assignedAt: '2024-01-20T08:00:00Z',
          startedAt: '2024-01-25T10:02:00Z',
          submittedAt: '2024-01-25T11:30:00Z',
          score: 85,
          status: 'submitted'
        }
      ];

      setAssignments(mockAssignments);
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  const handleCreateExam = async () => {
    if (!formData.title || !formData.courseId || !formData.scheduledFor || selectedStudents.length === 0) {
      toast.error('Please fill in all required fields and select students');
      return;
    }

    try {
      const newExam: ScheduledExam = {
        id: `schedule_${Date.now()}`,
        title: formData.title,
        courseId: formData.courseId,
        courseName: courses.find(c => c.id === formData.courseId)?.name || '',
        examId: `exam_${Date.now()}`,
        scheduledFor: formData.scheduledFor,
        duration: formData.duration,
        instructions: formData.instructions,
        assignedTo: selectedStudents,
        createdBy: user?.id || '',
        createdAt: new Date().toISOString(),
        status: 'draft',
        settings: {
          allowRetakes: formData.allowRetakes,
          showResultsImmediately: formData.showResultsImmediately,
          randomizeQuestions: formData.randomizeQuestions,
          timeLimit: formData.timeLimit
        }
      };

      setScheduledExams(prev => [...prev, newExam]);

      // Create assignments for selected students
      const newAssignments: ExamAssignment[] = selectedStudents.map(studentId => ({
        id: `assign_${Date.now()}_${studentId}`,
        examId: newExam.id,
        studentId,
        studentName: students.find(s => s.id === studentId)?.name || '',
        assignedAt: new Date().toISOString(),
        status: 'assigned' as const
      }));

      setAssignments(prev => [...prev, ...newAssignments]);

      // Reset form
      setFormData({
        title: '',
        courseId: '',
        courseName: '',
        scheduledFor: '',
        duration: 60,
        instructions: '',
        allowRetakes: false,
        showResultsImmediately: true,
        randomizeQuestions: false,
        timeLimit: 120
      });
      setSelectedStudents([]);
      setShowCreateModal(false);

      toast.success(`Exam scheduled successfully! ${selectedStudents.length} students assigned.`);
    } catch (error) {
      console.error('Error creating exam schedule:', error);
      toast.error('Failed to schedule exam');
    }
  };

  const handlePublishExam = async (examId: string) => {
    try {
      setScheduledExams(prev =>
        prev.map(exam =>
          exam.id === examId
            ? { ...exam, status: 'scheduled' as const }
            : exam
        )
      );

      // Send notifications to assigned students
      const exam = scheduledExams.find(e => e.id === examId);
      if (exam) {
        // In a real app, this would send actual notifications
        toast.success(`Exam "${exam.title}" published and notifications sent to ${exam.assignedTo.length} students`);
      }
    } catch (error) {
      console.error('Error publishing exam:', error);
      toast.error('Failed to publish exam');
    }
  };

  const handleCancelExam = async (examId: string) => {
    try {
      setScheduledExams(prev =>
        prev.map(exam =>
          exam.id === examId
            ? { ...exam, status: 'cancelled' as const }
            : exam
        )
      );

      toast.success('Exam cancelled successfully');
    } catch (error) {
      console.error('Error cancelling exam:', error);
      toast.error('Failed to cancel exam');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'outline' as const, color: 'gray' },
      scheduled: { variant: 'default' as const, color: 'blue' },
      active: { variant: 'default' as const, color: 'green' },
      completed: { variant: 'secondary' as const, color: 'gray' },
      cancelled: { variant: 'destructive' as const, color: 'red' },
      assigned: { variant: 'outline' as const, color: 'blue' },
      in_progress: { variant: 'default' as const, color: 'yellow' },
      submitted: { variant: 'default' as const, color: 'green' },
      overdue: { variant: 'destructive' as const, color: 'red' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <Badge variant={config.variant} className="capitalize">
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Please log in</h3>
        <p className="text-muted-foreground">You need to be logged in to access exam scheduling.</p>
      </div>
    );
  }

  if (!canScheduleExams()) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
        <p className="text-muted-foreground mb-4">
          Only administrators and lecturers can schedule and manage exams.
        </p>
        <Badge variant="outline">Current Role: {(user.profile as any)?.role || 'Student'}</Badge>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Exam Scheduling & Assignment
          </h2>
          <p className="text-muted-foreground">
            Schedule exams, assign to students, and track completion status
          </p>
        </div>
        
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule New Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Exam</DialogTitle>
              <DialogDescription>
                Create a new exam schedule and assign it to students
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="exam-title">Exam Title</Label>
                  <Input
                    id="exam-title"
                    placeholder="e.g., Midterm - Computer Science"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="course">Course</Label>
                  <Select value={formData.courseId} onValueChange={(value) => setFormData(prev => ({ ...prev, courseId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheduled-for">Scheduled Date & Time</Label>
                  <Input
                    id="scheduled-for"
                    type="datetime-local"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledFor: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="90"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Exam instructions for students..."
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                />
              </div>

              <div>
                <Label>Assign to Students</Label>
                <ScrollArea className="h-32 border rounded p-2 mt-2">
                  {students.map(student => (
                    <div key={student.id} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={student.id}
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedStudents(prev => [...prev, student.id]);
                          } else {
                            setSelectedStudents(prev => prev.filter(id => id !== student.id));
                          }
                        }}
                      />
                      <Label htmlFor={student.id} className="flex-1 cursor-pointer">
                        {student.name} ({student.email})
                      </Label>
                    </div>
                  ))}
                </ScrollArea>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedStudents.length} students selected
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allow-retakes"
                    checked={formData.allowRetakes}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowRetakes: !!checked }))}
                  />
                  <Label htmlFor="allow-retakes">Allow retakes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-results"
                    checked={formData.showResultsImmediately}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showResultsImmediately: !!checked }))}
                  />
                  <Label htmlFor="show-results">Show results immediately</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateExam}>
                Schedule Exam
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">Scheduled Exams</TabsTrigger>
          <TabsTrigger value="assignments">Student Assignments</TabsTrigger>
          <TabsTrigger value="analytics">Completion Analytics</TabsTrigger>
        </TabsList>

        {/* Scheduled Exams Tab */}
        <TabsContent value="schedule" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading scheduled exams...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {scheduledExams.map(exam => (
                <Card key={exam.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {exam.title}
                          {getStatusBadge(exam.status)}
                        </CardTitle>
                        <CardDescription>
                          {exam.courseName} • {new Date(exam.scheduledFor).toLocaleString()} • {exam.duration} minutes
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {exam.status === 'draft' && (
                          <Button size="sm" onClick={() => handlePublishExam(exam.id)}>
                            <Send className="h-4 w-4 mr-1" />
                            Publish
                          </Button>
                        )}
                        {exam.status !== 'completed' && exam.status !== 'cancelled' && (
                          <Button variant="outline" size="sm" onClick={() => handleCancelExam(exam.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {exam.instructions && (
                        <p className="text-sm text-muted-foreground">{exam.instructions}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {exam.assignedTo.length} students assigned
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {exam.settings.timeLimit} min time limit
                        </div>
                        {exam.settings.allowRetakes && (
                          <Badge variant="outline" className="text-xs">
                            Retakes allowed
                          </Badge>
                        )}
                        {exam.settings.randomizeQuestions && (
                          <Badge variant="outline" className="text-xs">
                            Randomized
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Student Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {assignments.map(assignment => {
              const exam = scheduledExams.find(e => e.id === assignment.examId);
              return (
                <Card key={assignment.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{assignment.studentName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {exam?.title} • Assigned {new Date(assignment.assignedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        {getStatusBadge(assignment.status)}
                        {assignment.score !== undefined && (
                          <div className="text-sm font-medium">
                            Score: {assignment.score}%
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{scheduledExams.length}</div>
                <p className="text-xs text-muted-foreground">Exams scheduled</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {assignments.length > 0 ? 
                    Math.round((assignments.filter(a => a.status === 'submitted').length / assignments.length) * 100) : 0
                  }%
                </div>
                <p className="text-xs text-muted-foreground">
                  {assignments.filter(a => a.status === 'submitted').length} of {assignments.length} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {assignments.filter(a => a.score).length > 0 ? 
                    Math.round(
                      assignments.filter(a => a.score).reduce((sum, a) => sum + (a.score || 0), 0) / 
                      assignments.filter(a => a.score).length
                    ) : 0
                  }%
                </div>
                <p className="text-xs text-muted-foreground">From completed exams</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}