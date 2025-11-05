
import { GoogleGenAI } from "@google/genai";
import { ApiResponse } from '../types';

// Fix: Aligned with @google/genai guidelines for API key initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function analyzeApiResponse(response: ApiResponse): Promise<string> {
  const prompt = `
    You are a world-class senior backend engineer and API expert. 
    Analyze the following API response and provide a concise, actionable summary in Markdown format.

    Focus on these areas:
    1.  **Summary**: Briefly describe what the response represents.
    2.  **Status Code**: Is the status code appropriate for the request? Mention any potential issues (e.g., using 200 for a creation that should be 201).
    3.  **Headers**: Check for important security headers (like Content-Security-Policy, X-Content-Type-Options), caching headers, and correct Content-Type.
    4.  **Body Structure**: Analyze the JSON body for clarity, efficiency, and consistency. Are field names clear? Is the structure overly nested? Is there redundant data?
    5.  **Suggestions for Improvement**: Provide specific, actionable advice to improve the API response.

    Here is the API response data:
    ---
    **Status:** ${response.status} ${response.statusText}

    **Headers:**
    \`\`\`json
    ${JSON.stringify(response.headers, null, 2)}
    \`\`\`

    **Body:**
    \`\`\`json
    ${JSON.stringify(response.body, null, 2)}
    \`\`\`
    ---
  `;

  try {
    const genAIResponse = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    return genAIResponse.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
}
