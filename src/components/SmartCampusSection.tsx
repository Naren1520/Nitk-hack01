import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Brain, MapPin, Focus, MessageCircle, Navigation, Clock, Zap, Phone } from 'lucide-react';
import AIStudyAssistant from './AIStudyAssistant';

export default function SmartCampusSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">💡 Smart Campus Tools</h2>
        <p className="text-muted-foreground">AI-powered features to enhance your campus experience</p>
      </div>

      <Tabs defaultValue="ai-assistant" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
          <TabsTrigger value="ar-navigation">AR Navigation</TabsTrigger>
          <TabsTrigger value="study-mode">Study Mode</TabsTrigger>
        </TabsList>

        {/* AI Assistant */}
        <TabsContent value="ai-assistant" className="space-y-6">
          <AIStudyAssistant />
        </TabsContent>

        {/* AR Navigation */}
        <TabsContent value="ar-navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                AR Campus Navigation
              </CardTitle>
              <CardDescription>Never get lost again - point your phone for real-time directions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 h-80 flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Navigation className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                      <p className="font-medium">AR Camera View</p>
                      <p className="text-sm text-muted-foreground mt-2">Point your camera to see directions overlay</p>
                      <Button className="mt-4">Launch AR Mode</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm">Library</Button>
                    <Button variant="outline" size="sm">Cafeteria</Button>
                    <Button variant="outline" size="sm">CS Dept</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Popular Destinations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { name: 'Main Library', distance: '2 min walk', building: 'Building A' },
                          { name: 'Computer Lab', distance: '5 min walk', building: 'Building C' },
                          { name: 'Student Cafeteria', distance: '3 min walk', building: 'Building B' },
                          { name: 'Auditorium', distance: '7 min walk', building: 'Building D' },
                          { name: 'Sports Complex', distance: '10 min walk', building: 'Building E' },
                        ].map((dest, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{dest.name}</p>
                              <p className="text-xs text-muted-foreground">{dest.building} • {dest.distance}</p>
                            </div>
                            <Button size="sm" variant="outline">
                              <Navigation className="h-4 w-4 mr-1" />
                              Navigate
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Navigation Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Voice Directions</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Accessibility Mode</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Save Favorite Locations</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Share Location</span>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Mode */}
        <TabsContent value="study-mode" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Focus className="h-5 w-5" />
                Study Mode - Focus Like Never Before
              </CardTitle>
              <CardDescription>Block distractions and optimize your study environment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Focus Timer</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="mb-6">
                        <div className="text-6xl font-bold text-blue-600 mb-2">25:00</div>
                        <p className="text-muted-foreground">Pomodoro Session</p>
                      </div>
                      <div className="flex justify-center gap-2 mb-6">
                        <Button className="bg-green-600 hover:bg-green-700">Start Focus</Button>
                        <Button variant="outline">Pause</Button>
                        <Button variant="outline">Reset</Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Session 2 of 4 • Break in 25 minutes</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg">Study Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xl font-bold text-blue-600">4.5h</div>
                          <div className="text-sm text-blue-800">Today</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-xl font-bold text-green-600">28h</div>
                          <div className="text-sm text-green-800">This Week</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-xl font-bold text-purple-600">95%</div>
                          <div className="text-sm text-purple-800">Focus Rate</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-xl font-bold text-orange-600">12</div>
                          <div className="text-sm text-orange-800">Streak</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Distraction Blocking</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Block Social Media</p>
                            <p className="text-xs text-muted-foreground">Facebook, Twitter, Instagram</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Block Gaming Sites</p>
                            <p className="text-xs text-muted-foreground">Steam, gaming forums</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Block Entertainment</p>
                            <p className="text-xs text-muted-foreground">YouTube, Netflix, streaming</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Silent Notifications</p>
                            <p className="text-xs text-muted-foreground">Except emergency contacts</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Study Environment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium block mb-2">Background Sounds</label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm">🌧️ Rain</Button>
                            <Button variant="outline" size="sm">☕ Cafe</Button>
                            <Button variant="outline" size="sm">🔥 Fireplace</Button>
                            <Button variant="outline" size="sm">🌊 Ocean</Button>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-2">Study Goal</label>
                          <Input placeholder="e.g., Complete Chapter 5 exercises" />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-2">Break Reminder</label>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">15 min</Button>
                            <Button variant="default" size="sm">25 min</Button>
                            <Button variant="outline" size="sm">45 min</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}