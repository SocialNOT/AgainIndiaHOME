'use server';
/**
 * @fileOverview Provides a comprehensive daily insight based on user birth details, current location,
 * and real-time planetary positions, integrating numerology, astrology, and vastu principles.
 *
 * - dailySankhyaInsight - A function that generates the daily insight.
 * - DailySankhyaInsightInput - The input type for the dailySankhyaInsight function.
 * - DailySankhyaInsightOutput - The return type for the dailySankhyaInsight function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
  dailyInsight: z
    .string()
    .describe(
      'A comprehensive daily insight based on numerology, astrology, and vastu. Keep it concise, poetic, and inspiring.'
    ),
  summary: z.string().describe('A one-sentence executive summary of the day.'),
  energeticAlignment: z.string().describe('A summary of the user\'s current energetic alignment.'),
  dailyTheme: z.string().describe('The dominant themes for the user\'s day.'),
  highlights: z.array(z.string()).describe('Top 3 strategic highlights for the day.'),
  opportunities: z.array(z.string()).describe('Specific opportunities the user should look out for.'),
  thingsToAvoid: z.array(z.string()).describe('Specific actions or mindsets to avoid today.'),
  suggestions: z.array(z.string()).describe('Actionable suggestions for professional or personal growth.'),
  microRituals: z
    .array(z.string())
    .describe('Personalized micro-rituals for the day, e.g., specific colors to wear, frequency music, affirmations.'),
});
export type DailySankhyaInsightOutput = z.infer<typeof DailySankhyaInsightOutputSchema>;

// Mock function for fetching planetary positions. In a real application, this would call an external API.
async function getMockPlanetaryPositions(
  latitude: number,
  longitude: number,
  dateTime: Date,
  timezoneOffset: number
): Promise<string> {
  const formattedDateTime = dateTime.toLocaleString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const mockPositions = [
    'Sun in Aries (ambition, new beginnings)',
    'Moon in Cancer (emotional sensitivity, nurturing)',
    'Mars in Leo (creativity, leadership)',
    'Mercury in Taurus (practical communication, stability)',
    'Jupiter in Pisces (compassion, spiritual growth)',
    'Venus in Gemini (social connections, intellectual charm)',
    'Saturn in Aquarius (innovation, community focus)',
  ];

  const mockPanchang = `
    Today's Tithi: Shukla Paksha Tritiya (growth, expansion)
    Nakshatra: Ashwini (healing, initiation)
    Yoga: Priti (joy, contentment)
    Karana: Kaulava (social interaction)
    This day supports dynamic action and heartfelt connections.
  `;

  const mockVastuHint = `
    Based on your current location (Lat: ${latitude}, Lon: ${longitude}), consider aligning your workspace towards the North-East for enhanced clarity and focus today.
  `;

  return `Planetary positions for ${formattedDateTime} (UTC, adjusted for local timezone offset ${timezoneOffset} minutes):
${mockPositions.join('\n')}
${mockPanchang}
${mockVastuHint}
`;
}

const dailySankhyaInsightPrompt = ai.definePrompt({
  name: 'dailySankhyaInsightPrompt',
  input: { schema: DailySankhyaInsightInputSchema },
  output: { schema: DailySankhyaInsightOutputSchema },
  prompt: `You are Sankhya, a highly intelligent reasoning engine specializing in Pythagorean and Chaldean Numerology, Vedic Astrology (Jyotish), and Vastu Shastra. Your purpose is to provide profound daily insights.

IMPORTANT: Provide the response in the language specified: {{{language}}}. If the language is 'bn', use Bengali. If 'hi', use Hindi. Default to English if not specified or understood.

Integrate all provided information to synthesize a comprehensive daily insight, summary, highlights, opportunities, risks (things to avoid), and specific micro-rituals.

User Profile:
- Name: {{{userName}}}
- Birth Date: {{{birthDate}}}
- Birth Time: {{{birthTime}}}
- Birth Place: {{{birthPlace}}}

Current Context:
- Current Date and Time: {{{currentDateTime}}} (Local Time)
- Current Location: Latitude {{{currentLatitude}}}, Longitude {{{currentLongitude}}}

Real-time Planetary and Astrological Data:
{{{planetaryAndAstrologicalData}}}

Task: Generate a concise, poetic, and inspiring daily insight. 
Provide a one-sentence summary.
List 3 strategic highlights.
Identify 2-3 specific opportunities.
Identify 2-3 things to avoid.
Provide 2-3 actionable suggestions/remedies.
Ensure the output is well-structured and aligns with the principles of Numerology, Jyotish, and Vastu.`,
});

const dailySankhyaInsightFlow = ai.defineFlow(
  {
    name: 'dailySankhyaInsightFlow',
    inputSchema: DailySankhyaInsightInputSchema,
    outputSchema: DailySankhyaInsightOutputSchema,
  },
  async (input) => {
    const currentDateTimeObj = new Date(input.currentDateTime);

    const planetaryAndAstrologicalData = await getMockPlanetaryPositions(
      input.currentLatitude,
      input.currentLongitude,
      currentDateTimeObj,
      input.currentTimezoneOffset
    );

    const { output } = await dailySankhyaInsightPrompt({
      ...input,
      planetaryAndAstrologicalData,
    });
    return output!;
  }
);

export async function dailySankhyaInsight(input: DailySankhyaInsightInput): Promise<DailySankhyaInsightOutput> {
  return dailySankhyaInsightFlow(input);
}
