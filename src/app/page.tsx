
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
import { MapPin, Sparkles, Star, Sun, Moon, Orbit, Shield, Zap as Lightning, Target, History, User, LogOut, Info, Calendar, Palette, Hash, Activity } from 'lucide-react';
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

  const t = (key: string) => getTranslation(language, key);

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
    if (userProfile) {
      fetchDailyInsight();
    }
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

  const handleOnboardingComplete = async (data: any) => {
    if (user && db) {
      await setDoc(doc(db, 'users', user.uid), {
        ...data,
        location,
        lastUpdated: serverTimestamp()
      }, { merge: true });
    }
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
    { label: 'Sun Path', value: 'Aries Transit', icon: Sun, impact: 'High Vitality', color: 'text-primary', details: 'Bold action and primal initiation.' },
    { label: 'Moon Phase', value: 'Waxing Crescent', icon: Moon, impact: 'Internal Growth', color: 'text-secondary', details: 'Nurture intentions and creative seeds.' },
    { label: 'Mercury Flow', value: 'Direct Motion', icon: Orbit, impact: 'Clear Logic', color: 'text-accent', details: 'Practical clarity in communication.' },
    { label: 'Mars Pulse', value: 'Leo Energy', icon: Lightning, impact: 'Creative Force', color: 'text-primary', details: 'Courageous self-expression.' },
    { label: 'Jupiter Reach', icon: Star, value: 'Pisces Horizon', impact: 'Spiritual expansion', color: 'text-secondary', details: 'Intuitive breakthroughs and abundance.' },
    { label: 'Saturn Hold', icon: Shield, value: 'Aquarius Zone', impact: 'Karmic Structure', color: 'text-accent', details: 'Innovation through discipline.' },
  ];

  const weeklyForecast = [
    { day: 'Mon', vibration: 3, theme: 'Expression' },
    { day: 'Tue', vibration: 7, theme: 'Reflection' },
    { day: 'Wed', vibration: 1, theme: 'Ambition' },
    { day: 'Thu', vibration: 5, theme: 'Adventure' },
    { day: 'Fri', vibration: 9, theme: 'Completion' },
    { day: 'Sat', vibration: 2, theme: 'Harmony' },
    { day: 'Sun', vibration: 8, theme: 'Power' },
  ];

  const isLanding = !user || !userProfile;

  return (
    <main className="relative min-h-screen flex flex-col overflow-x-hidden">
      <div className="fixed inset-0 sacred-grid pointer-events-none z-0 opacity-40" />

      <header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 sm:px-12 backdrop-blur-2xl bg-background/60 border-b border-white/5">
        <div className="flex items-center gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
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
              onClick={() => setShowProfileDeepDive(true)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-primary to-secondary p-[1px] shadow-[0_0_20px_rgba(var(--primary),0.3)] cursor-pointer"
            >
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-black text-sm text-primary">
                {userProfile?.name?.charAt(0) || user?.displayName?.charAt(0) || 'S'}
              </div>
            </motion.div>
          )}
        </div>
      </header>

      <div className="flex-1 w-full max-w-7xl mx-auto px-6 pt-28 pb-40 relative z-10">
        <AnimatePresence mode="wait">
          {isLanding && !profileLoading ? (
            <WelcomeHero key="landing" onStart={() => setShowOnboarding(true)} language={language} />
          ) : (
            <>
              {activeTab === 'home' && (
                <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12 sm:space-y-16">
                  <section className="relative w-full flex flex-col items-center">
                    <VibrationDashboard userProfile={userProfile} language={language} />
                    
                    {/* Celestial Events Pulse */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 w-full max-w-4xl grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 px-4 sm:px-0 z-20">
                      {celestialEvents.map((item, i) => (
                        <Card key={i} onClick={() => setSelectedEvent(item)} className="glass-morphism border-none p-3 sm:p-4 flex flex-col items-center justify-center text-center gap-1 group hover:scale-110 transition-all cursor-pointer relative overflow-hidden aspect-square sm:aspect-auto sm:h-28 rounded-xl sm:rounded-[2rem]">
                          <item.icon className={`w-7 h-7 sm:w-5 sm:h-5 ${item.color} group-hover:animate-pulse transition-transform duration-500`} />
                          <div className="hidden sm:flex flex-col items-center gap-0.5">
                            <span className="text-[8px] uppercase font-black tracking-widest text-foreground/60">{item.label}</span>
                            <span className={`text-[10px] font-headline font-black text-foreground group-hover:neon-glow line-clamp-1`}>{item.value}</span>
                          </div>
                        </Card>
                      ))}
                    </motion.div>
                  </section>

                  {/* 7-Day Forecast & Resonance Grid */}
                  <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 glass-morphism border-none p-8 rounded-[3rem] space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-headline font-bold text-primary flex items-center gap-2">
                          <Calendar className="w-5 h-5" /> 7-Day Vibration Forecast
                        </h3>
                        <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Weekly Sync Matrix</span>
                      </div>
                      <div className="flex justify-between items-end h-40 gap-2">
                        {weeklyForecast.map((day, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                            <div className="w-full bg-white/5 rounded-t-xl relative overflow-hidden flex items-end justify-center" style={{ height: `${day.vibration * 10}%` }}>
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: '100%' }}
                                transition={{ delay: i * 0.1, duration: 1 }}
                                className="w-full bg-gradient-to-t from-primary/40 to-primary/10" 
                              />
                              <span className="absolute top-2 text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity">{day.vibration}</span>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-black uppercase text-foreground">{day.day}</p>
                              <p className="text-[8px] font-bold text-foreground/40 uppercase hidden sm:block">{day.theme}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                      <Card className="glass-morphism border-none p-6 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-2 group hover:scale-105 transition-all">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-1">
                          <Hash className="w-5 h-5" />
                        </div>
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-foreground/60">Lucky Number</h4>
                        <p className="text-3xl font-headline font-black text-primary">{personalData?.universalDay}</p>
                      </Card>
                      <Card className="glass-morphism border-none p-6 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-2 group hover:scale-105 transition-all">
                        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary mb-1">
                          <Palette className="w-5 h-5" />
                        </div>
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-foreground/60">Power Color</h4>
                        <p className="text-xs font-black text-secondary uppercase tracking-tighter">Saffron Gold</p>
                      </Card>
                      <Card className="col-span-2 glass-morphism border-none p-6 rounded-[2.5rem] flex items-center gap-6 group hover:bg-white/5 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent shrink-0">
                          <Lightning className="w-7 h-7" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-[9px] font-black uppercase tracking-widest text-foreground/60">Active Remedy</h4>
                          <p className="text-xs font-bold text-foreground leading-relaxed">Align your workspace North-East for mental clarity today.</p>
                        </div>
                      </Card>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 sm:gap-12 items-start">
                    <div className="xl:col-span-3">
                      <DailyBriefing data={dailyData} language={language} />
                    </div>
                    <div className="xl:col-span-2 space-y-8">
                      <LifeGraph />
                      <Card className="glass-morphism rounded-[2.5rem] p-8 flex flex-col justify-center gap-6 border-none relative overflow-hidden group random-stack-1 hover:scale-105 transition-all">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
                          <Activity className="w-32 h-32" />
                        </div>
                        <h3 className="text-2xl font-headline font-bold text-primary">Transit Weaver</h3>
                        <p className="text-base text-foreground font-bold leading-relaxed">
                          Your current cycle aligns with a <span className="text-primary underline">Personal Year {personalData?.personalYear}</span>. This is a phase of {personalData?.personalYear === 1 ? 'radical new beginnings' : 'deep completion'}.
                        </p>
                        <button onClick={() => setActiveTab('calculator')} className="w-fit px-0 py-2 text-sm font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3 group-hover:gap-5 transition-all">
                          Analyze Matrix <span>→</span>
                        </button>
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
            </>
          )}
        </AnimatePresence>
      </div>

      <UserBirthModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} onCancel={() => setShowOnboarding(false)} />
      
      {/* Profile Deep Dive Modal */}
      <Dialog open={showProfileDeepDive} onOpenChange={setShowProfileDeepDive}>
        <DialogContent className="glass-morphism border-primary/20 sm:max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-[3rem]">
          <DialogHeader className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary p-[1px] mx-auto shadow-2xl">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-headline text-3xl font-black text-primary">
                {userProfile?.name?.charAt(0) || 'S'}
              </div>
            </div>
            <DialogTitle className="font-headline text-3xl font-bold text-center text-primary uppercase tracking-tighter">
              {userProfile?.name} Hub
            </DialogTitle>
            <DialogDescription className="text-center text-foreground font-bold uppercase tracking-widest text-[10px] opacity-80">
              User ID: {user?.uid?.slice(0, 8)}... Resonance Protocol Active
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 pt-6">
            <section className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
              <h4 className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                <Info className="w-4 h-4" /> Cosmic Coordinates
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-foreground/80">
                <div className="space-y-1"><p className="text-[10px] uppercase opacity-50">Birth Date</p><p>{userProfile?.birthDate}</p></div>
                <div className="space-y-1"><p className="text-[10px] uppercase opacity-50">Birth Place</p><p>{userProfile?.birthPlace}</p></div>
                <div className="space-y-1"><p className="text-[10px] uppercase opacity-50">Life Path</p><p className="text-primary font-black">{personalData?.lifePath}</p></div>
                <div className="space-y-1"><p className="text-[10px] uppercase opacity-50">Current Grid</p><p>{location.name}</p></div>
              </div>
            </section>

            <section className="space-y-4">
              <h4 className="flex items-center gap-2 text-secondary font-black uppercase tracking-widest text-[10px]">
                <Shield className="w-4 h-4" /> Active Analysis
              </h4>
              <div className="bg-secondary/10 p-5 rounded-2xl border border-secondary/20">
                <p className="text-sm font-bold leading-relaxed italic">
                  Currently vibrating in a Personal Year {personalData?.personalYear}. Focus on {personalData?.personalYear === 1 ? 'Initiation' : 'Refinement'} of your Life Path {personalData?.lifePath} energy.
                </p>
              </div>
            </section>

            <div className="flex flex-col gap-3">
              <Button 
                variant="outline" 
                onClick={() => { setShowProfileDeepDive(false); setShowOnboarding(true); }}
                className="h-14 rounded-2xl border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest"
              >
                Update Birth Details
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => { signOut(auth); setShowProfileDeepDive(false); }}
                className="h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Disconnect Resonance
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
