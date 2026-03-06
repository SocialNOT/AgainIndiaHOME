"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function UserBirthModal({ isOpen, onComplete }: { isOpen: boolean, onComplete: (data: any) => void }) {
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
    <Dialog open={isOpen}>
      <DialogContent className="glass-morphism border-white/20 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-accent">Initiate Synchro</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your earthly coordinates to synchronize with the universal mathematics.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="bg-white/5 border-white/10" 
              placeholder="e.g. Arjuna Singh" 
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Birth Date</Label>
              <Input 
                id="date" 
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                className="bg-white/5 border-white/10" 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Birth Time</Label>
              <Input 
                id="time" 
                type="time"
                value={formData.birthTime}
                onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
                className="bg-white/5 border-white/10" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="place">Birth Place</Label>
            <Input 
              id="place" 
              value={formData.birthPlace}
              onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}
              className="bg-white/5 border-white/10" 
              placeholder="City, Country" 
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-accent text-background hover:bg-accent/90 font-bold h-12 rounded-xl neon-border transition-all"
          >
            Sychronize Vibration
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}