import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { AIService, StudyPlan } from '../lib/services/openai';
import { BookOpen, Clock, Target } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

export default function StudyPlanGenerator() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [selectedDays, setSelectedDays] = useState<Date[]>([]); // using length as days count
  const [isLoading, setIsLoading] = useState(false);
  const [studyPlan, setStudyPlan] = useState<StudyPlan[]>([]);

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const generatePlan = async () => {
    if (subjects.length === 0 || selectedDays.length === 0) return;

    setIsLoading(true);
    try {
      // Create Day 1, Day 2, ... labels based on number of days selected
      const days = Array.from({ length: selectedDays.length }).map((_, i) => `Day ${i + 1}`);
      const plan = await AIService.generateStudyPlan(subjects, days);
      setStudyPlan(plan);
    } catch (error) {
      console.error('Error generating study plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          AI Study Plan Generator
        </CardTitle>
        <CardDescription>
          Enter your subjects and the number of days you have reserved; the plan will be split into Day 1, Day 2, etc.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Subject Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a subject..."
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
                    />
                    <Button onClick={handleAddSubject}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {subject}
                        <button
                          className="ml-2 hover:text-destructive"
                          onClick={() => handleRemoveSubject(index)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {/* Days selector icon */}
                  <Clock className="h-4 w-4" />
                  Number of Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    value={selectedDays.length}
                    onChange={(e) => {
                      const v = parseInt(e.target.value || '0');
                      if (v <= 0) return;
                      // Resize placeholder selectedDays array to represent number count
                      const newDays: Date[] = Array.from({ length: v }).map((_, i) => new Date());
                      setSelectedDays(newDays);
                    }}
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">days</span>
                </div>

                <Button 
                  className="w-full mt-4" 
                  onClick={generatePlan}
                  disabled={subjects.length === 0 || selectedDays.length === 0 || isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate Study Plan'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Generated Study Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Study Plan</CardTitle>
              {studyPlan.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Total subjects: {studyPlan.length} • Days: {selectedDays.length}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {studyPlan.length === 0 ? (
                <div className="text-center text-muted-foreground p-8">
                  Add subjects and select days to generate your study plan
                </div>
              ) : (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    {studyPlan.map((plan, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center justify-between">
                            {plan.subject}
                            <Badge variant="secondary">
                              <Clock className="h-4 w-4 mr-1" />
                              {plan.estimatedHours}h
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {plan.timeSlots.map((slot, i) => (
                              <div
                                key={i}
                                className="flex items-start justify-between p-3 border rounded-lg"
                              >
                                <div>
                                  <div className="font-medium text-sm">
                                    {slot.topic}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {slot.day} • {slot.time}
                                  </div>
                                </div>
                                <Target className="h-4 w-4 text-muted-foreground" />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}