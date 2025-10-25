import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Award,
  Clock,
  BookOpen,
  Brain,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../lib/contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface PerformanceData {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  examScore: number;
  maxScore: number;
  percentage: number;
  submittedAt: string;
  timeSpent: number;
  difficulty: string;
}

interface AnalyticsData {
  period: string;
  totalExams: number;
  avgScore: number;
  completionRate: number;
  studyTime: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsPerformance() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user can view analytics (admin/lecturer)
  const canViewAllAnalytics = () => {
    if (!user || !user.profile) return false;
    const profile = user.profile as any;
    return ['admin', 'lecturer'].includes(profile.role);
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod, selectedSubject]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate mock performance data
      const mockPerformanceData: PerformanceData[] = [
        {
          id: '1',
          studentId: user?.id || 'student1',
          studentName: 'John Doe',
          subject: 'Computer Science',
          examScore: 85,
          maxScore: 100,
          percentage: 85,
          submittedAt: '2024-01-15T10:30:00Z',
          timeSpent: 3600,
          difficulty: 'medium'
        },
        {
          id: '2',
          studentId: user?.id || 'student1',
          studentName: 'John Doe',
          subject: 'Mathematics',
          examScore: 92,
          maxScore: 100,
          percentage: 92,
          submittedAt: '2024-01-12T14:20:00Z',
          timeSpent: 2400,
          difficulty: 'hard'
        },
        {
          id: '3',
          studentId: 'student2',
          studentName: 'Jane Smith',
          subject: 'Physics',
          examScore: 78,
          maxScore: 100,
          percentage: 78,
          submittedAt: '2024-01-14T09:15:00Z',
          timeSpent: 4200,
          difficulty: 'medium'
        }
      ];

      // Generate mock analytics data
      const mockAnalyticsData: AnalyticsData[] = [
        { period: 'Mon', totalExams: 12, avgScore: 82, completionRate: 95, studyTime: 8 },
        { period: 'Tue', totalExams: 15, avgScore: 78, completionRate: 88, studyTime: 6.5 },
        { period: 'Wed', totalExams: 8, avgScore: 90, completionRate: 92, studyTime: 7.2 },
        { period: 'Thu', totalExams: 18, avgScore: 85, completionRate: 96, studyTime: 9.1 },
        { period: 'Fri', totalExams: 22, avgScore: 79, completionRate: 85, studyTime: 5.8 },
        { period: 'Sat', totalExams: 5, avgScore: 93, completionRate: 100, studyTime: 4.2 },
        { period: 'Sun', totalExams: 3, avgScore: 88, completionRate: 100, studyTime: 3.5 }
      ];

