'use server';
/**
 * @fileOverview This file implements the directSankhyaQueryFlow, allowing users to ask the Sankhya AI
 * direct questions and receive instant, AI-driven analysis and advice based on numerology, astrology,
 * and Vastu Shastra principles, incorporating real-time contextual data.
 *
 * - directSankhyaQuery - A function that handles direct queries to the Sankhya AI.
 * - DirectSankhyaQueryInput - The input type for the directSankhyaQuery function.
 * - DirectSankhyaQueryOutput - The return type for the directSankhyaQuery function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DirectSankhyaQueryInputSchema = z.object({
  query: z.string().describe('The user\u0027s direct question or scenario for Sankhya AI.'),
  userProfile: z.string().describe('Serialized user profile data, including birth details, for personalized analysis.'),
  currentLatLong: z.string().describe('The user\u0027s current GPS latitude and longitude (e.g., "34.0522,-118.2437").'),
  planetaryPositions: z.string().describe('Current astronomical data representing planetary positions relevant for astrological analysis.'),
  currentTimestamp: z.string().describe('The current timestamp at the time of the query.'),
});
export type DirectSankhyaQueryInput = z.infer<typeof DirectSankhyaQueryInputSchema>;

const DirectSankhyaQueryOutputSchema = z.string().describe('The AI-driven analysis and advice provided by Sankhya in response to the query.');
export type DirectSankhyaQueryOutput = z.infer<typeof DirectSankhyaQueryOutputSchema>;

export async function directSankhyaQuery(input: DirectSankhyaQueryInput): Promise<DirectSankhyaQueryOutput> {
  return directSankhyaQueryFlow(input);
}

const directSankhyaQueryPrompt = ai.definePrompt({
  name: 'directSankhyaQueryPrompt',
  input: { schema: DirectSankhyaQueryInputSchema },
  output: { schema: DirectSankhyaQueryOutputSchema },
  prompt: `You are Sankhya, a Gemini-powered reasoning engine pre-loaded with Pythagorean and Chaldean Numerology, Vedic Astrology (Jyotish), and Vastu Shastra principles. Your role is to provide instant, AI-driven analysis and advice. Adhere to "The World of Texts" prompting framework.

Contextual Data:
User Profile: {{{userProfile}}}
Current Location (Lat/Long): {{{currentLatLong}}}
Current Planetary Positions: {{{planetaryPositions}}}
Current Timestamp: {{{currentTimestamp}}}

User's Query: {{{query}}}

Based on your expert knowledge in Numerology, Astrology, and Vastu Shastra, and utilizing the provided contextual data, analyze the user's query and provide comprehensive, actionable advice or analysis.`,
});

const directSankhyaQueryFlow = ai.defineFlow(
  {
    name: 'directSankhyaQueryFlow',
    inputSchema: DirectSankhyaQueryInputSchema,
    outputSchema: DirectSankhyaQueryOutputSchema,
  },
  async (input) => {
    const { output } = await directSankhyaQueryPrompt(input);
    return output!;
  }
);
