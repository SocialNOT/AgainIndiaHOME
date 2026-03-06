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
import { RitualVault } from '@/components/sankhya/RitualVault';
import { VastuCompass } from '@/components/sankhya/VastuCompass';
import { NumerologyCalculator } from '@/components/sankhya/NumerologyCalculator';
import { ThemeToggle } from '@/components/navigation/ThemeToggle';
import { LanguageSelector } from '@/components/navigation/LanguageSelector';
import { WelcomeHero } from '@/components/landing/WelcomeHero';
import { VibrationDashboard } from '@/components/sankhya/VibrationDashboard';
import { dailySankhyaInsight, DailySankhyaInsightOutput } from '@/ai/flows/daily-sankhya-insight-flow';
import { MapPin, Sun, Moon, Orbit, Shield, Zap as Lightning, Target, User, Info, Calendar, Palette, Hash, Star, ArrowUpRight, ShieldAlert, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useUser, useFirestore, useDoc, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

const reduceToSingleDigit = (num: number): number => {
  if (num === 11 || num === 22 || num === 33) return num;
  while (num > 9) {
    num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return num;
};

export default function Home() {
  const { user } = useUser();
  const db = useFirestore();
  const { data: userProfile, loading: profileLoading } = useDoc(user ? doc(db, 'users', user.uid) : null);

  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState('cyber');
  const [language, setLanguage] = useState('en');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dailyData, setDailyData] = useState<DailySankhyaInsightOutput | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [location, setLocation] = useState({ lat: 25.3176, lon: 82.9739, name: 'Varanasi Pulse' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('again-india-theme');
      const savedLang = localStorage.getItem('again-india-lang');
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
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('again-india-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('again-india-lang', language);
    if (userProfile?.name && userProfile?.birthDate) fetchDailyInsight();
  }, [language]);

  useEffect(() => {
    if (userProfile?.name && userProfile?.birthDate && !dailyData && !isLoadingInsight) {
      fetchDailyInsight();
    }
  }, [userProfile, location]);

  const handleOnboardingComplete = async (data: any) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const updatePayload = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    
    setDoc(userRef, updatePayload, { merge: true })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'write',
          requestResourceData: updatePayload,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
      
    setShowOnboarding(false);
  };

  const fetchDailyInsight = async () => {
    if (!userProfile?.name || !userProfile?.birthDate || !userProfile?.birthPlace) return;
    
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
        currentDateTime: new Date().toISOString(),
        language: language
      });
      setDailyData(insight);
    } catch (error) {
      console.error("Error fetching insight:", error);
    } finally {
      setIsLoadingInsight(false);
    }
  };

  const personalData = useMemo(() => {
    if (!userProfile?.birthDate) return null;
    const now = new Date();
    const [year, month, day] = userProfile.birthDate.split('-').map(Number);
    const lifePath = reduceToSingleDigit(year + month + day);
    const currentYear = now.getFullYear();
    const personalYear = reduceToSingleDigit(month + day + currentYear);
    const universalDay = reduceToSingleDigit((now.getMonth() + 1) + now.getDate() + currentYear);
    return { lifePath, personalYear, universalDay };
  }, [userProfile]);

  const dynamicWeeklyForecast = useMemo(() => {
    if (!userProfile?.birthDate) return [];
    const [bYear, bMonth, bDay] = userProfile.birthDate.split('-').map(Number);
    const now = new Date();
    const currentYear = now.getFullYear();
    const personalYear = reduceToSingleDigit(bMonth + bDay + currentYear);
    const themes: Record<number, string> = { 1: 'Init', 2: 'Balance', 3: 'Create', 4: 'Focus', 5: 'Change', 6: 'Nurture', 7: 'Insight', 8: 'Power', 9: 'Release' };
    const forecast = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(now.getDate() + i);
      const vibration = reduceToSingleDigit(personalYear + (date.getMonth() + 1) + date.getDate());
      forecast.push({ day: date.toLocaleDateString(language, { weekday: 'short' }), vibration, theme: themes[vibration] || 'Sync' });
    }
    return forecast;
  }, [userProfile, language]);

  const isLanding = !user || !userProfile?.name;

  return (
    <main className="relative min-h-screen flex flex-col bg-background">
      <div className="fixed inset-0 sacred-grid pointer-events-none z-0 opacity-20" />

      <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 glass-morphism border-b border-white/5">
        <div className="flex items-center gap-4">
          <h1 className="font-headline text-lg font-bold tracking-tight text-foreground">
            AGAIN <span className="text-primary">INDIA</span>
          </h1>
          {!isLanding && (
            <div className="hidden md:flex items-center gap-2 text-[8px] font-bold bg-white/5 px-3 py-1 uppercase tracking-widest">
              <MapPin className="w-3 h-3 text-primary" /> {location.name}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector currentLang={language} onLangChange={setLanguage} />
          <ThemeToggle currentTheme={theme} onThemeChange={setTheme} />
          {!isLanding && (
            <button 
              className="w-8 h-8 bg-primary text-background flex items-center justify-center font-bold text-xs"
            >
              {userProfile?.name?.charAt(0) || 'S'}
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 w-full max-w-6xl mx-auto px-4 pt-20 pb-24 relative z-10">
        <AnimatePresence mode="wait">
          {isLanding && !profileLoading ? (
            <WelcomeHero key="landing" onStart={() => setShowOnboarding(true)} language={language} />
          ) : (
            <div className="space-y-6">
              {activeTab === 'home' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <VibrationDashboard userProfile={userProfile} language={language} />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-8">
                      <DailyBriefing data={dailyData} language={language} />
                    </div>

                    <div className="lg:col-span-4 grid grid-cols-2 gap-2">
                      <Card className="glass-morphism p-4 space-y-2 border-white/5">
                        <span className="text-[7px] font-black uppercase tracking-widest text-primary">Lucky #</span>
                        <div className="text-3xl font-black text-primary">{personalData?.universalDay}</div>
                      </Card>
                      <Card className="glass-morphism p-4 space-y-2 border-white/5">
                        <span className="text-[7px] font-black uppercase tracking-widest text-secondary">Aura Color</span>
                        <div className="text-[10px] font-black text-foreground">SAFFRON</div>
                        <div className="w-full h-1 bg-primary" />
                      </Card>
                      <Card className="col-span-2 glass-morphism p-4 space-y-2 border-white/5">
                        <span className="text-[7px] font-black uppercase tracking-widest text-accent">Strategic Theme</span>
                        <div className="text-xs font-bold leading-tight">{dailyData?.dailyTheme || 'Synchronizing Matrix...'}</div>
                      </Card>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="glass-morphism p-6 space-y-4 border-white/5">
                       <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                        <ArrowUpRight className="w-3 h-3" /> Opportunities
                       </h3>
                       <div className="space-y-3">
                        {dailyData?.opportunities.slice(0, 2).map((op, i) => (
                          <div key={i} className="text-xs font-bold leading-tight border-l border-white/10 pl-3">{op}</div>
                        ))}
                       </div>
                    </Card>
                    <Card className="glass-morphism p-6 space-y-4 border-white/5">
                       <h3 className="text-[9px] font-black text-destructive uppercase tracking-[0.2em] flex items-center gap-2">
                        <ShieldAlert className="w-3 h-3" /> Things to Avoid
                       </h3>
                       <div className="space-y-3">
                        {dailyData?.thingsToAvoid.slice(0, 2).map((av, i) => (
                          <div key={i} className="text-xs font-bold leading-tight border-l border-white/10 pl-3">{av}</div>
                        ))}
                       </div>
                    </Card>
                    <Card className="glass-morphism p-6 space-y-4 border-white/5">
                       <h3 className="text-[9px] font-black text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                        <Lightbulb className="w-3 h-3" /> Suggestions
                       </h3>
                       <div className="space-y-3">
                        {dailyData?.suggestions.slice(0, 2).map((sug, i) => (
                          <div key={i} className="text-xs font-bold leading-tight border-l border-white/10 pl-3">{sug}</div>
                        ))}
                       </div>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card className="lg:col-span-2 glass-morphism p-6 space-y-6 border-white/5">
                      <div className="flex justify-between items-center">
                        <h3 className="text-[9px] font-black text-foreground/50 uppercase tracking-[0.3em]">7-Day Forecast Matrix</h3>
                        <Lightning className="w-4 h-4 text-primary animate-pulse" />
                      </div>
                      <div className="flex justify-between items-end h-24 gap-1">
                        {dynamicWeeklyForecast.map((day, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full bg-primary/10 relative" style={{ height: `${day.vibration * 10}%` }}>
                              <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors" />
                            </div>
                            <span className="text-[7px] font-black uppercase opacity-40">{day.day}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="glass-morphism p-6 space-y-4 border-white/5 bg-primary/5">
                      <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Remedies</h3>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <Lightning className="w-4 h-4 text-primary shrink-0" />
                          <p className="text-[10px] font-bold leading-tight">North-East alignment recommended for peak clarity today.</p>
                        </div>
                        <Button onClick={() => setActiveTab('rituals')} variant="outline" className="w-full h-8 text-[8px] font-black uppercase tracking-widest">
                          Full Protocol →
                        </Button>
                      </div>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LifeGraph />
                    <Card className="glass-morphism p-8 space-y-6 border-white/5 flex flex-col justify-center">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-primary uppercase tracking-tighter">Matrix Analysis</h3>
                        <p className="text-xs font-bold leading-relaxed opacity-60 uppercase tracking-widest">Temporal Cycle Diagnostic</p>
                      </div>
                      <p className="text-lg font-bold leading-relaxed italic">
                        "Your current frequency suggests a phase of <span className="text-primary">Radical Completion</span>. Release the old to make space for the 8-cycle."
                      </p>
                      <Button variant="outline" onClick={() => setActiveTab('calculator')} className="w-full text-[10px] font-bold uppercase tracking-widest h-12">
                        View Complete Breakdown →
                      </Button>
                    </Card>
                  </div>
                </motion.div>
              )}
              <div className="w-full">
                {activeTab === 'chat' && <QueryInterface userProfile={userProfile} language={language} />}
                {activeTab === 'palm' && <PalmScanner language={language} />}
                {activeTab === 'rituals' && <RitualGenerator userProfile={userProfile} language={language} />}
                {activeTab === 'vault' && <RitualVault userProfile={userProfile} language={language} />}
                {activeTab === 'compass' && <VastuCompass language={language} />}
                {activeTab === 'calculator' && <NumerologyCalculator userProfile={userProfile} language={language} />}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <UserBirthModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} onCancel={() => setShowOnboarding(false)} />
      
      {!isLanding && <GlassDock activeTab={activeTab} onTabChange={setActiveTab} />}
      
      <footer className="fixed bottom-0 left-0 right-0 z-[60] h-6 flex items-center justify-between px-4 bg-background border-t border-white/5 pointer-events-none text-[7px] font-bold uppercase tracking-[0.3em] opacity-30">
        <span>Made in 🇮🇳</span>
        <span>Rajib Singh Sync</span>
      </footer>
    </main>
  );
}
