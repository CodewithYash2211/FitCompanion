'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowRight, ArrowLeft, Loader2, Target, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { onboardingSchema, type OnboardingInput } from '@/lib/validations/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'

const STEPS = [
  'Welcome',
  'Personal Details',
  'Goals',
  'Body Metrics',
  'Activity',
  'Diet',
]

// ─── Animation Variants ────────────────────────────────────────────────────────
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
    position: 'absolute' as const,
  }),
  center: {
    x: 0,
    opacity: 1,
    position: 'relative' as const,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    position: 'absolute' as const,
  }),
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = React.useState(0)
  const [direction, setDirection] = React.useState(1) // 1 for forward, -1 for backward
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    formState: { errors },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      age: 20,
      gender: 'male',
      height: 170,
      weight: 65,
      goal: 'maintain',
      activityLevel: 'moderate',
      dietaryPref: 'non_vegetarian',
      fitnessLevel: 'beginner',
      equipment: 'none',
      hostelMode: true,
    },
    mode: 'onChange',
  })

  // Group fields by step to validate before proceeding
  const getFieldsForStep = (stepIndex: number): Array<keyof OnboardingInput> => {
    switch (stepIndex) {
      case 1: return ['age', 'gender']
      case 2: return ['goal', 'fitnessLevel']
      case 3: return ['height', 'weight']
      case 4: return ['activityLevel']
      case 5: return ['dietaryPref', 'hostelMode']
      default: return []
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(step)
    const isStepValid = await trigger(fieldsToValidate)
    
    if (isStepValid && step < STEPS.length - 1) {
      setDirection(1)
      setStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setDirection(-1)
      setStep((prev) => prev - 1)
    }
  }

  const onSubmit = async (data: OnboardingInput) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save profile')
      }

      toast.success('Profile created successfully! Let\'s go.')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* ─── Progress Indicator ──────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 mx-1 rounded-full transition-colors duration-500 ${
                i <= step ? 'bg-gradient-brand shadow-[0_0_10px_rgba(124,58,237,0.5)]' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider text-center mt-4">
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>
      </div>

      <div className="relative overflow-hidden min-h-[400px] glass rounded-3xl p-8 border border-white/10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full"
            >
              {/* ─── Step 0: Welcome ───────────────────────────────────────────── */}
              {step === 0 && (
                <div className="text-center space-y-6 flex flex-col items-center justify-center min-h-[300px]">
                  <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center">
                    <Target className="w-8 h-8 text-brand-400" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-3xl text-foreground mb-2">
                      Let's build your plan
                    </h2>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      FitCompanion uses AI to generate personalized diet and workout routines tailored to your college lifestyle.
                    </p>
                  </div>
                </div>
              )}

              {/* ─── Step 1: Personal Details ────────────────────────────────────── */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-display font-bold text-2xl text-foreground mb-6">
                    Personal Details
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="20"
                        className="h-11 bg-white/5"
                        {...register('age')}
                      />
                      {errors.age && <p className="text-sm text-danger">{errors.age.message}</p>}
                    </div>
                    
                    <div className="space-y-3 pt-2">
                      <Label>Biological Gender</Label>
                      <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5">
                              <RadioGroupItem value="male" id="male" />
                              <Label htmlFor="male" className="font-normal cursor-pointer flex-1">Male</Label>
                            </div>
                            <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5">
                              <RadioGroupItem value="female" id="female" />
                              <Label htmlFor="female" className="font-normal cursor-pointer flex-1">Female</Label>
                            </div>
                          </RadioGroup>
                        )}
                      />
                      {errors.gender && <p className="text-sm text-danger">{errors.gender.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Step 2: Goals ──────────────────────────────────────────────── */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-display font-bold text-2xl text-foreground mb-6">
                    What's your main goal?
                  </h2>
                  
                  <Controller
                    name="goal"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-3"
                      >
                        {[
                          { val: 'lose_weight', label: 'Lose Weight', desc: 'Burn fat and tone up' },
                          { val: 'maintain', label: 'Maintain', desc: 'Stay healthy and active' },
                          { val: 'build_muscle', label: 'Build Muscle', desc: 'Increase strength and size' }
                        ].map(g => (
                          <div key={g.val} className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors ${field.value === g.val ? 'bg-brand-500/10 border-brand-500' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                            <RadioGroupItem value={g.val} id={g.val} />
                            <div className="flex-1 cursor-pointer">
                              <Label htmlFor={g.val} className="font-medium cursor-pointer block">{g.label}</Label>
                              <span className="text-xs text-muted-foreground">{g.desc}</span>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />

                  <div className="pt-4 space-y-3">
                    <Label>Current Fitness Level</Label>
                    <Controller
                      name="fitnessLevel"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-2">
                          {['beginner', 'intermediate', 'advanced'].map(level => (
                            <div key={level} className="flex-1">
                              <RadioGroupItem value={level} id={`fit-${level}`} className="peer sr-only" />
                              <Label
                                htmlFor={`fit-${level}`}
                                className={`flex items-center justify-center p-3 rounded-lg border text-sm capitalize cursor-pointer transition-colors ${field.value === level ? 'bg-brand-500/20 border-brand-500 text-white' : 'bg-white/5 border-white/10 text-muted-foreground hover:text-white'}`}
                              >
                                {level}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* ─── Step 3: Body Metrics ────────────────────────────────────────── */}
              {step === 3 && (
                <div className="space-y-8">
                  <h2 className="font-display font-bold text-2xl text-foreground mb-6">
                    Body Metrics
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Height (cm)</Label>
                      <span className="text-brand-400 font-bold">{watch('height')} cm</span>
                    </div>
                    <Controller
                      name="height"
                      control={control}
                      render={({ field }) => (
                        <Slider
                          min={120}
                          max={220}
                          step={1}
                          value={[field.value]}
                          onValueChange={(val) => field.onChange(val[0])}
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between">
                      <Label>Weight (kg)</Label>
                      <span className="text-brand-400 font-bold">{watch('weight')} kg</span>
                    </div>
                    <Controller
                      name="weight"
                      control={control}
                      render={({ field }) => (
                        <Slider
                          min={30}
                          max={150}
                          step={0.5}
                          value={[field.value]}
                          onValueChange={(val) => field.onChange(val[0])}
                        />
                      )}
                    />
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground mt-8 p-4 bg-white/5 rounded-xl">
                    This helps us calculate your Daily Caloric Need (TDEE) accurately.
                  </div>
                </div>
              )}

              {/* ─── Step 4: Activity Level ──────────────────────────────────────── */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="font-display font-bold text-2xl text-foreground mb-6">
                    How active are you?
                  </h2>
                  
                  <Controller
                    name="activityLevel"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-3"
                      >
                        {[
                          { val: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
                          { val: 'light', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
                          { val: 'moderate', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
                          { val: 'active', label: 'Active', desc: 'Hard exercise 6-7 days/week' },
                        ].map(a => (
                          <div key={a.val} className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors ${field.value === a.val ? 'bg-brand-500/10 border-brand-500' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                            <RadioGroupItem value={a.val} id={a.val} />
                            <div className="flex-1 cursor-pointer">
                              <Label htmlFor={a.val} className="font-medium cursor-pointer block">{a.label}</Label>
                              <span className="text-xs text-muted-foreground">{a.desc}</span>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                </div>
              )}

              {/* ─── Step 5: Diet & Preferences ────────────────────────────────── */}
              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="font-display font-bold text-2xl text-foreground mb-6">
                    Food & Lifestyle
                  </h2>
                  
                  <div className="space-y-3">
                    <Label>Dietary Preference</Label>
                    <Controller
                      name="dietaryPref"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-3">
                          {[
                            { val: 'non_vegetarian', label: 'Non-Veg' },
                            { val: 'vegetarian', label: 'Vegetarian' },
                            { val: 'eggetarian', label: 'Eggetarian' },
                            { val: 'vegan', label: 'Vegan' },
                          ].map(d => (
                            <div key={d.val}>
                              <RadioGroupItem value={d.val} id={d.val} className="peer sr-only" />
                              <Label
                                htmlFor={d.val}
                                className={`flex items-center justify-center p-3 rounded-xl border text-sm cursor-pointer transition-colors ${field.value === d.val ? 'bg-brand-500/20 border-brand-500 text-white' : 'bg-white/5 border-white/10 text-muted-foreground hover:text-white'}`}
                              >
                                {d.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    />
                  </div>

                  <div className="pt-4">
                    <Controller
                      name="hostelMode"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-start space-x-4 p-4 rounded-xl border border-white/10 bg-white/5">
                          <div className="mt-1">
                            <input 
                              type="checkbox" 
                              id="hostelMode"
                              className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-600"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="hostelMode" className="font-medium text-foreground text-base">Hostel Mode</Label>
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                              Enable to prioritize hostel mess food, easy canteen alternatives, and budget-friendly macros.
                            </p>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ─── Navigation Buttons ────────────────────────────────────────────── */}
          <div className="mt-8 pt-6 border-t border-white/10 flex justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              className={step === 0 ? 'invisible' : ''}
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-foreground text-background hover:bg-white/80"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-brand text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                Finish Setup
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
