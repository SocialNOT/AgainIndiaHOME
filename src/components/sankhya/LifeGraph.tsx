"use client"

import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const mockData = [
  { time: '6 AM', energy: 30, tithi: 'Growth' },
  { time: '9 AM', energy: 65, tithi: 'Action' },
  { time: '12 PM', energy: 85, tithi: 'Peak' },
  { time: '3 PM', energy: 45, tithi: 'Rest' },
  { time: '6 PM', energy: 75, tithi: 'Social' },
  { time: '9 PM', energy: 20, tithi: 'Deep' },
  { time: '12 AM', energy: 10, tithi: 'Zen' },
];

export function LifeGraph() {
  return (
    <Card className="glass-morphism border-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-headline font-medium text-accent flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Vibration Timeline
        </CardTitle>
        <div className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">Real-time Astro Shift</div>
      </CardHeader>
      <CardContent className="h-64 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(23, 23, 28, 0.9)', 
                borderColor: 'rgba(133, 230, 255, 0.2)',
                borderRadius: '12px',
                backdropBlur: '10px'
              }}
              itemStyle={{ color: 'hsl(var(--accent))' }}
            />
            <Area 
              type="monotone" 
              dataKey="energy" 
              stroke="hsl(var(--accent))" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#energyGradient)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex justify-between mt-4 px-2">
          {['Tithi: Shukla', 'Nakshatra: Ashwini', 'Yoga: Priti'].map((tag, i) => (
            <span key={i} className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}