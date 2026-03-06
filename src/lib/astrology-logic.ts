/**
 * @fileOverview Internal knowledge base for Vedic Astrology (Jyotish) principles.
 * Includes Sun sign logic and daily planetary highlights.
 */

export const getSunSign = (date: string): string => {
  const d = new Date(date);
  const m = d.getMonth() + 1;
  const day = d.getDate();

  if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) return "Aries";
  if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) return "Taurus";
  if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return "Gemini";
  if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return "Cancer";
  if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return "Leo";
  if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return "Virgo";
  if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return "Libra";
  if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return "Scorpio";
  if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return "Sagittarius";
  if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return "Capricorn";
  if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
};

export const ASTRO_REMEDIES: Record<string, string[]> = {
  Aries: ["Energize with physical activity", "Avoid impulsive decisions"],
  Taurus: ["Spend time in nature", "Practice flexibility in routine"],
  Gemini: ["Focus on one task at a time", "Clear communication with peers"],
  Cancer: ["Nurture your emotional health", "Stay connected with family"],
  Leo: ["Lead with generosity", "Balance ego with humility"],
  Virgo: ["Mindful organization", "Avoid over-criticizing yourself"],
  Libra: ["Seek harmony in relationships", "Be decisive in choices"],
  Scorpio: ["Channel passion into projects", "Practice transparency"],
  Sagittarius: ["Pursue new learning", "Stay grounded during travel"],
  Capricorn: ["Maintain disciplined work ethic", "Allow time for relaxation"],
  Aquarius: ["Engage with community", "Innovate your methods"],
  Pisces: ["Engage in artistic pursuits", "Protect your energy boundaries"]
};

export const getDailyPanchang = (date: Date) => {
  // Mock calculation for Tithi based on day of month
  const day = date.getDate();
  const tithis = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya"];
  const tithi = tithis[day % 15];
  
  return {
    tithi,
    nakshatra: day % 2 === 0 ? "Ashwini" : "Bharani",
    yoga: day % 3 === 0 ? "Priti" : "Ayushman"
  };
};
