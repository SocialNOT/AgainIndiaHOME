"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Music, Palette, Footprints, Loader2, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { generateMicroRitual, GenerateMicroRitualOutput } from '@/ai/flows/generate-micro-ritual-flow';

export function RitualGenerator({ userProfile }: { userProfile: any }) {
  const [imbalance, setImbalance] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ritual, setRitual] = useState<GenerateMicroRitualOutput | null>(null);

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
        <p className="text-muted-foreground max-w-lg mx-auto font-light leading-relaxed">
          Identify energetic friction and receive personalized micro-rituals to restore your universal balance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start px-4">
        <Card className="glass-morphism p-8 space-y-6 border-white/10 rounded-[2.5rem] random-stack-1 group hover:border-primary/20 transition-all">
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary flex items-center gap-2">
              <Zap className="w-4 h-4" /> State of Resonance
            </h3>
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest">Describe what feels blocked or where you seek growth.</p>
          </div>
          <Textarea 
            placeholder="e.g., I feel scattered at work, or my creative energy is low lately..."
            value={imbalance}
            onChange={(e) => setImbalance(e.target.value)}
            className="min-h-[160px] bg-white/5 border-white/10 focus:ring-primary/40 rounded-3xl resize-none text-sm leading-relaxed p-6"
          />
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !imbalance.trim()}
            className="w-full h-16 rounded-3xl bg-primary hover:bg-primary/90 text-background font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(255,153,51,0.2)] hover:scale-[1.02] transition-all"
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
              <Card className="glass-morphism p-8 border-secondary/20 relative overflow-hidden rounded-[2.5rem] group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-500">
                  <Sparkles className="w-16 h-16 text-secondary" />
                </div>
                
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-[1.5rem] bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                      <Palette className="w-5 h-5 text-primary mb-3" />
                      <h4 className="text-[9px] uppercase font-black text-muted-foreground tracking-widest mb-1">Vibration Color</h4>
                      <p className="text-sm font-bold text-foreground">{ritual.colorRecommendation}</p>
                    </div>
                    <div className="p-5 rounded-[1.5rem] bg-secondary/5 border border-secondary/10 hover:bg-secondary/10 transition-colors">
                      <Music className="w-5 h-5 text-secondary mb-3" />
                      <h4 className="text-[9px] uppercase font-black text-muted-foreground tracking-widest mb-1">Resonance Sound</h4>
                      <p className="text-sm font-bold text-foreground">{ritual.musicRecommendation}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                      <Footprints className="w-4 h-4" /> Ritual Actions
                    </h4>
                    <ul className="space-y-3">
                      {ritual.ritualActions.map((action, i) => (
                        <motion.li 
                          key={i} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex gap-4 items-start text-sm text-muted-foreground group/li"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0 group-hover/li:scale-150 transition-transform" />
                          <span className="group-hover/li:text-foreground transition-colors">{action}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <h4 className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-3">Rationale</h4>
                    <p className="text-[13px] italic text-muted-foreground leading-relaxed font-light">
                      {ritual.rationale}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-16 border-2 border-dashed border-white/5 rounded-[3rem] opacity-40 random-stack-3">
              <div className="relative mb-6">
                <ShieldCheck className="w-20 h-20 text-white/10 pulse-glow" />
                <div className="absolute inset-0 sacred-grid opacity-20" />
              </div>
              <p className="text-sm text-muted-foreground font-light tracking-wide uppercase">Identify your imbalance to reveal your sacred remedy.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}