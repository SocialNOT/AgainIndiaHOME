"use client"

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const NUMBERS = Array.from({ length: 9 }, (_, i) => i + 1);

interface Particle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  duration: number;
}

export function CelestialOrb() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

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

  return (
    <div className="relative w-full h-[50vh] sm:h-[70vh] flex items-center justify-center perspective-1000">
      {/* Background Mandala Glow */}
      <div className="absolute w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-primary/10 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none opacity-40 animate-pulse" />
      
      {/* Sacred Geometry Overlay */}
      <div className="absolute inset-0 sacred-grid pointer-events-none opacity-20" />

      {/* Main Orb Container */}
      <motion.div 
        className="relative w-full h-full flex items-center justify-center transform-style-3d"
        animate={{ 
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{ type: 'spring', stiffness: 30, damping: 15 }}
      >
        {/* Glowing Central Sphere (Sankhya Core) */}
        <div className={`absolute ${sphereSize} bg-gradient-to-tr from-primary via-white to-secondary rounded-full shadow-[0_0_80px_rgba(255,153,51,0.4)] blur-sm opacity-50`} />
        
        {/* Orbiting Numbers (The Matrix) */}
        {NUMBERS.map((num, idx) => (
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
            <div 
              className="transform-style-3d cursor-pointer group"
              style={{ transform: `translateX(${orbitRadius}px)` }}
            >
              <div className="w-9 h-9 sm:w-12 sm:h-12 glass-morphism rounded-full flex items-center justify-center font-headline text-sm sm:text-xl font-bold text-white border-white/20 group-hover:scale-150 group-hover:bg-primary group-hover:text-background transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                {num}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Constellation Lines / Sri Yantra Hints */}
        <svg className="absolute w-full h-full opacity-20 pointer-events-none overflow-visible">
          <circle cx="50%" cy="50%" r={orbitRadius} fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" className="text-white" />
          <circle cx="50%" cy="50%" r={orbitRadius * 0.7} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 10" className="text-primary" />
          <path d={`M 50% 50% L 50% ${50 - (orbitRadius / 5)}%`} className="text-secondary stroke-[1px]" />
          <polygon points="0,0 10,20 20,0" className="hidden" /> {/* Placeholder for logic-less SVG */}
        </svg>
      </motion.div>

      {/* Floating Vedic Particles */}
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
    </div>
  );
}