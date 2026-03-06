"use client"

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Calendar, Clock, User, LogIn, Loader2, AlertCircle, ChevronRight, ChevronLeft, Target, Zap, Shield } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

export function UserBirthModal({ isOpen, onComplete, onCancel }: { isOpen: boolean, onComplete: (data: any) => void, onCancel: () => void }) {
  const auth = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [authError, setAuthError] = useState<{ code: string; message: string } | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '12:00',
    birthPlace: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.displayName || ''
      }));
    }
  }, [user]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setAuthError(null);
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Auth error:", error);
      setAuthError({
        code: error.code,
        message: error.message
      });
      
      if (error.code === 'auth/unauthorized-domain') {
        toast({
          variant: 'destructive',
          title: 'Unauthorized Domain',
          description: 'This domain needs to be authorized in the Firebase Console.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description: error.message || 'Could not sign in with Google.',
        });
      }
    }
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      handleGoogleLogin();
      return;
    }
    setIsSyncing(true);
    try {
      await onComplete(formData);
    } finally {
      setIsSyncing(false);
    }
  };

  const steps = [
    {
      title: "The Mark of Identity",
      description: "Map your earthly name to the Chaldean frequency.",
      hook: "Your name is more than a label; it is a numerical vibration that dictates how you express your destiny in the physical world.",
      impact: "Calculates Expression & Soul Urge Numbers",
      icon: User,
      fields: (
        <div className="space-y-3">
          <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 flex items-center gap-2">
            Earthly Identity
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
      )
    },
    {
      title: "Celestial Snapshot",
      description: "Define your precise temporal coordinate.",
      hook: "The exact moment of your incarnation acts as a cosmic thumbprint, locking in your Life Path and planetary alignments.",
      impact: "Unlocks Life Path & Jyotish Transits",
      icon: Calendar,
      fields: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 flex items-center gap-2">
              Incarnation Date
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
              Temporal Mark
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
      )
    },
    {
      title: "Spatial Anchor",
      description: "Ground your resonance in geographic reality.",
      hook: "Where you first inhaled determines your geographic frequency, anchoring your Vastu resonance and local solar cycle.",
      impact: "Optimizes Vastu & Local Sunrise Sync",
      icon: MapPin,
      fields: (
        <div className="space-y-3">
          <Label htmlFor="place" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 flex items-center gap-2">
            Spatial Origin
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
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const isUnauthorizedDomain = authError?.code === 'auth/unauthorized-domain';
  const progressValue = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="glass-morphism border-primary/20 w-[95vw] sm:max-w-[550px] rounded-[2.5rem] sm:rounded-[3rem] p-0 overflow-hidden bg-background/95 backdrop-blur-3xl shadow-[0_0_100px_rgba(var(--primary),0.15)] flex flex-col max-h-[90vh]">
        <div className="absolute inset-0 sacred-grid opacity-10 pointer-events-none" />
        
        {/* Progress Bar */}
        <div className="w-full pt-1">
          <Progress value={progressValue} className="h-1 bg-white/5 rounded-none" />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-8 sm:p-12">
          {!user ? (
            <div className="relative z-10 space-y-8">
              <DialogHeader className="text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto border border-primary/20 shadow-2xl mb-2">
                  <Shield className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <DialogTitle className="font-headline text-4xl font-bold text-primary tracking-tighter uppercase">
                  Universal Access
                </DialogTitle>
                <DialogDescription className="text-foreground font-bold uppercase tracking-widest text-[10px] opacity-70">
                  Authorize your earthly identity to access the intelligence matrix.
                </DialogDescription>
              </DialogHeader>

              {isUnauthorizedDomain && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 rounded-2xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="text-xs font-black uppercase tracking-widest">Domain Authorization Required</AlertTitle>
                  <AlertDescription className="text-[10px] font-bold leading-relaxed mt-2">
                    To enable login, please add this domain to your **Firebase Console**:
                    <code className="block mt-2 p-2 bg-black/20 rounded text-[9px] break-all">
                      {typeof window !== 'undefined' ? window.location.hostname : 'current-domain'}
                    </code>
                    <p className="mt-2 opacity-70">Path: Authentication &gt; Settings &gt; Authorized Domains</p>
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleGoogleLogin}
                className="w-full h-18 bg-white text-black hover:bg-white/90 font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] flex items-center justify-center gap-3"
              >
                <LogIn className="w-5 h-5" /> Sign In with Google
              </Button>
              <p className="text-[8px] text-center font-black uppercase opacity-40 tracking-widest">Connect to secure your cosmic profile across devices.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative z-10 space-y-8"
              >
                <DialogHeader className="text-left space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <currentStepData.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60">
                      Phase {currentStep + 1} of {steps.length}
                    </div>
                  </div>
                  <DialogTitle className="font-headline text-3xl font-bold text-foreground tracking-tighter uppercase pt-2">
                    {currentStepData.title}
                  </DialogTitle>
                  <DialogDescription className="text-foreground font-bold uppercase tracking-widest text-[10px] opacity-70 leading-relaxed">
                    {currentStepData.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-3">
                  <p className="text-xs text-foreground/80 font-medium italic leading-relaxed">
                    "{currentStepData.hook}"
                  </p>
                  <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-secondary">
                    <Target className="w-3 h-3" /> {currentStepData.impact}
                  </div>
                </div>

                <div className="py-4">
                  {currentStepData.fields}
                </div>

                <div className="flex gap-4 pt-4">
                  {currentStep > 0 && (
                    <Button 
                      variant="outline"
                      onClick={prevStep}
                      className="h-16 flex-1 rounded-2xl border-white/10 text-foreground font-black text-xs uppercase tracking-widest"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                  )}
                  {currentStep < steps.length - 1 ? (
                    <Button 
                      onClick={nextStep}
                      disabled={
                        (currentStep === 0 && !formData.name) || 
                        (currentStep === 1 && !formData.birthDate)
                      }
                      className="h-16 flex-[2] rounded-2xl bg-primary hover:bg-primary/90 text-background font-black text-xs uppercase tracking-[0.3em] shadow-[0_10px_30px_rgba(var(--primary),0.2)]"
                    >
                      Next Phase <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit}
                      disabled={isSyncing || !formData.birthPlace}
                      className="h-16 flex-[2] rounded-2xl bg-primary hover:bg-primary/90 text-background font-black text-xs uppercase tracking-[0.3em] shadow-[0_10px_30px_rgba(var(--primary),0.2)]"
                    >
                      {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Synchronize Vibration <Zap className="w-4 h-4 ml-2 fill-current" /></>}
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
