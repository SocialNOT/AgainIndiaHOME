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
import { MapPin, Sun, Moon, Orbit, Shield, Zap as Lightning, Target, User, LogOut, Info, Calendar, Palette, Hash, Activity, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getTranslation } from '@/lib/translations';
import { useUser, useFirestore, useDoc, useAuth } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
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
  const auth = useAuth();
  const { data: userProfile, loading: profileLoading } = useDoc(user ? doc(db, 'users', user.uid) : null);

  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState('cyber');
  const [language, setLanguage] = useState('en');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProfileDeepDive, setShowProfileDeepDive] = useState(false);
  const [dailyData, setDailyData] = useState<DailySankhyaInsightOutput | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [location, setLocation] = useState({ lat: 25.3176, lon: 82.9739, name: 'Varanasi Pulse' });
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

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
    if (userProfile) fetchDailyInsight();
  }, [language]);

  useEffect(() => {
    if (userProfile && !dailyData && !isLoadingInsight) fetchDailyInsight();
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

  const celestialEvents = [
    { label: 'Sun', value: 'Aries', icon: Sun, color: 'text-primary' },
    { label: 'Moon', value: 'Waxing', icon: Moon, color: 'text-secondary' },
    { label: 'Merc', value: 'Direct', icon: Orbit, color: 'text-accent' },
    { label: 'Mars', value: 'Leo', icon: Lightning, color: 'text-primary' },
    { label: 'Jup', value: 'Pisces', icon: Star, color: 'text-secondary' },
    { label: 'Sat', value: 'Aquarius', icon: Shield, color: 'text-accent' },
  ];

  const isLanding = !user || !userProfile;

  return (
    <main className="relative min-h-screen flex flex-col bg-background">
      <div className="fixed inset-0 sacred-grid pointer-events-none z-0 opacity-20" />

      <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 glass-morphism border-b border-white/5">
        <div className="flex items-center gap-4">
          <h1 className="font-headline text-lg font-bold tracking-tight text-foreground">
            AGAIN <span className="text-primary">INDIA</span>
          </h1>
          {!isLanding && (
            <div className="hidden md:flex items-center gap-2 text-[9px] font-bold bg-white/5 px-3 py-1 uppercase tracking-widest">
              <MapPin className="w-3 h-3 text-primary" /> {location.name}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector currentLang={language} onLangChange={setLanguage} />
          <ThemeToggle currentTheme={theme} onThemeChange={setTheme} />
          {!isLanding && (
            <button 
              onClick={() => setShowProfileDeepDive(true)}
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
                  
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {celestialEvents.map((item, i) => (
                      <Card key={i} className="glass-morphism p-3 flex flex-col items-center justify-center text-center gap-1">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-[8px] uppercase font-bold text-foreground/50">{item.label}</span>
                        <span className="text-[9px] font-bold text-foreground line-clamp-1">{item.value}</span>
                      </Card>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card className="lg:col-span-2 glass-morphism p-6 space-y-4">
                      <h3 className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-widest">
                        <Calendar className="w-4 h-4" /> 7-Day Forecast
                      </h3>
                      <div className="flex justify-between items-end h-32 gap-1">
                        {dynamicWeeklyForecast.map((day, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full bg-primary/10 relative" style={{ height: `${day.vibration * 10}%` }}>
                              <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors" />
                            </div>
                            <span className="text-[8px] font-bold uppercase">{day.day}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                      <Card className="glass-morphism p-4 flex flex-col items-center justify-center gap-1">
                        <Hash className="w-4 h-4 text-primary" />
                        <span className="text-[8px] font-bold uppercase opacity-50">Lucky #</span>
                        <p className="text-2xl font-bold text-primary">{personalData?.universalDay}</p>
                      </Card>
                      <Card className="glass-morphism p-4 flex flex-col items-center justify-center gap-1">
                        <Palette className="w-4 h-4 text-secondary" />
                        <span className="text-[8px] font-bold uppercase opacity-50">Color</span>
                        <p className="text-[9px] font-bold text-secondary uppercase">Saffron</p>
                      </Card>
                      <Card className="col-span-2 glass-morphism p-4 flex items-center gap-4">
                        <Lightning className="w-5 h-5 text-accent shrink-0" />
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-bold uppercase opacity-50 tracking-widest">Active Remedy</span>
                          <p className="text-[10px] font-bold text-foreground leading-tight">North-East alignment for mental focus.</p>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DailyBriefing data={dailyData} language={language} />
                    <div className="space-y-6">
                      <LifeGraph />
                      <Card className="glass-morphism p-6 space-y-4">
                        <h3 className="text-lg font-bold text-primary uppercase">Matrix Analysis</h3>
                        <p className="text-sm font-medium leading-relaxed opacity-80">
                          Current cycle: <span className="text-primary font-bold underline">Personal Year {personalData?.personalYear}</span>. 
                          Phase of {personalData?.personalYear === 1 ? 'radical new beginnings' : 'completion'}.
                        </p>
                        <Button variant="outline" onClick={() => setActiveTab('calculator')} className="w-full text-[10px] font-bold uppercase tracking-widest h-10">
                          Full Breakdown →
                        </Button>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              )}
              <div className="w-full">
                {activeTab === 'chat' && <QueryInterface userProfile={userProfile} language={language} />}
                {activeTab === 'palm' && <PalmScanner language={language} />}
                {activeTab === 'rituals' && <RitualGenerator userProfile={userProfile} language={language} />}
                {activeTab === 'compass' && <VastuCompass language={language} />}
                {activeTab === 'calculator' && <NumerologyCalculator userProfile={userProfile} language={language} />}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <UserBirthModal isOpen={showOnboarding} onComplete={() => setShowOnboarding(false)} onCancel={() => setShowOnboarding(false)} />
      
      {!isLanding && <GlassDock activeTab={activeTab} onTabChange={setActiveTab} />}
    </main>
  );
}
