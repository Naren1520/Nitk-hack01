import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Calendar, FileText, GraduationCap, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function AcademicsSection() {
  const upcomingExams = [
    { subject: 'Data Structures', date: '2024-03-15', time: '9:00 AM', type: 'Mid-term', status: 'scheduled' },
    { subject: 'Database Systems', date: '2024-03-18', time: '2:00 PM', type: 'Final', status: 'scheduled' },
    { subject: 'Computer Networks', date: '2024-03-22', time: '10:00 AM', type: 'Mid-term', status: 'scheduled' },
  ];

  const courseProgress = [
    { course: 'Software Engineering', progress: 85, grade: 'A', credits: 4 },
    { course: 'Machine Learning', progress: 72, grade: 'B+', credits: 3 },
    { course: 'Web Development', progress: 94, grade: 'A+', credits: 3 },
    { course: 'Computer Graphics', progress: 68, grade: 'B', credits: 2 },
  ];

  const availableCourses = [
    { name: 'Advanced Algorithms', credits: 4, prerequisites: 'Data Structures', seats: 25 },
    { name: 'Cloud Computing', credits: 3, prerequisites: 'Computer Networks', seats: 30 },
    { name: 'Mobile App Development', credits: 3, prerequisites: 'Programming', seats: 20 },
    { name: 'Cybersecurity', credits: 4, prerequisites: 'Networks', seats: 15 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">📚 Academics & Exams</h2>
        <p className="text-muted-foreground">Manage your academic journey with comprehensive tools and resources</p>
      </div>

      <Tabs defaultValue="exams" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="pyq">PYQ Bank</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="mentor">Mentor</TabsTrigger>
        </TabsList>

        {/* Examination Portal */}
        <TabsContent value="exams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Examination Portal
            </CardTitle>
            <CardDescription>Never miss an exam date again - view schedules, results, and take mock tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Upcoming Exams</h4>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              {upcomingExams.map((exam, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{exam.subject}</p>
                      <p className="text-sm text-muted-foreground">{exam.type} - {exam.date} at {exam.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{exam.type}</Badge>
                    <Button size="sm" variant="outline">Mock Test</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Algorithms Quiz</span>
                  <Badge variant="default">92%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Database Assignment</span>
                  <Badge variant="default">88%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Networks Lab</span>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mock Test Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Average Score</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tests Completed</span>
                    <span>12/15</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <Button className="w-full" variant="outline">Take Practice Test</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        </TabsContent>

        {/* PYQ Bank */}
        <TabsContent value="pyq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Previous Year Questions Bank
              </CardTitle>
              <CardDescription>Prepare smarter with comprehensive question paper archives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { subject: 'Data Structures', papers: 15, years: '2019-2023' },
                  { subject: 'Database Systems', papers: 12, years: '2020-2023' },
                  { subject: 'Computer Networks', papers: 18, years: '2018-2023' },
                  { subject: 'Operating Systems', papers: 14, years: '2019-2023' },
                  { subject: 'Software Engineering', papers: 10, years: '2021-2023' },
                  { subject: 'Machine Learning', papers: 8, years: '2021-2023' },
                ].map((item, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">{item.subject}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.papers} papers • {item.years}
                      </p>
                      <Button size="sm" className="w-full">Download Papers</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Course Registration */}
        <TabsContent value="registration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Course Registration
              </CardTitle>
              <CardDescription>Register for subjects, electives, and certifications with a click</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h4 className="font-medium mb-4">Available Courses - Spring 2024</h4>
                <div className="space-y-4">
                  {availableCourses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h5 className="font-medium">{course.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          {course.credits} Credits • Prerequisites: {course.prerequisites}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{course.seats} seats left</Badge>
                        <Button size="sm">Register</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Student Progress */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Student Portal - Academic Progress
              </CardTitle>
              <CardDescription>Track your attendance, grades, and course progress at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Current Semester Progress</h4>
                  <div className="space-y-4">
                    {courseProgress.map((course, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{course.course}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{course.grade}</Badge>
                            <span className="text-sm text-muted-foreground">{course.credits} cr</span>
                          </div>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">{course.progress}% complete</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Academic Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">3.7</div>
                      <div className="text-sm text-blue-800">Current GPA</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">92%</div>
                      <div className="text-sm text-green-800">Attendance</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">14</div>
                      <div className="text-sm text-purple-800">Credits Earned</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">6</div>
                      <div className="text-sm text-orange-800">Courses</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mentor Roadmap */}
        <TabsContent value="mentor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Personalized Mentor Roadmap
              </CardTitle>
              <CardDescription>Get custom academic and career guidance from your assigned mentor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Current Milestones</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Complete Core Subjects</p>
                        <p className="text-sm text-muted-foreground">Data Structures, Algorithms, DBMS</p>
                        <Badge variant="default" className="mt-1">Completed</Badge>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Build Portfolio Projects</p>
                        <p className="text-sm text-muted-foreground">2 web applications, 1 mobile app</p>
                        <Badge variant="secondary" className="mt-1">In Progress</Badge>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Internship Application</p>
                        <p className="text-sm text-muted-foreground">Apply for summer internships</p>
                        <Badge variant="outline" className="mt-1">Upcoming</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Mentor Details</h4>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          DR
                        </div>
                        <div>
                          <p className="font-medium">Dr. Sarah Rodriguez</p>
                          <p className="text-sm text-muted-foreground">Computer Science Department</p>
                        </div>
                      </div>
                      <p className="text-sm mb-3">Specialized in Software Engineering and AI research with 10+ years of industry experience.</p>
                      <Button size="sm" variant="outline" className="w-full">Schedule Meeting</Button>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-medium mb-2">Next Meeting</h5>
                      <p className="text-sm">March 20, 2024 at 2:00 PM</p>
                      <p className="text-sm text-muted-foreground">Room 304, CS Building</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}