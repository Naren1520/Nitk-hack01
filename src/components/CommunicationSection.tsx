import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Bell, MessageSquare, HelpCircle, Send, ThumbsUp, Eye, Pin, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/contexts/AuthContext';
import { useAnnouncements, useComplaints, useHelpQuestions } from '../lib/hooks/useData';
import { toast } from 'sonner@2.0.3';

export default function CommunicationSection() {
  const { user } = useAuth();
  const { announcements, loading: announcementsLoading, createAnnouncement } = useAnnouncements();
  const { complaints, loading: complaintsLoading, submitComplaint } = useComplaints();
  const { questions, loading: questionsLoading, submitQuestion } = useHelpQuestions();

  // Form states
  const [complaintForm, setComplaintForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const [questionForm, setQuestionForm] = useState({
    title: '',
    content: '',
    category: ''
  });

  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a complaint');
      return;
    }

    setSubmittingComplaint(true);
    try {
      const success = await submitComplaint(complaintForm);
      if (success) {
        setComplaintForm({
          title: '',
          description: '',
          category: '',
          priority: 'medium'
        });
      }
    } finally {
      setSubmittingComplaint(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a question');
      return;
    }

    setSubmittingQuestion(true);
    try {
      const success = await submitQuestion(questionForm);
      if (success) {
        setQuestionForm({
          title: '',
          content: '',
          category: ''
        });
      }
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'border-yellow-200 text-yellow-700 bg-yellow-50';
      case 'in_progress': return 'border-blue-200 text-blue-700 bg-blue-50';
      case 'resolved': return 'border-green-200 text-green-700 bg-green-50';
      case 'rejected': return 'border-red-200 text-red-700 bg-red-50';
      default: return 'border-gray-200 text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">📢 Communication & Updates</h2>
        <p className="text-muted-foreground">Stay connected and informed with the latest campus news and community support</p>
      </div>

      <Tabs defaultValue="news-feed" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="news-feed">News Feed</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="help-hub">Help Hub</TabsTrigger>
        </TabsList>

        {/* Daily News Feed */}
        <TabsContent value="news-feed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Daily News Feed
              </CardTitle>
              <CardDescription>Stay in the loop with announcements, events, and important circulars</CardDescription>
            </CardHeader>
            <CardContent>
              {announcementsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading announcements...</span>
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No announcements available</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {announcements.map((item) => (
                    <div key={item.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={item.priority === 'high' ? 'destructive' : 'secondary'}
                            className="flex items-center gap-1"
                          >
                            {item.priority === 'high' && <Pin className="h-3 w-3" />}
                            {item.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{formatDate(item.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          {item.views}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground mb-4">{item.content}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Read More</Button>
                        <Button size="sm" variant="ghost">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Like
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center py-4">
                    <Button variant="outline">Load More News</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Cafeteria Menu Updated</p>
                      <p className="text-xs text-muted-foreground">New healthy options available</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Bus Schedule Change</p>
                      <p className="text-xs text-muted-foreground">Route 3 timing modified</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Weather Alert</p>
                      <p className="text-xs text-muted-foreground">Heavy rain expected tomorrow</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium text-sm">Career Fair 2024</p>
                    <p className="text-xs text-muted-foreground">March 22-23 • Main Auditorium</p>
                  </div>
                  <div className="border-l-4 border-green-400 pl-4">
                    <p className="font-medium text-sm">Cultural Night</p>
                    <p className="text-xs text-muted-foreground">March 25 • Open Amphitheater</p>
                  </div>
                  <div className="border-l-4 border-purple-400 pl-4">
                    <p className="font-medium text-sm">Research Symposium</p>
                    <p className="text-xs text-muted-foreground">March 30 • Conference Hall</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Complaint Portal */}
        <TabsContent value="complaints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Complaint Portal
              </CardTitle>
              <CardDescription>Your voice matters - submit feedback or report issues directly to administration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Submit New Complaint</h4>
                  <form onSubmit={handleComplaintSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">Category</label>
                      <Select value={complaintForm.category} onValueChange={(value) => setComplaintForm({...complaintForm, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academic">Academic Issues</SelectItem>
                          <SelectItem value="facility">Facility Problems</SelectItem>
                          <SelectItem value="cafeteria">Cafeteria Services</SelectItem>
                          <SelectItem value="transport">Transportation</SelectItem>
                          <SelectItem value="library">Library Services</SelectItem>
                          <SelectItem value="it">IT Support</SelectItem>
                          <SelectItem value="hostel">Hostel/Accommodation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Priority Level</label>
                      <div className="flex gap-2">
                        <Button 
                          type="button"
                          variant={complaintForm.priority === 'low' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setComplaintForm({...complaintForm, priority: 'low'})}
                        >
                          Low
                        </Button>
                        <Button 
                          type="button"
                          variant={complaintForm.priority === 'medium' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setComplaintForm({...complaintForm, priority: 'medium'})}
                        >
                          Medium
                        </Button>
                        <Button 
                          type="button"
                          variant={complaintForm.priority === 'high' ? 'destructive' : 'outline'} 
                          size="sm"
                          onClick={() => setComplaintForm({...complaintForm, priority: 'high'})}
                        >
                          High
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Subject</label>
                      <Input 
                        placeholder="Brief description of the issue" 
                        value={complaintForm.title}
                        onChange={(e) => setComplaintForm({...complaintForm, title: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Detailed Description</label>
                      <Textarea 
                        placeholder="Provide detailed information about your complaint..."
                        rows={6}
                        value={complaintForm.description}
                        onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1" disabled={submittingComplaint || !user}>
                        {submittingComplaint ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Complaint
                          </>
                        )}
                      </Button>
                      <Button type="button" variant="outline">Save as Draft</Button>
                    </div>
                    {!user && (
                      <p className="text-sm text-muted-foreground">Please login to submit a complaint</p>
                    )}
                  </form>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">My Complaints</h4>
                  {complaintsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading complaints...</span>
                    </div>
                  ) : !user ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Please login to view your complaints</p>
                    </div>
                  ) : complaints.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No complaints submitted yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {complaints.map((complaint) => (
                        <div key={complaint.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className={getStatusColor(complaint.status)}>
                              {complaint.status.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{formatDate(complaint.created_at)}</span>
                          </div>
                          <h5 className="font-medium text-sm mb-1">{complaint.title}</h5>
                          <p className="text-xs text-muted-foreground mb-3">
                            {complaint.description.substring(0, 100)}...
                          </p>
                          <div className="text-xs text-muted-foreground">
                            <p>Complaint ID: #{complaint.id}</p>
                            <p>Category: {complaint.category}</p>
                            {complaint.resolution && (
                              <p className="text-green-600 mt-1">Resolution: {complaint.resolution}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Help Hub */}
        <TabsContent value="help-hub" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Help Hub - Peer Support Network
              </CardTitle>
              <CardDescription>Ask questions, share notes, and help each other succeed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Ask a Question</h4>
                    <Button size="sm" variant="outline">Browse Categories</Button>
                  </div>
                  <form onSubmit={handleQuestionSubmit} className="space-y-4">
                    <Input 
                      placeholder="What do you need help with?" 
                      value={questionForm.title}
                      onChange={(e) => setQuestionForm({...questionForm, title: e.target.value})}
                      required
                    />
                    <div>
                      <Select value={questionForm.category} onValueChange={(value) => setQuestionForm({...questionForm, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="campus_life">Campus Life</SelectItem>
                          <SelectItem value="career">Career</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea 
                      placeholder="Describe your question in detail..."
                      rows={4}
                      value={questionForm.content}
                      onChange={(e) => setQuestionForm({...questionForm, content: e.target.value})}
                      required
                    />
                    <Button type="submit" className="w-full" disabled={submittingQuestion || !user}>
                      {submittingQuestion ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <HelpCircle className="h-4 w-4 mr-2" />
                          Post Question
                        </>
                      )}
                    </Button>
                    {!user && (
                      <p className="text-sm text-muted-foreground">Please login to post a question</p>
                    )}
                  </form>

                  {user && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-4">Recent Activity</h4>
                      <div className="space-y-3">
                        <div className="text-sm p-3 bg-green-50 rounded-lg">
                          <p className="font-medium">You helped with "Database normalization"</p>
                          <p className="text-muted-foreground">Earned 5 reputation points</p>
                        </div>
                        <div className="text-sm p-3 bg-blue-50 rounded-lg">
                          <p className="font-medium">Your question was answered</p>
                          <p className="text-muted-foreground">"How to prepare for placement interviews?"</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Popular Questions</h4>
                  {questionsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading questions...</span>
                    </div>
                  ) : questions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No questions available</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {questions.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                  {item.author_id.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">User {item.author_id}</span>
                            </div>
                            {item.is_solved && <Badge variant="default" className="bg-green-600">Solved</Badge>}
                          </div>
                          <h5 className="font-medium text-sm mb-2">{item.title}</h5>
                          <p className="text-xs text-muted-foreground mb-3">{item.content.substring(0, 100)}...</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                {item.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {item.views}
                              </span>
                            </div>
                            <Button size="sm" variant="outline">View Thread</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {user && (
                    <div className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Your Reputation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-xl font-bold text-blue-600">156</div>
                              <div className="text-xs text-muted-foreground">Points</div>
                            </div>
                            <div>
                              <div className="text-xl font-bold text-green-600">12</div>
                              <div className="text-xs text-muted-foreground">Answers</div>
                            </div>
                            <div>
                              <div className="text-xl font-bold text-purple-600">3</div>
                              <div className="text-xs text-muted-foreground">Best Answers</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}