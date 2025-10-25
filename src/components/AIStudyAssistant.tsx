import { useState, useRef, useEffect } from 'react';
import { 
  Brain, 
  Send, 
  BookOpen, 
  Lightbulb, 
  Target, 
  Clock, 
  MessageCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  RefreshCw,
  Trash2,
  Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../lib/contexts/AuthContext';
import { aiService } from '../lib/services/aiService';
import { toast } from 'sonner@2.0.3';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  subject?: string;
}

interface StudyPlan {
  id: string;
  title: string;
  content: string;
  subjects: string[];
  timeFrame: string;
  created: string;
  progress: number;
}

export default function AIStudyAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('general');
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const subjects = [
    { id: 'general', name: 'General Study Help' },
    { id: 'math', name: 'Mathematics' },
    { id: 'cs', name: 'Computer Science' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' },
    { id: 'english', name: 'English Literature' },
    { id: 'history', name: 'History' }
  ];

  const quickQuestions = [
    "Explain this concept in simple terms",
    "Create a study schedule for me",
    "Help me understand this topic better",
    "What are the key points I should remember?",
    "Generate practice questions for me"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with a welcome message
    if (messages.length === 0 && user) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'assistant',
        content: `Hello ${(user.profile as any)?.first_name || 'there'}! I'm your AI Study Assistant. I can help you with explanations, create study plans, generate practice questions, and provide personalized learning guidance. What would you like to learn about today?`,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: currentMessage.trim(),
      timestamp: new Date().toISOString(),
      subject: selectedSubject
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    try {
      // Get AI response
      const context = selectedSubject !== 'general' ? 
        subjects.find(s => s.id === selectedSubject)?.name : '';
      
      const response = await aiService.answerStudentQuestion(
        userMessage.content,
        context,
        selectedSubject
      );

      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        type: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        subject: selectedSubject
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Text-to-speech if enabled
      if (isSpeechEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        type: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please make sure your AI service is properly configured and try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setCurrentMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const generateStudyPlan = async () => {
    if (!user) return;

    try {
      setIsTyping(true);
      const profile = user.profile as any;
      
      const studyPlan = await aiService.generateStudyPlan(
        profile.academic_level || 'undergraduate',
        [selectedSubject],
        20, // hours per week
        ['improve grades', 'better understanding']
      );

      const newPlan: StudyPlan = {
        id: `plan_${Date.now()}`,
        title: studyPlan.title,
        content: studyPlan.content,
        subjects: [selectedSubject],
        timeFrame: 'weekly',
        created: new Date().toISOString(),
        progress: 0
      };

      setStudyPlans(prev => [...prev, newPlan]);
      toast.success('Study plan generated successfully!');

      // Add as chat message
      const planMessage: ChatMessage = {
        id: `plan_${Date.now()}`,
        type: 'assistant',
        content: `I've created a personalized study plan for you! Here's what I recommend:\n\n${studyPlan.content}`,
        timestamp: new Date().toISOString(),
        subject: selectedSubject
      };

      setMessages(prev => [...prev, planMessage]);
      
    } catch (error) {
      console.error('Error generating study plan:', error);
      toast.error('Failed to generate study plan');
    } finally {
      setIsTyping(false);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard!');
  };

  const clearChat = () => {
    setMessages([]);
    toast.success('Chat history cleared');
  };

  const exportChat = () => {
    const chatData = {
      export_date: new Date().toISOString(),
      user: user?.profile,
      messages: messages
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai_chat_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Chat exported successfully!');
  };

  const startVoiceRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        toast.info('Listening... Speak now!');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentMessage(transcript);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        toast.error('Voice recognition failed');
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } else {
      toast.error('Voice recognition not supported in this browser');
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Please log in</h3>
        <p className="text-muted-foreground">You need to be logged in to use the AI Study Assistant.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            AI Study Assistant
          </h2>
          <p className="text-muted-foreground">
            Get personalized help, explanations, and study plans powered by AI
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
          >
            {isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={exportChat}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={clearChat}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="plans">Study Plans</TabsTrigger>
          <TabsTrigger value="analytics">Learning Analytics</TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Area */}
            <div className="lg:col-span-3 space-y-4">
              <Card className="h-96">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">AI Chat Assistant</CardTitle>
                    <div className="flex items-center gap-2">
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map(subject => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-72 px-6">
                    <div className="space-y-4 pb-4">
                      {messages.map(message => (
                        <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            message.type === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <div className="whitespace-pre-wrap text-sm">
                              {message.content}
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-opacity-20">
                              <div className="text-xs opacity-70">
                                {new Date(message.timestamp).toLocaleTimeString()}
                                {message.subject && message.subject !== 'general' && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {subjects.find(s => s.id === message.subject)?.name}
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 opacity-70 hover:opacity-100"
                                onClick={() => copyMessage(message.content)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-muted p-3 rounded-lg">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Message Input */}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Ask me anything about your studies..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isTyping}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startVoiceRecording}
                  disabled={isTyping || isRecording}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button onClick={handleSendMessage} disabled={isTyping || !currentMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={generateStudyPlan}
                    disabled={isTyping}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Generate Study Plan
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleQuickQuestion('Create practice questions for me')}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Practice Questions
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Quick Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-auto p-2 whitespace-normal"
                      onClick={() => handleQuickQuestion(question)}
                      disabled={isTyping}
                    >
                      <MessageCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                      {question}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Study Plans Tab */}
        <TabsContent value="plans" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Study Plans</h3>
            <Button onClick={generateStudyPlan}>
              <Target className="h-4 w-4 mr-2" />
              Create New Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studyPlans.map(plan => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{plan.title}</CardTitle>
                  <CardDescription>
                    Created {new Date(plan.created).toLocaleDateString()} • {plan.subjects.join(', ')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {plan.content.slice(0, 200)}...
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Full Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {studyPlans.length === 0 && (
              <div className="col-span-2 text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Study Plans Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Generate personalized study plans to improve your learning efficiency.
                </p>
                <Button onClick={generateStudyPlan}>
                  <Target className="h-4 w-4 mr-2" />
                  Create Your First Plan
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Questions Asked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{messages.filter(m => m.type === 'user').length}</div>
                <p className="text-xs text-muted-foreground">Total interactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Study Plans Created</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studyPlans.length}</div>
                <p className="text-xs text-muted-foreground">Personalized plans</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Most Asked Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {selectedSubject !== 'general' ? 
                    subjects.find(s => s.id === selectedSubject)?.name.slice(0, 8) : 'General'
                  }
                </div>
                <p className="text-xs text-muted-foreground">Focus area</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Learning Insights</CardTitle>
              <CardDescription>AI analysis of your study patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">📊 Study Pattern</h4>
                  <p className="text-sm text-blue-800">
                    You're most active asking questions about {subjects.find(s => s.id === selectedSubject)?.name.toLowerCase() || 'general topics'}. 
                    Consider diversifying your study subjects for a more balanced learning approach.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">💡 Recommendation</h4>
                  <p className="text-sm text-green-800">
                    Based on your questions, you might benefit from more structured study sessions. 
                    Try using the generated study plans to organize your learning schedule.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">🎯 Next Steps</h4>
                  <p className="text-sm text-purple-800">
                    Consider generating practice questions and setting specific learning goals to track your progress more effectively.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}