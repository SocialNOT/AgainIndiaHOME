"use client"

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Scan, RefreshCcw, Info, Loader2 } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-headline font-bold text-primary">Palm Resonance</h2>
        <p className="text-muted-foreground">Synchronize your palm's geometry with the cosmic grid.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-morphism overflow-hidden relative border-white/5">
          {!photo ? (
            <div className="relative aspect-[3/4] bg-black/40 flex items-center justify-center">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-80 border-2 border-primary/40 border-dashed rounded-[4rem] animate-pulse" />
              </div>
              
              <div className="absolute bottom-6 w-full flex justify-center px-6">
                <Button 
                  onClick={capturePhoto} 
                  className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 shadow-xl"
                  disabled={hasCameraPermission === false}
                >
                  <Camera className="w-8 h-8 text-background" />
                </Button>
              </div>

              {hasCameraPermission === false && (
                <div className="absolute inset-0 bg-background/80 flex items-center p-8 text-center">
                  <Alert variant="destructive">
                    <AlertTitle>Camera Access Denied</AlertTitle>
                    <AlertDescription>Please enable camera access in your settings to use the scanner.</AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          ) : (
            <div className="relative aspect-[3/4]">
              <img src={photo} alt="Captured palm" className="w-full h-full object-cover" />
              <div className="absolute bottom-6 w-full flex justify-center gap-4 px-6">
                <Button variant="secondary" onClick={() => {setPhoto(null); setResult(null);}} className="flex-1 rounded-xl glass-morphism">
                  <RefreshCcw className="w-4 h-4 mr-2" /> Retake
                </Button>
                <Button 
                  onClick={handleProcess} 
                  disabled={isProcessing}
                  className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-background font-bold"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4 mr-2" />}
                  {isProcessing ? 'Reading...' : 'Interpret'}
                </Button>
              </div>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </Card>

        <AnimatePresence>
          {result ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="glass-morphism p-6 border-primary/20">
                <h3 className="text-xl font-headline text-primary mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Interpretation
                </h3>
                <div className="prose prose-invert text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {result}
                </div>
              </Card>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-4">
                <Info className="w-6 h-6 text-primary shrink-0" />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  The lines of your palm are a mirror of the mathematical destiny encoded at your birth. This analysis integrates Jyotish and Samudrika Shastra.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-3xl">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                  <Scan className="w-8 h-8 text-primary/40" />
                </div>
                <h3 className="text-lg font-headline font-medium text-muted-foreground">Ready for Scan</h3>
                <p className="text-xs text-muted-foreground/60 max-w-xs mx-auto">
                  Position your dominant hand within the guide for a high-resonance reading.
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}