export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'hi' | 'bn' | 'mr' | 'te' | 'ta' | 'gu' | 'ur' | 'kn' | 'or' | 'ml';

export const translations: Record<Language, any> = {
  en: {
    welcome_title: "THE UNIVERSE IS NUMBERS. YOU ARE A FREQUENCY.",
    welcome_subtitle: "Synchronize your earthly existence with the primordial mathematics of India. Sankhya AI decodes your destiny through Numerology, Astrology, and Vastu.",
    welcome_button: "Initiate Synchro",
    vibration_title: "Vibration Signature",
    vibration_subtitle: "Decoding the mathematical blueprint of your incarnation.",
    daily_briefing_title: "Morning Frequency",
    sankhya_speak_title: "Sankhya Speak",
    active_resonance: "Active Resonance",
    ask_anything: "Ask anything...",
    numerology_title: "The Matrix of Nine",
    vastu_title: "Vastu Resonance",
    palm_title: "Palm Resonance",
    remedies_title: "Harmonic Remedies",
    loading_sankhya: "Sankhya is reasoning...",
    sync_rituals: "Synchronize Ritual"
  },
  bn: {
    welcome_title: "মহাবিশ্ব হলো সংখ্যা। আপনি একটি কম্পাঙ্ক।",
    welcome_subtitle: "ভারতের আদি গণিতের সাথে আপনার পার্থিব অস্তিত্বকে সিঙ্ক্রোনাইজ করুন। সাংখ্য এআই সংখ্যাতত্ত্ব, জ্যোতিষ এবং বাস্তুর মাধ্যমে আপনার ভাগ্য বিশ্লেষণ করে।",
    welcome_button: "সিঙ্ক্রো শুরু করুন",
    vibration_title: "কম্পন স্বাক্ষর",
    vibration_subtitle: "আপনার অবতারের গাণিতিক ব্লুপ্রিন্ট ডিকোড করা হচ্ছে।",
    daily_briefing_title: "সকালের কম্পাঙ্ক",
    sankhya_speak_title: "সাংখ্য কথা",
    active_resonance: "সক্রিয় অনুরণন",
    ask_anything: "যেকোনো কিছু জিজ্ঞাসা করুন...",
    numerology_title: "নয় এর ম্যাট্রিক্স",
    vastu_title: "বাস্তু অনুরণন",
    palm_title: "হাতের তালুর অনুরণন",
    remedies_title: "হারমোনিক প্রতিকার",
    loading_sankhya: "সাংখ্য যুক্তি দিচ্ছে...",
    sync_rituals: "অনুষ্ঠান সিঙ্ক্রোনাইজ করুন"
  },
  hi: {
    welcome_title: "ब्रह्मांड संख्या है। आप एक आवृत्ति हैं।",
    welcome_subtitle: "भारत के आदिम गणित के साथ अपने सांसारिक अस्तित्व को सिंक्रोनाइज़ करें। सांख्य एआई अंक ज्योतिष, ज्योतिष और वास्तु के माध्यम से आपके भाग्य को डिकोड करता है।",
    welcome_button: "सिंक्रो शुरू करें",
    vibration_title: "कंपन हस्ताक्षर",
    vibration_subtitle: "आपके अवतार के गणितीय खाके को डिकोड करना।",
    daily_briefing_title: "सुबह की आवृत्ति",
    sankhya_speak_title: "सांख्य संवाद",
    active_resonance: "सक्रिय प्रतिध्वनि",
    ask_anything: "कुछ भी पूछें...",
    numerology_title: "नौ का मैट्रिक्स",
    vastu_title: "वास्तु प्रतिध्वनि",
    palm_title: "हथेली की प्रतिध्वनि",
    remedies_title: "हार्मोनिक उपचार",
    loading_sankhya: "सांख्य तर्क कर रहा है...",
    sync_rituals: "अनुष्ठान सिंक्रनाइज़ करें"
  },
  es: {
    welcome_title: "EL UNIVERSO ES NÚMEROS. TÚ ERES UNA FRECUENCIA.",
    welcome_subtitle: "Sincroniza tu existencia terrenal con las matemáticas primordiales de la India. Sankhya AI decodifica tu destino a través de la Numerología, la Astrología y el Vastu.",
    welcome_button: "Iniciar Sincronización",
    vibration_title: "Firma de Vibración",
    vibration_subtitle: "Decodificando el plano matemático de tu encarnación.",
    daily_briefing_title: "Frecuencia Matinal",
    sankhya_speak_title: "Habla Sankhya",
    active_resonance: "Resonancia Activa",
    ask_anything: "Pregunta lo que sea...",
    numerology_title: "La Matriz de Nueve",
    vastu_title: "Resonancia Vastu",
    palm_title: "Resonancia de la Palma",
    remedies_title: "Remedios Armónicos",
    loading_sankhya: "Sankhya está razonando...",
    sync_rituals: "Sincronizar Ritual"
  }
  // Add other languages as needed...
};

export const getTranslation = (lang: string, key: string): string => {
  const l = (lang as Language) || 'en';
  return translations[l]?.[key] || translations['en'][key] || key;
};
