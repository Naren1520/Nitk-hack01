import { useState } from 'react';
import { AIService } from '../lib/services/openai';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export default function APITest() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testAPI = async () => {
    setIsLoading(true);
    try {
      const response = await AIService.chat('Hello! This is a test message.');
      setResult(response);
    } catch (error) {
      console.error('API Test Error:', error);
      setResult('Error: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <Button 
          onClick={testAPI}
          disabled={isLoading}
        >
          {isLoading ? 'Testing...' : 'Test OpenAI Connection'}
        </Button>
        {result && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}