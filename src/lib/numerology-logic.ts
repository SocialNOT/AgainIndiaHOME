/**
 * @fileOverview Internal knowledge base for Pythagorean and Chaldean Numerology.
 * Contains formulas for Life Path, Destiny, Soul Urge, and corresponding remedies.
 */

export const reduceToSingleDigit = (num: number): number => {
  if (num === 11 || num === 22 || num === 33) return num;
  while (num > 9) {
    num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return num;
};

export const getLetterValue = (char: string): number => {
  const values: Record<string, number> = {
    A: 1, I: 1, J: 1, Q: 1, Y: 1,
    B: 2, K: 2, R: 2,
    C: 3, G: 3, L: 3, S: 3,
    D: 4, M: 4, T: 4,
    E: 5, H: 5, N: 5, X: 5,
    U: 6, V: 6, W: 6,
    O: 7, Z: 7,
    F: 8, P: 8
  };
  return values[char.toUpperCase()] || 0;
};

export const NUMEROLOGY_THEORIES: Record<number, { title: string; essence: string; remedies: string[]; rituals: string[] }> = {
  1: {
    title: "The Primal Pioneer",
    essence: "Individualism, leadership, and raw initiative. You are the spark of creation.",
    remedies: ["Wear gold or orange on Sundays", "Chant 'Om Suryaya Namaha'"],
    rituals: ["Morning sun gazing for 5 mins", "Keep a red handkerchief"]
  },
  2: {
    title: "The Diplomatic Mirror",
    essence: "Duality, intuition, and emotional resonance. You are the bridge between worlds.",
    remedies: ["Wear white or silver on Mondays", "Drink water from a silver glass"],
    rituals: ["Moonlight meditation", "Practice active listening"]
  },
  3: {
    title: "The Creative Catalyst",
    essence: "Expansion, joy, and the power of the word. You are the artist of reality.",
    remedies: ["Wear yellow on Thursdays", "Respect elders and teachers"],
    rituals: ["Journaling creative ideas", "Listen to 528Hz Solfeggio frequency"]
  },
  4: {
    title: "The Master Architect",
    essence: "Order, discipline, and the physical foundation. You are the stability of the grid.",
    remedies: ["Help manual laborers", "Feed stray dogs"],
    rituals: ["Systematic planning of the next day", "Walk barefoot on grass"]
  },
  5: {
    title: "The Dynamic Alchemist",
    essence: "Freedom, adaptability, and sensual exploration. You are the flow of change.",
    remedies: ["Wear green on Wednesdays", "Keep a small jade stone"],
    rituals: ["Change your daily route", "Short spontaneous travel"]
  },
  6: {
    title: "The Cosmic Guardian",
    essence: "Harmony, responsibility, and nurturing love. You are the healer of the home.",
    remedies: ["Wear silk or cream on Fridays", "Donate to orphanages"],
    rituals: ["Home decluttering ritual", "Fragrance therapy with sandalwood"]
  },
  7: {
    title: "The Esoteric Seeker",
    essence: "Analysis, introspection, and spiritual depth. You are the eye of the storm.",
    remedies: ["Meditate in silence", "Keep a spiritual book nearby"],
    rituals: ["Solitude hour every evening", "Focus on the third eye during meditation"]
  },
  8: {
    title: "The Power Manifestor",
    essence: "Authority, karma, and material success. You are the balance of justice.",
    remedies: ["Wear blue or black on Saturdays", "Practice humility with subordinates"],
    rituals: ["Strategic goal setting", "Physical endurance exercises"]
  },
  9: {
    title: "The Universal Soul",
    essence: "Compassion, completion, and humanitarian vision. You are the end and the beginning.",
    remedies: ["Donate blood or food", "Wear red on Tuesdays"],
    rituals: ["Forgiveness ritual", "Visualizing world peace"]
  },
  11: {
    title: "The Master Illuminator",
    essence: "High intuition and spiritual channeling. You are a psychic messenger.",
    remedies: ["Regular grounding exercises", "Spiritual study"],
    rituals: ["Channeling through writing", "Daily chakra balancing"]
  },
  22: {
    title: "The Master Builder",
    essence: "Turning grand visions into physical reality. You are the master of the material plane.",
    remedies: ["Large scale community service", "Disciplined execution"],
    rituals: ["Vision boarding", "Structured meditation on global impact"]
  },
  33: {
    title: "The Master Teacher",
    essence: "Unconditional love and selfless service. You are the healer of humanity.",
    remedies: ["Teaching others for free", "Compassionate leadership"],
    rituals: ["Loving-kindness meditation", "Vocal toning with 'Aum'"]
  }
};
