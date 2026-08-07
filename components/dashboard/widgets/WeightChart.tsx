'use client'

import * as React from 'react'
import { BentoCard } from '../BentoCard'
import type { DashboardData } from '@/services/mock-data'
import { AreaChart, Area, Tooltip, ResponsiveContainer, YAxis } from 'recharts'

export function WeightChart({ data }: { data: DashboardData }) {
  const { current, trend, history } = data.weight

  // Determine chart colors based on trend
  const isTrendingDown = trend < 0
  const color = isTrendingDown ? '#10b981' : '#f59e0b'
  
  return (
    <BentoCard variant="analytics" delay={0.6} className="col-span-1 md:col-span-3 flex flex-col justify-between">
      <div className="p-6 pb-0 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Weight</h3>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-3xl text-foreground tracking-tight">
              {current.toFixed(1)}
              <span className="text-lg text-muted-foreground ml-1 font-normal">kg</span>
            </span>
          </div>
        </div>
        
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#1c1c1f] border border-[#27272a] ${isTrendingDown ? 'text-[#10b981]' : 'text-[#f59e0b]'}`}>
          {trend > 0 ? '+' : ''}{trend} kg this week
        </div>
      </div>

      <div className="flex-1 mt-6 h-[160px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.15}/>
                <stop offset="100%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#121214] border border-[#27272a] px-3 py-2 rounded-lg shadow-xl">
                      <p className="text-xs text-muted-foreground mb-1">{payload[0].payload.day}</p>
                      <p className="text-sm font-semibold text-foreground">{payload[0].value} kg</p>
                    </div>
                  )
                }
                return null
              }}
              cursor={{ stroke: '#27272a', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area 
              type="monotone" 
              dataKey="weight" 
              stroke={color} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorWeight)" 
              animationDuration={1500}
              animationEasing="ease-in-out"
              activeDot={{ r: 4, fill: '#121214', stroke: color, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </BentoCard>
  )
}
