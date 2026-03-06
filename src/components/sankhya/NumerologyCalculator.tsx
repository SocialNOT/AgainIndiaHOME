"use client"

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Zap, Target, Heart, TrendingUp, Sparkles } from 'lucide-react';
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
    { label: 'Life Path', value: lifePath, icon: Zap, color: 'text-primary', desc: 'The blueprint of your destiny.', stack: 'random-stack-1' },
    { label: 'Destiny', value: destiny, icon: Target, color: 'text-secondary', desc: 'Your manifestation power.', stack: 'random-stack-2' },
    { label: 'Soul Urge', value: reduceToSingleDigit(lifePath + destiny), icon: Heart, color: 'text-red-400', desc: 'Inner motivation.', stack: 'random-stack-3' },
    { label: 'Expression', value: reduceToSingleDigit(destiny * 2), icon: TrendingUp, color: 'text-blue-400', desc: 'Outer personality.', stack: 'random-stack-1' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-headline font-bold text-primary flex items-center justify-center gap-3">
          <Calculator className="w-10 h-10" />
          The Matrix of Nine
        </h2>
        <p className="text-muted-foreground font-light tracking-wide">The numerical signature of your earthly incarnation.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={stat.stack}
          >
            <Card className="glass-morphism p-6 border-white/5 flex flex-col items-center text-center space-y-4 hover:scale-110 hover:rotate-0 hover:z-20 transition-all cursor-pointer group">
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-125 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-[9px] uppercase font-black tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</h4>
                <div className="text-4xl sm:text-5xl font-headline font-black text-foreground neon-glow">{stat.value}</div>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed hidden sm:block">{stat.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="glass-morphism p-8 border-white/10 relative overflow-hidden group hover:bg-white/10 transition-all">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Sparkles className="w-48 h-48 text-primary" />
        </div>
        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h3 className="text-2xl font-headline font-bold text-primary uppercase tracking-tighter">Sankhya Matrix Analysis</h3>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed">
            Your Life Path of <span className="text-foreground font-black underline decoration-primary underline-offset-4">{lifePath}</span> indicates a vibration deeply aligned with 
            {lifePath === 1 ? ' leadership and radical innovation.' : 
             lifePath === 2 ? ' profound harmony and diplomacy.' :
             lifePath === 3 ? ' creative brilliance and self-expression.' :
             lifePath === 4 ? ' unbreakable stability and architectural mastery.' :
             lifePath === 5 ? ' absolute freedom and dynamic adventure.' :
             lifePath === 6 ? ' cosmic responsibility and nurturing wisdom.' :
             lifePath === 7 ? ' esoteric spirituality and deep introspection.' :
             lifePath === 8 ? ' infinite power and material manifestation.' :
             ' universal love and spiritual completion.'}
          </p>
          <div className="flex flex-wrap gap-2 pt-4">
             {['Pythagorean Grid', 'Chaldean Resonance', 'Active Frequency'].map(tag => (
               <span key={tag} className="text-[10px] uppercase font-bold tracking-widest bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-muted-foreground hover:text-primary hover:border-primary/30 transition-all cursor-default">
                 {tag}
               </span>
             ))}
          </div>
        </div>
      </Card>
    </div>
  );
}