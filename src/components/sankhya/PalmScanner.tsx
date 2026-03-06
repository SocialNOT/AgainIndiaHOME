"use client"

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Scan, RefreshCcw, Info, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { interpretPalmLines } from '@/ai/flows/interpret-palm-lines-flow';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function PalmScanner() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();
    
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setPhoto(dataUrl);
      }
    }
  };

  const handleProcess = async () => {
    if (!photo) return;
    setIsProcessing(true);
    try {
      const response = await interpretPalmLines({ photoDataUri: photo });
      setResult(response.interpretation);
    } catch (error) {
      console.error("Processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-headline font-bold text-primary uppercase tracking-tighter">Palm Resonance</h2>
        <p className="text-muted-foreground font-light">Synchronize your palm's geometry with the cosmic data-grid.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start px-4">
        <Card className="glass-morphism overflow-hidden relative border-white/5 rounded-3xl random-stack-1">
          {!photo ? (
            <div className="relative aspect-[3/4] bg-black/40 flex items-center justify-center">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-70"
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-80 border-2 border-primary/40 border-dashed rounded-[4rem] animate-pulse" />
                <div className="absolute inset-0 sacred-grid opacity-20" />
              </div>
              
              <div className="absolute bottom-6 w-full flex justify-center px-6">
                <Button 
                  onClick={capturePhoto} 
                  className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_40px_rgba(255,153,51,0.5)] transition-all"
                  disabled={hasCameraPermission === false}
                >
                  <Camera className="w-8 h-8 text-background" />
                </Button>
              </div>

              {hasCameraPermission === false && (
                <div className="absolute inset-0 bg-background/80 flex items-center p-8 text-center">
                  <Alert variant="destructive" className="border-primary/50 bg-primary/10">
                    <AlertTitle className="text-primary font-bold">Camera Access Denied</AlertTitle>
                    <AlertDescription className="text-muted-foreground text-xs">Enable camera access to synchronize your palm with Sankhya.</AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          ) : (
            <div className="relative aspect-[3/4]">
              <img src={photo} alt="Captured palm" className="w-full h-full object-cover grayscale brightness-125" />
              <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
              <div className="absolute bottom-6 w-full flex justify-center gap-4 px-6">
                <Button variant="secondary" onClick={() => {setPhoto(null); setResult(null);}} className="flex-1 rounded-2xl glass-morphism border-white/10 h-14 uppercase font-bold text-xs tracking-widest">
                  <RefreshCcw className="w-4 h-4 mr-2" /> Retake
                </Button>
                <Button 
                  onClick={handleProcess} 
                  disabled={isProcessing}
                  className="flex-1 rounded-2xl bg-primary hover:bg-primary/90 text-background font-black h-14 uppercase text-xs tracking-[0.2em] shadow-[0_0_30px_rgba(255,153,51,0.3)]"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4 mr-2" />}
                  {isProcessing ? 'Decoding...' : 'Analyze'}
                </Button>
              </div>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </Card>

        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6 random-stack-2"
            >
              <Card className="glass-morphism p-8 border-primary/20 bg-primary/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-45 transition-transform duration-700">
                  <Sparkles className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-primary mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Scan className="w-5 h-5" />
                  </div>
                  Resonance Report
                </h3>
                <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap font-light">
                  {result}
                </div>
              </Card>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex gap-4 hover:bg-white/10 transition-colors group">
                <Info className="w-6 h-6 text-primary shrink-0 group-hover:scale-125 transition-transform" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground leading-relaxed font-bold">
                  The lines of your palm are a quantum mirror of the mathematical destiny encoded at birth. Analysis synthesized via Jyotish & Samudrika Shastra.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-12 h-full border-2 border-dashed border-white/5 rounded-[3rem] opacity-50 random-stack-3">
              <div className="space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10 pulse-glow" />
                  <Scan className="w-10 h-10 text-primary/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h3 className="text-xl font-headline font-bold text-muted-foreground uppercase tracking-widest">Waiting for Scan</h3>
                <p className="text-xs text-muted-foreground/60 max-w-xs mx-auto leading-relaxed">
                  Position your dominant palm within the guide. Sankhya will decode the geometric frequencies hidden in your skin.
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}