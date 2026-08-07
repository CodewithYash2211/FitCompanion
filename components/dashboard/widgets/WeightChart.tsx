'use client'

import * as React from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { BentoCard } from '../BentoCard'
import { AnimatedCounter } from '../AnimatedCounter'
import type { DashboardData } from '@/services/mock-data'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export function WeightChart({ data }: { data: DashboardData }) {
  const { current, trend, history } = data.weight

  // Determine chart colors based on trend (down = success, up = warning)
  const isTrendingDown = trend < 0
  const color = isTrendingDown ? '#10b981' : '#f59e0b'
  
  return (
    <BentoCard delay={0.6} className="col-span-1 md:col-span-2 flex flex-col justify-between group/chart">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Weight</h3>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-3xl text-foreground">
              <AnimatedCounter value={current} format={(v) => v.toFixed(1)} />
              <span className="text-lg text-muted-foreground ml-1">kg</span>
            </span>
          </div>
        </div>
        
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${isTrendingDown ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
          {isTrendingDown ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
          {Math.abs(trend)} kg
        </div>
      </div>

      <div className="flex-1 mt-4 h-[120px] w-[calc(100%+3rem)] -mx-6 mb-[-1.5rem]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                color: '#fff'
              }}
              itemStyle={{ color: '#fff' }}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area 
              type="monotone" 
              dataKey="weight" 
              stroke={color} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorWeight)" 
              animationDuration={2000}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </BentoCard>
  )
}
