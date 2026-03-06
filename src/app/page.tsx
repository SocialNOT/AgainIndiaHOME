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
import { MapPin, MessageSquare, Sparkles } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dailyData, setDailyData] = useState<DailySankhyaInsightOutput | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('again-india-profile');
    if (saved) {
      setUserProfile(JSON.parse(saved));
    } else {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    if (userProfile && !dailyData && !isLoadingInsight) {
      fetchDailyInsight();
    }
  }, [userProfile]);

  const fetchDailyInsight = async () => {
    if (!userProfile) return;
    setIsLoadingInsight(true);
    try {
      const insight = await dailySankhyaInsight({
        userName: userProfile.name,
        birthDate: userProfile.birthDate,
        birthTime: userProfile.birthTime || '12:00',
        birthPlace: userProfile.birthPlace,
        currentLatitude: 28.6139,
        currentLongitude: 77.2090,
        currentTimezoneOffset: -330,
        currentDateTime: new Date().toISOString().split('T')[0] + 'T' + new Date().toTimeString().split(' ')[0]
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
    <main className="relative min-h-screen bg-cosmic flex flex-col">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 flex items-center justify-between px-4 sm:px-8 backdrop-blur-md bg-background/20 border-b border-white/5">
        <div className="flex items-center gap-3 sm:gap-6">
          <h1 className="font-headline text-lg sm:text-2xl font-bold tracking-tighter text-foreground whitespace-nowrap">
            AGAIN <span className="text-primary">INDIA</span>
          </h1>
          <div className="hidden lg:flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <MapPin className="w-3 h-3 text-primary" />
            Varanasi, UP
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:block text-right">
            <div className="text-[10px] font-bold text-foreground uppercase tracking-widest">SANKHYA CORE</div>
            <div className="text-[9px] text-primary/70 uppercase">RES_0.98 ACTIVE</div>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-primary via-white/50 to-secondary p-[1px] shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-bold text-xs sm:text-sm text-primary">
              {userProfile?.name?.charAt(0) || 'S'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 pt-24 pb-32 sm:pt-32">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12 sm:space-y-20"
            >
              {/* One-liner Chat CTA */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setActiveTab('chat')}
                className="glass-morphism rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all border-primary/20 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Sankhya Speak</h4>
                    <p className="text-xs text-muted-foreground">Ask the Oracle: "What is the resonance of my today?"</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform relative z-10">
                  INITIATE DIALOGUE <span>→</span>
                </div>
              </motion.div>

              {/* Central Orrery */}
              <section className="relative w-full overflow-visible py-8 sm:py-12">
                <CelestialOrb />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-1 sm:space-y-2"
                  >
                    <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary font-bold px-4">Resonance Level</div>
                    <div className="text-4xl sm:text-6xl font-headline font-bold text-white neon-glow">98.2%</div>
                  </motion.div>
                </div>
              </section>

              {/* Daily Briefing */}
              <div className="relative z-20">
                <DailyBriefing data={dailyData} />
              </div>

              {/* Life Graph Visualization */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pb-8">
                <div className="lg:col-span-2">
                  <LifeGraph />
                </div>
                <div className="glass-morphism rounded-3xl p-6 sm:p-8 flex flex-col justify-center gap-6 border-none relative overflow-hidden group">
                  <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles className="w-32 h-32 text-primary" />
                  </div>
                  <h3 className="text-xl font-headline font-medium text-primary">Real-time Synchro</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Sankhya is currently monitoring the transit of <span className="text-foreground font-medium">Saturn in Aquarius</span>. 
                    Your personal year energy is peaking.
                  </p>
                  <button onClick={() => setActiveTab('calculator')} className="w-fit text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 hover:translate-x-2 transition-transform py-2">
                    View Full Analysis <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="h-full flex flex-col justify-center"
            >
              <QueryInterface userProfile={userProfile} />
            </motion.div>
          )}

          {activeTab === 'palm' && (
            <motion.div key="palm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PalmScanner />
            </motion.div>
          )}

          {activeTab === 'rituals' && (
            <motion.div key="rituals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RitualGenerator userProfile={userProfile} />
            </motion.div>
          )}

          {activeTab === 'compass' && (
            <motion.div key="compass" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <VastuCompass />
            </motion.div>
          )}

          {activeTab === 'calculator' && (
            <motion.div key="calculator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <NumerologyCalculator userProfile={userProfile} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Onboarding */}
      <UserBirthModal 
        isOpen={showOnboarding} 
        onComplete={handleOnboardingComplete} 
      />

      {/* Navigation Dock */}
      <GlassDock activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  );
}