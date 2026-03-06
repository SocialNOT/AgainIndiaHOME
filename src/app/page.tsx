
"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassDock } from '@/components/navigation/GlassDock';
import { DailyBriefing } from '@/components/sankhya/DailyBriefing';
import { LifeGraph } from '@/components/sankhya/LifeGraph';
import { UserBirthModal } from '@/components/onboarding/UserBirthModal';
import { QueryInterface } from '@/components/sankhya/QueryInterface';
import { PalmScanner } from '@/components/sankhya/PalmScanner';
import { RitualGenerator } from '@/components/sankhya/RitualGenerator';
import { VastuCompass } from '@/components/sankhya/VastuCompass';
import { NumerologyCalculator } from '@/components/sankhya/NumerologyCalculator';
import { ThemeToggle } from '@/components/navigation/ThemeToggle';
import { LanguageSelector } from '@/components/navigation/LanguageSelector';
import { WelcomeHero } from '@/components/landing/WelcomeHero';
import { VibrationDashboard } from '@/components/sankhya/VibrationDashboard';
import { dailySankhyaInsight, DailySankhyaInsightOutput } from '@/ai/flows/daily-sankhya-insight-flow';
import { MapPin, Sparkles, Star, Sun, Moon, Orbit, Shield, Zap as Lightning, Target, History } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const reduceToSingleDigit = (num: number): number => {
  if (num === 11 || num === 22 || num === 33) return num;
  while (num > 9) {
    num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return num;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState('cyber');
  const [language, setLanguage] = useState('en');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dailyData, setDailyData] = useState<DailySankhyaInsightOutput | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [location, setLocation] = useState({ lat: 25.3176, lon: 82.9739, name: 'Varanasi Pulse' });
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Reset scroll on module change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  useEffect(() => {
    const saved = localStorage.getItem('again-india-profile');
    const savedTheme = localStorage.getItem('again-india-theme');
    const savedLang = localStorage.getItem('again-india-lang');
    if (saved) setUserProfile(JSON.parse(saved));
    if (savedTheme) setTheme(savedTheme || 'cyber');
    if (savedLang) setLanguage(savedLang);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          name: 'Local Resonance'
        });
      });
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('again-india-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('again-india-lang', language);
  }, [language]);

  useEffect(() => {
    if (userProfile && !dailyData && !isLoadingInsight) {
      fetchDailyInsight();
    }
  }, [userProfile, location]);

  const fetchDailyInsight = async () => {
    if (!userProfile) return;
    setIsLoadingInsight(true);
    try {
      const insight = await dailySankhyaInsight({
        userName: userProfile.name,
        birthDate: userProfile.birthDate,
        birthTime: userProfile.birthTime || '12:00',
        birthPlace: userProfile.birthPlace,
        currentLatitude: location.lat,
        currentLongitude: location.lon,
        currentTimezoneOffset: new Date().getTimezoneOffset(),
        currentDateTime: new Date().toISOString()
      });
      setDailyData(insight);
    } catch (error) {
      console.error("Error fetching insight:", error);
    } finally {
      setIsLoadingInsight(false);
    }
  };

  const handleOnboardingComplete = (data: any) => {
    localStorage.setItem('again-india-profile', JSON.stringify(data));
    setUserProfile(data);
    setShowOnboarding(false);
  };

  const personalData = useMemo(() => {
    if (!userProfile?.birthDate) return null;
    const now = new Date();
    const [year, month, day] = userProfile.birthDate.split('-').map(Number);
    const lifePath = reduceToSingleDigit(year + month + day);
    
    const currentYear = now.getFullYear();
    const personalYear = reduceToSingleDigit(month + day + currentYear);
    const personalMonth = reduceToSingleDigit(personalYear + (now.getMonth() + 1));
    const universalDay = reduceToSingleDigit((now.getMonth() + 1) + now.getDate() + currentYear);

    return { lifePath, personalYear, personalMonth, universalDay };
  }, [userProfile]);

  const celestialEvents = [
    { 
      label: 'Sun Path', 
      value: 'Aries Transit', 
      icon: Sun, 
      impact: 'High Vitality', 
      color: 'text-primary',
      details: 'The Sun in Aries marks a period of radical initiation. It is a time for bold action, setting new boundaries, and asserting your primal willpower.'
    },
    { 
      label: 'Moon Phase', 
      value: 'Waxing Crescent', 
      icon: Moon, 
      impact: 'Internal Growth', 
      color: 'text-secondary',
      details: 'As the light returns, focus on nurturing the seeds of intention planted during the New Moon. This phase supports expansion and creative manifestation.'
    },
    { 
      label: 'Mercury Flow', 
      value: 'Direct Motion', 
      icon: Orbit, 
      impact: 'Clear Logic', 
      color: 'text-accent',
      details: 'Mercury moving forward in Taurus brings practical clarity to communication. It is an ideal time for signing contracts and formalizing intellectual plans.'
    },
    { 
      label: 'Mars Pulse', 
      value: 'Leo Energy', 
      icon: Lightning, 
      impact: 'Creative Force', 
      color: 'text-primary',
      details: 'Mars in Leo encourages courageous self-expression. Your drive is fueled by passion and the desire to be seen and celebrated in your authentic power.'
    },
    { 
      label: 'Jupiter Reach', 
      icon: Star, 
      value: 'Pisces Horizon', 
      impact: 'Spiritual Expansion', 
      color: 'text-secondary',
      details: 'Jupiter in its own sign of Pisces dissolves limitations. Expect a heightened sense of compassion, intuitive breakthroughs, and spiritual abundance.'
    },
    { 
      label: 'Saturn Hold', 
      icon: Shield, 
      value: 'Aquarius Zone', 
      impact: 'Karmic Structure', 
      color: 'text-accent',
      details: 'Saturn in Aquarius demands innovation through discipline. It is a call to build new societal structures and embrace your role within the collective consciousness.'
    },
  ];

  const isLanding = !userProfile;

  return (
    <main className="relative min-h-screen flex flex-col overflow-x-hidden">
      <div className="fixed inset-0 sacred-grid pointer-events-none z-0 opacity-40" />

      <header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 sm:px-12 backdrop-blur-2xl bg-background/60 border-b border-white/5">
        <div className="flex items-center gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tighter text-foreground whitespace-nowrap">
              AGAIN <span className="text-primary neon-glow">INDIA</span>
            </h1>
          </motion.div>
          
          {!isLanding && (
            <div className="hidden lg:flex items-center gap-3 text-[10px] text-foreground font-black bg-white/5 px-4 py-2 rounded-full border border-white/10 uppercase tracking-[0.2em]">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {location.name}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector currentLang={language} onLangChange={setLanguage} />
          <ThemeToggle currentTheme={theme} onThemeChange={setTheme} />
          {!isLanding && (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowOnboarding(true)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-primary to-secondary p-[1px] shadow-[0_0_20px_rgba(var(--primary),0.3)] cursor-pointer"
            >
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-black text-sm text-primary">
                {userProfile?.name?.charAt(0) || 'S'}
              </div>
            </motion.div>
          )}
        </div>
      </header>

      <div className="flex-1 w-full max-w-7xl mx-auto px-6 pt-28 pb-40 relative z-10">
        <AnimatePresence mode="wait">
          {isLanding ? (
            <WelcomeHero key="landing" onStart={() => setShowOnboarding(true)} />
          ) : (
            <>
              {activeTab === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-12 sm:space-y-16"
                >
                  {/* Catchy Personalized Resonance Section */}
                  <section className="relative w-full flex flex-col items-center">
                    <VibrationDashboard userProfile={userProfile} />
                    
                    {/* Celestial Events Grid: Icons on Mobile, Details on Desktop */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 w-full max-w-4xl grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 px-4 sm:px-0 z-20"
                    >
                      {celestialEvents.map((item, i) => (
                        <Card 
                          key={i} 
                          onClick={() => setSelectedEvent(item)}
                          className="glass-morphism border-none p-3 sm:p-4 flex flex-col items-center justify-center text-center gap-1 group hover:scale-110 transition-all cursor-pointer relative overflow-hidden aspect-square sm:aspect-auto sm:h-28 rounded-xl sm:rounded-[2rem]"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                          <item.icon className={`w-7 h-7 sm:w-5 sm:h-5 ${item.color} group-hover:animate-pulse transition-transform duration-500`} />
                          
                          <div className="hidden sm:flex flex-col items-center gap-0.5">
                            <span className="text-[8px] uppercase font-black tracking-widest text-foreground/60">{item.label}</span>
                            <span className={`text-[10px] font-headline font-black text-foreground group-hover:neon-glow line-clamp-1`}>{item.value}</span>
                            <span className="text-[9px] font-bold text-primary opacity-70 group-hover:opacity-100">{item.impact}</span>
                          </div>
                        </Card>
                      ))}
                    </motion.div>
                  </section>

                  {/* Dashboard Grid */}
                  <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 sm:gap-12 items-start">
                    <div className="xl:col-span-3">
                      <DailyBriefing data={dailyData} />
                    </div>
                    <div className="xl:col-span-2 space-y-8">
                      <div className="random-stack-2">
                        <LifeGraph />
                      </div>
                      <Card className="glass-morphism rounded-[2.5rem] p-8 flex flex-col justify-center gap-6 border-none relative overflow-hidden group random-stack-1 hover:scale-105 hover:rotate-0 transition-transform duration-500">
                        <div className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
                          <Sparkles className="w-48 h-48 text-primary" />
                        </div>
                        <h3 className="text-2xl font-headline font-bold text-primary">Transit Weaver</h3>
                        <p className="text-base text-foreground font-bold leading-relaxed">
                          Your current cycle aligns with a <span className="text-primary underline">Personal Year {personalData?.personalYear}</span>. 
                          The magical frequency for today is <span className="text-secondary">Vibration {personalData?.universalDay}</span>.
                        </p>
                        <button 
                          onClick={() => setActiveTab('calculator')} 
                          className="w-fit px-0 py-2 text-sm font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3 hover:translate-x-4 transition-transform"
                        >
                          Analyze Matrix <span>→</span>
                        </button>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="w-full">
                {activeTab === 'chat' && <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><QueryInterface userProfile={userProfile} /></motion.div>}
                {activeTab === 'palm' && <motion.div key="palm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><PalmScanner /></motion.div>}
                {activeTab === 'rituals' && <motion.div key="rituals" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><RitualGenerator userProfile={userProfile} /></motion.div>}
                {activeTab === 'compass' && <motion.div key="compass" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><VastuCompass /></motion.div>}
                {activeTab === 'calculator' && <motion.div key="calculator" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><NumerologyCalculator userProfile={userProfile} /></motion.div>}
              </div>
            </>
          )}
        </AnimatePresence>
      </div>

      <UserBirthModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} onCancel={() => setShowOnboarding(false)} />
      {!isLanding && <GlassDock activeTab={activeTab} onTabChange={setActiveTab} />}

      {/* Celestial Event Deep Dive Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="glass-morphism border-primary/20 sm:max-w-md rounded-[3rem] max-h-[90vh] overflow-y-auto no-scrollbar">
          {selectedEvent && (
            <>
              <DialogHeader className="space-y-4">
                <div className={`w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center ${selectedEvent.color} mx-auto border border-primary/20 shadow-2xl`}>
                  <selectedEvent.icon className="w-8 h-8" />
                </div>
                <DialogTitle className="font-headline text-2xl font-bold text-center text-primary uppercase tracking-tighter">
                  {selectedEvent.label} Deep Dive
                </DialogTitle>
                <DialogDescription className="text-center text-foreground font-black uppercase tracking-widest text-[10px] opacity-80">
                  {selectedEvent.value} Resonance
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                  <h4 className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                    <Target className="w-4 h-4" /> Celestial Impact
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed font-bold italic">
                    {selectedEvent.details}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20 flex flex-col items-center text-center">
                    <Lightning className="w-4 h-4 text-secondary mb-2" />
                    <h5 className="text-[9px] font-black uppercase text-secondary tracking-widest">Active Pulse</h5>
                    <p className="text-[10px] text-foreground font-black">{selectedEvent.impact}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 flex flex-col items-center text-center">
                    <History className="w-4 h-4 text-accent mb-2" />
                    <h5 className="text-[9px] font-black uppercase text-accent tracking-widest">Cycle Duration</h5>
                    <p className="text-[10px] text-foreground font-black">28 Days Active</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
