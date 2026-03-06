"use client"

import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { DailySankhyaInsightOutput } from '@/ai/flows/daily-sankhya-insight-flow';

export function DailyBriefing({ data }: { data: DailySankhyaInsightOutput | null }) {
  if (!data) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between px-4">
        <h2 className="font-headline text-2xl sm:text-3xl font-bold text-accent flex items-center gap-3">
          <Sparkles className="text-primary animate-pulse" />
          Morning Frequency
        </h2>
        <div className="text-[10px] text-muted-foreground flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
          <Calendar className="w-3 h-3" />
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>

      <Card className="glass-morphism overflow-hidden border-none random-stack-1 hover:rotate-0 transition-transform duration-500">
        <CardContent className="p-6 sm:p-10 space-y-8">
          <div className="space-y-4">
            <p className="text-lg sm:text-xl leading-relaxed font-light italic text-foreground/90 first-letter:text-5xl first-letter:font-headline first-letter:text-accent first-letter:float-left first-letter:mr-3">
              {data.dailyInsight}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors group">
              <h3 className="text-primary font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                Daily Theme
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                {data.dailyTheme}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/20 hover:bg-secondary/10 transition-colors group">
              <h3 className="text-secondary font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
                Alignment
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                {data.energeticAlignment}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent/60">Recommended Micro-Rituals</h3>
            <div className="flex flex-wrap gap-2">
              {data.microRituals.map((ritual, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 rounded-xl bg-accent/5 border border-accent/10 text-[11px] font-bold text-accent uppercase tracking-wider flex items-center gap-2 hover:bg-accent/20 hover:border-accent/30 transition-all cursor-default"
                >
                  <Sparkles className="w-3 h-3 text-primary" />
                  {ritual}
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}