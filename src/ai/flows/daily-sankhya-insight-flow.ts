'use server';
/**
 * @fileOverview Provides a comprehensive daily insight based on user birth details, current location,
 * and real-time planetary positions, integrating numerology, astrology, and vastu principles.
 * Includes a robust logic-driven fallback system.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { reduceToSingleDigit, NUMEROLOGY_THEORIES } from '@/lib/numerology-logic';
import { getSunSign, ASTRO_REMEDIES, getDailyPanchang } from '@/lib/astrology-logic';

const DailySankhyaInsightInputSchema = z.object({
  userName: z.string().describe("The user's name."),
  birthDate: z.string().describe("The user's birth date in YYYY-MM-DD format."),
  birthTime: z.string().describe("The user's birth time in HH:MM format (24-hour)."),
  birthPlace: z.string().describe("The user's birth city and country."),
  currentLatitude: z.number().describe("The user's current latitude."),
  currentLongitude: z.number().describe("The user's current longitude."),
  currentTimezoneOffset: z.number().describe("The user's current timezone offset from UTC in minutes."),
  currentDateTime: z.string().describe("The current date and time in YYYY-MM-DDTHH:MM:SS format."),
  language: z.string().optional().describe("The language for the response (e.g., 'bn' for Bengali, 'en' for English)."),
});
export type DailySankhyaInsightInput = z.infer<typeof DailySankhyaInsightInputSchema>;

const DailySankhyaInsightOutputSchema = z.object({
  dailyInsight: z.string(),
  summary: z.string(),
  energeticAlignment: z.string(),
  dailyTheme: z.string(),
  highlights: z.array(z.string()),
  opportunities: z.array(z.string()),
  thingsToAvoid: z.array(z.string()),
  suggestions: z.array(z.string()),
  microRituals: z.array(z.string()),
});
export type DailySankhyaInsightOutput = z.infer<typeof DailySankhyaInsightOutputSchema>;

const dailySankhyaInsightPrompt = ai.definePrompt({
  name: 'dailySankhyaInsightPrompt',
  input: { schema: DailySankhyaInsightInputSchema.extend({ planetaryAndAstrologicalData: z.string() }) },
  output: { schema: DailySankhyaInsightOutputSchema },
  prompt: `You are Sankhya, a high-intelligence reasoning engine. 
  Generate a profound daily insight for {{{userName}}}.
  
  Language: {{{language}}}
  
  Context:
  Profile: {{{userName}}}, born {{{birthDate}}} at {{{birthPlace}}}.
  Astrological Context: {{{planetaryAndAstrologicalData}}}
  
  Integrate Numerology, Jyotish, and Vastu. Provide strategic, poetic, and actionable data.`,
});

export async function dailySankhyaInsight(input: DailySankhyaInsightInput): Promise<DailySankhyaInsightOutput> {
  // Step 1: Calculate Logic-Based Grounding
  const [bYear, bMonth, bDay] = input.birthDate.split('-').map(Number);
  const lifePath = reduceToSingleDigit(bYear + bMonth + bDay);
  const sunSign = getSunSign(input.birthDate);
  const panchang = getDailyPanchang(new Date(input.currentDateTime));
  const numTheory = NUMEROLOGY_THEORIES[lifePath];

  // Step 2: Attempt AI Generation
  try {
    const planetaryData = `Sun in ${sunSign}. Tithi: ${panchang.tithi}. Nakshatra: ${panchang.nakshatra}. Numerology: Life Path ${lifePath} (${numTheory.title}).`;
    
    const { output } = await dailySankhyaInsightPrompt({
      ...input,
      planetaryAndAstrologicalData: planetaryData,
    });
    
    if (output) return output;
    throw new Error('AI output empty');
  } catch (error) {
    // Step 3: Fallback to Mathematical Logic (No Fail Guarantee)
    console.warn("AI Quota Exhausted or Error. Using internal Sankhya logic.");
    
    return {
      dailyInsight: `The matrix indicates a phase of ${numTheory.essence} today. With the Sun in ${sunSign}, your path is illuminated by ${panchang.tithi} energy.`,
      summary: `A day for ${numTheory.title.toLowerCase()} energy and ${sunSign} focus.`,
      energeticAlignment: `Aligned with Life Path ${lifePath} and ${panchang.nakshatra} Nakshatra.`,
      dailyTheme: numTheory.title,
      highlights: [
        `Harness the power of ${numTheory.title}`,
        `Leverage ${sunSign} strengths`,
        `Observe ${panchang.tithi} discipline`
      ],
      opportunities: [
        `Strategic planning in the North-East sector`,
        `Engagement with ${sunSign}-aligned tasks`
      ],
      thingsToAvoid: [
        `Ignoring your ${lifePath} vibration`,
        `Impulsive ${sunSign} behavior`
      ],
      suggestions: ASTRO_REMEDIES[sunSign],
      microRituals: numTheory.rituals
    };
  }
}
