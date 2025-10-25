import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Clock, MapPin } from 'lucide-react';
import { MONTHLY_HIGHLIGHTS, CLUB_EVENTS } from '../data/campusLifeData';

interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  description: string;
}

interface EventsListProps {
  events: Event[];
}

export default function EventsList({ events }: EventsListProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h4 className="font-medium mb-4">Upcoming Major Events</h4>
        <div className="space-y-4">
          {events.map((event, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <Badge 
                    variant="outline"
                    className={
                      event.type === 'career' ? 'border-blue-200 text-blue-700' :
                      event.type === 'cultural' ? 'border-purple-200 text-purple-700' :
                      'border-green-200 text-green-700'
                    }
                  >
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{event.date}</span>
                </div>
                <h5 className="font-semibold mb-2">{event.title}</h5>
                <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </span>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-3">
                  Add to My Calendar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">This Month's Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MONTHLY_HIGHLIGHTS.map((highlight, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className={`w-8 h-8 bg-${highlight.color}-500 rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                    {highlight.day}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{highlight.title}</p>
                    <p className="text-xs text-muted-foreground">{highlight.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Club & Society Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {CLUB_EVENTS.map((clubEvent, index) => (
                <div key={index} className={`border-l-4 border-${clubEvent.color}-400 pl-3`}>
                  <p className="font-medium text-sm">{clubEvent.name}</p>
                  <p className="text-xs text-muted-foreground">{clubEvent.date} • {clubEvent.details}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Academic Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                <p className="font-medium text-sm">Assignment Submission</p>
                <p className="text-xs text-muted-foreground">Database Systems Project - March 20</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <p className="font-medium text-sm">Mid-term Registration</p>
                <p className="text-xs text-muted-foreground">Last date: March 12</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <p className="font-medium text-sm">Internship Applications</p>
                <p className="text-xs text-muted-foreground">Summer 2024 - Due March 25</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}