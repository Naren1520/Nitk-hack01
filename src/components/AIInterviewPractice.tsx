import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AIService } from '../lib/services/openai';
import { Mic, MicOff, Play, Square, MessageCircle, Bot, Brain } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIInterviewPractice() {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if (window.webkitSpeechRecognition) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      setIsRecording(true);
      setTranscript('');
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && recognitionRef.current) {
      mediaRecorderRef.current.stop();
      recognitionRef.current.stop();
      setIsRecording(false);

      // Process the transcript with AI
      if (transcript.trim()) {
        setIsProcessing(true);
        try {
          const response = await AIService.conductInterview(transcript);
          setMessages(prev => [
            ...prev,
            { role: 'user', content: transcript },
            { role: 'assistant', content: response }
          ]);
        } catch (error) {
          console.error('Error processing interview:', error);
        }
        setIsProcessing(false);
        setTranscript('');
      }
    }
  };

  // Text-to-speech for AI responses
  const speakResponse = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Interview Practice with Voice
        </CardTitle>
        <CardDescription>
          Practice interviews with AI using natural voice conversation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recording Interface */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Voice Interview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 text-center">
                    {isRecording ? (
                      <div className="animate-pulse">
                        <Mic className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <p className="font-medium">Recording...</p>
                      </div>
                    ) : (
                      <Mic className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    )}
                    
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        {transcript || 'Your response will appear here...'}
                      </div>
                      
                      <div className="flex justify-center gap-2">
                        {!isRecording ? (
                          <Button onClick={startRecording}>
                            <Play className="h-4 w-4 mr-2" />
                            Start Interview
                          </Button>
                        ) : (
                          <Button onClick={stopRecording} variant="destructive">
                            <Square className="h-4 w-4 mr-2" />
                            Stop Recording
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Interview Tips</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Speak clearly and at a natural pace</p>
                    <p>• Take brief pauses between responses</p>
                    <p>• Elaborate on your answers with examples</p>
                    <p>• Use professional language</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversation Display */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interview Conversation</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'assistant' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`rounded-lg p-3 max-w-[80%] ${
                          message.role === 'assistant'
                            ? 'bg-muted'
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.role === 'assistant' ? (
                            <Bot className="h-4 w-4" />
                          ) : (
                            <MessageCircle className="h-4 w-4" />
                          )}
                          <span className="text-xs font-medium">
                            {message.role === 'assistant' ? 'Interviewer' : 'You'}
                          </span>
                          {message.role === 'assistant' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 ml-auto"
                              onClick={() => speakResponse(message.content)}
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="animate-pulse flex items-center gap-2">
                          <Bot className="h-4 w-4" />
                          <span className="text-xs">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}