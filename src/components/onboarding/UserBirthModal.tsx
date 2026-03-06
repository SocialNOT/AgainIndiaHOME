
"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Calendar, Clock, User } from 'lucide-react';

export function UserBirthModal({ isOpen, onComplete, onCancel }: { isOpen: boolean, onComplete: (data: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '12:00',
    birthPlace: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="glass-morphism border-primary/20 sm:max-w-[500px] rounded-[3rem] p-8 sm:p-12 overflow-hidden bg-background/95 backdrop-blur-3xl shadow-[0_0_100px_rgba(var(--primary),0.15)]">
        {/* Animated Background Hint */}
        <div className="absolute inset-0 sacred-grid opacity-10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[60px]" />
        
        <DialogHeader className="relative z-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto border border-primary/20 shadow-2xl mb-2">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <DialogTitle className="font-headline text-4xl font-bold text-primary tracking-tighter uppercase">
            Initiate Synchro
          </DialogTitle>
          <DialogDescription className="text-foreground font-bold uppercase tracking-widest text-[10px] opacity-70">
            Map your earthly coordinates into the Sankhya Intelligence Matrix.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-8 pt-8">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 flex items-center gap-2">
              <User className="w-3 h-3" /> Earthly Identity
            </Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary/40 px-6 font-bold text-foreground placeholder:opacity-30" 
              placeholder="Full Name (e.g. Arjuna Singh)" 
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Incarnation Date
              </Label>
              <Input 
                id="date" 
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary/40 px-6 font-bold text-foreground" 
                required
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="time" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 flex items-center gap-2">
                <Clock className="w-3 h-3" /> Temporal Mark
              </Label>
              <Input 
                id="time" 
                type="time"
                value={formData.birthTime}
                onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
                className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary/40 px-6 font-bold text-foreground" 
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="place" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> Spatial Origin
            </Label>
            <Input 
              id="place" 
              value={formData.birthPlace}
              onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}
              className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary/40 px-6 font-bold text-foreground placeholder:opacity-30" 
              placeholder="City, Country" 
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-18 bg-primary hover:bg-primary/90 text-background font-black text-lg uppercase tracking-[0.4em] rounded-[1.5rem] shadow-[0_10px_30px_rgba(var(--primary),0.3)] hover:scale-[1.02] transition-all"
          >
            Synchronize Vibration
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
