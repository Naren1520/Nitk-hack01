import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import {
  Settings,
  Palette,
  Type,
  Bell,
  Clock,
  CheckSquare,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Monitor,
  Mail,
  Smartphone,
  Save,
  RotateCcw,
  AlarmClock,
  Calendar,
  Key
} from 'lucide-react';
import { useSettings, Alarm, TodoItem } from '../lib/contexts/SettingsContext';
import { toast } from 'sonner@2.0.3';
import APIConfiguration from './APIConfiguration';
import SupabaseConnectionTest from './SupabaseConnectionTest';
import EnvironmentStatus from './EnvironmentStatus';

export default function SettingsPanel() {
  const {
    settings,
    updateSettings,
    addAlarm,
    toggleAlarm,
    deleteAlarm,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo
  } = useSettings();

  const [newAlarm, setNewAlarm] = useState({
    title: '',
    time: '',
    repeat: 'none' as const
  });

  const [newTodo, setNewTodo] = useState({
    text: '',
    priority: 'medium' as const,
    dueDate: ''
  });

  const handleAddAlarm = () => {
    if (!newAlarm.title || !newAlarm.time) {
      toast.error('Please fill in all alarm fields');
      return;
    }

    addAlarm({
      title: newAlarm.title,
      time: newAlarm.time,
      repeat: newAlarm.repeat,
      isEnabled: true
    });

    setNewAlarm({ title: '', time: '', repeat: 'none' });
    toast.success('Alarm added successfully!');
  };

  const handleAddTodo = () => {
    if (!newTodo.text.trim()) {
      toast.error('Please enter a todo item');
      return;
    }

    addTodo({
      text: newTodo.text,
      priority: newTodo.priority,
      dueDate: newTodo.dueDate || undefined,
      completed: false
    });

    setNewTodo({ text: '', priority: 'medium', dueDate: '' });
    toast.success('Todo item added successfully!');
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="alarms" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Alarms
          </TabsTrigger>
          <TabsTrigger value="todos" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Todo List
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme & Display
              </CardTitle>
              <CardDescription>
                Customize the look and feel of Campus Link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={settings.theme === 'light' ? 'default' : 'outline'}
                    className="flex items-center gap-2 h-auto p-4"
                    onClick={() => updateSettings({ theme: 'light' })}
                  >
                    <Sun className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">Light</div>
                      <div className="text-xs text-muted-foreground">Bright theme</div>
                    </div>
                  </Button>
                  <Button
                    variant={settings.theme === 'dark' ? 'default' : 'outline'}
                    className="flex items-center gap-2 h-auto p-4"
                    onClick={() => updateSettings({ theme: 'dark' })}
                  >
                    <Moon className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">Dark</div>
                      <div className="text-xs text-muted-foreground">Dark theme</div>
                    </div>
                  </Button>
                  <Button
                    variant={settings.theme === 'system' ? 'default' : 'outline'}
                    className="flex items-center gap-2 h-auto p-4"
                    onClick={() => updateSettings({ theme: 'system' })}
                  >
                    <Monitor className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">System</div>
                      <div className="text-xs text-muted-foreground">Auto theme</div>
                    </div>
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Font Size Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Font Size</Label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { value: 'small', label: 'Small', size: 'text-sm' },
                    { value: 'medium', label: 'Medium', size: 'text-base' },
                    { value: 'large', label: 'Large', size: 'text-lg' },
                    { value: 'extra-large', label: 'Extra Large', size: 'text-xl' }
                  ].map(({ value, label, size }) => (
                    <Button
                      key={value}
                      variant={settings.fontSize === value ? 'default' : 'outline'}
                      className="flex items-center gap-2 h-auto p-4"
                      onClick={() => updateSettings({ fontSize: value as any })}
                    >
                      <Type className="h-4 w-4" />
                      <div className="text-left">
                        <div className={`font-medium ${size}`}>{label}</div>
                        <div className="text-xs text-muted-foreground">Aa</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  Theme and font size changes will be applied immediately across the entire application.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive instant notifications in your browser
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {settings.soundEnabled ? <Volume2 className="h-5 w-5 text-muted-foreground" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
                  <div>
                    <Label className="font-medium">Sound Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sounds when notifications arrive
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important updates via email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSettings({ emailNotifications: checked })}
                />
              </div>

              <Alert>
                <AlertDescription>
                  Changes to notification settings will take effect immediately. Some notifications may require browser permissions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alarms */}
        <TabsContent value="alarms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlarmClock className="h-5 w-5" />
                Alarm Management
              </CardTitle>
              <CardDescription>
                Set up reminders for classes, events, and important deadlines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Alarm */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium">Add New Alarm</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="alarm-title">Title</Label>
                    <Input
                      id="alarm-title"
                      placeholder="e.g., Mathematics Class"
                      value={newAlarm.title}
                      onChange={(e) => setNewAlarm({ ...newAlarm, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alarm-time">Time</Label>
                    <Input
                      id="alarm-time"
                      type="time"
                      value={newAlarm.time}
                      onChange={(e) => setNewAlarm({ ...newAlarm, time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alarm-repeat">Repeat</Label>
                    <Select value={newAlarm.repeat} onValueChange={(value: any) => setNewAlarm({ ...newAlarm, repeat: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select repeat option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Never</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekdays">Weekdays</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddAlarm} className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Alarm
                </Button>
              </div>

              {/* Alarm List */}
              <div className="space-y-3">
                <h3 className="font-medium">Your Alarms ({settings.alarms.length})</h3>
                {settings.alarms.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No alarms set yet. Add your first alarm above!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {settings.alarms.map((alarm) => (
                      <div key={alarm.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={alarm.isEnabled}
                            onCheckedChange={() => toggleAlarm(alarm.id)}
                          />
                          <div>
                            <div className="font-medium">{alarm.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatTime(alarm.time)} • {alarm.repeat === 'none' ? 'Once' : alarm.repeat}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAlarm(alarm.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Todo List */}
        <TabsContent value="todos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Todo List Management
              </CardTitle>
              <CardDescription>
                Keep track of your tasks, assignments, and goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Todo */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium">Add New Todo</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="todo-text">Task</Label>
                    <Textarea
                      id="todo-text"
                      placeholder="e.g., Complete physics assignment"
                      value={newTodo.text}
                      onChange={(e) => setNewTodo({ ...newTodo, text: e.target.value })}
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="todo-priority">Priority</Label>
                      <Select value={newTodo.priority} onValueChange={(value: any) => setNewTodo({ ...newTodo, priority: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="todo-date">Due Date</Label>
                      <Input
                        id="todo-date"
                        type="date"
                        value={newTodo.dueDate}
                        onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={handleAddTodo} className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Todo
                </Button>
              </div>

              {/* Todo List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Your Tasks ({settings.todos.length})</h3>
                  <Badge variant="outline">
                    {settings.todos.filter(t => !t.completed).length} pending
                  </Badge>
                </div>
                {settings.todos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No tasks yet. Add your first todo item above!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {settings.todos
                      .sort((a, b) => {
                        if (a.completed !== b.completed) return a.completed ? 1 : -1;
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                      })
                      .map((todo) => (
                        <div key={todo.id} className={`flex items-start justify-between p-3 border rounded-lg ${todo.completed ? 'opacity-60' : ''}`}>
                          <div className="flex items-start space-x-3">
                            <Switch
                              checked={todo.completed}
                              onCheckedChange={() => toggleTodo(todo.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className={`font-medium ${todo.completed ? 'line-through' : ''}`}>
                                {todo.text}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={getPriorityColor(todo.priority)}>
                                  {todo.priority}
                                </Badge>
                                {todo.dueDate && (
                                  <Badge variant="outline" className="text-xs">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(todo.dueDate).toLocaleDateString()}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTodo(todo.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Configuration */}
        <TabsContent value="api" className="space-y-6">
          <APIConfiguration />
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          {/* Environment Status */}
          <EnvironmentStatus />
          
          {/* Supabase Connection Test */}
          <SupabaseConnectionTest />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Advanced Settings
              </CardTitle>
              <CardDescription>
                Additional settings and data management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Data Export</div>
                    <div className="text-sm text-muted-foreground">
                      Download your settings, alarms, and todos as JSON
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const dataStr = JSON.stringify(settings, null, 2);
                      const dataBlob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `campus-link-settings-${new Date().toISOString().split('T')[0]}.json`;
                      link.click();
                      URL.revokeObjectURL(url);
                      toast.success('Settings exported successfully!');
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Reset Settings</div>
                    <div className="text-sm text-muted-foreground">
                      Reset all settings to default values
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      if (confirm('Are you sure you want to reset all settings? This action cannot be undone.')) {
                        updateSettings({
                          theme: 'light',
                          fontSize: 'medium',
                          notificationsEnabled: true,
                          soundEnabled: true,
                          emailNotifications: true,
                          alarms: [],
                          todos: []
                        });
                        toast.success('Settings reset to defaults!');
                      }
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset All
                  </Button>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  Advanced settings changes are saved automatically. Exported data can be imported by manually editing your browser's local storage.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}