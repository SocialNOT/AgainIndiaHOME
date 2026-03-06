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

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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

    const particleCount = mobileStatus ? 10 : 25;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 400 - 200,
      y: Math.random() * 400 - 200,
      opacity: Math.random(),
      duration: 3 + Math.random() * 4,
    }));
    setParticles(newParticles);

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientY / innerHeight - 0.5) * 30;
      const y = (clientX / innerWidth - 0.5) * 30;
      setRotation({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const orbitRadius = isMobile ? 100 : 160;
  const sphereSize = isMobile ? 'w-24 h-24' : 'w-48 h-48';

  const getNumberMeaning = (num: number) => {
    const meanings: Record<number, string> = {
      1: "The Primal Force: Independence, leadership, and radical initiative.",
      2: "The All-Knowing: Balance, diplomacy, and emotional sensitivity.",
      3: "The Creative Catalyst: Expansion, joy, and the power of expression.",
      4: "The Architect: Order, discipline, and solid foundations.",
      5: "The Dynamic Alchemist: Freedom, adaptability, and sensual exploration.",
      6: "The Cosmic Guardian: Harmony, responsibility, and nurturing love.",
      7: "The Esoteric Seeker: Analysis, introspection, and spiritual depth.",
      8: "The Power Manifestor: Authority, karma, and material success.",
      9: "The Universal Soul: Compassion, completion, and humanitarian vision."
    };
    return meanings[num] || "Universal synchronization frequency.";
  };

  return (
    <div className="relative w-full aspect-square max-w-[400px] flex items-center justify-center perspective-1000 overflow-visible">
      <div className="absolute w-full h-full bg-primary/5 rounded-full blur-[80px] pointer-events-none opacity-40 animate-pulse" />
      
      <motion.div 
        className="relative w-full h-full flex items-center justify-center transform-style-3d"
        animate={{ 
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{ type: 'spring', stiffness: 20, damping: 10 }}
      >
        {/* Core Sphere */}
        <div className={`absolute ${sphereSize} bg-gradient-to-tr from-primary/40 via-white/10 to-secondary/40 rounded-full border border-white/10 shadow-[0_0_50px_rgba(var(--primary),0.2)] backdrop-blur-md pulse-glow`} />
        
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
                duration: 25 + idx * 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <motion.div 
                whileHover={{ scale: 1.4, z: 50 }}
                className="transform-style-3d cursor-pointer group"
                style={{ transform: `translateX(${orbitRadius}px)` }}
                onClick={() => setSelectedNumber(num)}
              >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 glass-morphism border-white/20 flex items-center justify-center font-headline text-sm font-bold group-hover:bg-primary group-hover:text-background transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)] ${isSpecial ? 'border-primary ring-1 ring-primary/40 text-primary' : 'text-foreground/80'}`}>
                  {/* Keep text facing forward even when orbiting */}
                  <motion.span
                    animate={{ rotateY: [-(idx * 40), -(idx * 40 + 360)] }}
                    transition={{
                      duration: 25 + idx * 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {num}
                  </motion.span>
                  {isSpecial && <Star className="w-1.5 h-1.5 absolute -top-1 -right-1 text-primary fill-primary animate-pulse" />}
                </div>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Orbit Rings */}
        <svg className="absolute w-[150%] h-[150%] opacity-10 pointer-events-none overflow-visible">
          <circle cx="50%" cy="50%" r={orbitRadius} fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" className="text-white" />
          <circle cx="50%" cy="50%" r={orbitRadius * 0.7} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 10" className="text-primary" />
        </svg>
      </motion.div>

      {/* Floating Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 bg-white/40"
          initial={{ x: p.x, y: p.y, opacity: p.opacity }}
          animate={{ 
            y: [p.y, p.y - 40, p.y],
            opacity: [0.1, 0.6, 0.1]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      <Dialog open={!!selectedNumber} onOpenChange={() => setSelectedNumber(null)}>
        <DialogContent className="glass-morphism border-primary/20 max-w-sm p-0 overflow-hidden bg-background/95 backdrop-blur-2xl">
          {selectedNumber && (
            <div className="p-8 space-y-6">
              <DialogHeader className="space-y-4">
                <div className="w-20 h-20 rounded-none bg-primary/10 flex items-center justify-center text-primary mx-auto border border-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.2)]">
                  <div className="text-4xl font-headline font-black neon-glow">{selectedNumber}</div>
                </div>
                <DialogTitle className="font-headline text-2xl font-bold text-center text-primary uppercase tracking-tighter">
                  VIBRATION {selectedNumber}
                </DialogTitle>
                <DialogDescription className="text-center text-foreground font-black uppercase tracking-[0.2em] text-[10px] opacity-60">
                  COSMIC ESSENCE PROTOCOL
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="bg-white/5 p-5 border border-white/10 space-y-3">
                  <h4 className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[8px]">
                    <Target className="w-3 h-3" /> RESONANCE ARCHETYPE
                  </h4>
                  <p className="text-xs text-foreground leading-relaxed font-bold italic">
                    "{getNumberMeaning(selectedNumber)}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-4 bg-secondary/10 border border-secondary/20 flex flex-col items-center gap-1">
                    <History className="w-3 h-3 text-secondary" />
                    <h5 className="text-[7px] font-black uppercase text-secondary tracking-widest">KARMIC MARK</h5>
                    <p className="text-[10px] text-foreground font-black">ACTIVE</p>
                  </div>
                  <div className="p-4 bg-accent/10 border border-accent/20 flex flex-col items-center gap-1">
                    <Forward className="w-3 h-3 text-accent" />
                    <h5 className="text-[7px] font-black uppercase text-accent tracking-widest">NEXT PULSE</h5>
                    <p className="text-[10px] text-foreground font-black">INCOMING</p>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 border border-primary/10">
                  <h4 className="text-[7px] font-black uppercase text-primary tracking-widest mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> TEMPORAL SHIFT
                  </h4>
                  <p className="text-[10px] text-foreground font-bold leading-relaxed">
                    This frequency peaks in <span className="text-primary">{selectedNumber * 2} cycles</span>. Prepare for a surge in <span className="italic">{selectedNumber % 2 === 0 ? 'collaborative' : 'creative'}</span> energy.
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}