
"use client"

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Sparkles, Star, History, Info, BookOpen, Orbit, Forward } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getTranslation } from '@/lib/translations';
import { CelestialOrb } from '../orrery/CelestialOrb';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const reduceToSingleDigit = (num: number): number => {
  if (num === 11 || num === 22 || num === 33) return num;
  while (num > 9) {
    num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return num;
};

interface VibrationDashboardProps {
  userProfile: any;
  language: string;
}

export function VibrationDashboard({ userProfile, language }: VibrationDashboardProps) {
  const [selectedVibration, setSelectedVibration] = useState<any>(null);
  const t = (key: string) => getTranslation(language, key);

  const stats = useMemo(() => {
    if (!userProfile?.birthDate) return { lifePath: 0, destiny: 0, personalYear: 0 };
    
    const [year, month, day] = userProfile.birthDate.split('-').map(Number);
    const lifePath = reduceToSingleDigit(year + month + day);
    
    const letterValues: Record<string, number> = { A: 1, I: 1, J: 1, Q: 1, Y: 1, B: 2, K: 2, R: 2, C: 3, G: 3, L: 3, S: 3, D: 4, M: 4, T: 4, E: 5, H: 5, N: 5, X: 5, U: 6, V: 6, W: 6, O: 7, Z: 7, F: 8, P: 8 };
    const nameSum = userProfile.name?.toUpperCase().split('').reduce((acc: number, char: string) => acc + (letterValues[char] || 0), 0);
    const destiny = reduceToSingleDigit(nameSum);

    const now = new Date();
    const currentYear = now.getFullYear();
    const personalYear = reduceToSingleDigit(month + day + currentYear);

    return { lifePath, destiny, personalYear };
  }, [userProfile]);

  const vibrations = [
    {
      id: 'lifepath',
      label: 'Life Path',
      value: stats.lifePath,
      icon: Zap,
      color: 'text-primary',
      glow: 'shadow-[0_0_30px_rgba(var(--primary),0.3)]',
      summary: 'Your core frequency and purpose.',
      details: `Your Life Path ${stats.lifePath} represents the road you are destined to travel. It is the primary frequency you broadcast to the universe.`,
      future: `A major shift in your ${stats.lifePath} cycle is expected soon.`
    },
    {
      id: 'destiny',
      label: 'Destiny',
      value: stats.destiny,
      icon: Target,
      color: 'text-secondary',
      glow: 'shadow-[0_0_30px_rgba(var(--secondary),0.3)]',
      summary: 'Your manifestation and talent.',
      details: `The Destiny number ${stats.destiny} reveals your natural abilities and how you express your Life Path.`,
      future: `Enhanced ${stats.destiny % 2 === 0 ? 'collaborative' : 'independent'} opportunities incoming.`
    },
    {
      id: 'personalyear',
      label: 'Personal Year',
      value: stats.personalYear,
      icon: Orbit,
      color: 'text-accent',
      glow: 'shadow-[0_0_30px_rgba(var(--accent),0.3)]',
      summary: 'The theme of your current phase.',
      details: `Personal Year ${stats.personalYear} dictates the energetic climate of your life right now.`,
      future: `The transition to the next cycle begins in the next quarter.`
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        {/* Astronomical Visualization */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <CelestialOrb lifePath={stats.lifePath} destiny={stats.destiny} userProfile={userProfile} />
        </div>

        {/* Gamified Stat Cards */}
        <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
          <div className="space-y-2 mb-8 text-center lg:text-left">
            <h2 className="text-4xl sm:text-5xl font-headline font-black tracking-tighter text-foreground uppercase">
              Vibration <span className="text-primary neon-glow">Matrix</span>
            </h2>
            <p className="text-[10px] font-black text-foreground/50 uppercase tracking-[0.4em]">
              Sankhya Real-time Frequency Link
            </p>
          </div>

          {vibrations.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedVibration(v)}
              className="group cursor-pointer"
            >
              <Card className="glass-morphism p-6 border-white/5 hover:border-white/20 transition-all duration-500 hover:scale-105 flex items-center gap-6 rounded-[2.5rem] relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`} />
                
                <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${v.color} shadow-2xl group-hover:bg-primary group-hover:text-background transition-all duration-500`}>
                  <v.icon className="w-7 h-7" />
                </div>
                
                <div className="flex-1">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/60">{v.label}</h4>
                  <div className="text-4xl font-headline font-black text-foreground group-hover:neon-glow transition-all">{v.value}</div>
                </div>

                <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Forward className="w-4 h-4 text-primary" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedVibration} onOpenChange={() => setSelectedVibration(null)}>
        <DialogContent className="glass-morphism border-primary/20 sm:max-w-lg rounded-[3rem] p-0 overflow-hidden">
          {selectedVibration && (
            <div className="flex flex-col h-full">
              <DialogHeader className="p-10 pb-6 space-y-4 shrink-0">
                <div className={`w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center ${selectedVibration.color} mx-auto border border-primary/20 shadow-2xl`}>
                  <selectedVibration.icon className="w-10 h-10" />
                </div>
                <DialogTitle className="font-headline text-3xl font-bold text-center text-primary uppercase tracking-tighter">
                  {selectedVibration.label} Protocol
                </DialogTitle>
                <DialogDescription className="text-center text-foreground font-black uppercase tracking-widest text-[10px] opacity-80">
                  Value Resonance: <span className="text-2xl text-primary ml-2">{selectedVibration.value}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="px-10 pb-12 space-y-8">
                <section className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                  <h4 className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                    <Info className="w-4 h-4" /> Cosmic Analysis
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed font-bold italic">
                    {selectedVibration.details}
                  </p>
                </section>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-secondary/10 border border-secondary/20 flex flex-col items-center text-center">
                    <Star className="w-5 h-5 text-secondary mb-2" />
                    <h5 className="text-[9px] font-black uppercase text-secondary tracking-widest">Meaning</h5>
                    <p className="text-[10px] text-foreground font-black uppercase">Primal Frequency</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-accent/10 border border-accent/20 flex flex-col items-center text-center">
                    <Zap className="w-5 h-5 text-accent mb-2" />
                    <h5 className="text-[9px] font-black uppercase text-accent tracking-widest">Resonance</h5>
                    <p className="text-[10px] text-foreground font-black">{selectedVibration.value * 9}Hz Sync</p>
                  </div>
                </div>

                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                  <h4 className="text-[9px] font-black uppercase text-primary tracking-widest mb-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Predictive Pulse
                  </h4>
                  <p className="text-[11px] text-foreground font-bold leading-relaxed">
                    {selectedVibration.future}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
