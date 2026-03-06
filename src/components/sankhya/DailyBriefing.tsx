"use client"

import React from 'react';
import { Sparkles, Calendar, MapPin } from 'lucide-react';
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
        <h2 className="font-headline text-3xl font-bold text-accent flex items-center gap-3">
          <Sparkles className="text-primary animate-pulse" />
          Morning Frequency
        </h2>
        <div className="text-sm text-muted-foreground flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>

      <Card className="glass-morphism overflow-hidden border-none">
        <CardContent className="p-8 space-y-8">
          <div className="space-y-4">
            <p className="text-xl leading-relaxed font-light italic text-foreground/90 first-letter:text-4xl first-letter:font-headline first-letter:text-accent">
              {data.dailyInsight}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20">
              <h3 className="text-accent font-semibold mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                Daily Theme
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {data.dailyTheme}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/20 border border-white/5">
              <h3 className="text-primary font-semibold mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Energetic Alignment
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {data.energeticAlignment}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-headline font-medium text-accent">Micro-Rituals for Today</h3>
            <div className="flex flex-wrap gap-3">
              {data.microRituals.map((ritual, i) => (
                <div 
                  key={i}
                  className="px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-sm text-accent-foreground flex items-center gap-2 hover:bg-accent/20 transition-colors"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {ritual}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}