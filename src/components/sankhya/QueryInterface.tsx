"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Mic, Orbit, Zap, Star } from 'lucide-react';
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
  "Today's karmic lesson?",
  "Spatial Vastu check.",
  "Life Path career impact?",
  "Creative block ritual.",
];

export function QueryInterface({ userProfile, language }: { userProfile: any, language: string }) {
  const t = (key: string) => getTranslation(language, key);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "I am Sankhya. How can the universe serve you?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
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
      setMessages(prev => [...prev, { role: 'assistant', content: "Alignment blurred. Try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-morphism flex flex-col h-[calc(100vh-180px)] max-h-[700px] w-full max-w-4xl mx-auto overflow-hidden border-none">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary flex items-center justify-center text-background font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Sankhya Oracle</h3>
            <span className="text-[8px] text-primary font-bold uppercase tracking-widest flex items-center gap-1">
              <Zap className="w-2 h-2" /> Channel Active
            </span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-4 text-xs font-medium leading-relaxed ${
                  msg.role === 'user' ? 'bg-primary text-background' : 'bg-white/5 border border-white/10 text-foreground'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 p-4 flex items-center gap-3">
                <Loader2 className="w-3 h-3 animate-spin text-primary" />
                <span className="text-[9px] font-bold uppercase text-primary">Reasoning...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 bg-background border-t border-white/10 space-y-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {chatStarters.map((starter, i) => (
            <button
              key={i}
              onClick={() => handleSend(starter)}
              className="px-3 py-2 bg-white/5 border border-white/10 text-[8px] font-bold uppercase whitespace-nowrap hover:border-primary/50 transition-colors"
            >
              {starter}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Query the matrix..."
            className="flex-1 bg-white/5 border-white/10 h-10 text-xs px-4"
          />
          <Button 
            onClick={() => handleSend()} 
            disabled={isLoading || !input.trim()}
            className="bg-primary text-background h-10 px-6 font-bold uppercase text-[10px]"
          >
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
}