      setPerformanceData(mockPerformanceData);
      setAnalyticsData(mockAnalyticsData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallStats = () => {
    const totalExams = performanceData.length;
    const avgScore = totalExams > 0 ? 
      performanceData.reduce((sum, exam) => sum + exam.percentage, 0) / totalExams : 0;
    const avgTime = totalExams > 0 ?
      performanceData.reduce((sum, exam) => sum + exam.timeSpent, 0) / totalExams / 60 : 0; // in minutes
    
    return { totalExams, avgScore, avgTime };
  };

  const getSubjectDistribution = () => {
    const subjects = performanceData.reduce((acc, exam) => {
      acc[exam.subject] = (acc[exam.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(subjects).map(([subject, count], index) => ({
      name: subject,
      value: count,
      color: COLORS[index % COLORS.length]
    }));
  };

  const getDifficultyStats = () => {
    const difficulty = performanceData.reduce((acc, exam) => {
      acc[exam.difficulty] = (acc[exam.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(difficulty).map(([level, count]) => ({
      difficulty: level.charAt(0).toUpperCase() + level.slice(1),
      count,
      percentage: (count / performanceData.length) * 100
    }));
  };

  const exportData = () => {
    const dataToExport = {
      summary: calculateOverallStats(),
      performance: performanceData,
      analytics: analyticsData,
      exported: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Analytics report exported successfully!');
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Please log in</h3>
        <p className="text-muted-foreground">You need to be logged in to view analytics.</p>
      </div>
    );
  }

  const overallStats = calculateOverallStats();
  const subjectData = getSubjectDistribution();
  const difficultyStats = getDifficultyStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Analytics & Performance
          </h2>
          <p className="text-muted-foreground">
            {canViewAllAnalytics() ? 
              'Comprehensive analytics for all students and courses' : 
              'Your personal learning analytics and performance insights'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="semester">Semester</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="cs">Computer Science</SelectItem>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      ) : (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallStats.totalExams}</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last {selectedPeriod}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallStats.avgScore.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    +5.2% from last {selectedPeriod}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Study Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallStats.avgTime.toFixed(0)}m</div>
                  <p className="text-xs text-muted-foreground">
                    Per exam session
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {performanceData.filter(p => p.percentage >= 70).length}/{performanceData.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {((performanceData.filter(p => p.percentage >= 70).length / performanceData.length) * 100).toFixed(0)}% passing rate
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Subject Distribution</CardTitle>
                  <CardDescription>Exam attempts by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={subjectData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {subjectData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Performance Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Performance Trend</CardTitle>
                  <CardDescription>Average scores and completion rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="avgScore" stroke="#8884d8" strokeWidth={2} name="Avg Score %" />
                      <Line type="monotone" dataKey="completionRate" stroke="#82ca9d" strokeWidth={2} name="Completion %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Difficulty Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Difficulty Level Analysis</CardTitle>
                <CardDescription>Performance breakdown by exam difficulty</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {difficultyStats.map((stat, index) => (
                    <div key={stat.difficulty} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"}>
                          {stat.difficulty}
                        </Badge>
                        <span className="font-medium">{stat.count} exams</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={stat.percentage} className="w-24" />
                        <span className="text-sm text-muted-foreground min-w-12">
                          {stat.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Performance</CardTitle>
                <CardDescription>Detailed breakdown of recent exam attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.map((performance) => (
                    <div key={performance.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{performance.subject}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(performance.submittedAt).toLocaleDateString()} • 
                          {Math.floor(performance.timeSpent / 60)}m {performance.timeSpent % 60}s
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-lg font-semibold">
                          {performance.examScore}/{performance.maxScore}
                        </div>
                        <Badge variant={performance.percentage >= 80 ? "default" : performance.percentage >= 70 ? "secondary" : "destructive"}>
                          {performance.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Time vs Performance</CardTitle>
                <CardDescription>Correlation between study time and exam scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="studyTime" stackId="1" stroke="#8884d8" fill="#8884d8" name="Study Hours" />
                    <Area type="monotone" dataKey="avgScore" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Avg Score" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exam Volume Trends</CardTitle>
                <CardDescription>Number of exams taken over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalExams" fill="#8884d8" name="Total Exams" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>Personalized recommendations based on your performance data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">📈 Performance Trend</h4>
                    <p className="text-sm text-blue-800">
                      Your average score has improved by 5.2% over the last week. Keep up the consistent study schedule!
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">💪 Strength Areas</h4>
                    <p className="text-sm text-green-800">
                      You excel in Mathematics (92% avg) and Computer Science (85% avg). Consider mentoring peers in these subjects.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">🎯 Improvement Areas</h4>
                    <p className="text-sm text-orange-800">
                      Physics shows potential for improvement (78% avg). Recommend spending 20% more study time on foundational concepts.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">🕒 Study Pattern</h4>
                    <p className="text-sm text-purple-800">
                      Your optimal study time appears to be mid-week (Wed-Thu). Consider scheduling important exams during these days.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">🚀 Next Steps</h4>
                    <ul className="text-sm text-gray-800 space-y-1 list-disc list-inside">
                      <li>Focus on Physics fundamentals with additional practice problems</li>
                      <li>Maintain current study schedule for Mathematics and CS</li>
                      <li>Consider taking more challenging exams to push your limits</li>
                      <li>Join study groups for collaborative learning in weaker subjects</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}