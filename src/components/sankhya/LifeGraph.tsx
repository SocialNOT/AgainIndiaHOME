
"use client"

import React, { useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Orbit, Zap, Star } from 'lucide-react';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

const reduceToSingleDigit = (num: number): number => {
  if (num === 11 || num === 22 || num === 33) return num;
  while (num > 9) {
    num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return num;
};

export function LifeGraph() {
  const { user } = useUser();
  const db = useFirestore();
  const { data: userProfile } = useDoc(user ? doc(db, 'users', user.uid) : null);

  const graphData = useMemo(() => {
    if (!userProfile?.birthDate) {
      return [
        { time: '6 AM', energy: 30 },
        { time: '12 PM', energy: 85 },
        { time: '6 PM', energy: 75 },
        { time: '12 AM', energy: 10 },
      ];
    }

    const [bYear, bMonth, bDay] = userProfile.birthDate.split('-').map(Number);
    const lifePath = reduceToSingleDigit(bYear + bMonth + bDay);
    const now = new Date();
    const personalYear = reduceToSingleDigit(bMonth + bDay + now.getFullYear());
    const personalDay = reduceToSingleDigit(personalYear + (now.getMonth() + 1) + now.getDate());

    const data = [];
    const times = ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM', '3 AM'];
    
    for (let i = 0; i < 8; i++) {
      const hourIndex = i * 3;
      const baseEnergy = (lifePath * 5 + personalDay * 8 + hourIndex * 3) % 100;
      const energy = Math.max(10, Math.min(95, baseEnergy + Math.sin(i * 0.8) * 20));
      
      data.push({
        time: times[i],
        energy: Math.round(energy),
        vibration: personalDay
      });
    }
    return data;
  }, [userProfile]);

  return (
    <Card className="glass-morphism border-white/5 relative overflow-hidden group rounded-none">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Orbit className="w-32 h-32 animate-spin-very-slow text-primary" />
      </div>
      
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/5">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-accent flex items-center gap-2">
          <TrendingUp className="w-3 h-3 text-primary" />
          Vibration Timeline
        </CardTitle>
        <div className="text-[8px] font-bold text-muted-foreground bg-white/5 px-2 py-1 uppercase tracking-widest border border-white/5">
          Real-time Astro Shift
        </div>
      </CardHeader>
      
      <CardContent className="h-64 pt-6 px-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={graphData}>
            <defs>
              <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 8, fontWeight: 900 }}
              interval={1}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(23, 23, 28, 0.95)', 
                borderColor: 'rgba(133, 230, 255, 0.2)',
                borderRadius: '0px',
                backdropBlur: '10px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
              labelStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px' }}
              itemStyle={{ color: 'hsl(var(--accent))', fontSize: '9px', fontWeight: 700 }}
            />
            <Area 
              type="monotone" 
              dataKey="energy" 
              stroke="hsl(var(--accent))" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#energyGradient)" 
              animationDuration={3000}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        <div className="flex justify-between mt-6 pt-4 border-t border-white/5">
          {[
            { label: 'Tithi', val: 'Shukla', icon: Zap },
            { label: 'Nakshatra', val: 'Ashwini', icon: Orbit },
            { label: 'Yoga', val: 'Priti', icon: Star }
          ].map((tag, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/50">{tag.label}</span>
              <span className="text-[9px] font-black uppercase text-foreground flex items-center gap-1">
                <tag.icon className="w-2 h-2 text-primary" /> {tag.val}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
