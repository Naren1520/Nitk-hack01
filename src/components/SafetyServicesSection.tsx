import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, Wifi, Phone, MapPin, Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import EmergencyButton from './EmergencyButton';

export default function SafetyServicesSection() {
  const emergencyContacts = [
    { name: 'Campus Security', number: '+1-555-0101', type: 'security', available: '24/7' },
    { name: 'Medical Emergency', number: '+1-555-0102', type: 'medical', available: '24/7' },
    { name: 'Fire Department', number: '+1-555-0103', type: 'fire', available: '24/7' },
    { name: 'Student Counselor', number: '+1-555-0104', type: 'counseling', available: '9 AM - 6 PM' },
  ];

  const wifiRequests = [
    { id: 'WF-2024-001', device: 'MacBook Pro', status: 'approved', date: '2024-03-05' },
    { id: 'WF-2024-002', device: 'iPhone 13', status: 'pending', date: '2024-03-08' },
    { id: 'WF-2024-003', device: 'Dell Laptop', status: 'rejected', date: '2024-03-01', reason: 'Invalid device MAC address' },
  ];

  const handleEmergencyTriggered = () => {
    console.log('Emergency alert triggered - notifying security and emergency contacts');
    // Here you would implement actual emergency response logic
    // This could include:
    // - Sending SMS to emergency contacts
    // - Triggering campus security alert
    // - Logging the emergency in the system
    // - Sending location data to security
  };

  return (
    <div className="space-y-8">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">🔒 Safety & Services</h2>
        <p className="text-muted-foreground">Campus safety features and essential digital services</p>
      </div>

      <Tabs defaultValue="safety-click" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="safety-click">Safety Click</TabsTrigger>
          <TabsTrigger value="wifi-access">WiFi Access</TabsTrigger>
        </TabsList>

        {/* Safety Click */}
        <TabsContent value="safety-click" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Shield className="h-5 w-5" />
                Safety Click - Emergency Response System
              </CardTitle>
              <CardDescription>Instant help in emergencies - hold button for 3 seconds to connect with campus security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Emergency Protocol:</strong> Use the emergency button only for genuine emergencies. 
                      False alarms may result in penalties.
                    </AlertDescription>
                  </Alert>

                  <EmergencyButton onEmergencyTriggered={handleEmergencyTriggered} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Call Security
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Share Location
                    </Button>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Safety Features</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>Automatic location sharing</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>Multi-channel alert system</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>Emergency contact notification</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>Real-time response tracking</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Emergency Contacts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {emergencyContacts.map((contact, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                contact.type === 'security' ? 'bg-blue-100' :
                                contact.type === 'medical' ? 'bg-red-100' :
                                contact.type === 'fire' ? 'bg-orange-100' :
                                'bg-purple-100'
                              }`}>
                                {contact.type === 'security' && <Shield className="h-5 w-5 text-blue-600" />}
                                {contact.type === 'medical' && <Phone className="h-5 w-5 text-red-600" />}
                                {contact.type === 'fire' && <AlertTriangle className="h-5 w-5 text-orange-600" />}
                                {contact.type === 'counseling' && <Users className="h-5 w-5 text-purple-600" />}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm truncate">{contact.name}</p>
                                <p className="text-xs text-muted-foreground">{contact.available}</p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" className="ml-2 flex-shrink-0">
                              <Phone className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Call</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Safety Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-1">🚨 Medical Emergency</h5>
                          <p className="text-xs text-muted-foreground">
                            Call medical emergency number immediately. Provide location and nature of emergency.
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-1">🔥 Fire Emergency</h5>
                          <p className="text-xs text-muted-foreground">
                            Evacuate immediately via nearest exit. Do not use elevators. Report to assembly point.
                          </p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-1">🔒 Security Concerns</h5>
                          <p className="text-xs text-muted-foreground">
                            Report suspicious activities to campus security. Use emergency button if in immediate danger.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-xs p-2 bg-yellow-50 rounded border-l-2 border-yellow-400">
                          <p className="font-medium">Weather Advisory</p>
                          <p className="text-muted-foreground">Heavy rain expected. Avoid outdoor activities. - 2 hours ago</p>
                        </div>
                        <div className="text-xs p-2 bg-blue-50 rounded border-l-2 border-blue-400">
                          <p className="font-medium">Maintenance Notice</p>
                          <p className="text-muted-foreground">Elevator maintenance in Building A from 10 AM - 2 PM. - 1 day ago</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WiFi Access Request */}
        <TabsContent value="wifi-access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Wifi className="h-5 w-5" />
                WiFi Access Request
              </CardTitle>
              <CardDescription>Fast and paperless - apply for college network access online</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Request New Device Access</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium block mb-2">Device Type</label>
                        <select className="w-full p-2 border rounded-lg">
                          <option>Laptop</option>
                          <option>Smartphone</option>
                          <option>Tablet</option>
                          <option>Smart Watch</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-2">Device Name/Model</label>
                        <Input placeholder="e.g., MacBook Pro 13-inch" />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-2">MAC Address</label>
                        <Input placeholder="e.g., 00:1B:44:11:3A:B7" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Find MAC address in device network settings
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-2">Device Owner</label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button variant="outline" size="sm">Personal</Button>
                          <Button variant="outline" size="sm">Department</Button>
                          <Button variant="outline" size="sm">Guest</Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-2">Purpose/Justification</label>
                        <Textarea 
                          placeholder="Explain why you need network access for this device..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" id="terms" />
                          <label htmlFor="terms" className="text-sm text-muted-foreground">
                            I agree to abide by the college's network usage policy and understand that 
                            misuse may result in access termination.
                          </label>
                        </div>
                      </div>
                      <Button className="w-full">Submit WiFi Access Request</Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Network Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium">Student Network</p>
                        <p className="text-muted-foreground">Campus-Student-WiFi</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="font-medium">Faculty Network</p>
                        <p className="text-muted-foreground">Campus-Faculty-WiFi</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="font-medium">Guest Network</p>
                        <p className="text-muted-foreground">Campus-Guest-WiFi</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="font-medium">Lab Network</p>
                        <p className="text-muted-foreground">Campus-Lab-WiFi</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">My WiFi Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {wifiRequests.map((request, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Badge 
                                variant={
                                  request.status === 'approved' ? 'default' :
                                  request.status === 'pending' ? 'secondary' :
                                  'destructive'
                                }
                                className={
                                  request.status === 'approved' ? 'bg-green-600' : ''
                                }
                              >
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{request.date}</span>
                            </div>
                            <h5 className="font-medium text-sm mb-1">{request.device}</h5>
                            <p className="text-xs text-muted-foreground mb-2">Request ID: {request.id}</p>
                            {request.reason && (
                              <p className="text-xs text-red-600">Reason: {request.reason}</p>
                            )}
                            {request.status === 'approved' && (
                              <div className="mt-3 p-2 bg-green-50 rounded text-xs">
                                <p className="font-medium text-green-800">Network Credentials</p>
                                <p className="text-green-700">Password will be sent to your college email</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Network Usage Policy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div>
                          <h5 className="font-medium mb-1">Acceptable Use</h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>• Academic research and coursework</li>
                            <li>• Educational content access</li>
                            <li>• Official college communications</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-1">Prohibited Activities</h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>• Downloading copyrighted content</li>
                            <li>• Accessing inappropriate websites</li>
                            <li>• Network hacking or unauthorized access</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-1">Device Limits</h5>
                          <p className="text-muted-foreground text-xs">
                            Maximum 3 devices per student. Additional devices require special approval.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Need Help?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact IT Support: +1-555-0199
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Clock className="h-4 w-4 mr-2" />
                          Support Hours: 9 AM - 5 PM
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <MapPin className="h-4 w-4 mr-2" />
                          IT Office: Room 201, Admin Building
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