import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MapPin, Phone, Clock, Users, Info, Star } from 'lucide-react';

interface Facility {
  name: string;
  description: string;
  location: string;
  contact: string;
  hours: string;
}

interface FacilitiesGridProps {
  facilities: Facility[];
}

export default function FacilitiesGrid({ facilities }: FacilitiesGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h4 className="font-medium mb-4">Campus Facilities</h4>
        <div className="space-y-4">
          {facilities.map((facility, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <h5 className="font-semibold mb-2">{facility.name}</h5>
                <p className="text-sm text-muted-foreground mb-3">{facility.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{facility.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{facility.contact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{facility.hours}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1">View Details</Button>
                  <Button size="sm" variant="ghost">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5" />
              Campus Rules & Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h6 className="font-medium text-sm mb-1">📚 Academic Guidelines</h6>
                <p className="text-xs text-muted-foreground">
                  Maintain 75% attendance. Submit assignments on time. Follow academic integrity policies.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h6 className="font-medium text-sm mb-1">🏛️ Campus Conduct</h6>
                <p className="text-xs text-muted-foreground">
                  Respect college property. No smoking/alcohol on campus. Maintain decorum in all areas.
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h6 className="font-medium text-sm mb-1">🔐 Security Policies</h6>
                <p className="text-xs text-muted-foreground">
                  Carry ID cards always. Visitors must register at security. Report suspicious activities.
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <h6 className="font-medium text-sm mb-1">🌐 IT Usage Policy</h6>
                <p className="text-xs text-muted-foreground">
                  Use college network responsibly. No unauthorized software installation. Respect bandwidth limits.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Campus Security</span>
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Medical Emergency</span>
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">IT Helpdesk</span>
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Administration</span>
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Campus Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-4">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Interactive Campus Map</p>
                <p className="text-xs">Click to explore campus locations</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">View Full Map</Button>
              <Button size="sm" variant="outline" className="flex-1">Get Directions</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start">
                <Users className="h-4 w-4 mr-2" />
                Student Handbook
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Office Hours
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Directory
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Info className="h-4 w-4 mr-2" />
                FAQ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}