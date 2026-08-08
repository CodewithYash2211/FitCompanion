'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      // Simulate API call for now (mock update)
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Onboarding complete. Engine ready.')
      router.push('/dashboard')
    } catch (e) {
      toast.error('Failed to configure profile.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
      <div className="mb-10 text-center">
        <h1 className="font-display font-bold text-4xl uppercase tracking-tighter mb-3">
          Calibration
        </h1>
        <p className="text-white/50 font-medium">
          Step {step} of 3: Baseline Metrics
        </p>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="uppercase tracking-widest text-xs font-bold text-white/70">Current Weight (kg)</label>
            <input type="number" className="w-full h-14 bg-[#09090B] border border-white/10 text-white placeholder:text-white/20 focus:border-white/50 rounded-none px-4 outline-none font-mono text-lg" placeholder="75" />
          </div>
          <div className="space-y-2">
            <label className="uppercase tracking-widest text-xs font-bold text-white/70">Height (cm)</label>
            <input type="number" className="w-full h-14 bg-[#09090B] border border-white/10 text-white placeholder:text-white/20 focus:border-white/50 rounded-none px-4 outline-none font-mono text-lg" placeholder="175" />
          </div>
          <button onClick={() => setStep(2)} className="w-full h-14 bg-white text-black font-bold uppercase tracking-wider flex justify-center items-center hover:bg-white/90">
            Next Phase
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="uppercase tracking-widest text-xs font-bold text-white/70">Primary Objective</label>
            <select className="w-full h-14 bg-[#09090B] border border-white/10 text-white focus:border-white/50 rounded-none px-4 outline-none font-mono uppercase text-sm">
              <option value="cut">Fat Loss (Cut)</option>
              <option value="maintain">Maintenance</option>
              <option value="bulk">Hypertrophy (Bulk)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="uppercase tracking-widest text-xs font-bold text-white/70">Activity Level</label>
            <select className="w-full h-14 bg-[#09090B] border border-white/10 text-white focus:border-white/50 rounded-none px-4 outline-none font-mono uppercase text-sm">
              <option value="sedentary">Sedentary (0-1 days/wk)</option>
              <option value="active">Active (3-5 days/wk)</option>
              <option value="athlete">Athlete (6-7 days/wk)</option>
            </select>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setStep(1)} className="flex-1 h-14 border border-white/20 text-white font-bold uppercase tracking-wider flex justify-center items-center hover:bg-white/5">
              Back
            </button>
            <button onClick={() => setStep(3)} className="flex-1 h-14 bg-white text-black font-bold uppercase tracking-wider flex justify-center items-center hover:bg-white/90">
              Next Phase
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 text-center">
          <div className="w-20 h-20 mx-auto border-4 border-success rounded-full flex items-center justify-center animate-[pulse_2s_infinite]">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <p className="text-white/70 uppercase tracking-widest font-bold text-sm">Calibration Complete</p>
          <button onClick={handleComplete} disabled={isLoading} className="w-full h-14 bg-white text-black font-bold uppercase tracking-wider flex justify-center items-center hover:bg-white/90">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Dashboard'}
          </button>
        </div>
      )}
    </div>
  )
}
