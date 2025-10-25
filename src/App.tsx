import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Toaster } from './components/ui/sonner';
import { 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  MessageSquare, 
  Shield, 
  Trophy, 
  Brain, 
  MapPin,
  Bell,
  FileText,
  Users,
  Wifi,
  Search,
  Clock,
  Star,
  LogOut,
  User,
  Settings,
  Upload,
  ArrowLeft,
  BarChart3,
  Menu
} from 'lucide-react';
import { AuthProvider, useAuth } from './lib/contexts/AuthContext';
import { SettingsProvider } from './lib/contexts/SettingsContext';
import { useRealTimeData } from './lib/hooks/useData';
import LoginModal from './components/auth/LoginModal';
import AcademicsSection from './components/AcademicsSection';
import SmartCampusSection from './components/SmartCampusSection';
import CommunicationSection from './components/CommunicationSection';
import SafetyServicesSection from './components/SafetyServicesSection';
import CommunitySection from './components/CommunitySection';
import CampusLifeSection from './components/CampusLifeSection';
import NotificationCenter from './components/NotificationCenter';
import DocumentCollaboration from './components/DocumentCollaboration';
import AIExamGenerator from './components/AIExamGenerator';
import ContentManagement from './components/ContentManagement';
import SettingsPanel from './components/SettingsPanel';
import AlarmNotificationSystem from './components/AlarmNotificationSystem';
import QuickSettingsWidget from './components/QuickSettingsWidget';
import AnalyticsPerformance from './components/AnalyticsPerformance';
import ExamScheduling from './components/ExamScheduling';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';

