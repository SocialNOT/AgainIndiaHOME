
"use client"

import React from 'react';
import { MessageSquare, Calculator, Compass, Scan, ShieldCheck, Home, Heart, Library } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { icon: Home, label: 'Home', id: 'home' },
  { icon: Library, label: 'Vault', id: 'vault' },
  { icon: MessageSquare, label: 'Chat', id: 'chat' },
  { icon: Calculator, label: 'Matrix', id: 'calculator' },
  { icon: Compass, label: 'Vastu', id: 'compass' },
  { icon: Scan, label: 'Palm', id: 'palm' },
  { icon: ShieldCheck, label: 'Rituals', id: 'rituals' },
];

export function GlassDock({ activeTab, onTabChange }: { activeTab: string, onTabChange: (id: string) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center gap-0 pointer-events-none">
      <div className="w-full max-w-3xl bg-background/80 backdrop-blur-md border-t border-white/10 flex items-center justify-around p-1 pointer-events-auto">
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
                      "flex flex-col items-center justify-center w-12 h-12 transition-all group",
                      isActive ? "bg-primary text-background" : "text-muted-foreground hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[7px] font-bold uppercase mt-1 hidden md:block">{item.label}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-background text-foreground border-white/10 mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest">{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
      <div className="w-full bg-background border-t border-white/5 py-1 px-4 flex justify-between items-center pointer-events-auto">
        <span className="text-[8px] font-bold uppercase text-foreground/40 tracking-widest">Sankhya Pro v1.0</span>
        <Heart className="w-3 h-3 text-primary animate-pulse" />
      </div>
    </nav>
  );
}
