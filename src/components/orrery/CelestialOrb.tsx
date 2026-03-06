
"use client"

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Target, Star, History, Forward } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const NUMBERS = Array.from({ length: 9 }, (_, i) => i + 1);

interface Particle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  duration: number;
}

interface CelestialOrbProps {
  userProfile?: any;
  lifePath?: number;
  destiny?: number;
}

export function CelestialOrb({ userProfile, lifePath, destiny }: CelestialOrbProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      return mobile;
    };
    
    const mobileStatus = checkMobile();
    window.addEventListener('resize', checkMobile);

    const particleCount = mobileStatus ? 15 : 30;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 600 - 300,
      y: Math.random() * 600 - 300,
      opacity: Math.random(),
      duration: 5 + Math.random() * 5,
    }));
    setParticles(newParticles);

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientY / innerHeight - 0.5) * 40;
      const y = (clientX / innerWidth - 0.5) * 40;
      setRotation({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const orbitRadius = isMobile ? 120 : 180;
  const sphereSize = isMobile ? 'w-32 h-32' : 'w-56 h-56';

  const getNumberMeaning = (num: number) => {
    const meanings: Record<number, string> = {
      1: "The Primal Force: Independence, leadership, and new beginnings. Today, it invites you to initiate action.",
      2: "The All-Knowing: Balance, diplomacy, and sensitivity. Focus on collaboration and harmony.",
      3: "The Creative Child: Self-expression, joy, and social expansion. Your voice is your power.",
      4: "The Architect: Stability, hard work, and discipline. Build your foundations today.",
      5: "The Dynamic Explorer: Freedom, change, and adventure. Expect the unexpected.",
      6: "The Caretaker: Responsibility, love, and community. Nurture your relationships.",
      7: "The Seeker: Analysis, spirituality, and inner wisdom. A day for deep introspection.",
      8: "The Manifestor: Power, abundance, and material success. Your manifestation portal is open.",
      9: "The Humanitarian: Completion, universal love, and spiritual enlightenment. Let go and evolve."
    };
    return meanings[num] || "Universal resonance.";
  };

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] flex items-center justify-center perspective-1000">
      <div className="absolute w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-primary/10 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none opacity-40 animate-pulse" />
      <div className="absolute inset-0 sacred-grid pointer-events-none opacity-20" />

      <motion.div 
        className="relative w-full h-full flex items-center justify-center transform-style-3d"
        animate={{ 
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{ type: 'spring', stiffness: 30, damping: 15 }}
      >
        <div className={`absolute ${sphereSize} bg-gradient-to-tr from-primary via-white to-secondary rounded-full shadow-[0_0_80px_rgba(255,153,51,0.4)] blur-sm opacity-50 pulse-glow`} />
        
        {NUMBERS.map((num, idx) => {
          const isSpecial = num === lifePath || num === destiny;
          return (
            <motion.div
              key={num}
              className="absolute transform-style-3d"
              animate={{
                rotateY: [idx * 40, idx * 40 + 360],
              }}
              transition={{
                duration: 30 + idx * 4,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <motion.div 
                whileHover={{ scale: 1.5 }}
                className="transform-style-3d cursor-pointer group"
                style={{ transform: `translateX(${orbitRadius}px)` }}
                onClick={() => setSelectedNumber(num)}
              >
                <div className={`w-9 h-9 sm:w-12 sm:h-12 glass-morphism rounded-full flex items-center justify-center font-headline text-sm sm:text-xl font-bold border-white/20 group-hover:bg-primary group-hover:text-background transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)] ${isSpecial ? 'border-primary ring-2 ring-primary/40 animate-pulse text-primary' : 'text-white'}`}>
                  {num}
                  {isSpecial && <Star className="w-2 h-2 absolute -top-1 -right-1 text-primary fill-primary" />}
                </div>
              </motion.div>
            </motion.div>
          );
        })}

        <svg className="absolute w-full h-full opacity-20 pointer-events-none overflow-visible">
          <circle cx="50%" cy="50%" r={orbitRadius} fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" className="text-white" />
          <circle cx="50%" cy="50%" r={orbitRadius * 0.7} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 10" className="text-primary" />
        </svg>
      </motion.div>

      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 bg-white/60 rounded-full"
          initial={{ 
            x: p.x, 
            y: p.y,
            opacity: p.opacity
          }}
          animate={{ 
            y: [p.y, p.y - 60, p.y],
            x: [p.x, p.x + 20, p.x],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      <Dialog open={!!selectedNumber} onOpenChange={() => setSelectedNumber(null)}>
        <DialogContent className="glass-morphism border-primary/20 sm:max-w-md rounded-[3rem]">
          {selectedNumber && (
            <>
              <DialogHeader className="space-y-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto border border-primary/20 shadow-2xl">
                  <div className="text-4xl font-headline font-black">{selectedNumber}</div>
                </div>
                <DialogTitle className="font-headline text-3xl font-bold text-center text-primary uppercase tracking-tighter">
                  Vibration {selectedNumber}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                  <h4 className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                    <Target className="w-4 h-4" /> Current Essence
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed font-bold italic">
                    {getNumberMeaning(selectedNumber)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20 flex flex-col items-center">
                    <History className="w-4 h-4 text-secondary mb-2" />
                    <h5 className="text-[9px] font-black uppercase text-secondary tracking-widest">Karmic Mark</h5>
                    <p className="text-xs text-foreground font-black">Active Phase</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 flex flex-col items-center">
                    <Forward className="w-4 h-4 text-accent mb-2" />
                    <h5 className="text-[9px] font-black uppercase text-accent tracking-widest">Future Pulse</h5>
                    <p className="text-xs text-foreground font-black">Incoming Resonance</p>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <h4 className="text-[9px] font-black uppercase text-primary tracking-widest mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Future Shift
                  </h4>
                  <p className="text-[11px] text-foreground font-bold leading-relaxed">
                    This number will cycle back in <span className="text-primary">{selectedNumber * 3} days</span>. Prepare for a surge in <span className="italic">{selectedNumber % 2 === 0 ? 'collaborative' : 'independent'}</span> energy.
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