function AppContent() {
  const { user, logout, loading } = useAuth();
  const { lastUpdate } = useRealTimeData();
  const [activeTab, setActiveTab] = useState('overview');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Update stats based on real-time data
  const [stats, setStats] = useState({
    activeStudents: 15000,
    facultyMembers: 500,
    departments: 50,
    systemUptime: 99.9
  });

  useEffect(() => {
    // Simulate real-time stats updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeStudents: prev.activeStudents + Math.floor(Math.random() * 10) - 5,
        systemUptime: Math.min(99.9, prev.systemUptime + (Math.random() - 0.5) * 0.1)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    const profile = user.profile as any;
    return `${profile.first_name} ${profile.last_name}`;
  };

  const getUSN = () => {
    if (!user) return '';
    const profile = user.profile as any;
    return profile.student_id || profile.faculty_id || '';
  };

  const tabItems = [
    { value: 'overview', icon: Star, label: 'Overview' },
    { value: 'academics', icon: BookOpen, label: 'Academics' },
    { value: 'smart-campus', icon: Brain, label: 'Smart Campus' },
    { value: 'communication', icon: MessageSquare, label: 'Communication' },
    { value: 'safety', icon: Shield, label: 'Safety' },
    { value: 'community', icon: Trophy, label: 'Community' },
    { value: 'campus-life', icon: Calendar, label: 'Campus Life' },
    { value: 'documents', icon: FileText, label: 'Documents' },
    { value: 'ai-exams', icon: Brain, label: 'AI Exams' },
    { value: 'analytics', icon: BarChart3, label: 'Analytics' },
    { value: 'content', icon: Upload, label: 'Content' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <GraduationCap className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading Campus Link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and navigation */}
            <div className="flex items-center space-x-3">
              {activeTab !== 'overview' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActiveTab('overview')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              )}
              <GraduationCap className="h-8 w-8 text-primary" />
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate">Campus Link</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  {user ? `${getGreeting()}, ${getUserDisplayName()}` : 'All-in-One College Hub'}
                </p>
                {user && (
                  <p className="text-xs text-muted-foreground sm:hidden">
                    USN: {getUSN()}
                  </p>
                )}
              </div>
            </div>
            
            {/* Right side - Status and user controls */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hidden sm:flex">
                🟢 Online
              </Badge>
              
              {user ? (
                <>
                  <NotificationCenter />
                  
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={(user.profile as any).avatar_url} />
                    <AvatarFallback>
                      {getUserDisplayName().split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <Button variant="ghost" size="sm" onClick={logout} className="hidden sm:flex">
                    <LogOut className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveTab('settings')}
                    className="hidden sm:flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>

                  {/* Mobile menu */}
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm" className="sm:hidden">
                        <Menu className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-72">
                      <div className="space-y-4 mt-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <Avatar className="h-16 w-16 mx-auto mb-3">
                            <AvatarImage src={(user.profile as any).avatar_url} />
                            <AvatarFallback className="text-lg">
                              {getUserDisplayName().split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-medium">{getUserDisplayName()}</h3>
                          <p className="text-sm text-muted-foreground">USN: {getUSN()}</p>
                          <Badge variant="outline" className="mt-2 capitalize">
                            {user.role}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <Button 
                            variant="ghost" 
                            onClick={() => {
                              setActiveTab('settings');
                              setMobileMenuOpen(false);
                            }}
                            className="w-full justify-start"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </Button>
                          <Button 
                            variant="ghost" 
                            onClick={logout}
                            className="w-full justify-start"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Button variant="outline" onClick={() => setShowLoginModal(true)} size="sm">
                    <span className="hidden sm:inline">Student Login</span>
                    <span className="sm:hidden">Login</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveTab('settings')}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Settings</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop Tab List */}
          <TabsList className="hidden lg:grid w-full grid-cols-11 mb-8">
            {tabItems.map((item) => (
              <TabsTrigger key={item.value} value={item.value} className="flex items-center justify-center p-3" title={item.label}>
                <item.icon className="h-5 w-5" />
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Mobile Tab List */}
          <div className="lg:hidden mb-6">
            <div className="flex overflow-x-auto scrollbar-hide space-x-2 pb-2">
              {tabItems.map((item) => (
                <Button
                  key={item.value}
                  variant={activeTab === item.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(item.value)}
                  className="flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 sm:space-y-8">
            {user && (
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="min-w-0">
                      <h2 className="text-xl sm:text-2xl font-bold mb-2">
                        {getGreeting()}, {getUserDisplayName()}!
                      </h2>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Welcome back to Campus Link. You have 3 new notifications and 2 upcoming classes today.
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-muted-foreground">Role</p>
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">USN: {getUSN()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Welcome to Campus Link</h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Your comprehensive college hub that connects academics, campus life, and services in one seamless platform.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>

            {/* Enhanced Real-time Features */}
            {user && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">🚀 Enhanced Real-time Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <QuickSettingsWidget onOpenFullSettings={() => setActiveTab('settings')} />

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('documents')}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-sm">Live Documents</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground">Real-time collaborative editing</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('ai-exams')}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-5 w-5 text-green-600" />
                        <CardTitle className="text-sm">AI Exam Generator</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground">Generate exams from study materials</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('content')}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2">
                        <Upload className="h-5 w-5 text-orange-600" />
                        <CardTitle className="text-sm">Content Hub</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground">Secure content management system</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Feature Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('academics')}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-base sm:text-lg">📚 Academics & Exams</CardTitle>
                  </div>
                  <CardDescription>Complete academic management system</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Examination Portal & Results</li>
                    <li>• Previous Year Question Papers</li>
                    <li>• Course Registration System</li>
                    <li>• Student Progress Tracking</li>
                    <li>• Personalized Mentor Roadmaps</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('smart-campus')}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Brain className="h-6 w-6 text-purple-600" />
                    <CardTitle className="text-base sm:text-lg">💡 Smart Campus Tools</CardTitle>
                  </div>
                  <CardDescription>AI-powered campus experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• AI Study Assistant</li>
                    <li>• AR Campus Navigation</li>
                    <li>• Focus Mode for Studies</li>
                    <li>• Smart Recommendations</li>
                    <li>• Automated Scheduling</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('communication')}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                    <CardTitle className="text-base sm:text-lg">📢 Communication Hub</CardTitle>
                  </div>
                  <CardDescription>Stay connected and informed</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Daily News & Announcements</li>
                    <li>• Complaint Resolution Portal</li>
                    <li>• Peer Help Network</li>
                    <li>• Direct Faculty Communication</li>
                    <li>• Event Notifications</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('safety')}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-6 w-6 text-red-600" />
                    <CardTitle className="text-base sm:text-lg">🔒 Safety & Services</CardTitle>
                  </div>
                  <CardDescription>Campus safety and digital services</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Emergency Safety Alert System</li>
                    <li>• Wi-Fi Access Management</li>
                    <li>• Digital Service Requests</li>
                    <li>• Security Contact Directory</li>
                    <li>• Campus Safety Guidelines</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('community')}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                    <CardTitle className="text-base sm:text-lg">🏆 Community & Recognition</CardTitle>
                  </div>
                  <CardDescription>Celebrate achievements and connect</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Student Achievement Gallery</li>
                    <li>• Lost & Found Portal</li>
                    <li>• Community Forums</li>
                    <li>• Recognition Programs</li>
                    <li>• Peer Networking</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('campus-life')}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-6 w-6 text-indigo-600" />
                    <CardTitle className="text-base sm:text-lg">🗓 Campus Life Organizer</CardTitle>
                  </div>
                  <CardDescription>Manage your daily campus activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Personal Class Timetables</li>
                    <li>• Campus Event Calendar</li>
                    <li>• Student Resource Guide</li>
                    <li>• Club & Society Events</li>
                    <li>• Academic Deadlines</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 sm:mt-12">
              <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.activeStudents.toLocaleString()}+</div>
                <div className="text-xs sm:text-sm text-blue-800">Active Students</div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-green-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.facultyMembers}+</div>
                <div className="text-xs sm:text-sm text-green-800">Faculty Members</div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-purple-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">{stats.departments}+</div>
                <div className="text-xs sm:text-sm text-purple-800">Departments</div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-orange-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-orange-600">{stats.systemUptime.toFixed(1)}%</div>
                <div className="text-xs sm:text-sm text-orange-800">System Uptime</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="academics">
            <AcademicsSection />
          </TabsContent>

          <TabsContent value="smart-campus">
            <SmartCampusSection />
          </TabsContent>

          <TabsContent value="communication">
            <CommunicationSection />
          </TabsContent>

          <TabsContent value="safety">
            <SafetyServicesSection />
          </TabsContent>

          <TabsContent value="community">
            <CommunitySection />
          </TabsContent>

          <TabsContent value="campus-life">
            <CampusLifeSection />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentCollaboration />
          </TabsContent>

          <TabsContent value="ai-exams">
            <div className="space-y-8">
              <AIExamGenerator />
              <ExamScheduling />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsPerformance />
          </TabsContent>

          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h3 className="font-semibold mb-3">Campus Link</h3>
              <p className="text-sm text-muted-foreground">
                Revolutionizing college life with smart, integrated solutions.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-3">Quick Access</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Student Portal</li>
                <li>Faculty Dashboard</li>
                <li>Admin Panel</li>
                <li>Mobile App</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Contact IT Support</li>
                <li>System Status</li>
                <li>Report Issue</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Campus Social</li>
                <li>Student Forums</li>
                <li>Official Website</li>
                <li>Mobile Apps</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-6 sm:mt-8 pt-4 text-center text-sm text-muted-foreground">
            © 2024 Campus Link. All rights reserved. | Privacy Policy | Terms of Service
          </div>
        </div>
      </footer>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      <AlarmNotificationSystem />
      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  );
}