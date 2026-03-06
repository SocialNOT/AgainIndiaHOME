
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Compass, Wind, Droplets, Flame, Mountain, Info, Target, Sparkles, Zap, Upload, Loader2, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { analyzeVastu, AnalyzeVastuOutput } from '@/ai/flows/analyze-vastu-flow';
import { useUser, useFirestore, FirestorePermissionError, errorEmitter } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const directions = [
  { label: 'North', element: 'Water', icon: Droplets, color: 'text-blue-400', energy: 'Wealth & Career', details: "The North is ruled by Kuber, the God of Wealth. In Vastu, this sector should be kept open and light. Blue colors and water elements here stimulate financial flow." },
  { label: 'East', element: 'Air', icon: Wind, color: 'text-green-400', energy: 'Social Connection', details: "East is the direction of the Sun (Surya). It governs health, vitality, and social status. Keeping this sector clean and well-ventilated brings enlightenment and status." },
  { label: 'South', element: 'Fire', icon: Flame, color: 'text-orange-400', energy: 'Name & Fame', details: "The South is ruled by Yama. It requires heavy stability. Using shades of red or orange here boosts your reputation and provides unshakeable strength in career." },
  { label: 'West', element: 'Earth', icon: Mountain, color: 'text-amber-600', energy: 'Creativity', details: "West is governed by Varuna. It represents expansion and creative output. Earthy tones and heavy furniture here help ground your ideas and ensure fulfillment." },
  { label: 'NE', element: 'Spirit', icon: Compass, color: 'text-primary', energy: 'Knowledge', details: "Northeast (Ishanya) is the most sacred zone. It is the convergence of high cosmic frequencies. Ideal for meditation, altars, or deep study. Keep it clutter-free." },
  { label: 'SE', element: 'Fire/Cash', icon: Flame, color: 'text-red-400', energy: 'Finance', details: "Southeast (Agneya) is the Fire sector. In modern life, it governs liquid cash. Avoid water elements here. Ideal for kitchens or electronic equipment." },
  { label: 'SW', element: 'Earth/Stability', icon: Mountain, color: 'text-yellow-600', energy: 'Relationships', details: "Southwest (Nairutya) governs the stability of the home. It is the master bedroom quadrant. Heavy objects and yellow tones here strengthen family bonds." },
  { label: 'NW', element: 'Air/Support', icon: Wind, color: 'text-secondary', energy: 'Helpful People', details: "Northwest (Vayavya) governs travel and support systems. If you seek mentors or global opportunities, ensure this sector has movement (fans, clocks)." },
];

