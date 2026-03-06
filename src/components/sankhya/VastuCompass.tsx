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
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-headline font-bold text-primary">Vastu Resonance</h2>
        <p className="text-muted-foreground">Align your physical space with the primordial elements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative flex items-center justify-center py-20">
          <motion.div 
            className="w-72 h-72 sm:w-80 sm:h-80 rounded-full glass-morphism border-primary/20 flex items-center justify-center relative"
            style={{ rotate: -rotation }}
          >
            {/* Compass Markings */}
            {directions.map((dir, i) => (
              <div 
                key={dir.label}
                className="absolute text-[10px] font-bold text-muted-foreground"
                style={{ transform: `rotate(${i * 45}deg) translateY(-120px)` }}
              >
                {dir.label}
              </div>
            ))}
            
            <div className="w-1 h-32 bg-gradient-to-t from-primary to-transparent rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full" />
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Compass className="w-8 h-8 text-primary" />
            </div>
          </motion.div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             <div className="w-80 h-80 sm:w-96 sm:h-96 border border-white/5 rounded-full" />
             <div className="w-[400px] h-[400px] border border-white/5 rounded-full hidden sm:block" />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-headline font-bold text-primary">Elemental Insights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {directions.map((dir) => (
              <Card key={dir.label} className="glass-morphism p-4 border-white/5 hover:border-primary/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-white/5 ${dir.color}`}>
                    <dir.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest">{dir.label} • {dir.element}</h4>
                    <p className="text-[10px] text-muted-foreground">{dir.energy}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-4">
            <Info className="w-6 h-6 text-primary shrink-0" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground leading-relaxed">
              Vastu Shastra is the science of spatial arrangement. Align your entrance or workspace to these sectors to maximize planetary resonance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}