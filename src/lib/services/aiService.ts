interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Safe environment variable access
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  if (typeof window !== 'undefined') {
    // Client-side: check if process exists and has env
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || defaultValue;
    }
    // Fallback: try to get from window if available
    return (window as any).__ENV__?.[key] || defaultValue;
  }
  
  // Server-side: safely access process.env
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  
  return defaultValue;
};

class AIService {
  private apiKey: string;
  private baseURL: string = 'https://api.openai.com/v1';

  constructor() {
    // Safely get API key with fallback
    this.apiKey = getEnvVar('REACT_APP_OPENAI_API_KEY', 'sk-proj-your-openai-api-key-here');
  }

  async generateExamQuestions(
    content: string, 
    questionCount: number, 
    difficulty: 'easy' | 'medium' | 'hard',
    subjects: string[] = []
  ): Promise<any[]> {
    const prompt = this.buildExamPrompt(content, questionCount, difficulty, subjects);
    
    try {
      const response = await this.callOpenAI([
        {
          role: 'system',
          content: 'You are an expert educator and exam creator. Generate high-quality, diverse exam questions based on the provided content.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      return this.parseExamQuestions(response.content);
    } catch (error) {
      console.error('AI service error:', error);
      return this.generateFallbackQuestions(content, questionCount, difficulty);
    }
  }

  async generateStudyPlan(
    studentLevel: string,
    subjects: string[],
    timeAvailable: number,
    goals: string[]
  ): Promise<any> {
    const prompt = `Create a personalized study plan for a ${studentLevel} student.
    Subjects: ${subjects.join(', ')}
    Time available per week: ${timeAvailable} hours
    Goals: ${goals.join(', ')}
    
    Please provide:
    1. Weekly schedule breakdown
    2. Priority subjects and topics
    3. Recommended study techniques
    4. Milestone checkpoints
    5. Resource suggestions`;

    try {
      const response = await this.callOpenAI([
        {
          role: 'system',
          content: 'You are an expert academic advisor. Create comprehensive, personalized study plans.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      return this.parseStudyPlan(response.content);
    } catch (error) {
      console.error('AI service error:', error);
      return this.generateFallbackStudyPlan(subjects, timeAvailable);
    }
  }

  async analyzePerformance(
    performanceData: any[],
    userProfile: any
  ): Promise<string> {
    const prompt = `Analyze the following student performance data and provide insights:
    
    Student Profile: ${JSON.stringify(userProfile, null, 2)}
    Performance Data: ${JSON.stringify(performanceData, null, 2)}
    
    Provide:
    1. Strengths and weaknesses
    2. Learning patterns
    3. Improvement recommendations
    4. Study strategy suggestions
    5. Goal setting advice`;

    try {
      const response = await this.callOpenAI([
        {
          role: 'system',
          content: 'You are an expert educational data analyst. Provide actionable insights based on student performance data.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      return response.content;
    } catch (error) {
      console.error('AI service error:', error);
      return 'Unable to generate AI analysis at this time. Please check your API configuration.';
    }
  }

  async answerStudentQuestion(
    question: string,
    context: string = '',
    subject: string = ''
  ): Promise<string> {
    const prompt = `Student Question: ${question}
    ${context ? `Context: ${context}` : ''}
    ${subject ? `Subject: ${subject}` : ''}
    
    Please provide a clear, educational answer that helps the student understand the concept.`;

    try {
      const response = await this.callOpenAI([
        {
          role: 'system',
          content: 'You are a knowledgeable tutor. Provide clear, educational explanations that help students learn.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      return response.content;
    } catch (error) {
      console.error('AI service error:', error);
      return 'I apologize, but I cannot provide an answer at this time. Please check your internet connection or try again later.';
    }
  }

  // Check if API is properly configured
  isConfigured(): boolean {
    return this.apiKey !== 'sk-proj-your-openai-api-key-here' && this.apiKey.length > 20;
  }

  // Get current API key status (without exposing the actual key)
  getApiKeyStatus(): { configured: boolean; keyPreview: string } {
    const configured = this.isConfigured();
    const keyPreview = configured 
      ? `${this.apiKey.substring(0, 7)}...${this.apiKey.substring(this.apiKey.length - 4)}`
      : 'Not configured';
    
    return { configured, keyPreview };
  }

  private async callOpenAI(messages: OpenAIMessage[]): Promise<AIResponse> {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured. Please set REACT_APP_OPENAI_API_KEY environment variable.');
    }

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API');
    }

    return {
      content: data.choices[0].message.content,
      usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
    };
  }

  private buildExamPrompt(
    content: string, 
    count: number, 
    difficulty: string,
    subjects: string[]
  ): string {
    return `Based on the following study material, generate ${count} exam questions at ${difficulty} difficulty level.
    ${subjects.length > 0 ? `Focus on subjects: ${subjects.join(', ')}` : ''}
    
    Study Material:
    ${content}
    
    Requirements:
    - Include a mix of multiple choice, short answer, and essay questions
    - Ensure questions test understanding, not just memorization
    - Provide correct answers for all questions
    - Questions should be appropriately challenging for ${difficulty} level
    
    Format the response as JSON with this structure:
    {
      "questions": [
        {
          "id": "q1",
          "type": "multiple_choice|short_answer|essay",
          "question": "Question text",
          "options": ["A", "B", "C", "D"] (for multiple choice only),
          "correctAnswer": "Answer or option index",
          "points": number,
          "explanation": "Brief explanation of the answer"
        }
      ]
    }`;
  }

  private parseExamQuestions(response: string): any[] {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.questions || [];
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }
    
    // Fallback to text parsing
    return this.parseQuestionsFromText(response);
  }

  private parseQuestionsFromText(text: string): any[] {
    // Simple text parsing as fallback
    const questions = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentQuestion: any = null;
    let questionCounter = 1;

    for (const line of lines) {
      if (line.match(/^\d+\.|^Question \d+/)) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          id: `q${questionCounter++}`,
          type: 'short_answer',
          question: line.replace(/^\d+\.\s*|^Question \d+:?\s*/i, ''),
          points: 5,
          correctAnswer: 'Sample answer based on course material',
          explanation: 'This question tests understanding of key concepts from the study material.'
        };
      }
    }
    
    if (currentQuestion) {
      questions.push(currentQuestion);
    }

    return questions.length > 0 ? questions : this.generateFallbackQuestions('', 5, 'medium');
  }

  private parseStudyPlan(response: string): any {
    return {
      title: 'AI-Generated Study Plan',
      content: response,
      created: new Date().toISOString(),
      sections: [
        'Weekly Schedule',
        'Priority Topics',
        'Study Techniques',
        'Milestones',
        'Resources'
      ]
    };
  }

  private generateFallbackQuestions(content: string, count: number, difficulty: string): any[] {
    const questions = [];
    const difficultyPoints = { easy: 2, medium: 5, hard: 10 };
    
    for (let i = 1; i <= count; i++) {
      questions.push({
        id: `q${i}`,
        type: i % 3 === 0 ? 'essay' : i % 2 === 0 ? 'short_answer' : 'multiple_choice',
        question: `Based on the study material, explain the concept discussed in section ${i}.`,
        options: i % 2 === 1 ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined,
        correctAnswer: i % 2 === 1 ? 0 : 'This would be answered based on the specific content provided.',
        points: difficultyPoints[difficulty as keyof typeof difficultyPoints] || 5,
        explanation: 'This question tests understanding of key concepts from the study material.'
      });
    }
    
    return questions;
  }

  private generateFallbackStudyPlan(subjects: string[], timeAvailable: number): any {
    return {
      title: 'Basic Study Plan',
      content: `Study Plan for ${subjects.join(', ')}\n\nWeekly Time: ${timeAvailable} hours\n\nRecommended schedule:\n- Distribute time evenly across subjects\n- Include regular review sessions\n- Take breaks every 90 minutes\n- Practice active recall techniques`,
      created: new Date().toISOString(),
      sections: ['Schedule', 'Subjects', 'Techniques', 'Goals']
    };
  }
}

export const aiService = new AIService();