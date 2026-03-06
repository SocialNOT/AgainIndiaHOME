"use client"

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const NUMBERS = Array.from({ length: 9 }, (_, i) => i + 1);

export function CelestialOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientY / innerHeight - 0.5) * 40;
      const y = (clientX / innerWidth - 0.5) * 40;
      setRotation({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-[60vh] flex items-center justify-center perspective-1000 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Main Orb Container */}
      <motion.div 
        className="relative w-80 h-80 flex items-center justify-center transform-style-3d"
        animate={{ 
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      >
        {/* Glowing Central Sphere */}
        <div className="absolute w-40 h-40 bg-gradient-to-tr from-primary to-accent rounded-full shadow-[0_0_50px_rgba(133,230,255,0.4)] blur-sm opacity-80" />
        
        {/* Orbiting Numbers */}
        {NUMBERS.map((num, idx) => (
          <motion.div
            key={num}
            className="absolute transform-style-3d"
            animate={{
              rotateY: [idx * 40, idx * 40 + 360],
            }}
            transition={{
              duration: 20 + idx * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div 
              className="translate-x-[160px] transform-style-3d cursor-pointer group"
              style={{ transform: `translateX(160px)` }}
            >
              <div className="w-10 h-10 glass-morphism rounded-full flex items-center justify-center font-headline text-lg font-bold text-accent border-accent/30 group-hover:scale-125 group-hover:bg-accent group-hover:text-background transition-all">
                {num}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Constellation Lines */}
        <svg className="absolute w-full h-full opacity-20 pointer-events-none">
          <circle cx="50%" cy="50%" r="160" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" className="text-accent" />
          <circle cx="50%" cy="50%" r="100" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 5" className="text-primary" />
        </svg>
      </motion.div>

      {/* Floating Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent rounded-full"
          initial={{ 
            x: Math.random() * 1000 - 500, 
            y: Math.random() * 1000 - 500,
            opacity: Math.random()
          }}
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}