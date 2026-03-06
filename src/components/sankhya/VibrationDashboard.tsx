"use client"

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Orbit, Forward, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CelestialOrb } from '../orrery/CelestialOrb';

const reduceToSingleDigit = (num: number): number => {
  if (num === 11 || num === 22 || num === 33) return num;
  while (num > 9) {
    num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return num;
};

export function VibrationDashboard({ userProfile, language }: { userProfile: any, language: string }) {
  const stats = useMemo(() => {
    if (!userProfile?.birthDate) return { lifePath: 0, destiny: 0, personalYear: 0 };
    const [year, month, day] = userProfile.birthDate.split('-').map(Number);
    const lifePath = reduceToSingleDigit(year + month + day);
    const letterValues: Record<string, number> = { A: 1, I: 1, J: 1, Q: 1, Y: 1, B: 2, K: 2, R: 2, C: 3, G: 3, L: 3, S: 3, D: 4, M: 4, T: 4, E: 5, H: 5, N: 5, X: 5, U: 6, V: 6, W: 6, O: 7, Z: 7, F: 8, P: 8 };
    const nameSum = userProfile.name?.toUpperCase().split('').reduce((acc: number, char: string) => acc + (letterValues[char] || 0), 0);
    const destiny = reduceToSingleDigit(nameSum);
    const now = new Date();
    const personalYear = reduceToSingleDigit(month + day + now.getFullYear());
    return { lifePath, destiny, personalYear };
  }, [userProfile]);

  const vibrations = [
    { label: 'Life Path', value: stats.lifePath, icon: Zap, color: 'text-primary' },
    { label: 'Destiny', value: stats.destiny, icon: Target, color: 'text-secondary' },
    { label: 'Personal Year', value: stats.personalYear, icon: Orbit, color: 'text-accent' }
  ];

  return (
    <Card className="glass-morphism p-0 border-none overflow-hidden bg-transparent shadow-none">
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
        <div className="md:col-span-7 flex justify-center py-4">
          <CelestialOrb lifePath={stats.lifePath} destiny={stats.destiny} />
        </div>
        <div className="md:col-span-5 flex flex-col gap-2 p-4 md:p-6 bg-white/[0.02] border-l border-white/5 h-full justify-center">
          <div className="mb-4">
            <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-foreground">
              VIBRATION <span className="text-primary">MATRIX</span>
            </h2>
            <p className="text-[8px] font-black text-foreground/30 uppercase tracking-[0.4em]">SYNC STATUS: ACTIVE</p>
          </div>
          {vibrations.map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-morphism p-4 border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors group cursor-default">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 bg-white/5 flex items-center justify-center ${v.color} border border-white/5 shadow-inner`}>
                    <v.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-[8px] font-black uppercase text-foreground/40 tracking-[0.2em]">{v.label}</h4>
                    <div className="text-2xl font-black text-foreground">{v.value}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}