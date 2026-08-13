'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser, UserProfile } from '@/lib/context/UserContext'
import { toast } from 'sonner'
import { Activity, Flame, Save, RefreshCw, ChevronRight } from 'lucide-react'

// Utilities
const ACTIVITY_MULTIPLIERS = {
  'sedentary': 1.2,
  'light': 1.375,
  'moderate': 1.55,
  'active': 1.725,
  'very_active': 1.9
}

const GOAL_MODIFIERS = {
  'lose_weight': -500,
  'maintain': 0,
  'gain_weight': 500,
  'build_muscle': 500
}

export default function CalculatorsPage() {
  const { profile, currentWeight, updateProfile, updateTargets } = useUser()
  const [isLoaded, setIsLoaded] = React.useState(false)

  // Local state for interactive calculators
  const [weight, setWeight] = React.useState<number | undefined | null>(currentWeight)
  const [height, setHeight] = React.useState<number | undefined>(profile.height)
  const [age, setAge] = React.useState<number | undefined>(profile.age)
  const [gender, setGender] = React.useState<UserProfile['gender']>(profile.gender)
  const [activity, setActivity] = React.useState<UserProfile['activityLevel']>(profile.activityLevel)
  const [goal, setGoal] = React.useState<UserProfile['goal']>(profile.goal)
  
  // Custom Macros
  const [proteinRatio, setProteinRatio] = React.useState(30)
  const [fatRatio, setFatRatio] = React.useState(25)
  // Carbs is remainder
  const carbRatio = Math.max(0, 100 - proteinRatio - fatRatio)

  React.useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) return <div className="min-h-screen bg-[#020202]" />

  // Calculations
  const calcWeight = weight || 70
  const calcHeight = height || 175
  const calcAge = age || 25
  const calcGender = gender || 'male'

  // BMI = kg / m^2
  const heightM = calcHeight / 100
  const bmi = calcWeight / (heightM * heightM)
  let bmiCategory = 'Normal'
  if (bmi < 18.5) bmiCategory = 'Underweight'
  else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight'
  else if (bmi >= 30) bmiCategory = 'Obese'

  // Mifflin-St Jeor BMR
  let bmr = (10 * calcWeight) + (6.25 * calcHeight) - (5 * calcAge)
  bmr = calcGender === 'male' ? bmr + 5 : bmr - 161

  // TDEE
  const tdee = bmr * (activity ? ACTIVITY_MULTIPLIERS[activity] : 1.55) // fallback to moderate for calc
  
  // Target Calories
  const targetCals = Math.round(tdee + (goal ? GOAL_MODIFIERS[goal] : 0)) // fallback to maintain for calc

  // Target Macros
  // 1g Protein = 4 kcal, 1g Fat = 9 kcal, 1g Carb = 4 kcal
  const targetProtein = Math.round((targetCals * (proteinRatio / 100)) / 4)
  const targetFat = Math.round((targetCals * (fatRatio / 100)) / 9)
  const targetCarbs = Math.round((targetCals * (carbRatio / 100)) / 4)

  const handleSaveToProfile = () => {
    updateProfile({
      age, gender, height, activityLevel: activity, goal
    })
    updateTargets({
      calories: targetCals,
      protein: targetProtein,
      carbs: targetCarbs,
      fat: targetFat
    })
    toast.success('Saved to Profile! Dashboard & AI updated.', { duration: 3000 })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="min-h-screen bg-[#020202] text-white p-6 md:p-12 pb-24 font-sans selection:bg-white/20"
    >
      <header className="mb-12 border-b border-white/10 pb-8">
        <div className="text-white/50 font-bold uppercase tracking-widest text-sm mb-2">Tools</div>
        <h1 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tighter leading-none">
          Calculators
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUTS COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-black border border-white/10 p-6">
            <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs mb-6">Your Physiology</h2>
            
            <div className="space-y-6">
              {/* Gender */}
              <div className="grid grid-cols-3 gap-2">
                {['male', 'female', 'other'].map(s => (
                  <button
                    key={s}
                    onClick={() => setGender(s as 'male' | 'female' | 'other')}
                    className={`h-10 text-xs font-bold uppercase tracking-widest transition-colors ${gender === s ? 'bg-white text-black' : 'border border-white/10 hover:bg-white/5'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Sliders */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                  <span className="text-white/50">Weight</span>
                  <span>{calcWeight} kg</span>
                </div>
                <input type="range" min="30" max="200" step="0.5" value={calcWeight} onChange={(e) => setWeight(parseFloat(e.target.value))} className="w-full accent-white" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                  <span className="text-white/50">Height</span>
                  <span>{calcHeight} cm</span>
                </div>
                <input type="range" min="120" max="250" step="1" value={calcHeight} onChange={(e) => setHeight(parseInt(e.target.value))} className="w-full accent-white" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                  <span className="text-white/50">Age</span>
                  <span>{calcAge} yrs</span>
                </div>
                <input type="range" min="12" max="100" step="1" value={calcAge} onChange={(e) => setAge(parseInt(e.target.value))} className="w-full accent-white" />
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Activity Level</div>
                <select 
                  value={activity || ''} 
                  onChange={(e) => setActivity(e.target.value as any)}
                  className="w-full bg-[#05050A] border border-white/10 h-12 px-4 text-sm font-bold focus:outline-none focus:border-white transition-colors"
                >
                  <option value="" disabled>Select Activity Level</option>
                  <option value="sedentary">Sedentary (Little to no exercise)</option>
                  <option value="light">Lightly Active (1-3 days/week)</option>
                  <option value="moderate">Moderately Active (3-5 days/week)</option>
                  <option value="active">Very Active (6-7 days/week)</option>
                  <option value="very_active">Extremely Active (Physical job/2x day)</option>
                </select>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Primary Goal</div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { val: 'lose_weight', label: 'Lose Weight' },
                    { val: 'maintain', label: 'Maintain Weight' },
                    { val: 'gain_weight', label: 'Gain Weight' },
                    { val: 'build_muscle', label: 'Build Muscle' }
                  ].map(g => (
                    <button
                      key={g.val}
                      onClick={() => setGoal(g.val as any)}
                      className={`h-12 text-xs font-bold uppercase tracking-widest transition-colors ${goal === g.val ? 'bg-white text-black' : 'border border-white/10 hover:bg-white/5'}`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-black border border-white/10 p-6">
            <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs mb-6">Macro Distribution</h2>
            
            <div className="space-y-6">
               <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                  <span className="text-white/50">Protein Ratio</span>
                  <span>{proteinRatio}%</span>
                </div>
                <input type="range" min="10" max="60" step="5" value={proteinRatio} onChange={(e) => setProteinRatio(parseInt(e.target.value))} className="w-full accent-white" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                  <span className="text-white/50">Fat Ratio</span>
                  <span>{fatRatio}%</span>
                </div>
                <input type="range" min="10" max="60" step="5" value={fatRatio} onChange={(e) => setFatRatio(parseInt(e.target.value))} className="w-full accent-white" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                  <span className="text-white/50">Carb Ratio (Auto)</span>
                  <span>{carbRatio}%</span>
                </div>
                {/* Visual bar */}
                <div className="h-2 w-full bg-white/10 mt-2 flex">
                  <div style={{ width: `${proteinRatio}%` }} className="bg-white h-full" />
                  <div style={{ width: `${fatRatio}%` }} className="bg-white/60 h-full" />
                  <div style={{ width: `${carbRatio}%` }} className="bg-white/30 h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS COLUMN */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#05050A] border border-white/10 text-white p-8 relative overflow-hidden">
            <h2 className="font-bold uppercase tracking-widest text-xs mb-6 opacity-60">Target Summary</h2>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Daily Calories</div>
                <div className="font-display font-bold text-6xl tracking-tighter flex items-baseline gap-2">
                  {targetCals}
                  <span className="text-xl opacity-50 uppercase">Kcal</span>
                </div>
              </div>
              <button 
                onClick={handleSaveToProfile}
                className="h-12 px-6 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-white/80 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save to Profile
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Protein</div>
                <div className="font-bold text-2xl">{targetProtein}g</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Carbs</div>
                <div className="font-bold text-2xl">{targetCarbs}g</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Fat</div>
                <div className="font-bold text-2xl">{targetFat}g</div>
              </div>
            </div>
            
            {/* Ambient graphic */}
            <Flame className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-[0.03] pointer-events-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black border border-white/10 p-6">
              <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs mb-4">Metabolism (BMR)</h2>
              <div className="font-display font-bold text-3xl tracking-tighter mb-2">{Math.round(bmr)} <span className="text-sm text-white/50 uppercase tracking-widest">Kcal</span></div>
              <p className="text-xs text-white/60 leading-relaxed">
                Basal Metabolic Rate is the energy your body burns at complete rest to maintain vital functions.
              </p>
            </div>
            <div className="bg-black border border-white/10 p-6">
              <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs mb-4">Total Energy (TDEE)</h2>
              <div className="font-display font-bold text-3xl tracking-tighter mb-2">{Math.round(tdee)} <span className="text-sm text-white/50 uppercase tracking-widest">Kcal</span></div>
              <p className="text-xs text-white/60 leading-relaxed">
                Total Daily Energy Expenditure estimates your maintenance calories including your activity level.
              </p>
            </div>
            <div className="bg-black border border-white/10 p-6 md:col-span-2">
              <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs mb-4">Body Mass Index (BMI)</h2>
              <div className="flex items-end gap-4 mb-4">
                <div className="font-display font-bold text-4xl tracking-tighter">{bmi.toFixed(1)}</div>
                <div className={`font-bold uppercase tracking-widest text-sm mb-1 ${
                  bmiCategory === 'Normal' ? 'text-success' : bmiCategory === 'Underweight' ? 'text-warning' : 'text-danger'
                }`}>
                  {bmiCategory}
                </div>
              </div>
              {/* BMI Scale visual */}
              <div className="h-3 w-full flex bg-white/5 relative">
                <div className="w-[18.5%] border-r border-[#020202] bg-warning/50" title="Underweight (< 18.5)"/>
                <div className="w-[25%] border-r border-[#020202] bg-success/50" title="Normal (18.5 - 25)"/>
                <div className="w-[20%] border-r border-[#020202] bg-warning/50" title="Overweight (25 - 30)"/>
                <div className="w-[36.5%] bg-danger/50" title="Obese (> 30)"/>
                
                {/* Marker */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white"
                  style={{ left: `${Math.min(Math.max((bmi / 40) * 100, 0), 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-2">
                BMI is a general screening metric, not a definitive measure of health or body composition.
              </p>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}
