
"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Music, Palette, Footprints, Loader2, Sparkles, Zap, Info, Target, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { generateMicroRitual, GenerateMicroRitualOutput } from '@/ai/flows/generate-micro-ritual-flow';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function RitualGenerator({ userProfile }: { userProfile: any }) {
  const [imbalance, setImbalance] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ritual, setRitual] = useState<GenerateMicroRitualOutput | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerate = async () => {
    if (!imbalance.trim()) return;
    setIsGenerating(true);
    try {
      const response = await generateMicroRitual({
        imbalanceDescription: imbalance,
        userProfile: {
          name: userProfile.name,
          birthDate: userProfile.birthDate
        },
        currentLatLong: { lat: 28.6139, long: 77.2090 },
        planetaryPositions: ["Sun in Aries", "Mars in Leo"],
        currentTimestamp: new Date().toISOString()
      });
      setRitual(response);
    } catch (error) {
      console.error("Ritual generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-headline font-bold text-primary flex items-center justify-center gap-3 uppercase tracking-tighter">
          <ShieldCheck className="w-12 h-12" />
          Harmonic Remedies
        </h2>
        <p className="text-foreground font-bold max-w-lg mx-auto leading-relaxed uppercase text-[10px] tracking-widest opacity-80">
          Identify energetic friction and receive personalized micro-rituals to restore your universal balance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start px-4">
        <Card className="glass-morphism p-8 space-y-6 border-white/10 rounded-[2.5rem] random-stack-1 group hover:border-primary/40 transition-all shadow-2xl">
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary flex items-center gap-2">
              <Zap className="w-4 h-4" /> State of Resonance
            </h3>
            <p className="text-[11px] text-foreground font-black uppercase tracking-widest opacity-70">Describe what feels blocked or where you seek growth.</p>
          </div>
          <Textarea 
            placeholder="e.g., I feel scattered at work, or my creative energy is low lately..."
            value={imbalance}
            onChange={(e) => setImbalance(e.target.value)}
            className="min-h-[160px] bg-white/5 border-white/10 focus:ring-primary/40 rounded-3xl resize-none text-sm leading-relaxed p-6 text-foreground font-bold"
          />
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !imbalance.trim()}
            className="w-full h-16 rounded-3xl bg-primary hover:bg-primary/90 text-background font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(var(--primary),0.2)] hover:scale-[1.02] transition-all"
          >
            {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Sychronize Ritual'}
          </Button>
        </Card>

        <AnimatePresence mode="wait">
          {ritual ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6 random-stack-2"
            >
              <Card 
                onClick={() => setIsModalOpen(true)}
                className="glass-morphism p-8 border-secondary/20 relative overflow-hidden rounded-[2.5rem] group cursor-pointer hover:border-secondary/50 shadow-2xl"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-500">
                  <Sparkles className="w-16 h-16 text-secondary" />
                </div>
                
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-[1.5rem] bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                      <Palette className="w-5 h-5 text-primary mb-3" />
                      <h4 className="text-[9px] uppercase font-black text-foreground/60 tracking-widest mb-1">Vibration Color</h4>
                      <p className="text-sm font-bold text-foreground">{ritual.colorRecommendation}</p>
                    </div>
                    <div className="p-5 rounded-[1.5rem] bg-secondary/5 border border-secondary/10 hover:bg-secondary/10 transition-colors">
                      <Music className="w-5 h-5 text-secondary mb-3" />
                      <h4 className="text-[9px] uppercase font-black text-foreground/60 tracking-widest mb-1">Resonance Sound</h4>
                      <p className="text-sm font-bold text-foreground">{ritual.musicRecommendation}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                      <Footprints className="w-4 h-4" /> Ritual Actions
                    </h4>
                    <ul className="space-y-3">
                      {ritual.ritualActions.slice(0, 2).map((action, i) => (
                        <li key={i} className="flex gap-4 items-start text-sm text-foreground font-bold">
                          <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-secondary/60 group-hover:text-secondary transition-colors pt-4 border-t border-white/5">
                    <BookOpen className="w-4 h-4" />
                    Expand Deep Understanding
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-16 border-2 border-dashed border-white/10 rounded-[3rem] opacity-40 random-stack-3">
              <div className="relative mb-6">
                <ShieldCheck className="w-20 h-20 text-white/10 pulse-glow" />
                <div className="absolute inset-0 sacred-grid opacity-20" />
              </div>
              <p className="text-[10px] text-foreground font-black tracking-wide uppercase">Identify your imbalance to reveal your sacred remedy.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-morphism border-secondary/20 sm:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-[3rem]">
          {ritual && (
            <>
              <DialogHeader className="space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary mx-auto border border-secondary/20 shadow-2xl">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <DialogTitle className="font-headline text-3xl font-bold text-center text-secondary uppercase tracking-tighter">
                  Remedy Deep Dive
                </DialogTitle>
                <DialogDescription className="text-center text-foreground font-black uppercase tracking-widest text-[10px] opacity-80">
                  Energetic Harmonization Protocol
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-8 pt-6">
                <section className="space-y-4">
                  <h4 className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm">
                    <Info className="w-4 h-4" /> Rationale & Insights
                  </h4>
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                    <p className="text-foreground leading-relaxed font-bold italic">
                      {ritual.rationale}
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="flex items-center gap-2 text-secondary font-black uppercase tracking-widest text-sm">
                    <Target className="w-4 h-4" /> Action Highlights
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {ritual.ritualActions.map((action, i) => (
                      <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex gap-4 items-center">
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-black shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-sm text-foreground font-bold">{action}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="flex items-center gap-2 text-accent font-black uppercase tracking-widest text-sm">
                    <Music className="w-4 h-4" /> Frequency Synergy
                  </h4>
                  <div className="bg-accent/10 p-6 rounded-3xl border border-accent/20">
                    <p className="text-sm text-foreground font-bold leading-relaxed mb-4">
                      Incorporate the color <span className="text-accent font-black uppercase">{ritual.colorRecommendation}</span> alongside the soundscape of <span className="italic">{ritual.musicRecommendation}</span> for the next 7 cycles.
                    </p>
                    <div className="flex gap-2">
                      <div className="w-full h-2 rounded-full bg-accent/20 overflow-hidden">
                        <motion.div 
                          className="h-full bg-accent"
                          animate={{ width: ["0%", "100%"] }}
                          transition={{ duration: 10, repeat: Infinity }}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
