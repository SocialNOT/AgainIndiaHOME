"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { directSankhyaQuery } from '@/ai/flows/direct-sankhya-query-flow';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function QueryInterface({ userProfile }: { userProfile: any }) {
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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
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
    <Card className="glass-morphism border-none h-[600px] flex flex-col max-w-2xl mx-auto w-full">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center animate-pulse">
            <Bot className="w-6 h-6 text-background" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-accent">Sankhya Speak</h3>
            <span className="text-[10px] text-green-400 uppercase tracking-widest">Active Resonance</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-white/5 border border-white/10 text-foreground'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span className="text-xs text-muted-foreground italic">Sankhya is reasoning...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
            <Mic className="w-5 h-5 text-accent" />
          </Button>
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="flex-1 bg-white/5 border-white/10 focus-visible:ring-accent"
          />
          <Button 
            onClick={handleSend}
            disabled={isLoading}
            size="icon" 
            className="bg-accent text-background rounded-full hover:bg-accent/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}