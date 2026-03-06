
"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Mic, Sparkles } from 'lucide-react';
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
  "What do my palm lines say about my health?"
];

export function QueryInterface({ userProfile, language }: { userProfile: any, language: string }) {
  const t = (key: string) => getTranslation(language, key);
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: language === 'bn' ? "আমি সাংখ্য। আজ মহাবিশ্বের গণিত আপনার জন্য কীভাবে সাহায্য করতে পারে?" : "I am Sankhya. How can the mathematics of the universe serve you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Maintain single screen visual on load
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

    try {
      const response = await directSankhyaQuery({
        query: userMsg,
        userProfile: JSON.stringify(userProfile),
        currentLatLong: "28.6139, 77.2090", // Mock Delhi coords
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
    <Card ref={containerRef} className="glass-morphism border-none h-[700px] flex flex-col max-w-3xl mx-auto w-full rounded-[3rem] overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center animate-pulse shadow-xl">
            <Bot className="w-7 h-7 text-background" />
          </div>
          <div>
            <h3 className="font-headline text-xl font-bold text-accent uppercase tracking-tighter">{t('sankhya_speak_title')}</h3>
            <span className="text-[10px] text-green-400 font-black uppercase tracking-widest flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
              {t('active_resonance')}
            </span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-bold leading-relaxed shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-primary text-background rounded-tr-none' 
                  : 'bg-white/5 border border-white/10 text-foreground rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] rounded-tl-none flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{t('loading_sankhya')}</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-white/10 space-y-4">
        {/* Chat Starters */}
        <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar pb-2">
          {chatStarters.map((starter, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              onClick={() => handleSend(starter)}
              disabled={isLoading}
              className="rounded-full bg-white/5 border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-background transition-all whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              {starter}
            </Button>
          ))}
        </div>

        <div className="flex gap-3 bg-white/5 p-2 rounded-[2rem] border border-white/10">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 w-12 h-12">
            <Mic className="w-6 h-6 text-accent" />
          </Button>
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('ask_anything')}
            className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm font-bold h-12"
          />
          <Button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="bg-accent text-background rounded-full hover:bg-accent/90 w-12 h-12 shadow-lg"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
