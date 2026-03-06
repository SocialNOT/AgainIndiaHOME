"use client"

import React, { useState, useEffect } from 'react';
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
import { dailySankhyaInsight, DailySankhyaInsightOutput } from '@/ai/flows/daily-sankhya-insight-flow';
import { MapPin, MessageSquare, Sparkles, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dailyData, setDailyData] = useState<DailySankhyaInsightOutput | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [location, setLocation] = useState({ lat: 28.6139, lon: 77.2090, name: 'Varanasi Pulse' });

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  useEffect(() => {
    const saved = localStorage.getItem('again-india-profile');
    if (saved) {
      setUserProfile(JSON.parse(saved));
    } else {
      setShowOnboarding(true);
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          name: 'Current Coordinates'
        });
      });
    }
  }, []);

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
      console.error("Error fetching daily data:", error);
    } finally {
      setIsLoadingInsight(false);
    }
  };

  const handleOnboardingComplete = (data: any) => {
    localStorage.setItem('again-india-profile', JSON.stringify(data));
    setUserProfile(data);
    setShowOnboarding(false);
  };

  return (
    <main className="relative min-h-screen bg-cosmic flex flex-col overflow-x-hidden">
      {/* Moving Sacred Grid */}
      <div className="fixed inset-0 sacred-grid pointer-events-none z-0 opacity-40" />

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 sm:px-12 backdrop-blur-2xl bg-background/40 border-b border-white/5">
        <div className="flex items-center gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tighter text-foreground whitespace-nowrap">
              AGAIN <span className="text-primary neon-glow">INDIA</span>
            </h1>
          </motion.div>
          
          <div className="hidden lg:flex items-center gap-3 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {location.name}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:block text-right">
            <div className="text-[10px] font-black text-foreground uppercase tracking-widest">SANKHYA CORE v1.2</div>
            <div className="text-[9px] text-secondary font-bold uppercase">Grid Resonance Active</div>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-primary via-white to-secondary p-[1px] shadow-[0_0_20px_rgba(255,153,51,0.3)] cursor-pointer"
          >
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-black text-sm sm:text-base text-primary">
              {userProfile?.name?.charAt(0) || 'S'}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 pt-28 pb-40 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12 sm:space-y-16"
            >
              {/* Catchy Chat CTA */}
              <div className="flex justify-center w-full">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('chat')}
                  className="group relative flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-primary/30 px-6 py-4 rounded-2xl overflow-hidden transition-all hover:border-primary hover:shadow-[0_0_30px_rgba(255,153,51,0.2)] max-w-2xl w-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6 text-primary group-hover:animate-bounce" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="block text-[10px] font-black text-primary uppercase tracking-[0.3em]">Quantum Inquiry</span>
                    <span className="text-sm sm:text-lg font-headline font-bold text-foreground">"Sankhya, what is my vibrational frequency today?"</span>
                  </div>
                  <Zap className="w-5 h-5 text-secondary animate-pulse" />
                </motion.button>
              </div>

              {/* Central Orrery */}
              <section className="relative w-full">
                <CelestialOrb />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <div className="text-[10px] uppercase tracking-[0.5em] text-primary font-black">Sync Ratio</div>
                    <div className="text-6xl sm:text-9xl font-headline font-black text-white neon-glow">99.1</div>
                    <div className="text-[10px] text-secondary font-bold tracking-[0.3em] uppercase">Universal Alignment</div>
                  </motion.div>
                </div>
              </section>

              {/* Daily Briefing & Life Graph */}
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 sm:gap-12 items-start">
                <div className="xl:col-span-3">
                  <DailyBriefing data={dailyData} />
                </div>
                <div className="xl:col-span-2 space-y-8">
                  <div className="random-stack-2">
                    <LifeGraph />
                  </div>
                  <Card className="glass-morphism rounded-3xl p-8 flex flex-col justify-center gap-6 border-none relative overflow-hidden group random-stack-1 hover:scale-105 hover:rotate-0 transition-transform duration-500">
                    <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                      <Sparkles className="w-48 h-48 text-primary" />
                    </div>
                    <h3 className="text-2xl font-headline font-bold text-primary">Astro-Loom Feed</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Your transit weaver is currently mapping <span className="text-foreground font-bold">Mercury's Alignment</span>. 
                      A portal for <span className="text-secondary font-bold">deep communication</span> is active.
                    </p>
                    <button 
                      onClick={() => setActiveTab('calculator')} 
                      className="w-fit px-0 py-2 text-sm font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3 hover:translate-x-4 transition-transform"
                    >
                      View Detailed Grid <span>→</span>
                    </button>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {/* Module Tabs */}
          <div className="w-full">
            {activeTab === 'chat' && (
              <motion.div key="chat" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                <QueryInterface userProfile={userProfile} />
              </motion.div>
            )}
            {activeTab === 'palm' && (
              <motion.div key="palm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <PalmScanner />
              </motion.div>
            )}
            {activeTab === 'rituals' && (
              <motion.div key="rituals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <RitualGenerator userProfile={userProfile} />
              </motion.div>
            )}
            {activeTab === 'compass' && (
              <motion.div key="compass" initial={{ opacity: 0, rotate: -5 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 5 }}>
                <VastuCompass />
              </motion.div>
            )}
            {activeTab === 'calculator' && (
              <motion.div key="calculator" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <NumerologyCalculator userProfile={userProfile} />
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </div>

      <UserBirthModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} />
      <GlassDock activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  );
}