import { MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function VideoCallRoom() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">🚫 Video Calling Removed</h2>
        <p className="text-muted-foreground">This feature has been temporarily removed for hosting optimization</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Alternative Communication Options
          </CardTitle>
          <CardDescription>Use these features to stay connected with your campus community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">📢 Communication Hub</h4>
              <p className="text-sm text-muted-foreground">
                Access announcements, submit complaints, and participate in help discussions
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium mb-2">📄 Document Collaboration</h4>
              <p className="text-sm text-muted-foreground">
                Work together on documents with real-time collaborative editing
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium mb-2">🔔 Notification Center</h4>
              <p className="text-sm text-muted-foreground">
                Stay updated with real-time notifications from faculty and administration
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}