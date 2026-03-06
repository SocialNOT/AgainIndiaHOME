"use client"

import React from 'react';
import { 
  MessageSquare, 
  Calculator, 
  Compass, 
  Scan, 
  ShieldCheck,
  Home
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
    <nav className="fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
      <div className="glass-morphism rounded-[2rem] p-1.5 sm:p-2 flex items-center gap-1 sm:gap-2 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] pointer-events-auto max-w-[95vw] overflow-x-auto no-scrollbar">
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
                      "relative flex flex-col items-center justify-center min-w-[3rem] sm:w-14 sm:h-14 w-12 h-12 rounded-2xl transition-all duration-300",
                      isActive 
                        ? "bg-accent text-background scale-105 sm:scale-110 shadow-[0_0_20px_rgba(133,230,255,0.3)]" 
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute -bottom-1 w-1 h-1 bg-background rounded-full" 
                      />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-background/90 text-foreground border-white/10 hidden sm:block">
                  <p className="text-xs font-medium">{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </nav>
  );
}
