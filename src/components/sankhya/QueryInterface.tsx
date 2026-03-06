
"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Mic, Sparkles, Orbit, Zap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { directSankhyaQuery } from '@/ai/flows/direct-sankhya-query-flow';
import { getTranslation } from '@/lib/translations';
import { Progress } from '@/components/ui/progress';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const chatStarters = [
  "What is my karmic lesson today?",
  "Analyze my spatial Vastu resonance.",
  "How does my Life Path impact my career?",
  "Recommend a ritual for creative block.",
  "What do my palm lines say about my health?"
];

export function QueryInterface({ userProfile, language }: { userProfile: any, language: string }) {
  const t = (key: string) => getTranslation(language, key);
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: language === 'bn' ? "আমি সাংখ্য। আজ মহাবিশ্বের গণিত আপনার জন্য কীভাবে সাহায্য করতে পারে?" : "I am Sankhya. How can the mathematics of the universe serve you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncLevel, setSyncLevel] = useState(65);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (containerRef.current) {
      window.scrollTo({ top: containerRef.current.offsetTop - 100, behavior: 'smooth' });
    }
  }, []);

  const handleSend = async (customMsg?: string) => {
    const userMsg = (customMsg || input).trim();
    if (!userMsg || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    setSyncLevel(prev => Math.min(prev + 5, 100));

    try {
      const response = await directSankhyaQuery({
        query: userMsg,
        userProfile: JSON.stringify(userProfile),
        currentLatLong: "28.6139, 77.2090",
        planetaryPositions: "Sun in Aries, Moon in Cancer",
        currentTimestamp: new Date().toISOString()
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "The cosmic alignment is temporarily blurred. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card ref={containerRef} className="glass-morphism border-none h-[750px] flex flex-col max-w-4xl mx-auto w-full rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(var(--primary),0.1)] relative">
      <div className="absolute inset-0 sacred-grid opacity-10 pointer-events-none" />
      
      {/* Dynamic Header */}
      <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5 relative z-10">
        <div className="flex items-center gap-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary via-accent to-secondary p-[2px] shadow-[0_0_40px_rgba(var(--primary),0.3)]"
          >
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <Bot className="w-8 h-8 text-primary" />
            </div>
          </motion.div>
          <div>
            <h3 className="font-headline text-2xl font-bold text-foreground uppercase tracking-tighter">
              Sankhya <span className="text-primary neon-glow">Oracle</span>
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Zap className="w-3 h-3 animate-pulse" /> Channel Active
              </span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-[10px] text-accent font-black uppercase tracking-[0.2em]">Universal Core v2.5</span>
            </div>
          </div>
        </div>

        {/* Resonance Meter (Gamification) */}
        <div className="hidden sm:flex flex-col items-end gap-2 w-48">
          <div className="flex items-center justify-between w-full text-[9px] font-black uppercase tracking-widest text-foreground/60">
            <span>Sync Resonance</span>
            <span className="text-primary">{syncLevel}%</span>
          </div>
          <Progress value={syncLevel} className="h-1.5 bg-white/10" />
        </div>
      </div>

      <ScrollArea className="flex-1 p-8 relative z-10">
        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.9, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                transition={{ type: "spring", damping: 15 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`relative max-w-[85%] p-6 rounded-[2.5rem] text-sm font-bold leading-relaxed shadow-2xl backdrop-blur-xl transition-all ${
                  msg.role === 'user' 
                    ? 'bg-primary/20 border border-primary/30 text-foreground rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-foreground/90 rounded-tl-none'
                }`}>
                  {msg.role === 'assistant' && <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-background border border-white/10 flex items-center justify-center text-primary shadow-xl"><Orbit className="w-4 h-4" /></div>}
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] rounded-tl-none flex items-center gap-4">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(d => (
                    <motion.div key={d} animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }} className="w-2 h-2 rounded-full bg-primary" />
                  ))}
                </div>
                <span className="text-[10px] text-primary font-black uppercase tracking-widest">{t('loading_sankhya')}</span>
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-8 bg-black/20 border-t border-white/10 space-y-6 relative z-10">
        {/* Cometary Starters */}
        <div className="flex flex-wrap gap-3 pb-2 overflow-x-auto no-scrollbar">
          {chatStarters.map((starter, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(var(--primary), 0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSend(starter)}
              disabled={isLoading}
              className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary hover:border-primary/40 transition-all whitespace-nowrap flex items-center gap-2 group"
            >
              <Star className="w-3 h-3 group-hover:fill-primary transition-all" />
              {starter}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-4 items-center bg-white/5 p-3 rounded-[2.5rem] border border-white/10 shadow-inner group focus-within:border-primary/40 transition-all">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 w-14 h-14 group">
            <Mic className="w-7 h-7 text-primary/60 group-hover:text-primary transition-all" />
          </Button>
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('ask_anything')}
            className="flex-1 bg-transparent border-none focus-visible:ring-0 text-base font-bold h-14 placeholder:opacity-30"
          />
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="bg-primary text-background rounded-full hover:bg-primary/90 w-14 h-14 flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.4)] disabled:opacity-30"
          >
            <Send className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </Card>
  );
}
