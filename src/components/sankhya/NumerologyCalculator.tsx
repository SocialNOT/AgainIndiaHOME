
"use client"

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Zap, Target, Heart, TrendingUp, Sparkles, BookOpen, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const letterValues: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

const reduceToSingleDigit = (num: number): number => {
  if (num === 11 || num === 22 || num === 33) return num;
  while (num > 9) {
    num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return num;
};

export function NumerologyCalculator({ userProfile }: { userProfile: any }) {
  const [selectedStat, setSelectedStat] = useState<any>(null);

  const calculateLifePath = () => {
    if (!userProfile?.birthDate) return 0;
    const digits = userProfile.birthDate.replace(/-/g, '').split('').map(Number);
    const sum = digits.reduce((a: number, b: number) => a + b, 0);
    return reduceToSingleDigit(sum);
  };

  const calculateDestiny = () => {
    if (!userProfile?.name) return 0;
    const sum = userProfile.name.toUpperCase().split('').reduce((acc: number, char: string) => {
      return acc + (letterValues[char] || 0);
    }, 0);
    return reduceToSingleDigit(sum);
  };

  const lifePath = useMemo(calculateLifePath, [userProfile]);
  const destiny = useMemo(calculateDestiny, [userProfile]);

  const stats = [
    { label: 'Life Path', value: lifePath, icon: Zap, color: 'text-primary', desc: 'The blueprint of your destiny.', stack: 'random-stack-1', details: "Your Life Path number represents the core frequency of your existence. It defines the challenges, opportunities, and innate talents you brought into this incarnation. It is the 'road' you are destined to travel." },
    { label: 'Destiny', value: destiny, icon: Target, color: 'text-secondary', desc: 'Your manifestation power.', stack: 'random-stack-2', details: "The Destiny number (or Expression number) reveals your potential. It represents the natural abilities you possess and the goal you are working towards in this lifetime. It is the 'how' of your life's mission." },
    { label: 'Soul Urge', value: reduceToSingleDigit(lifePath + destiny), icon: Heart, color: 'text-accent', desc: 'Inner motivation.', stack: 'random-stack-3', details: "The Soul Urge number reflects your hidden desires and inner motivations. It is what your heart truly yearns for, often kept private from the outside world. It defines your emotional resonance." },
    { label: 'Expression', value: reduceToSingleDigit(destiny * 2), icon: TrendingUp, color: 'text-primary', desc: 'Outer personality.', stack: 'random-stack-1', details: "The Expression number shows how the world perceives you. It is your dynamic mask and the way you communicate your essence to others. It dictates your social frequency and creative output." },
  ];

  const getMeaning = (val: number) => {
    const meanings: Record<number, string> = {
      1: 'Leadership & Radical Innovation',
      2: 'Harmony & Diplomacy',
      3: 'Creative Brilliance & Self-Expression',
      4: 'Stability & Architectural Mastery',
      5: 'Freedom & Dynamic Adventure',
      6: 'Responsibility & Nurturing Wisdom',
      7: 'Esoteric Spirituality & Introspection',
      8: 'Power & Material Manifestation',
      9: 'Universal Love & Spiritual Completion',
      11: 'Illumination & Master Intuition',
      22: 'Master Builder & Grounded Vision',
      33: 'Master Teacher & Altruistic Healing'
    };
    return meanings[val] || 'Complex Universal Resonance';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-headline font-bold text-primary flex items-center justify-center gap-3 uppercase tracking-tighter">
          <Calculator className="w-10 h-10" />
          The Matrix of Nine
        </h2>
        <p className="text-foreground font-bold tracking-wide uppercase text-[10px] opacity-80">The numerical signature of your earthly incarnation.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={stat.stack}
            onClick={() => setSelectedStat(stat)}
          >
            <Card className="glass-morphism p-6 border-white/5 flex flex-col items-center text-center space-y-4 hover:scale-110 hover:rotate-0 hover:z-20 transition-all cursor-pointer group hover:border-primary/40 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-125 transition-transform group-hover:bg-primary group-hover:text-background`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-[9px] uppercase font-black tracking-[0.2em] text-foreground/70 group-hover:text-primary transition-colors">{stat.label}</h4>
                <div className="text-4xl sm:text-5xl font-headline font-black text-foreground neon-glow">{stat.value}</div>
              </div>
              <p className="text-[10px] text-foreground font-bold leading-relaxed hidden sm:block opacity-60 group-hover:opacity-100">{stat.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="glass-morphism p-8 border-white/10 relative overflow-hidden group hover:bg-white/10 transition-all rounded-[3rem]">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Sparkles className="w-48 h-48 text-primary" />
        </div>
        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h3 className="text-2xl font-headline font-bold text-primary uppercase tracking-tighter">Sankhya Matrix Analysis</h3>
          </div>
          <p className="text-lg text-foreground font-bold leading-relaxed">
            Your Life Path of <span className="text-primary underline decoration-primary underline-offset-4 decoration-2">{lifePath}</span> indicates a vibration deeply aligned with <span className="italic">{getMeaning(lifePath)}</span>.
          </p>
          <div className="flex flex-wrap gap-2 pt-4">
             {['Pythagorean Grid', 'Chaldean Resonance', 'Active Frequency'].map(tag => (
               <span key={tag} className="text-[10px] uppercase font-black tracking-widest bg-white/5 border border-white/10 px-4 py-2 rounded-full text-foreground hover:text-primary hover:border-primary/30 transition-all cursor-default">
                 {tag}
               </span>
             ))}
          </div>
        </div>
      </Card>

      <Dialog open={!!selectedStat} onOpenChange={() => setSelectedStat(null)}>
        <DialogContent className="glass-morphism border-primary/20 sm:max-w-lg rounded-[3rem]">
          {selectedStat && (
            <>
              <DialogHeader className="space-y-4">
                <div className={`w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center ${selectedStat.color} mx-auto border border-primary/20`}>
                  <selectedStat.icon className="w-10 h-10" />
                </div>
                <DialogTitle className="font-headline text-3xl font-bold text-center text-primary uppercase tracking-tighter">
                  {selectedStat.label} Resonance
                </DialogTitle>
                <DialogDescription className="text-center text-foreground font-black uppercase tracking-widest text-xs opacity-80">
                  Value: <span className="text-2xl text-primary ml-2">{selectedStat.value}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                  <h4 className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                    <Info className="w-4 h-4" /> Frequency Breakdown
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed font-bold italic">
                    {selectedStat.details}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20">
                    <h5 className="text-[9px] font-black uppercase text-secondary tracking-widest mb-1">Archetype</h5>
                    <p className="text-xs text-foreground font-black">{getMeaning(selectedStat.value)}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20">
                    <h5 className="text-[9px] font-black uppercase text-accent tracking-widest mb-1">Vibration</h5>
                    <p className="text-xs text-foreground font-black">{selectedStat.value * 111} Hz Sync</p>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <h4 className="text-[9px] font-black uppercase text-primary tracking-widest mb-2">Key Takeaway</h4>
                  <p className="text-[11px] text-foreground font-bold leading-relaxed">
                    This frequency suggests that your current life phase should prioritize {selectedStat.label === 'Life Path' ? 'pioneer efforts' : 'social collaboration'}. Lean into your {selectedStat.value} vibration for maximum ease.
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
