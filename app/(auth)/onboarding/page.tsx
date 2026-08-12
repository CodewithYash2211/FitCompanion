'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)

  const [formData, setFormData] = React.useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    goal: 'maintain',
    activityLevel: 'moderate',
    dietaryPref: 'non_vegetarian',
    fitnessLevel: 'beginner',
    equipment: 'none'
  })

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const validateStep1 = () => {
    if (!formData.age || !formData.weight || !formData.height) {
      toast.error('Please fill in all fields')
      return false
    }
    return true
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      const payload = {
        age: parseInt(formData.age),
        gender: formData.gender,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        goal: formData.goal,
        activityLevel: formData.activityLevel,
        dietaryPref: formData.dietaryPref,
        fitnessLevel: formData.fitnessLevel,
        equipment: formData.equipment
      }
      
      const res = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to save profile')
      }

      toast.success('Onboarding complete. Engine ready.')
      // Force a hard reload to the dashboard so Context picks up the fresh DB data
      window.location.href = '/dashboard'
    } catch (e: any) {
      toast.error(e.message || 'Failed to configure profile.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
      <div className="mb-10 text-center">
        <h1 className="font-display font-bold text-4xl uppercase tracking-tighter mb-3">
          Calibration
        </h1>
        <p className="text-white/50 font-medium">
          Step {step} of 4: {step === 1 ? 'Metrics' : step === 2 ? 'Objectives' : step === 3 ? 'Preferences' : 'Complete'}
        </p>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="uppercase tracking-widest text-xs font-bold text-white/70">Age</label>
              <input type="number" value={formData.age} onChange={e => updateForm('age', e.target.value)} className="w-full h-14 bg-[#09090B] border border-white/10 text-white placeholder:text-white/20 focus:border-white/50 rounded-none px-4 outline-none font-mono text-lg" placeholder="25" />
            </div>
            <div className="space-y-2">
              <label className="uppercase tracking-widest text-xs font-bold text-white/70">Gender</label>
              <select value={formData.gender} onChange={e => updateForm('gender', e.target.value)} className="w-full h-14 bg-[#09090B] border border-white/10 text-white focus:border-white/50 rounded-none px-4 outline-none font-mono uppercase text-sm">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="uppercase tracking-widest text-xs font-bold text-white/70">Weight (kg)</label>
              <input type="number" value={formData.weight} onChange={e => updateForm('weight', e.target.value)} className="w-full h-14 bg-[#09090B] border border-white/10 text-white placeholder:text-white/20 focus:border-white/50 rounded-none px-4 outline-none font-mono text-lg" placeholder="75" />
            </div>
            <div className="space-y-2">
              <label className="uppercase tracking-widest text-xs font-bold text-white/70">Height (cm)</label>
              <input type="number" value={formData.height} onChange={e => updateForm('height', e.target.value)} className="w-full h-14 bg-[#09090B] border border-white/10 text-white placeholder:text-white/20 focus:border-white/50 rounded-none px-4 outline-none font-mono text-lg" placeholder="175" />
            </div>
          </div>
          <button onClick={() => validateStep1() && setStep(2)} className="w-full h-14 bg-white text-black font-bold uppercase tracking-wider flex justify-center items-center hover:bg-white/90">
            Next Phase
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="uppercase tracking-widest text-xs font-bold text-white/70">Primary Objective</label>
            <select value={formData.goal} onChange={e => updateForm('goal', e.target.value)} className="w-full h-14 bg-[#09090B] border border-white/10 text-white focus:border-white/50 rounded-none px-4 outline-none font-mono uppercase text-sm">
              <option value="lose_weight">Fat Loss</option>
              <option value="maintain">Maintenance</option>
              <option value="gain_weight">Gain Weight</option>
              <option value="build_muscle">Build Muscle</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="uppercase tracking-widest text-xs font-bold text-white/70">Activity Level</label>
            <select value={formData.activityLevel} onChange={e => updateForm('activityLevel', e.target.value)} className="w-full h-14 bg-[#09090B] border border-white/10 text-white focus:border-white/50 rounded-none px-4 outline-none font-mono uppercase text-sm">
              <option value="sedentary">Sedentary (0-1 days/wk)</option>
              <option value="light">Lightly Active (1-3 days/wk)</option>
              <option value="moderate">Moderately Active (3-5 days/wk)</option>
              <option value="active">Very Active (6-7 days/wk)</option>
              <option value="very_active">Athlete Level</option>
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
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="uppercase tracking-widest text-xs font-bold text-white/70">Dietary Preference</label>
            <select value={formData.dietaryPref} onChange={e => updateForm('dietaryPref', e.target.value)} className="w-full h-14 bg-[#09090B] border border-white/10 text-white focus:border-white/50 rounded-none px-4 outline-none font-mono uppercase text-sm">
              <option value="non_vegetarian">Non-Vegetarian</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="eggetarian">Eggetarian</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="uppercase tracking-widest text-xs font-bold text-white/70">Fitness Level</label>
              <select value={formData.fitnessLevel} onChange={e => updateForm('fitnessLevel', e.target.value)} className="w-full h-14 bg-[#09090B] border border-white/10 text-white focus:border-white/50 rounded-none px-4 outline-none font-mono uppercase text-sm">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="uppercase tracking-widest text-xs font-bold text-white/70">Equipment</label>
              <select value={formData.equipment} onChange={e => updateForm('equipment', e.target.value)} className="w-full h-14 bg-[#09090B] border border-white/10 text-white focus:border-white/50 rounded-none px-4 outline-none font-mono uppercase text-sm">
                <option value="none">None (Bodyweight)</option>
                <option value="home">Home Gym</option>
                <option value="gym">Full Gym</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setStep(2)} className="flex-1 h-14 border border-white/20 text-white font-bold uppercase tracking-wider flex justify-center items-center hover:bg-white/5">
              Back
            </button>
            <button onClick={() => setStep(4)} className="flex-1 h-14 bg-white text-black font-bold uppercase tracking-wider flex justify-center items-center hover:bg-white/90">
              Review
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6 text-center">
          <div className="w-20 h-20 mx-auto border-4 border-success rounded-full flex items-center justify-center animate-[pulse_2s_infinite]">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <p className="text-white/70 uppercase tracking-widest font-bold text-sm">Calibration Ready</p>
          <div className="flex gap-4 mt-8">
            <button onClick={() => setStep(3)} className="flex-1 h-14 border border-white/20 text-white font-bold uppercase tracking-wider flex justify-center items-center hover:bg-white/5">
              Back
            </button>
            <button onClick={handleComplete} disabled={isLoading} className="flex-1 h-14 bg-white text-black font-bold uppercase tracking-wider flex justify-center items-center hover:bg-white/90">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Dashboard'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
