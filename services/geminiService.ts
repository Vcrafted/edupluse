
import { GoogleGenAI } from "@google/genai";
import { StudentResult } from "../types";

export const getAIInsights = async (students: StudentResult[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const studentSummary = students.map(s => 
    `${s.name}: Marks ${s.marks}, Attendance ${s.attendance}%, Study ${s.studyHours}h/day, Status: ${s.status}`
  ).join('\n');

  const prompt = `
    You are an expert academic counselor. Analyze the following student performance data and provide a professional, concise summary of the group's strengths, weaknesses, and 3-5 specific actionable recommendations for improvement.
    
    Data:
    ${studentSummary}
    
    Format the response in Markdown with clear sections. Keep it encouraging but realistic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI insights currently unavailable. Please try again later.";
  }
};
