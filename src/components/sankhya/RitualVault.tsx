
"use client"

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Circle, Clock, Trash2, Zap, ArrowRight, Library, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useCollection, FirestorePermissionError, errorEmitter } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export function RitualVault({ userProfile, language }: { userProfile: any, language: string }) {
  const { user } = useUser();
  const db = useFirestore();

  const ritualsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users', user.uid, 'rituals'), orderBy('timestamp', 'desc'));
  }, [db, user]);

  const { data: rituals, loading } = useCollection(ritualsQuery);

  const toggleComplete = (ritualId: string, currentState: boolean) => {
    if (!user) return;
    const ritualRef = doc(db, 'users', user.uid, 'rituals', ritualId);
    updateDoc(ritualRef, { completed: !currentState }).catch(async () => {
      const permissionError = new FirestorePermissionError({
        path: ritualRef.path,
        operation: 'update',
        requestResourceData: { completed: !currentState }
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  const deleteRitual = (ritualId: string) => {
    if (!user) return;
    const ritualRef = doc(db, 'users', user.uid, 'rituals', ritualId);
    deleteDoc(ritualRef).catch(async () => {
      const permissionError = new FirestorePermissionError({
        path: ritualRef.path,
        operation: 'delete'
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-headline font-bold text-primary flex items-center justify-center gap-3 uppercase tracking-tighter">
          <Library className="w-12 h-12" />
          The Ritual Vault
        </h2>
        <p className="text-foreground font-bold max-w-lg mx-auto leading-relaxed uppercase text-[10px] tracking-widest opacity-80">
          Your historical record of energetic harmonization protocols. Track your evolution and consistency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
        <div className="lg:col-span-1 space-y-4">
          <Card className="glass-morphism p-6 border-white/10 space-y-6 rounded-none bg-primary/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
              <Zap className="w-4 h-4" /> Mastery Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[8px] font-bold uppercase opacity-50">Total Protocols</span>
                <span className="text-2xl font-black">{rituals.length}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[8px] font-bold uppercase opacity-50">Completion Rate</span>
                <span className="text-2xl font-black text-secondary">
                  {rituals.length > 0 
                    ? Math.round((rituals.filter(r => r.completed).length / rituals.length) * 100) 
                    : 0}%
                </span>
              </div>
            </div>
          </Card>

          <div className="p-6 rounded-none bg-white/5 border border-white/10 space-y-3">
             <h4 className="text-[9px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Pro Insight
             </h4>
             <p className="text-[10px] font-bold leading-relaxed text-foreground opacity-70">
               Consistent completion of micro-rituals correlates with a 40% increase in alignment clarity over 28-day cycles.
             </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <ScrollArea className="h-[600px] pr-4">
            <AnimatePresence mode="popLayout">
              {rituals.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center p-20 text-center opacity-30 space-y-4 border-2 border-dashed border-white/5">
                  <Library className="w-16 h-16" />
                  <p className="text-xs font-black uppercase tracking-widest">No protocols stored yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rituals.map((ritual, idx) => (
                    <motion.div
                      key={ritual.id || idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className={`glass-morphism border-white/5 p-5 flex items-center gap-5 group transition-all rounded-none ${ritual.completed ? 'bg-secondary/5 border-secondary/20' : ''}`}>
                        <button 
                          onClick={() => toggleComplete(ritual.id, ritual.completed)}
                          className={`w-8 h-8 rounded-none border-2 flex items-center justify-center shrink-0 transition-colors ${ritual.completed ? 'bg-secondary border-secondary text-background' : 'border-white/10 hover:border-primary/50'}`}
                        >
                          {ritual.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5 opacity-20" />}
                        </button>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-3">
                            <h4 className={`text-xs font-black uppercase tracking-wide transition-colors ${ritual.completed ? 'text-secondary line-through' : 'text-foreground'}`}>
                              {ritual.title}
                            </h4>
                            <Badge variant="outline" className="text-[7px] border-white/5 uppercase px-2 h-4">
                              {ritual.type}
                            </Badge>
                          </div>
                          <p className="text-[10px] font-bold opacity-60 line-clamp-1">{ritual.description}</p>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => deleteRitual(ritual.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

function useMemo(callback: () => any, deps: any[]) {
  return React.useMemo(callback, deps);
}
