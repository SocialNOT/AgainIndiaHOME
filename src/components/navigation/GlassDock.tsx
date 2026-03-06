"use client"

import React from 'react';
import { MessageSquare, Calculator, Compass, Scan, ShieldCheck, Home, Library } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { icon: Home, label: 'CORE', id: 'home' },
  { icon: Library, label: 'VAULT', id: 'vault' },
  { icon: MessageSquare, label: 'ORACLE', id: 'chat' },
  { icon: Calculator, label: 'MATRIX', id: 'calculator' },
  { icon: Compass, label: 'VASTU', id: 'compass' },
  { icon: Scan, label: 'PALM', id: 'palm' },
  { icon: ShieldCheck, label: 'REMEDY', id: 'rituals' },
];

export function GlassDock({ activeTab, onTabChange }: { activeTab: string, onTabChange: (id: string) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
      <div className="w-full max-w-4xl bg-background/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around p-0 pointer-events-auto shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
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
                      "flex flex-col items-center justify-center flex-1 h-14 transition-all duration-300 relative group",
                      isActive ? "bg-primary text-background" : "text-muted-foreground hover:bg-white/5"
                    )}
                  >
                    {isActive && (
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-white/20" />
                    )}
                    <Icon className={cn("w-5 h-5", isActive ? "scale-110" : "scale-100")} />
                    <span className="text-[7px] font-black uppercase mt-1 tracking-widest hidden sm:block">{item.label}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-background text-foreground border-white/10 mb-2 rounded-none">
                  <p className="text-[8px] font-black uppercase tracking-[0.3em]">{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </nav>
  );
}