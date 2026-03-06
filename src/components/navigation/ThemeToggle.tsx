"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { SwatchBook, Sparkles } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const themes = [
  { id: 'cyber', name: 'Cyber Loom', color: 'bg-[#ff9933]' },
  { id: 'alchemist', name: 'Solar Alchemist', color: 'bg-[#FFD700]' },
  { id: 'monsoon', name: 'Astral Monsoon', color: 'bg-[#00FFFF]' },
  { id: 'lotus', name: 'Lotus Dawn', color: 'bg-[#FF69B4]' },
  { id: 'twilight', name: 'Benares Twilight', color: 'bg-[#FF4500]' },
  { id: 'indus', name: 'Indus Grid', color: 'bg-[#708090]' },
  { id: 'darbar', name: 'Royal Darbar', color: 'bg-[#800000]' },
];

export function ThemeToggle({ currentTheme, onThemeChange }: { currentTheme: string, onThemeChange: (id: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 px-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 gap-2">
          <SwatchBook className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">Style Grid</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-morphism border-white/10 w-48 p-2">
        {themes.map((theme) => (
          <DropdownMenuItem 
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg p-2 group"
          >
            <div className={`w-3 h-3 rounded-full ${theme.color} group-hover:scale-125 transition-transform`} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${currentTheme === theme.id ? 'text-primary' : 'text-foreground'}`}>
              {theme.name}
            </span>
            {currentTheme === theme.id && <Sparkles className="w-3 h-3 text-primary ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
