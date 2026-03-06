
"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Languages, Globe, Sparkles } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const languages = [
  // International
  { id: 'en', name: 'English', code: 'EN', type: 'international' },
  { id: 'es', name: 'Español', code: 'ES', type: 'international' },
  { id: 'fr', name: 'Français', code: 'FR', type: 'international' },
  { id: 'de', name: 'Deutsch', code: 'DE', type: 'international' },
  { id: 'ja', name: '日本語', code: 'JA', type: 'international' },
  // Indian
  { id: 'hi', name: 'हिन्दी', code: 'HI', type: 'indian' },
  { id: 'bn', name: 'বাংলা', code: 'BN', type: 'indian' },
  { id: 'mr', name: 'मराठी', code: 'MR', type: 'indian' },
  { id: 'te', name: 'తెలుగు', code: 'TE', type: 'indian' },
  { id: 'ta', name: 'தமிழ்', code: 'TA', type: 'indian' },
  { id: 'gu', name: 'ગુજરાતી', code: 'GU', type: 'indian' },
  { id: 'ur', name: 'اردو', code: 'UR', type: 'indian' },
  { id: 'kn', name: 'ಕನ್ನಡ', code: 'KN', type: 'indian' },
  { id: 'or', name: 'ଓଡ଼ିଆ', code: 'OR', type: 'indian' },
  { id: 'ml', name: 'മലയാളം', code: 'ML', type: 'indian' },
];

export function LanguageSelector({ currentLang, onLangChange }: { currentLang: string, onLangChange: (id: string) => void }) {
  const selectedLang = languages.find(l => l.id === currentLang) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 px-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 gap-2">
          <Languages className="w-4 h-4 text-secondary" />
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">
            {selectedLang.code}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-morphism border-white/10 w-64 p-0 rounded-2xl overflow-hidden">
        <DropdownMenuLabel className="p-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60">
          <Globe className="w-3 h-3 text-secondary" />
          Select Resonance
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/5" />
        <ScrollArea className="h-[350px]">
          <div className="p-2 space-y-4">
            <div>
              <p className="px-2 pb-2 text-[8px] font-black uppercase tracking-[0.2em] text-secondary/60">International</p>
              {languages.filter(l => l.type === 'international').map((lang) => (
                <DropdownMenuItem 
                  key={lang.id}
                  onClick={() => onLangChange(lang.id)}
                  className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-xl p-3 group transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-black text-[10px] text-foreground group-hover:bg-secondary group-hover:text-background transition-colors border border-white/5">
                    {lang.code}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${currentLang === lang.id ? 'text-secondary' : 'text-foreground'}`}>
                    {lang.name}
                  </span>
                  {currentLang === lang.id && <Sparkles className="w-3 h-3 text-secondary ml-auto" />}
                </DropdownMenuItem>
              ))}
            </div>

            <DropdownMenuSeparator className="bg-white/5" />

            <div>
              <p className="px-2 pb-2 text-[8px] font-black uppercase tracking-[0.2em] text-primary/60">Indian Regional</p>
              {languages.filter(l => l.type === 'indian').map((lang) => (
                <DropdownMenuItem 
                  key={lang.id}
                  onClick={() => onLangChange(lang.id)}
                  className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-xl p-3 group transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-black text-[10px] text-foreground group-hover:bg-primary group-hover:text-background transition-colors border border-white/5">
                    {lang.code}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${currentLang === lang.id ? 'text-primary' : 'text-foreground'}`}>
                    {lang.name}
                  </span>
                  {currentLang === lang.id && <Sparkles className="w-3 h-3 text-primary ml-auto" />}
                </DropdownMenuItem>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
