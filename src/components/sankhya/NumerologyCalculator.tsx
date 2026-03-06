"use client"

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Zap, Target, Heart, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
    { label: 'Life Path', value: lifePath, icon: Zap, color: 'text-primary', desc: 'The blueprint of your destiny.' },
    { label: 'Destiny', value: destiny, icon: Target, color: 'text-secondary', desc: 'Your manifestation power.' },
    { label: 'Soul Urge', value: reduceToSingleDigit(lifePath + destiny), icon: Heart, color: 'text-red-400', desc: 'Inner motivation.' },
    { label: 'Expression', value: reduceToSingleDigit(destiny * 2), icon: TrendingUp, color: 'text-blue-400', desc: 'Outer personality.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-headline font-bold text-primary flex items-center justify-center gap-3">
          <Calculator className="w-8 h-8" />
          The Matrix of Nine
        </h2>
        <p className="text-muted-foreground">The numerical signature of your earthly incarnation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-morphism p-6 border-white/5 flex flex-col items-center text-center space-y-4 hover:border-primary/20 transition-all">
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{stat.label}</h4>
                <div className="text-4xl font-headline font-bold text-foreground">{stat.value}</div>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{stat.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="glass-morphism p-8 border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Calculator className="w-48 h-48 text-primary" />
        </div>
        <div className="max-w-2xl space-y-4 relative z-10">
          <h3 className="text-xl font-headline font-bold text-primary">Sankhya Analysis</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your Life Path of <span className="text-foreground font-bold">{lifePath}</span> indicates a vibration deeply aligned with 
            {lifePath === 1 ? ' leadership and innovation.' : 
             lifePath === 2 ? ' harmony and diplomacy.' :
             lifePath === 3 ? ' creativity and self-expression.' :
             lifePath === 4 ? ' stability and hard work.' :
             lifePath === 5 ? ' freedom and adventure.' :
             lifePath === 6 ? ' responsibility and nurturing.' :
             lifePath === 7 ? ' spirituality and introspection.' :
             lifePath === 8 ? ' power and material success.' :
             ' universal love and completion.'}
          </p>
          <div className="flex flex-wrap gap-2 pt-4">
             {['Pythagorean System', 'Chaldean Grid', 'Active Resonance'].map(tag => (
               <span key={tag} className="text-[9px] uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-full text-muted-foreground">
                 {tag}
               </span>
             ))}
          </div>
        </div>
      </Card>
    </div>
  );
}