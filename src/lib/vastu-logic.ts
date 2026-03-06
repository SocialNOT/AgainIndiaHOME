/**
 * @fileOverview Internal knowledge base for Vastu Shastra and Feng Shui principles.
 * Contains directional remedies and elemental balance logic.
 */

export type VastuDirection = 'North' | 'East' | 'South' | 'West' | 'NE' | 'SE' | 'SW' | 'NW';

export const VASTU_REMEDIES: Record<VastuDirection, { element: string; impact: string; remedy: string }> = {
  North: { element: 'Water', impact: 'Wealth & Career', remedy: 'Place a blue water fountain or blue artwork here.' },
  East: { element: 'Air/Sun', impact: 'Social Status & Health', remedy: 'Keep windows open or add green plants.' },
  South: { element: 'Fire', impact: 'Fame & Stability', remedy: 'Use red or orange colors and bright lights.' },
  West: { element: 'Earth/Space', impact: 'Creativity & Gains', remedy: 'Place heavy furniture or metallic objects here.' },
  NE: { element: 'Spirit/Water', impact: 'Clarity & Meditation', remedy: 'Keep this area clutter-free and highly sanitized.' },
  SE: { element: 'Fire', impact: 'Cash Flow & Vitality', remedy: 'Ideal for kitchen or electronics; avoid water here.' },
  SW: { element: 'Earth', impact: 'Relationships & Stability', remedy: 'Place heavy cabinets or family photos in yellow frames.' },
  NW: { element: 'Air', impact: 'Travel & Support', remedy: 'Ensure movement with a fan or a metallic wind chime.' }
};

export const calculateElementalBalance = (roomType: string) => {
  // Logic-based elemental requirement based on room type
  if (roomType.toLowerCase() === 'bedroom') return { fire: 10, water: 20, earth: 50, air: 10, space: 10 };
  if (roomType.toLowerCase() === 'kitchen') return { fire: 60, water: 10, earth: 10, air: 10, space: 10 };
  if (roomType.toLowerCase() === 'office') return { fire: 10, water: 10, earth: 20, air: 30, space: 30 };
  return { fire: 20, water: 20, earth: 20, air: 20, space: 20 };
};
