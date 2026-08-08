import { BentoCard } from '../BentoCard'
import { Utensils, Dumbbell, Droplet, Moon } from 'lucide-react'

export function FitScore() {
  return (
    <BentoCard 
      variant="data" 
      delay={0.1}
      className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col justify-between !bg-[#000000] !border-[#27272A] !p-8 relative overflow-hidden"
    >
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-success/5 rounded-full blur-[80px] pointer-events-none translate-x-1/3 -translate-y-1/3" />

      <div className="flex justify-between items-start mb-8 z-10">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Today's Optimization</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-semibold tracking-tighter text-foreground">88</span>
            <span className="text-xl text-success font-medium">Fit Score™</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-success bg-success/10 px-3 py-1 rounded-full inline-flex items-center gap-1 border border-success/20">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            Optimal
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 z-10">
        {/* Breakdown Items */}
        <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#09090B] border border-white/[0.04]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Utensils className="w-4 h-4 text-success" />
            <span className="text-xs uppercase tracking-wider font-semibold">Nutrition</span>
          </div>
          <div className="text-lg font-medium text-foreground">+35 pts</div>
        </div>

        <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#09090B] border border-white/[0.04]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Dumbbell className="w-4 h-4 text-success" />
            <span className="text-xs uppercase tracking-wider font-semibold">Workout</span>
          </div>
          <div className="text-lg font-medium text-foreground">+25 pts</div>
        </div>

        <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#09090B] border border-white/[0.04]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Droplet className="w-4 h-4 text-info" />
            <span className="text-xs uppercase tracking-wider font-semibold">Water</span>
          </div>
          <div className="text-lg font-medium text-foreground">+12 pts</div>
        </div>

        <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#09090B] border border-white/[0.04]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Moon className="w-4 h-4 text-warning" />
            <span className="text-xs uppercase tracking-wider font-semibold">Sleep</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-lg font-medium text-foreground">+16 pts</div>
            <span className="text-[10px] text-warning bg-warning/10 px-1.5 py-0.5 rounded border border-warning/20">Needs Imp.</span>
          </div>
        </div>
      </div>
    </BentoCard>
  )
}
