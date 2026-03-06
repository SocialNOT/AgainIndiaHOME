"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CelestialOrb } from '@/components/orrery/CelestialOrb';
import { GlassDock } from '@/components/navigation/GlassDock';
import { DailyBriefing } from '@/components/sankhya/DailyBriefing';
import { LifeGraph } from '@/components/sankhya/LifeGraph';
import { UserBirthModal } from '@/components/onboarding/UserBirthModal';
import { QueryInterface } from '@/components/sankhya/QueryInterface';
import { dailySankhyaInsight, DailySankhyaInsightOutput } from '@/ai/flows/daily-sankhya-insight-flow';
import { MapPin, Clock, Search } from 'lucide-react';

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
    <main className="relative min-h-screen bg-background overflow-x-hidden pt-6 pb-32">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-background/20 border-b border-white/5">
        <div className="flex items-center gap-4">
          <h1 className="font-headline text-xl font-bold tracking-tighter text-foreground">
            AGAIN <span className="text-accent">INDIA</span>
          </h1>
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
            <MapPin className="w-3 h-3 text-accent" />
            Varanasi, UP
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-[10px] text-muted-foreground text-right hidden sm:block">
            <div className="font-bold text-foreground">SANKHYA CORE</div>
            RES_0.94 ACTIVE
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent p-[1px]">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-bold text-xs text-accent">
              {userProfile?.name?.charAt(0) || 'S'}
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 mt-20">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Central Orrery */}
              <section className="relative">
                <CelestialOrb />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <div className="text-xs uppercase tracking-[0.3em] text-accent font-bold">Resonance Level</div>
                    <div className="text-5xl font-headline font-bold text-white neon-glow">98.2%</div>
                  </motion.div>
                </div>
              </section>

              {/* Daily Briefing */}
              <DailyBriefing data={dailyData} />

              {/* Life Graph Visualization */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <LifeGraph />
                </div>
                <div className="glass-morphism rounded-3xl p-6 flex flex-col justify-center gap-4 border-none relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Search className="w-20 h-20 text-accent" />
                  </div>
                  <h3 className="text-lg font-headline font-medium text-accent">Real-time Synchro</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Sankhya is currently monitoring the transit of <span className="text-foreground font-medium">Saturn in Aquarius</span>. 
                    Your personal year energy is peaking.
                  </p>
                  <button className="mt-2 text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-2 hover:translate-x-1 transition-transform">
                    View Full Analysis →
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="pt-10"
            >
              <QueryInterface userProfile={userProfile} />
            </motion.div>
          )}

          {/* Other tabs would go here, placeholder for now */}
          {['calculator', 'compass', 'palm', 'rituals'].includes(activeTab) && (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-accent/30 animate-spin-very-slow flex items-center justify-center">
                <Clock className="w-10 h-10 text-accent/50" />
              </div>
              <h2 className="font-headline text-2xl text-accent">Module Synchronizing</h2>
              <p className="text-muted-foreground max-w-xs">
                Sankhya is currently processing the data for this module. Resonance will be available shortly.
              </p>
              <button 
                onClick={() => setActiveTab('home')}
                className="text-xs text-accent uppercase font-bold tracking-widest hover:underline"
              >
                Return to Orrery
              </button>
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