'use client'

import * as React from 'react'
import { getMockDashboardData, type DashboardData } from '@/services/mock-data'
import { WelcomeHeader } from '@/components/dashboard/widgets/WelcomeHeader'
import { HealthScore } from '@/components/dashboard/widgets/HealthScore'
import { NutritionOverview } from '@/components/dashboard/widgets/NutritionOverview'
import { WorkoutCard } from '@/components/dashboard/widgets/WorkoutCard'
import { WeightChart } from '@/components/dashboard/widgets/WeightChart'
import { WaterIntake } from '@/components/dashboard/widgets/WaterIntake'
import { AiCoachWidget } from '@/components/dashboard/widgets/AiCoachWidget'
import { ActivityTimeline } from '@/components/dashboard/widgets/ActivityTimeline'
import { QuickActions } from '@/components/dashboard/widgets/QuickActions'
import { SkeletonLoader } from '@/components/dashboard/SkeletonLoader'

export default function DashboardPage() {
  const [data, setData] = React.useState<DashboardData | null>(null)

  // Simulate network request for data
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setData(getMockDashboardData())
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!data) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700">
        <SkeletonLoader className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SkeletonLoader className="h-64 col-span-1" />
          <SkeletonLoader className="h-64 col-span-1 md:col-span-2" />
          <SkeletonLoader className="h-64 col-span-1" />
          
          <SkeletonLoader className="h-72 col-span-1 md:col-span-3" />
          <SkeletonLoader className="h-72 col-span-1" />
          
          <SkeletonLoader className="h-64 col-span-1 md:col-span-1" />
          <SkeletonLoader className="h-64 col-span-1 md:col-span-2" />
          <SkeletonLoader className="h-64 col-span-1" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <WelcomeHeader data={data} />
      
      {/* 4-Column Asymmetrical Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Row 1 */}
        <HealthScore data={data} />
        <NutritionOverview data={data} />
        <WorkoutCard data={data} />
        
        {/* Row 2 */}
        <div className="col-span-1 md:col-span-3">
          <WeightChart data={data} />
        </div>
        <WaterIntake data={data} />
        
        {/* Row 3 */}
        <AiCoachWidget data={data} />
        <ActivityTimeline data={data} />
        <QuickActions />
      </div>
    </div>
  )
}
