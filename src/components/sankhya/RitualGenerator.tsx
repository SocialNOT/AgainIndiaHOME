"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Music, Palette, Footprints, Loader2, Sparkles } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-headline font-bold text-primary flex items-center justify-center gap-3">
          <ShieldCheck className="w-10 h-10" />
          Harmonic Remedies
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Identify energetic friction and receive personalized micro-rituals to restore your balance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="glass-morphism p-8 space-y-6 border-white/10">
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">State of Flow</h3>
            <p className="text-xs text-muted-foreground">Describe what feels blocked or where you seek growth.</p>
          </div>
          <Textarea 
            placeholder="e.g., I feel scattered at work, or my creative energy is low lately..."
            value={imbalance}
            onChange={(e) => setImbalance(e.target.value)}
            className="min-h-[150px] bg-white/5 border-white/10 focus:ring-primary rounded-2xl resize-none"
          />
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !imbalance.trim()}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-background font-bold text-lg neon-border-saffron transition-all"
          >
            {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Sychronize Ritual'}
          </Button>
        </Card>

        <AnimatePresence mode="wait">
          {ritual ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="glass-morphism p-8 border-secondary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-12 h-12 text-secondary" />
                </div>
                
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <Palette className="w-5 h-5 text-primary mb-2" />
                      <h4 className="text-[10px] uppercase font-bold text-muted-foreground">Vibration Color</h4>
                      <p className="text-sm text-foreground">{ritual.colorRecommendation}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <Music className="w-5 h-5 text-secondary mb-2" />
                      <h4 className="text-[10px] uppercase font-bold text-muted-foreground">Resonance Sound</h4>
                      <p className="text-sm text-foreground">{ritual.musicRecommendation}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                      <Footprints className="w-4 h-4" /> Ritual Actions
                    </h4>
                    <ul className="space-y-3">
                      {ritual.ritualActions.map((action, i) => (
                        <li key={i} className="flex gap-3 items-start text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Rationale</h4>
                    <p className="text-xs italic text-muted-foreground leading-relaxed">
                      {ritual.rationale}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-3xl opacity-50">
              <ShieldCheck className="w-16 h-16 mb-4 text-white/20" />
              <p className="text-sm text-muted-foreground">Describe your imbalance to reveal your sacred remedy.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}