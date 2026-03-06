
"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Mic, Orbit, Zap, Star, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { directSankhyaQuery } from '@/ai/flows/direct-sankhya-query-flow';
import { getTranslation } from '@/lib/translations';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const chatStarters = [
  "What is my karmic lesson today?",
  "Analyze my spatial Vastu resonance.",
  "How does my Life Path impact my career?",
  "Recommend a ritual for creative block.",
  "What do my palm lines say about my health?",
];

export function QueryInterface({ userProfile, language }: { userProfile: any, language: string }) {
  const t = (key: string) => getTranslation(language, key);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "I am Sankhya. How can the mathematics of the universe serve you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (customMsg?: string) => {
    const userMsg = (customMsg || input).trim();
    if (!userMsg || isLoading) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    
    try {
      const response = await directSankhyaQuery({
        query: userMsg,
        userProfile: JSON.stringify(userProfile),
        currentLatLong: "28.6139, 77.2090",
        planetaryPositions: "Sun in Aries",
        currentTimestamp: new Date().toISOString()
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Alignment blurred. Retrying connection to the matrix..." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-morphism flex flex-col h-[calc(100vh-180px)] max-h-[700px] w-full max-w-4xl mx-auto overflow-hidden border-white/5 relative">
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary animate-spin-very-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-secondary animate-pulse" />
      </div>

      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02] relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group">
            <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Sankhya Oracle</h3>
            <span className="text-[7px] text-primary font-black uppercase tracking-widest flex items-center gap-1">
              <Zap className="w-2 h-2 animate-pulse" /> Resonance Link Active
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
          <span className="text-[7px] font-black uppercase opacity-40">Syncing Matrix...</span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6 relative z-10">
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-4 text-[11px] font-bold leading-relaxed border transition-all ${
                  msg.role === 'user' 
                    ? 'bg-primary border-primary text-background shadow-[0_0_20px_rgba(var(--primary),0.2)]' 
                    : 'bg-white/[0.03] border-white/10 text-foreground'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 opacity-40">
                      <Bot className="w-3 h-3" />
                      <span className="text-[7px] font-black uppercase tracking-widest">Oracle Response</span>
                    </div>
                  )}
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/[0.03] border border-white/10 p-4 flex items-center gap-3">
                <Loader2 className="w-3 h-3 animate-spin text-primary" />
                <span className="text-[9px] font-black uppercase text-primary tracking-widest">Synthesizing Data...</span>
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} className="h-4" />
        </div>
      </ScrollArea>

      <div className="p-6 bg-background border-t border-white/5 space-y-4 relative z-10">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {chatStarters.map((starter, i) => (
            <button
              key={i}
              onClick={() => handleSend(starter)}
              className="px-4 py-2 bg-white/[0.03] border border-white/10 text-[8px] font-black uppercase whitespace-nowrap hover:border-primary/50 hover:bg-white/[0.06] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-2.5 h-2.5 text-primary" />
              {starter}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Query the cosmic matrix..."
            className="flex-1 bg-white/[0.03] border-white/10 h-12 text-xs px-6 focus:ring-primary/20"
          />
          <Button 
            onClick={() => handleSend()} 
            disabled={isLoading || !input.trim()}
            className="bg-primary text-background h-12 px-8 font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform"
          >
            Initiate
          </Button>
        </div>
      </div>
    </Card>
  );
}
