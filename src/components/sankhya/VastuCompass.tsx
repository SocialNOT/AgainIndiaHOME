"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, Wind, Droplets, Flame, Mountain, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';

const directions = [
  { label: 'North', element: 'Water', icon: Droplets, color: 'text-blue-400', energy: 'Wealth & Career' },
  { label: 'East', element: 'Air', icon: Wind, color: 'text-green-400', energy: 'Social Connection' },
  { label: 'South', element: 'Fire', icon: Flame, color: 'text-orange-400', energy: 'Name & Fame' },
  { label: 'West', element: 'Earth', icon: Mountain, color: 'text-amber-600', energy: 'Creativity' },
  { label: 'NE', element: 'Spirit', icon: Compass, color: 'text-primary', energy: 'Knowledge' },
  { label: 'SE', element: 'Fire/Cash', icon: Flame, color: 'text-red-400', energy: 'Finance' },
  { label: 'SW', element: 'Earth/Stability', icon: Mountain, color: 'text-yellow-600', energy: 'Relationships' },
  { label: 'NW', element: 'Air/Support', icon: Wind, color: 'text-secondary', energy: 'Helpful People' },
];

export function VastuCompass() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.webkitCompassHeading) {
        setRotation(e.webkitCompassHeading);
      } else if (e.alpha) {
        setRotation(e.alpha);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-headline font-bold text-primary uppercase tracking-tighter">Vastu Resonance</h2>
        <p className="text-muted-foreground font-light">Align your physical space with the primordial elements of India.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4">
        <div className="relative flex items-center justify-center py-10 random-stack-1">
          <motion.div 
            className="w-72 h-72 sm:w-96 sm:h-96 rounded-full glass-morphism border-primary/20 flex items-center justify-center relative shadow-[0_0_100px_rgba(255,153,51,0.1)]"
            style={{ rotate: -rotation }}
          >
            {/* Compass Markings */}
            {directions.map((dir, i) => (
              <div 
                key={dir.label}
                className="absolute text-[9px] font-black text-muted-foreground uppercase tracking-widest"
                style={{ transform: `rotate(${i * 45}deg) translateY(-140px)` }}
              >
                {dir.label}
              </div>
            ))}
            
            <div className="w-1 h-40 bg-gradient-to-t from-primary to-transparent rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full" />
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 pulse-glow">
              <Compass className="w-10 h-10 text-primary" />
            </div>

            {/* Floating particles inside compass */}
            <div className="absolute inset-0 sacred-grid opacity-10 rounded-full overflow-hidden" />
          </motion.div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             <div className="w-80 h-80 sm:w-[420px] sm:h-[420px] border border-white/5 rounded-full animate-spin-very-slow" />
             <div className="w-[450px] h-[450px] border border-white/5 rounded-full hidden sm:block opacity-20" />
          </div>
        </div>

        <div className="space-y-6 random-stack-2">
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" /> Elemental Insights
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {directions.map((dir) => (
              <Card key={dir.label} className="glass-morphism p-4 border-white/5 hover:border-primary/20 hover:scale-105 transition-all group">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-white/5 ${dir.color} group-hover:scale-110 transition-transform`}>
                    <dir.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/80">{dir.label} • {dir.element}</h4>
                    <p className="text-[9px] text-muted-foreground group-hover:text-foreground transition-colors">{dir.energy}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex gap-4 hover:bg-white/10 transition-all group">
            <Info className="w-6 h-6 text-primary shrink-0 group-hover:rotate-12 transition-transform" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold leading-relaxed">
              Vastu Shastra is the ancient science of spatial arrangement. Align your entrance or creative workspace to these sectors to maximize planetary resonance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}