export function VastuCompass() {
  const { user } = useUser();
  const db = useFirestore();
  const [rotation, setRotation] = useState(0);
  const [selectedDir, setSelectedDir] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [vastuResult, setVastuResult] = useState<AnalyzeVastuOutput | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if ((e as any).webkitCompassHeading) {
        setRotation((e as any).webkitCompassHeading);
      } else if (e.alpha) {
        setRotation(e.alpha);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUri = reader.result as string;
        setIsAnalyzing(true);
        try {
          const result = await analyzeVastu({ 
            photoDataUri: dataUri,
            roomType: 'Space'
          });
          setVastuResult(result);
          setIsAnalysisModalOpen(true);

          const analysisRef = collection(db, 'users', user.uid, 'history');
          const analysisData = {
            type: 'vastu',
            content: result.analysis,
            remedies: result.remedies,
            balance: result.elementalBalance,
            timestamp: serverTimestamp(),
            photoUrl: dataUri.slice(0, 1000) // Storing a snippet for reference if too large
          };

          addDoc(analysisRef, analysisData).catch(async () => {
            const permissionError = new FirestorePermissionError({
              path: analysisRef.path,
              operation: 'create',
              requestResourceData: analysisData
            });
            errorEmitter.emit('permission-error', permissionError);
          });

        } catch (error) {
          console.error("Vastu analysis error:", error);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-headline font-bold text-primary uppercase tracking-tighter">Vastu Resonance</h2>
        <p className="text-foreground font-black uppercase text-[10px] tracking-widest opacity-80">Align your physical space with the primordial elements of India.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4">
        <div className="relative flex flex-col items-center justify-center py-10">
          <motion.div 
            className="w-72 h-72 sm:w-96 sm:h-96 rounded-full glass-morphism border-primary/20 flex items-center justify-center relative shadow-[0_0_100px_rgba(var(--primary),0.1)] mb-8"
            style={{ rotate: -rotation }}
          >
            {directions.map((dir, i) => (
              <div 
                key={dir.label}
                className="absolute text-[9px] font-black text-foreground/70 uppercase tracking-widest"
                style={{ transform: `rotate(${i * 45}deg) translateY(-140px)` }}
              >
                {dir.label}
              </div>
            ))}
            
            <div className="w-1 h-40 bg-gradient-to-t from-primary to-transparent rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full" />
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 pulse-glow">
              <Compass className="w-10 h-10 text-primary" />
            </div>
            <div className="absolute inset-0 sacred-grid opacity-10 rounded-full overflow-hidden" />
          </motion.div>

          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="w-full max-w-sm h-14 rounded-none bg-primary hover:bg-primary/90 text-background font-black uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(var(--primary),0.3)] transition-all"
          >
            {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-5 h-5 mr-3" />}
            {isAnalyzing ? 'Analyzing Spatial Grid...' : 'Upload Floor Plan / Room'}
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload} 
          />
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Elemental Insights
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {directions.map((dir) => (
              <Card 
                key={dir.label} 
                onClick={() => setSelectedDir(dir)}
                className="glass-morphism p-4 border-white/5 hover:border-primary/40 hover:scale-105 transition-all cursor-pointer group shadow-xl rounded-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-none bg-white/5 ${dir.color} group-hover:scale-110 group-hover:bg-primary group-hover:text-background transition-all`}>
                    <dir.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">{dir.label}</h4>
                    <p className="text-[9px] text-foreground/60 group-hover:text-foreground font-bold transition-colors">{dir.energy}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="p-6 rounded-none bg-white/5 border border-white/10 flex gap-4 hover:bg-white/10 transition-all group">
            <Info className="w-6 h-6 text-primary shrink-0 group-hover:rotate-12 transition-transform" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-foreground font-black leading-relaxed">
              Vastu Shastra is the ancient science of spatial arrangement. Upload a photo or tap any sector to reveal optimization secrets.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedDir} onOpenChange={() => setSelectedDir(null)}>
        <DialogContent className="glass-morphism border-primary/20 sm:max-w-md rounded-none max-h-[90vh] overflow-y-auto no-scrollbar bg-background/95 backdrop-blur-3xl">
          {selectedDir && (
            <>
              <DialogHeader className="space-y-4">
                <div className={`w-20 h-20 rounded-none bg-white/5 flex items-center justify-center ${selectedDir.color} mx-auto border border-white/10 shadow-2xl`}>
                  <selectedDir.icon className="w-10 h-10" />
                </div>
                <DialogTitle className="font-headline text-3xl font-bold text-center text-primary uppercase tracking-tighter">
                  {selectedDir.label} Optimization
                </DialogTitle>
                <DialogDescription className="text-center text-foreground font-black uppercase tracking-widest text-[10px] opacity-80">
                  Element: {selectedDir.element} • Energy: {selectedDir.energy}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <div className="bg-white/5 p-6 rounded-none border border-white/10">
                  <h4 className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mb-3">
                    <Zap className="w-4 h-4" /> Spatial Wisdom
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed font-bold italic">
                    {selectedDir.details}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="p-4 rounded-none bg-secondary/10 border border-secondary/20 flex items-center gap-3">
                    <Target className="w-5 h-5 text-secondary" />
                    <div>
                      <h5 className="text-[9px] font-black uppercase text-secondary tracking-widest">Actionable Remedy</h5>
                      <p className="text-xs text-foreground font-bold">Place a small {selectedDir.element.toLowerCase()} representation here.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-none bg-accent/10 border border-accent/20 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <div>
                      <h5 className="text-[9px] font-black uppercase text-accent tracking-widest">Resonance Boost</h5>
                      <p className="text-xs text-foreground font-bold">Avoid clutter to let the {selectedDir.energy} frequency flow.</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAnalysisModalOpen} onOpenChange={setIsAnalysisModalOpen}>
        <DialogContent className="glass-morphism border-primary/20 sm:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-none bg-background/95 backdrop-blur-3xl">
          {vastuResult && (
            <>
              <DialogHeader className="space-y-4">
                <div className="w-20 h-20 rounded-none bg-primary/10 flex items-center justify-center text-primary mx-auto border border-primary/20 shadow-2xl">
                  <Zap className="w-10 h-10" />
                </div>
                <DialogTitle className="font-headline text-3xl font-bold text-center text-primary uppercase tracking-tighter">
                  Spatial Analysis
                </DialogTitle>
                <DialogDescription className="text-center text-foreground font-black uppercase tracking-widest text-[10px] opacity-80">
                  Sankhya Spatial Diagnostic
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-8 pt-6">
                <section className="space-y-4">
                  <h4 className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm">
                    <Info className="w-4 h-4" /> Vastu Evaluation
                  </h4>
                  <div className="bg-white/5 p-6 rounded-none border border-white/10">
                    <p className="text-sm text-foreground leading-relaxed font-bold italic">
                      {vastuResult.analysis}
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="flex items-center gap-2 text-secondary font-black uppercase tracking-widest text-sm">
                    <Sparkles className="w-4 h-4" /> Actionable Remedies
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {vastuResult.remedies.map((remedy, i) => (
                      <div key={i} className="bg-white/5 p-4 rounded-none border border-white/5 flex gap-4 items-center">
                        <div className="w-8 h-8 rounded-none bg-secondary/20 flex items-center justify-center text-secondary font-black shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-xs text-foreground font-bold">{remedy}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <h4 className="flex items-center gap-2 text-accent font-black uppercase tracking-widest text-sm">
                    <Flame className="w-4 h-4" /> Elemental Signature
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/5 p-8 rounded-none border border-white/10">
                    {Object.entries(vastuResult.elementalBalance).map(([element, value]) => (
                      <div key={element} className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-foreground/70">
                          <span>{element}</span>
                          <span className="text-accent">{value}%</span>
                        </div>
                        <Progress value={value} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </section>

                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 pt-6 mt-4 border-t border-white/5">
                  <BookOpen className="w-4 h-4" />
                  Analysis Saved to History
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
