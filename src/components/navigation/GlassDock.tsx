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
      <div className="glass-morphism rounded-[2.5rem] p-2 flex items-center gap-2 border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] pointer-events-auto max-w-[95vw] overflow-x-auto no-scrollbar">
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
                      "relative flex flex-col items-center justify-center min-w-[3.25rem] sm:w-16 sm:h-16 w-14 h-14 rounded-[2rem] transition-all duration-500 group",
                      isActive 
                        ? "bg-primary text-background scale-110 shadow-[0_0_25px_hsl(var(--primary)/0.4)]" 
                        : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("w-6 h-6 transition-transform duration-500", isActive && "scale-110")} />
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-2 w-1.5 h-1.5 bg-background rounded-full" 
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
    </nav>
  );
}