"use client"

import React, { useState } from 'react';
import { Sparkles, Calendar, Zap, Target, BookOpen, AlertCircle, ArrowUpRight, ShieldAlert, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { DailySankhyaInsightOutput } from '@/ai/flows/daily-sankhya-insight-flow';
import { getTranslation } from '@/lib/translations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function DailyBriefing({ data, language }: { data: DailySankhyaInsightOutput | null, language: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = (key: string) => getTranslation(language, key);

  if (!data) return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full space-y-4"
      >
        <Card 
          onClick={() => setIsModalOpen(true)}
          className="glass-morphism overflow-hidden border-white/5 cursor-pointer hover:bg-white/10 transition-all duration-300"
        >
          <CardContent className="p-4 sm:p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                {t('daily_briefing_title')}
              </h2>
              <span className="text-[8px] font-bold opacity-50 uppercase tracking-widest">
                {new Date().toLocaleDateString(language, { weekday: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold leading-relaxed text-foreground italic border-l-2 border-primary pl-4 py-1">
                {data.summary}
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-3 space-y-1">
                  <span className="text-[7px] font-black uppercase tracking-widest text-secondary flex items-center gap-1">
                    <ArrowUpRight className="w-2 h-2" /> Opportunity
                  </span>
                  <p className="text-[9px] font-bold text-foreground line-clamp-2">{data.opportunities[0]}</p>
                </div>
                <div className="bg-white/5 p-3 space-y-1">
                  <span className="text-[7px] font-black uppercase tracking-widest text-destructive flex items-center gap-1">
                    <ShieldAlert className="w-2 h-2" /> Avoid
                  </span>
                  <p className="text-[9px] font-bold text-foreground line-clamp-2">{data.thingsToAvoid[0]}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-primary/60 pt-2">
              <BookOpen className="w-3 h-3" />
              Full Resonance Deep Dive
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-morphism border-primary/20 sm:max-w-xl max-h-[85vh] overflow-y-auto no-scrollbar rounded-none p-0 bg-background/95 backdrop-blur-xl">
          <div className="p-6 sm:p-10 space-y-8">
            <DialogHeader className="text-left space-y-2">
              <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-primary">
                Daily Oracle Analysis
              </DialogTitle>
              <DialogDescription className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
                Sankhya Intelligence Matrix
              </DialogDescription>
            </DialogHeader>

            <section className="space-y-4">
              <p className="text-lg font-bold leading-relaxed italic text-foreground first-letter:text-4xl first-letter:text-primary">
                {data.dailyInsight}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="bg-white/5 p-6 border border-white/5 space-y-4">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4" /> Opportunities
                </h4>
                <ul className="space-y-2">
                  {data.opportunities.map((item, i) => (
                    <li key={i} className="text-xs font-bold leading-tight flex gap-2">
                      <span className="text-secondary opacity-50">#</span> {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-white/5 p-6 border border-white/5 space-y-4">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-destructive flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Risks to Avoid
                </h4>
                <ul className="space-y-2">
                  {data.thingsToAvoid.map((item, i) => (
                    <li key={i} className="text-xs font-bold leading-tight flex gap-2">
                      <span className="text-destructive opacity-50">!</span> {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="bg-white/5 p-6 border border-white/5 space-y-4">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                <Zap className="w-4 h-4" /> Highlights
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.highlights.map((item, i) => (
                  <li key={i} className="text-[10px] font-bold opacity-80 border-t border-white/10 pt-2">
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-primary/5 p-6 border border-primary/20 space-y-4">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Remedies & Suggestions
              </h4>
              <ul className="space-y-3">
                {data.suggestions.map((item, i) => (
                  <li key={i} className="text-xs font-bold leading-relaxed flex gap-3">
                    <div className="w-1.5 h-1.5 bg-primary shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
