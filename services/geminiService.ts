import { GoogleGenAI, Type } from "@google/genai";
import { Exam, StudySession } from "../types";

// Helper to generate a unique ID (simple version)
const generateId = () => Math.random().toString(36).substr(2, 9);

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMotivationalQuote = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Give me a short, punchy, non-cringe motivational quote for a university student who is stressed about exams. Keep it under 20 words.",
    });
    return response.text.replace(/"/g, '').trim();
  } catch (error) {
    console.error("Gemini Motivation Error:", error);
    return "You've got this. One step at a time.";
  }
};

export const generateStudyPlan = async (exam: Exam, startDate: Date): Promise<StudySession[]> => {
  try {
    const daysUntil = Math.ceil((new Date(exam.date).getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    
    if (daysUntil <= 0) return [];

    const prompt = `
      I have a ${exam.difficulty} difficulty exam on ${exam.subject} in ${daysUntil} days (Date: ${exam.date}).
      Generate a study plan. 
      Create a list of specific study sessions. 
      Each session should have a topic and a duration in minutes (between 30 and 120).
      Do not schedule sessions on the day of the exam.
      Balance the load.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING, description: "Focus topic for the session" },
              daysFromNow: { type: Type.INTEGER, description: "Number of days from today (0 is today, 1 is tomorrow)" },
              durationMinutes: { type: Type.INTEGER, description: "Duration in minutes" }
            },
            required: ["topic", "daysFromNow", "durationMinutes"]
          }
        }
      }
    });

    const generatedSessions = JSON.parse(response.text);

    return generatedSessions.map((s: any) => {
      const sessionDate = new Date(startDate);
      sessionDate.setDate(startDate.getDate() + s.daysFromNow);
      
      return {
        id: generateId(),
        examId: exam.id,
        topic: s.topic,
        date: sessionDate.toISOString().split('T')[0],
        durationMinutes: s.durationMinutes,
        completed: false
      };
    });

  } catch (error) {
    console.error("Gemini Study Plan Error:", error);
    return [];
  }
};

export const suggestPriority = async (tasks: string[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `I have these tasks: ${tasks.join(', ')}. Which one should I do first for maximum impact? Reply with just the task name.`,
    });
    return response.text.trim();
  } catch (e) {
    return "";
  }
};