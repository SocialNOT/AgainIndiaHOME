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

    // Generate random particles only on client to avoid hydration mismatch
    const particleCount = mobileStatus ? 10 : 20;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 600 - 300,
      y: Math.random() * 600 - 300,
      opacity: Math.random(),
      duration: 4 + Math.random() * 4,
    }));
    setParticles(newParticles);

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return; // Disable hover tilt on mobile
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

  const orbitRadius = isMobile ? 120 : 160;
  const sphereSize = isMobile ? 'w-32 h-32' : 'w-48 h-48';

  return (
    <div className="relative w-full h-[40vh] sm:h-[60vh] flex items-center justify-center perspective-1000">
      {/* Background Glow */}
      <div className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
      
      {/* Main Orb Container */}
      <motion.div 
        className="relative w-full h-full flex items-center justify-center transform-style-3d"
        animate={{ 
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{ type: 'spring', stiffness: 40, damping: 20 }}
      >
        {/* Glowing Central Sphere */}
        <div className={`absolute ${sphereSize} bg-gradient-to-tr from-primary to-accent rounded-full shadow-[0_0_50px_rgba(133,230,255,0.3)] blur-sm opacity-60`} />
        
        {/* Orbiting Numbers */}
        {NUMBERS.map((num, idx) => (
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
            <div 
              className="transform-style-3d cursor-pointer group"
              style={{ transform: `translateX(${orbitRadius}px)` }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 glass-morphism rounded-full flex items-center justify-center font-headline text-sm sm:text-lg font-bold text-accent border-accent/20 group-hover:scale-125 group-hover:bg-accent group-hover:text-background transition-all shadow-lg">
                {num}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Constellation Lines */}
        <svg className="absolute w-full h-full opacity-10 pointer-events-none overflow-visible">
          <circle cx="50%" cy="50%" r={orbitRadius} fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" className="text-accent" />
          <circle cx="50%" cy="50%" r={orbitRadius * 0.6} fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 5" className="text-primary" />
        </svg>
      </motion.div>

      {/* Floating Particles - Rendered only after client-side calculation */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 bg-accent/40 rounded-full"
          initial={{ 
            x: p.x, 
            y: p.y,
            opacity: p.opacity
          }}
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.1, 0.6, 0.1]
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