
"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CelestialOrb } from '@/components/orrery/CelestialOrb';
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
import { WelcomeHero } from '@/components/landing/WelcomeHero';
import { dailySankhyaInsight, DailySankhyaInsightOutput } from '@/ai/flows/daily-sankhya-insight-flow';
import { MapPin, MessageSquare, Sparkles, Zap, Star, Sun, Moon, Orbit, Shield, Zap as Lightning } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dailyData, setDailyData] = useState<DailySankhyaInsightOutput | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [location, setLocation] = useState({ lat: 25.3176, lon: 82.9739, name: 'Varanasi Pulse' });

  // Reset scroll on module change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  useEffect(() => {
    const saved = localStorage.getItem('again-india-profile');
    const savedTheme = localStorage.getItem('again-india-theme');
    if (saved) setUserProfile(JSON.parse(saved));
    if (savedTheme) setTheme(savedTheme || 'cyber');

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
    { label: 'Sun Path', value: 'Aries Transit', icon: Sun, impact: 'High Vitality', color: 'text-primary' },
    { label: 'Moon Phase', value: 'Waxing Crescent', icon: Moon, impact: 'Internal Growth', color: 'text-secondary' },
    { label: 'Mercury Flow', value: 'Direct Motion', icon: Orbit, impact: 'Clear Logic', color: 'text-accent' },
    { label: 'Mars Pulse', value: 'Leo Energy', icon: Lightning, impact: 'Creative Force', color: 'text-primary' },
    { label: 'Jupiter Reach', icon: Star, value: 'Pisces Horizon', impact: 'Spiritual Expansion', color: 'text-secondary' },
    { label: 'Saturn Hold', icon: Shield, value: 'Aquarius Zone', impact: 'Karmic Structure', color: 'text-accent' },
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
                  {/* Catchy One-Liner Chat CTA */}
                  <div className="flex justify-center w-full">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('chat')}
                      className="group relative flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-primary/40 px-6 py-4 rounded-full overflow-hidden transition-all hover:border-primary hover:shadow-[0_0_40px_rgba(var(--primary),0.2)] max-w-2xl w-full"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-5 h-5 text-primary group-hover:animate-bounce" />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-sm sm:text-base font-headline font-bold text-foreground opacity-90 group-hover:opacity-100">
                          "Sankhya, what do the numbers say about my next 24 hours?"
                        </span>
                      </div>
                      <Zap className="w-4 h-4 text-secondary animate-pulse" />
                    </motion.button>
                  </div>

                  {/* Central Interactive Orrery */}
                  <section className="relative w-full flex flex-col items-center">
                    <CelestialOrb userProfile={userProfile} lifePath={personalData?.lifePath} />
                    
                    {/* 2x3 Grid of Ongoing/Future Celestial Events */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 w-full max-w-5xl grid grid-cols-2 md:grid-cols-3 gap-4 px-4 z-20"
                    >
                      {celestialEvents.map((item, i) => (
                        <Card key={i} className="glass-morphism border-none p-5 flex flex-col items-center justify-center text-center gap-1 group hover:scale-105 transition-all cursor-default relative overflow-hidden h-32">
                          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <item.icon className={`w-8 h-8 ${item.color}`} />
                          </div>
                          <item.icon className={`w-5 h-5 mb-1 ${item.color} group-hover:animate-pulse`} />
                          <span className="text-[9px] uppercase font-black tracking-widest text-foreground/60">{item.label}</span>
                          <span className={`text-base font-headline font-black text-foreground group-hover:neon-glow`}>{item.value}</span>
                          <span className="text-[10px] font-bold text-primary opacity-70 group-hover:opacity-100">{item.impact}</span>
                        </Card>
                      ))}
                    </motion.div>
                  </section>

                  {/* Compact Dashboard Cards */}
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
    </main>
  );
}
