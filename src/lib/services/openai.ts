import OpenAI from 'openai';

// Initialize OpenAI client - replace with your API key
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, make API calls from backend
});

export interface StudyPlan {
  subject: string;
  timeSlots: { day: string; time: string; topic: string }[];
  estimatedHours: number;
}

export interface AIExam {
  questions: {
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation?: string;
  }[];
  totalMarks: number;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const AIService = {
  // Generate study plan based on subjects and available days
  async generateStudyPlan(subjects: string[], availableDays: string[]): Promise<StudyPlan[]> {
    const prompt = `Create a detailed study plan for the following subjects: ${subjects.join(", ")}
    Available days: ${availableDays.join(", ")}
    Format the response as a JSON array of study plans, one per subject.
    Include specific topics, time slots, and estimated hours.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content || '[]');
  },

  // Generate exam based on uploaded content and difficulty
  async generateExam(content: string, difficulty: 'easy' | 'medium' | 'hard'): Promise<AIExam> {
    const prompt = `Based on this content: "${content}"
    Create a ${difficulty} level exam with a mix of questions.
    Include multiple choice and descriptive questions.
    Format as JSON with questions array, totalMarks, duration, and difficulty.
    Add explanations for correct answers.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  },

  // Analyze learning progress
  async analyzeLearning(studyHistory: any): Promise<any> {
    const prompt = `Analyze this study history: ${JSON.stringify(studyHistory)}
    Provide insights on:
    1. Strong and weak areas
    2. Progress trends
    3. Recommendations for improvement
    Format response as JSON with insights and recommendations.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  },

  // AI Interview with voice
  async conductInterview(transcript: string): Promise<string> {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are a professional interviewer. Provide relevant follow-up questions and feedback based on the candidate's responses."
        },
        { role: "user", content: transcript }
      ],
      temperature: 0.8,
    });

    return response.choices[0].message.content || '';
  },

  // Chat with AI assistant
  async chat(message: string, context: string = ''): Promise<string> {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: `You are a helpful academic assistant. ${context}`
        },
        { role: "user", content: message }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || '';
  }
};