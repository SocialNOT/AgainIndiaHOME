"use client"

import React from 'react';
import { 
  MessageSquare, 
  Calculator, 
  Compass, 
  Scan, 
  ShieldCheck,
  Home,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { icon: Home, label: 'Oracle', id: 'home' },
  { icon: MessageSquare, label: 'Sankhya Speak', id: 'chat' },
  { icon: Calculator, label: 'Numerology', id: 'calculator' },
  { icon: Compass, label: 'Vastu Compass', id: 'compass' },
  { icon: Scan, label: 'Palm Scanner', id: 'palm' },
  { icon: ShieldCheck, label: 'Remedies', id: 'rituals' },
];

export function GlassDock({ activeTab, onTabChange }: { activeTab: string, onTabChange: (id: string) => void }) {
  return (
    <nav className="fixed bottom-4 left-0 right-0 z-50 px-4 flex flex-col items-center gap-4 pointer-events-none">
      {/* Dock Icons Container */}
      <div className="glass-morphism rounded-[2.2rem] sm:rounded-[2.5rem] p-1.5 sm:p-2 flex items-center justify-center gap-1 sm:gap-2 border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] pointer-events-auto max-w-full sm:max-w-fit overflow-hidden">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      "relative flex flex-col items-center justify-center w-11 h-11 sm:w-16 sm:h-16 rounded-[1.8rem] sm:rounded-[2rem] transition-all duration-500 group",
                      isActive 
                        ? "bg-primary text-background scale-105 sm:scale-110 shadow-[0_0_25px_hsl(var(--primary)/0.4)]" 
                        : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-500", isActive && "scale-110")} />
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-1.5 sm:bottom-2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-background rounded-full" 
                      />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-background/95 text-foreground border-white/10 hidden sm:block">
                  <p className="text-xs font-bold uppercase tracking-widest">{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>

      {/* Sticky Footer Credit */}
      <div className="pointer-events-auto">
        <a 
          href="https://www.eastindiaautomation.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="group inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-background/40 backdrop-blur-xl border border-white/5 hover:border-primary/40 hover:bg-white/5 transition-all duration-500 shadow-2xl"
        >
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-foreground/60 group-hover:text-foreground">
            Made in
          </span>
          <span className="text-base sm:text-lg animate-flag-wave inline-block">🇮🇳</span>
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-foreground/60 group-hover:text-foreground">
            With
          </span>
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-heart-chroma fill-current" />
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-foreground/60 group-hover:text-foreground">
            by
          </span>
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-primary group-hover:neon-glow">
            Rajib Singh
          </span>
        </a>
      </div>
    </nav>
  );
}
