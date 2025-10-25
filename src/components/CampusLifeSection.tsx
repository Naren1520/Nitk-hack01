import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, Clock, BookOpen, MapPin, Users, Star, Info, Phone } from 'lucide-react';
import { TIMETABLE_DATA, UPCOMING_EVENTS, FACILITIES_DATA } from './data/campusLifeData';
import TimetableGrid from './campus-life/TimetableGrid';
import EventsList from './campus-life/EventsList';
import FacilitiesGrid from './campus-life/FacilitiesGrid';

export default function CampusLifeSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">🗓 Campus Life Organizer</h2>
        <p className="text-muted-foreground">Manage your daily campus activities and stay organized</p>
      </div>

      <Tabs defaultValue="timetable" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timetable">Class Timetable</TabsTrigger>
          <TabsTrigger value="calendar">College Calendar</TabsTrigger>
          <TabsTrigger value="guide">Student Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="timetable" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Personal Class Timetable
              </CardTitle>
              <CardDescription>Plan your day effortlessly with updated schedules at your fingertips</CardDescription>
            </CardHeader>
            <CardContent>
              <TimetableGrid timetable={TIMETABLE_DATA} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                College Calendar - March 2024
              </CardTitle>
              <CardDescription>One month, one view - see upcoming events, workshops, and holidays</CardDescription>
            </CardHeader>
            <CardContent>
              <EventsList events={UPCOMING_EVENTS} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Student Resource Guide
              </CardTitle>
              <CardDescription>Know your campus - rules, facilities, and contacts all in one place</CardDescription>
            </CardHeader>
            <CardContent>
              <FacilitiesGrid facilities={FACILITIES_DATA} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}