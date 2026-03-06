
"use client"

import React, { useState } from 'react';
import { Sparkles, Calendar, Zap, Target, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { DailySankhyaInsightOutput } from '@/ai/flows/daily-sankhya-insight-flow';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function DailyBriefing({ data }: { data: DailySankhyaInsightOutput | null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!data) return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between px-4">
          <h2 className="font-headline text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
            <Sparkles className="text-primary animate-pulse" />
            Morning Frequency
          </h2>
          <div className="text-[10px] text-foreground font-black flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
            <Calendar className="w-3 h-3" />
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>

        <Card 
          onClick={() => setIsModalOpen(true)}
          className="glass-morphism overflow-hidden border-none cursor-pointer group random-stack-1 hover:rotate-0 transition-all duration-500 hover:shadow-[0_0_50px_rgba(var(--primary),0.2)]"
        >
          <CardContent className="p-6 sm:p-10 space-y-8">
            <div className="space-y-4">
              <p className="text-lg sm:text-2xl leading-relaxed font-bold italic text-foreground first-letter:text-6xl first-letter:font-headline first-letter:text-primary first-letter:float-left first-letter:mr-3">
                {data.dailyInsight}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-[2rem] bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <h3 className="text-primary font-black text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  Daily Theme
                </h3>
                <p className="text-sm text-foreground font-bold leading-relaxed">
                  {data.dailyTheme}
                </p>
              </div>
              <div className="p-6 rounded-[2rem] bg-secondary/10 border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
                <h3 className="text-secondary font-black text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                  Alignment
                </h3>
                <p className="text-sm text-foreground font-bold leading-relaxed">
                  {data.energeticAlignment}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 group-hover:text-primary transition-colors">
              <BookOpen className="w-4 h-4" />
              Tap to Expand Deep Dive
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-morphism border-primary/20 sm:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-[3rem]">
          <DialogHeader className="space-y-4">
            <div className="w-16 h-1 bg-primary/40 rounded-full mx-auto" />
            <DialogTitle className="font-headline text-3xl font-bold text-primary flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8" />
              Cosmic Deep Dive
            </DialogTitle>
            <DialogDescription className="text-center text-foreground font-bold uppercase tracking-widest text-xs">
              Sankhya Intelligence Breakdown
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 pt-6">
            <section className="space-y-4">
              <h4 className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm">
                <Target className="w-4 h-4" /> Highlights
              </h4>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <p className="text-foreground leading-relaxed font-medium">
                  The primary frequency for today is centered on <span className="text-primary font-black">{data.dailyTheme}</span>. Your alignment with {data.energeticAlignment} indicates a high potential for manifestation and spiritual clarity.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h4 className="flex items-center gap-2 text-secondary font-black uppercase tracking-widest text-sm">
                <Zap className="w-4 h-4" /> Key Points
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Planetary Resonance active in solar plexus",
                  "Numerical vibration 99.1 synchronized",
                  "Vastu North-East quadrant optimization recommended",
                  "Mercury transits boosting communication portals"
                ].map((point, i) => (
                  <li key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex gap-3 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                    <span className="text-xs text-foreground font-bold">{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-4">
              <h4 className="flex items-center gap-2 text-accent font-black uppercase tracking-widest text-sm">
                <Sparkles className="w-4 h-4" /> Core Takeaways
              </h4>
              <div className="bg-accent/10 p-6 rounded-3xl border border-accent/20">
                <ul className="space-y-4">
                  {data.microRituals.map((ritual, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-black shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm text-foreground font-bold leading-relaxed">{ritual}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
