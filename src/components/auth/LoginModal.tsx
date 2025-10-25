import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useAuth } from '../../lib/contexts/AuthContext';
import { LoginCredentials, SignupData } from '../../lib/types/database';
import { Loader2, GraduationCap, UserCircle, Shield, Key } from 'lucide-react';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { login, signup, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  
  // Login form state - now using USN instead of email
  const [loginForm, setLoginForm] = useState({
    usn: '',
    password: ''
  });

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    email: '',
    usn: '',
    password: '',
    confirmPassword: '',
    role: '' as 'student' | 'faculty',
    firstName: '',
    lastName: '',
    department: '',
    year: '',
    facultyId: '',
    designation: '',
    specialization: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert USN to email format for backend compatibility
    const credentials: LoginCredentials = {
      email: `${loginForm.usn}@student.college.edu`,
      password: loginForm.password
    };
    
    const success = await login(credentials);
    if (success) {
      onOpenChange(false);
      setLoginForm({ usn: '', password: '' });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupForm.password !== signupForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const signupData: SignupData = {
      email: signupForm.email,
      password: signupForm.password,
      role: signupForm.role,
      profile: signupForm.role === 'student' ? {
        student_id: signupForm.usn,
        first_name: signupForm.firstName,
        last_name: signupForm.lastName,
        department: signupForm.department,
        year: parseInt(signupForm.year) || 1,
        gpa: 0.0
      } : {
        faculty_id: signupForm.facultyId,
        first_name: signupForm.firstName,
        last_name: signupForm.lastName,
        department: signupForm.department,
        designation: signupForm.designation,
        specialization: signupForm.specialization
      }
    };

    const success = await signup(signupData);
    if (success) {
      onOpenChange(false);
      // Reset form
      setSignupForm({
        email: '', usn: '', password: '', confirmPassword: '', role: '' as any,
        firstName: '', lastName: '', department: '', year: '',
        facultyId: '', designation: '', specialization: ''
      });
    }
  };

  const demoAccounts = [
    {
      usn: 'CS2021001',
      password: 'demo123',
      role: 'Student',
      icon: <GraduationCap className="h-4 w-4" />
    },
    {
      usn: 'FAC001',
      password: 'demo123',
      role: 'Faculty',
      icon: <UserCircle className="h-4 w-4" />
    },
    {
      usn: 'ADMIN001',
      password: 'demo123',
      role: 'Admin',
      icon: <Shield className="h-4 w-4" />
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Campus Link Access
          </DialogTitle>
          <DialogDescription>
            Sign in with your USN to access your personalized campus dashboard
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Welcome Back</CardTitle>
                <CardDescription>Enter your USN and password to continue</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-usn" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      USN (University Serial Number)
                    </Label>
                    <Input
                      id="login-usn"
                      type="text"
                      placeholder="e.g., CS2021001"
                      value={loginForm.usn}
                      onChange={(e) => setLoginForm({ ...loginForm, usn: e.target.value.toUpperCase() })}
                      required
                      className="uppercase"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your unique University Serial Number
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Demo Accounts</CardTitle>
                <CardDescription>Try the platform with pre-configured accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {demoAccounts.map((account, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setLoginForm({ usn: account.usn, password: account.password })}
                    >
                      {account.icon}
                      <span className="ml-2">{account.role} Demo - {account.usn}</span>
                    </Button>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs">
                  <p className="font-medium text-blue-800 mb-1">🔍 How to find your USN:</p>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Check your student ID card</li>
                    <li>• Look in your official college documents</li>
                    <li>• Contact the registrar's office if needed</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create Account</CardTitle>
                <CardDescription>Join the Campus Link community</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-firstName">First Name</Label>
                      <Input
                        id="signup-firstName"
                        placeholder="John"
                        value={signupForm.firstName}
                        onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-lastName">Last Name</Label>
                      <Input
                        id="signup-lastName"
                        placeholder="Doe"
                        value={signupForm.lastName}
                        onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@college.edu"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-usn" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      USN (University Serial Number)
                    </Label>
                    <Input
                      id="signup-usn"
                      placeholder="e.g., CS2024001"
                      value={signupForm.usn}
                      onChange={(e) => setSignupForm({ ...signupForm, usn: e.target.value.toUpperCase() })}
                      required
                      className="uppercase"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your unique University Serial Number
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Role</Label>
                    <Select value={signupForm.role} onValueChange={(value: 'student' | 'faculty') => setSignupForm({ ...signupForm, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-department">Department</Label>
                    <Select value={signupForm.department} onValueChange={(value) => setSignupForm({ ...signupForm, department: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                        <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                        <SelectItem value="Business Administration">Business Administration</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {signupForm.role === 'student' && (
                    <div className="space-y-2">
                      <Label htmlFor="signup-year">Academic Year</Label>
                      <Select value={signupForm.year} onValueChange={(value) => setSignupForm({ ...signupForm, year: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">First Year</SelectItem>
                          <SelectItem value="2">Second Year</SelectItem>
                          <SelectItem value="3">Third Year</SelectItem>
                          <SelectItem value="4">Fourth Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {signupForm.role === 'faculty' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="signup-facultyId">Faculty ID</Label>
                        <Input
                          id="signup-facultyId"
                          placeholder="FAC001"
                          value={signupForm.facultyId}
                          onChange={(e) => setSignupForm({ ...signupForm, facultyId: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-designation">Designation</Label>
                        <Input
                          id="signup-designation"
                          placeholder="Assistant Professor"
                          value={signupForm.designation}
                          onChange={(e) => setSignupForm({ ...signupForm, designation: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-specialization">Specialization</Label>
                        <Input
                          id="signup-specialization"
                          placeholder="Machine Learning"
                          value={signupForm.specialization}
                          onChange={(e) => setSignupForm({ ...signupForm, specialization: e.target.value })}
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirmPassword">Confirm Password</Label>
                    <Input
                      id="signup-confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}