
"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ShieldCheck, Calculator, Compass, Scan, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTranslation } from '@/lib/translations';

export function WelcomeHero({ onStart, language }: { onStart: () => void, language: string }) {
  const t = (key: string) => getTranslation(language, key);
  
  const features = [
    { icon: Calculator, label: 'Numerology', color: 'text-primary' },
    { icon: Compass, label: 'Vastu', color: 'text-secondary' },
    { icon: Scan, label: 'Palmistry', color: 'text-accent' },
    { icon: ShieldCheck, label: 'Remedies', color: 'text-primary' },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-12 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-[1px] w-12 bg-primary/40" />
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.5em] text-primary neon-glow">
            Universal Intelligence Core
          </span>
          <div className="h-[1px] w-12 bg-primary/40" />
        </div>
        
        <h1 className="text-4xl sm:text-7xl font-headline font-black tracking-tighter leading-tight text-foreground">
          {t('welcome_title')}
        </h1>
        
        <p className="text-sm sm:text-lg text-foreground font-bold max-w-2xl mx-auto leading-relaxed opacity-80 uppercase tracking-wide">
          {t('welcome_subtitle')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-6 w-full max-w-md"
      >
        <Button 
          onClick={onStart}
          className="group relative h-16 sm:h-20 flex-1 rounded-2xl bg-primary hover:bg-primary/90 text-background font-black text-lg uppercase tracking-widest shadow-[0_0_40px_rgba(var(--primary),0.3)] transition-all hover:scale-105"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <span className="relative z-10 flex items-center gap-3">
            {t('welcome_button')} <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </span>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-12 border-t border-white/5 w-full"
      >
        {features.map((feature, i) => (
          <div key={i} className="flex flex-col items-center gap-3 group cursor-default">
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/40 transition-all ${feature.color}`}>
              <feature.icon className="w-6 h-6 group-hover:scale-125 transition-transform" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60 group-hover:text-foreground">
              {feature.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Decorative Orbs */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />
      </div>
    </div>
  );
}
