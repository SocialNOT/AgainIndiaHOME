/**
 * @fileOverview Internal knowledge base for Samudrika Shastra (Palmistry).
 * Provides line-based interpretations and strategic advice.
 */

export const PALM_LINE_THEORIES = {
  heartLine: {
    title: "The Heart Line (Hriday Rekha)",
    description: "Governs emotional resonance, empathy, and the depth of interpersonal connections.",
    types: {
      curved: "Emotional openness and warmth.",
      straight: "Logical approach to relationships.",
      broken: "Periods of emotional transformation."
    }
  },
  headLine: {
    title: "The Head Line (Mastishk Rekha)",
    description: "Dictates decision-making logic, concentration, and intellectual focus.",
    types: {
      long: "Deep analytical capabilities.",
      short: "Quick, instinctive thinking.",
      sloping: "Highly creative and imaginative mind."
    }
  },
  lifeLine: {
    title: "The Life Line (Jeevan Rekha)",
    description: "Represents vitality, stability, and the overall energetic current of your physical journey.",
    types: {
      deep: "Strong vitality and constitution.",
      faint: "Sensitive energy system requiring care.",
      chained: "Variable energy levels throughout life."
    }
  }
};

export const getGenericPalmInterpretation = () => {
  return `Based on traditional Samudrika Shastra, your palm's resonance indicates a strong current of intellectual energy (Head Line) balanced by a sensitive emotional framework (Heart Line). Your current Life Path suggests a need for grounding.

Key Insight: The convergence of your major lines indicates a strategic phase where logic must lead your emotional responses for maximum success.`;
};
