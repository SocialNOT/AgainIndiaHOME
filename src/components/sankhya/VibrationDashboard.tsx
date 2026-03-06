
"use client"

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Sparkles, Star, History, Info, BookOpen, Orbit } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getTranslation } from '@/lib/translations';
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

  const vibrations = useMemo(() => {
    if (!userProfile?.birthDate) return [];
    
    const [year, month, day] = userProfile.birthDate.split('-').map(Number);
    const lifePath = reduceToSingleDigit(year + month + day);
    
    // Simple Chaldean mapping for destiny (example)
    const letterValues: Record<string, number> = { A: 1, I: 1, J: 1, Q: 1, Y: 1, B: 2, K: 2, R: 2, C: 3, G: 3, L: 3, S: 3, D: 4, M: 4, T: 4, E: 5, H: 5, N: 5, X: 5, U: 6, V: 6, W: 6, O: 7, Z: 7, F: 8, P: 8 };
    const nameSum = userProfile.name?.toUpperCase().split('').reduce((acc: number, char: string) => acc + (letterValues[char] || 0), 0);
    const destiny = reduceToSingleDigit(nameSum);

    const now = new Date();
    const currentYear = now.getFullYear();
    const personalYear = reduceToSingleDigit(month + day + currentYear);

    return [
      {
        id: 'lifepath',
        label: 'Life Path',
        value: lifePath,
        icon: Zap,
        color: 'text-primary',
        glow: 'shadow-[0_0_30px_rgba(var(--primary),0.3)]',
        summary: 'Your core frequency and purpose.',
        details: `Your Life Path ${lifePath} represents the road you are destined to travel. It is the primary frequency you broadcast to the universe.`,
        future: `A major shift in your ${lifePath} cycle is expected in the next personal cycle.`
      },
      {
        id: 'destiny',
        label: 'Destiny',
        value: destiny,
        icon: Target,
        color: 'text-secondary',
        glow: 'shadow-[0_0_30px_rgba(var(--secondary),0.3)]',
        summary: 'Your manifestation and talent.',
        details: `The Destiny number ${destiny} reveals your natural abilities and how you express your Life Path. It is the 'how' behind your 'why'.`,
        future: `Expect enhanced ${destiny % 2 === 0 ? 'collaborative' : 'independent'} opportunities soon.`
      },
      {
        id: 'personalyear',
        label: 'Personal Year',
        value: personalYear,
        icon: Orbit,
        color: 'text-accent',
        glow: 'shadow-[0_0_30px_rgba(var(--accent),0.3)]',
        summary: 'The theme of your current phase.',
        details: `Personal Year ${personalYear} dictates the energetic climate of your life right now. This is a time for ${personalYear === 1 ? 'new beginnings' : personalYear === 9 ? 'completion' : 'growth'}.`,
        future: `The transition to Personal Year ${reduceToSingleDigit(personalYear + 1)} will begin its influence in 3 months.`
      }
    ];
  }, [userProfile]);

  const getNumberMeaning = (num: number) => {
    const meanings: Record<number, string> = {
      1: "Radical Initiation and Leadership.",
      2: "Harmonious Collaboration and Diplomacy.",
      3: "Creative Brilliance and Joyful Expression.",
      4: "Structured Foundations and Discipline.",
      5: "Dynamic Freedom and Adaptive Change.",
      6: "Compassionate Responsibility and Healing.",
      7: "Esoteric Seeking and Deep Introspection.",
      8: "Powerful Manifestation and Material Success.",
      9: "Universal Completion and Spiritual Love.",
      11: "Master Intuition and Illumination.",
      22: "Master Building and Grounded Vision.",
      33: "Master Teaching and Altruistic Service."
    };
    return meanings[num] || "Universal Resonance.";
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-0">
      <Card className="glass-morphism border-none rounded-[3rem] p-8 sm:p-12 overflow-hidden relative group hover:shadow-[0_0_80px_rgba(var(--primary),0.1)] transition-all duration-700">
        <div className="absolute inset-0 sacred-grid opacity-10 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-700" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-6xl font-headline font-black tracking-tighter text-foreground uppercase">
              {t('vibration_title').split(' ')[0]} <span className="text-primary neon-glow">{t('vibration_title').split(' ')[1] || ''}</span>
            </h2>
            <p className="text-xs sm:text-sm font-bold text-foreground/70 uppercase tracking-[0.4em] max-w-xl">
              {t('vibration_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
            {vibrations.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedVibration(v)}
                className="group/card cursor-pointer"
              >
                <div className={`relative p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 ${v.glow}`}>
                  <div className="absolute top-4 right-4 opacity-20 group-hover/card:opacity-100 transition-opacity">
                    <Sparkles className={`w-5 h-5 ${v.color}`} />
                  </div>
                  
                  <div className="flex flex-col items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl bg-background border border-white/5 flex items-center justify-center ${v.color} shadow-2xl group-hover/card:bg-primary group-hover/card:text-background transition-colors`}>
                      <v.icon className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60">{v.label}</h4>
                      <div className="text-6xl font-headline font-black text-foreground group-hover/card:neon-glow transition-all">{v.value}</div>
                    </div>
                    
                    <p className="text-[10px] font-bold text-foreground/80 leading-relaxed max-w-[140px] italic">
                      {v.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest text-primary/40 group-hover/card:text-primary transition-colors">
                    <BookOpen className="w-3 h-3" />
                    Deep Analysis
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      <Dialog open={!!selectedVibration} onOpenChange={() => setSelectedVibration(null)}>
        <DialogContent className="glass-morphism border-primary/20 sm:max-w-lg rounded-[3rem] max-h-[90vh] overflow-y-auto no-scrollbar">
          {selectedVibration && (
            <>
              <DialogHeader className="space-y-4">
                <div className={`w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center ${selectedVibration.color} mx-auto border border-primary/20 shadow-2xl`}>
                  <selectedVibration.icon className="w-10 h-10" />
                </div>
                <DialogTitle className="font-headline text-3xl font-bold text-center text-primary uppercase tracking-tighter">
                  {selectedVibration.label} Deep Dive
                </DialogTitle>
                <DialogDescription className="text-center text-foreground font-black uppercase tracking-widest text-xs opacity-80">
                  Resonance Level: <span className="text-2xl text-primary ml-2">{selectedVibration.value}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <section className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                  <h4 className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                    <Info className="w-4 h-4" /> Core Archetype
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed font-bold italic">
                    {selectedVibration.details}
                  </p>
                </section>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20 flex flex-col items-center text-center">
                    <Star className="w-4 h-4 text-secondary mb-2" />
                    <h5 className="text-[9px] font-black uppercase text-secondary tracking-widest">Meaning</h5>
                    <p className="text-[10px] text-foreground font-black">{getNumberMeaning(selectedVibration.value)}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 flex flex-col items-center text-center">
                    <History className="w-4 h-4 text-accent mb-2" />
                    <h5 className="text-[9px] font-black uppercase text-accent tracking-widest">Vibration</h5>
                    <p className="text-[10px] text-foreground font-black">{selectedVibration.value * 9}.1 Hz Sync</p>
                  </div>
                </div>

                <section className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <h4 className="text-[9px] font-black uppercase text-primary tracking-widest mb-2 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Future Shift
                  </h4>
                  <p className="text-[11px] text-foreground font-bold leading-relaxed">
                    {selectedVibration.future}
                  </p>
                </section>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
