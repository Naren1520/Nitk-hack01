import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Trophy, Search, MapPin, Calendar, Star, Award, Target, Users } from 'lucide-react';

export default function CommunitySection() {
  const achievements = [
    {
      name: 'Sarah Chen',
      achievement: 'First Place in National Coding Championship',
      category: 'Academic',
      date: '2024-03-05',
      department: 'Computer Science',
      description: 'Secured 1st position among 500+ participants nationwide in the annual coding competition.',
      image: 'SC'
    },
    {
      name: 'Michael Rodriguez',
      achievement: 'Published Research Paper in IEEE Journal',
      category: 'Research',
      date: '2024-02-28',
      department: 'Electrical Engineering',
      description: 'Co-authored research on renewable energy systems published in prestigious IEEE journal.',
      image: 'MR'
    },
    {
      name: 'Priya Patel',
      achievement: 'Student of the Year Award 2024',
      category: 'Overall Excellence',
      date: '2024-02-15',
      department: 'Business Administration',
      description: 'Recognition for outstanding academic performance and leadership in student activities.',
      image: 'PP'
    },
  ];

  const lostItems = [
    {
      id: 'LF-001',
      type: 'lost',
      item: 'Black iPhone 13',
      description: 'Lost near the library on March 8th. Has a blue protective case with a crack on the corner.',
      location: 'Central Library',
      date: '2024-03-08',
      contact: 'john.doe@college.edu',
      status: 'active'
    },
    {
      id: 'LF-002',
      type: 'found',
      item: 'Red Backpack',
      description: 'Found in Computer Lab B. Contains textbooks and a calculator. Owner can contact to claim.',
      location: 'Computer Lab B',
      date: '2024-03-07',
      contact: 'security@college.edu',
      status: 'claimed'
    },
    {
      id: 'LF-003',
      type: 'lost',
      item: 'Silver MacBook Pro',
      description: 'Left in Lecture Hall 3 during Database Systems class. Has stickers from various tech companies.',
      location: 'Lecture Hall 3',
      date: '2024-03-06',
      contact: 'alice.smith@college.edu',
      status: 'active'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">🏆 Recognition & Community</h2>
        <p className="text-muted-foreground">Celebrate achievements and connect with the campus community</p>
      </div>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">Achievement Showcase</TabsTrigger>
          <TabsTrigger value="lost-found">Lost & Found</TabsTrigger>
        </TabsList>

        {/* Achievement Showcase */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievement Showcase
              </CardTitle>
              <CardDescription>Celebrate success - see student and faculty achievements that inspire</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-medium">Recent Achievements</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Filter by Category</Button>
                      <Button size="sm">Submit Achievement</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {achievements.map((achievement, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {achievement.image}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold">{achievement.name}</h5>
                                <Badge 
                                  variant="outline"
                                  className={
                                    achievement.category === 'Academic' ? 'border-blue-200 text-blue-700' :
                                    achievement.category === 'Research' ? 'border-green-200 text-green-700' :
                                    'border-purple-200 text-purple-700'
                                  }
                                >
                                  {achievement.category}
                                </Badge>
                              </div>
                              <h6 className="font-medium text-lg mb-2">{achievement.achievement}</h6>
                              <p className="text-muted-foreground text-sm mb-3">{achievement.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {achievement.department}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {achievement.date}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost">
                                    <Star className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline">View Details</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="text-center mt-6">
                    <Button variant="outline">Load More Achievements</Button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Achievement Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Award className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium">Academic Excellence</span>
                          </div>
                          <Badge variant="outline">142</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Target className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium">Research & Innovation</span>
                          </div>
                          <Badge variant="outline">67</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-medium">Leadership & Service</span>
                          </div>
                          <Badge variant="outline">89</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Trophy className="h-5 w-5 text-orange-600" />
                            <span className="text-sm font-medium">Sports & Athletics</span>
                          </div>
                          <Badge variant="outline">53</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Hall of Fame</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                          <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                          <p className="font-medium text-sm">Top Achiever 2024</p>
                          <p className="text-xs text-muted-foreground">Dr. Emily Watson</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                              1
                            </div>
                            <div>
                              <p className="text-sm font-medium">Sarah Chen</p>
                              <p className="text-xs text-muted-foreground">15 achievements</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                              2
                            </div>
                            <div>
                              <p className="text-sm font-medium">Michael Rodriguez</p>
                              <p className="text-xs text-muted-foreground">12 achievements</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                            <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                              3
                            </div>
                            <div>
                              <p className="text-sm font-medium">Priya Patel</p>
                              <p className="text-xs text-muted-foreground">11 achievements</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Submit Achievement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Input placeholder="Achievement title..." />
                        <Textarea placeholder="Describe your achievement..." rows={3} />
                        <Button className="w-full">Submit for Review</Button>
                        <p className="text-xs text-muted-foreground text-center">
                          Achievements are verified before publication
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lost & Found */}
        <TabsContent value="lost-found" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Lost & Found Portal
              </CardTitle>
              <CardDescription>Because things happen - report lost items or claim found ones easily</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-2">
                      <Input placeholder="Search lost/found items..." className="w-64" />
                      <Button variant="outline">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Report Lost Item</Button>
                      <Button size="sm">Report Found Item</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {lostItems.map((item, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant={item.type === 'lost' ? 'destructive' : 'default'}
                                className={item.type === 'found' ? 'bg-green-600' : ''}
                              >
                                {item.type === 'lost' ? 'Lost' : 'Found'}
                              </Badge>
                              {item.status === 'claimed' && (
                                <Badge variant="outline" className="text-green-700 border-green-200">
                                  Claimed
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">{item.date}</span>
                          </div>
                          
                          <h5 className="font-semibold mb-2">{item.item}</h5>
                          <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {item.location}
                              </span>
                              <span>ID: {item.id}</span>
                            </div>
                            {item.status === 'active' && (
                              <Button size="sm" variant="outline">
                                {item.type === 'lost' ? 'I Found This' : 'This is Mine'}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="text-center mt-6">
                    <Button variant="outline">Load More Items</Button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium block mb-2">Item Type</label>
                          <div className="flex gap-2 mb-3">
                            <Button variant="outline" size="sm" className="flex-1">Lost Item</Button>
                            <Button variant="outline" size="sm" className="flex-1">Found Item</Button>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-2">Item Name</label>
                          <Input placeholder="e.g., iPhone, Backpack, Keys" />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-2">Location</label>
                          <select className="w-full p-2 border rounded-lg text-sm">
                            <option>Select Location</option>
                            <option>Central Library</option>
                            <option>Computer Lab A</option>
                            <option>Computer Lab B</option>
                            <option>Cafeteria</option>
                            <option>Lecture Hall 1</option>
                            <option>Lecture Hall 2</option>
                            <option>Lecture Hall 3</option>
                            <option>Sports Complex</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-2">Description</label>
                          <Textarea placeholder="Detailed description..." rows={4} />
                        </div>
                        <Button className="w-full">Submit Report</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-xl font-bold text-red-600">23</div>
                          <div className="text-sm text-red-800">Lost Items</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-xl font-bold text-green-600">18</div>
                          <div className="text-sm text-green-800">Found Items</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xl font-bold text-blue-600">31</div>
                          <div className="text-sm text-blue-800">Reunited</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-xl font-bold text-purple-600">78%</div>
                          <div className="text-sm text-purple-800">Success Rate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tips & Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h6 className="font-medium mb-1">📝 Be Descriptive</h6>
                          <p className="text-muted-foreground text-xs">
                            Include specific details, colors, brands, and unique features
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h6 className="font-medium mb-1">📍 Exact Location</h6>
                          <p className="text-muted-foreground text-xs">
                            Mention the exact room, floor, or area where item was lost/found
                          </p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <h6 className="font-medium mb-1">⚡ Act Quickly</h6>
                          <p className="text-muted-foreground text-xs">
                            Report items as soon as possible for better chances of recovery
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          📞 Security Office: +1-555-0101
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          📧 security@college.edu
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          📍 Ground Floor, Admin Building
                        </Button>
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