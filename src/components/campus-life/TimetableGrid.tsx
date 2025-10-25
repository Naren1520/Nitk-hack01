import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface ClassInfo {
  subject: string;
  room: string;
  type: string;
}

interface TimetableRow {
  time: string;
  monday: ClassInfo;
  tuesday: ClassInfo;
  wednesday: ClassInfo;
  thursday: ClassInfo;
  friday: ClassInfo;
}

interface TimetableGridProps {
  timetable: TimetableRow[];
}

export default function TimetableGrid({ timetable }: TimetableGridProps) {
  const getSubjectTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lab': return 'bg-green-100 text-green-800 border-green-200';
      case 'project': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'free': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <Badge variant="outline">Spring 2024</Badge>
          <Badge variant="default">Computer Science - Year 3</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Print Schedule</Button>
          <Button size="sm">Export to Calendar</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-3 text-left font-medium">Time</th>
              <th className="border p-3 text-center font-medium">Monday</th>
              <th className="border p-3 text-center font-medium">Tuesday</th>
              <th className="border p-3 text-center font-medium">Wednesday</th>
              <th className="border p-3 text-center font-medium">Thursday</th>
              <th className="border p-3 text-center font-medium">Friday</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border p-3 font-medium text-sm">{row.time}</td>
                {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const).map((day) => {
                  const classInfo = row[day];
                  return (
                    <td key={day} className="border p-2 text-center">
                      {classInfo.subject !== 'Free Period' ? (
                        <div className={`p-2 rounded border ${getSubjectTypeColor(classInfo.type)}`}>
                          <div className="font-medium text-xs">{classInfo.subject}</div>
                          <div className="text-xs opacity-75">{classInfo.room}</div>
                        </div>
                      ) : (
                        <div className="p-2 text-xs text-gray-500">Free Period</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Data Structures</p>
                  <p className="text-xs text-muted-foreground">9:00 AM - 10:00 AM • CS-101</p>
                </div>
                <Badge variant="outline">Now</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">DS Lab</p>
                  <p className="text-xs text-muted-foreground">10:00 AM - 11:00 AM • Lab-A</p>
                </div>
                <Badge variant="outline">Next</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Mathematics</p>
                  <p className="text-xs text-muted-foreground">11:00 AM - 12:00 PM • Math-101</p>
                </div>
                <Badge variant="secondary">Upcoming</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">18</div>
                <div className="text-sm text-blue-800">Classes/Week</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">8</div>
                <div className="text-sm text-green-800">Lab Sessions</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">5</div>
                <div className="text-sm text-purple-800">Free Periods</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-xl font-bold text-orange-600">94%</div>
                <div className="text-sm text-orange-800">Attendance</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}