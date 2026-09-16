import axios from "axios";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const outputSchema = z.object({
  feedback: z.string().describe("Feedback for the user"),
  score: z.number().describe("Score out of 10 for thier interview performance"),
});

const RESULT_PROMPT = `
Hii you are an expert evaluator for interviews. You have to evaluate the interview based on the conversation between the user and the AI interviewer. The conversation is provided in JSON format. You have to provide feedback for the user and a score out of 10 for their interview performance. The output should be in JSON format with two fields: feedback : string and score : number.
 
{{USER_TRANSCRIPT}}

`;

export const calculateResult = async (
  messages: { type: "Assistant" | "User"; message: string; createdAt: Date }[],
) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: RESULT_PROMPT.replace(`{{USER_TRANSCRIPT}}`, JSON.stringify(messages)),
    config: {
        responseFormat : {
            text : {
                mimeType : "application/json",
                schema : zodToJsonSchema(outputSchema),
            }
        }
    },
  });
  const result = outputSchema.parse(JSON.parse(response.text!));
  return result;
};
