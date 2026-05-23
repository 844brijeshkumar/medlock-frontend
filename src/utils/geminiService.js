import { GoogleGenAI } from "@google/genai";

export const generateHealthReport = async (hospitals) => {
  // Use process.env.API_KEY directly for initialization as per guidelines
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  const hospitalDataStr = hospitals
    .map(
      (h) =>
        `${h.name}: ${h.reports} reports, ${h.doctors} doctors, growth ${h.growth}`,
    )
    .join("\n");

  const prompt = `
    Act as a professional healthcare consultant. 
    Analyze the following hospital branch data and provide a concise, professional executive summary.
    Identify the best performing branch, areas for improvement, and a strategic recommendation for the network.
    
    Data:
    ${hospitalDataStr}
    
    Format the response as a clear markdown with sections.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    // Correctly accessing .text property on response
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI report. Please check your API configuration.";
  }
};
