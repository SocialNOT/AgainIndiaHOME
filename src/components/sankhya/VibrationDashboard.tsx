"use client"

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Orbit, Forward } from 'lucide-react';
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
    { label: 'Year', value: stats.personalYear, icon: Orbit, color: 'text-accent' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
      <div className="lg:col-span-3 order-2 lg:order-1 flex justify-center">
        <CelestialOrb lifePath={stats.lifePath} destiny={stats.destiny} />
      </div>
      <div className="lg:col-span-2 space-y-3 order-1 lg:order-2">
        <div className="mb-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">
            Vibration <span className="text-primary">Matrix</span>
          </h2>
          <p className="text-[8px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Resonance Link Active</p>
        </div>
        {vibrations.map((v, i) => (
          <Card key={i} className="glass-morphism p-4 border-none flex items-center justify-between hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 bg-white/5 flex items-center justify-center ${v.color}`}>
                <v.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[8px] font-bold uppercase text-foreground/50 tracking-widest">{v.label}</h4>
                <div className="text-2xl font-bold text-foreground">{v.value}</div>
              </div>
            </div>
            <Forward className="w-4 h-4 text-primary opacity-30" />
          </Card>
        ))}
      </div>
    </div>
  );
}
