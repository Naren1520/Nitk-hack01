import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Clock, MapPin } from 'lucide-react';
import { events } from '../../lib/api';
import { MONTHLY_HIGHLIGHTS, CLUB_EVENTS } from '../data/campusLifeData';

interface Event {
  id: string;
  title: string;
  description: string;
  eventType: string;
  location: string;
  startTime: string;
  endTime: string;
  isPublic: boolean;
  organizer: {
    firstName: string;
    lastName: string;
  };
}

export default function EventsList() {
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await events.getAll();
        setEventsList(data);
        setError(null);
      } catch (err) {
        setError('Failed to load events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h4 className="font-medium mb-4">Upcoming Events</h4>
        <div className="space-y-4">
          {eventsList.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <Badge 
                    variant="outline"
                    className={
                      event.eventType === 'career' ? 'border-blue-200 text-blue-700' :
                      event.eventType === 'cultural' ? 'border-purple-200 text-purple-700' :
                      'border-green-200 text-green-700'
                    }
                  >
                    {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(event.startTime)}
                  </span>
                </div>
                <h5 className="font-semibold mb-2">{event.title}</h5>
                <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatTime(event.startTime)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </span>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Organized by: {event.organizer.firstName} {event.organizer.lastName}
                  </span>
                  <Button size="sm" variant="outline">
                    Add to Calendar
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