'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useUser } from '@/lib/context/UserContext'
import { useAuth } from '@/lib/context/AuthContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Loader2, LogOut, AlertTriangle } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { calculateTDEE } from '@/lib/calculations'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  age: z.coerce.number().min(12, 'Age must be at least 12.'),
  gender: z.enum(['male', 'female', 'other']),
  height: z.coerce.number().min(50, 'Height must be at least 50cm.'),
  weight: z.coerce.number().min(20, 'Weight must be at least 20kg.'),
  targetWeight: z.coerce.number().min(20).optional(),
  goal: z.enum(['lose_weight', 'maintain', 'gain_weight', 'build_muscle']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
})

type ProfileInput = z.infer<typeof profileSchema>

const targetsSchema = z.object({
  calories: z.coerce.number().min(500),
  protein: z.coerce.number().min(0),
  carbs: z.coerce.number().min(0),
  fat: z.coerce.number().min(0),
  water: z.coerce.number().min(500),
  steps: z.coerce.number().min(1000),
})

type TargetsInput = z.infer<typeof targetsSchema>

export default function SettingsPage() {
  const { profile, currentWeight, targets, updateProfile, updateTargets, logWeight } = useUser()
  const { user, logout } = useAuth()
  
  const [isSavingProfile, setIsSavingProfile] = React.useState(false)
  const [isSavingTargets, setIsSavingTargets] = React.useState(false)

  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      age: profile.age,
      gender: profile.gender,
      height: profile.height,
      weight: currentWeight || profile.weight || 70,
      targetWeight: profile.targetWeight || undefined,
      goal: profile.goal,
      activityLevel: profile.activityLevel,
    },
  })

  const targetsForm = useForm<TargetsInput>({
    resolver: zodResolver(targetsSchema),
    defaultValues: {
      calories: targets.calories,
      protein: targets.protein,
      carbs: targets.carbs,
      fat: targets.fat,
      water: targets.water,
      steps: targets.steps,
    },
  })

  // Reset forms when profile data loads
  React.useEffect(() => {
    profileForm.reset({
      name: user?.name || '',
      age: profile.age,
      gender: profile.gender,
      height: profile.height,
      weight: currentWeight || profile.weight || 70,
      targetWeight: profile.targetWeight || undefined,
      goal: profile.goal,
      activityLevel: profile.activityLevel,
    })
    targetsForm.reset({
      calories: targets.calories,
      protein: targets.protein,
      carbs: targets.carbs,
      fat: targets.fat,
      water: targets.water,
      steps: targets.steps,
    })
  }, [profile, currentWeight, targets, profileForm, targetsForm, user])

  const onProfileSubmit = async (data: ProfileInput) => {
    setIsSavingProfile(true)
    try {
      await updateProfile({
        name: data.name,
        age: data.age,
        gender: data.gender,
        height: data.height,
        weight: data.weight,
        targetWeight: data.targetWeight,
        goal: data.goal,
        activityLevel: data.activityLevel,
      })
      
      if (data.weight && data.weight !== currentWeight) {
        logWeight(data.weight)
      }
    } finally {
      setIsSavingProfile(false)
    }
  }

  const onTargetsSubmit = async (data: TargetsInput) => {
    setIsSavingTargets(true)
    try {
      await updateTargets(data)
    } finally {
      setIsSavingTargets(false)
    }
  }

  const autoCalculateTargets = () => {
    const p = profileForm.getValues()
    const tdeeResult = calculateTDEE(p.weight, p.height, p.age, p.gender, p.activityLevel as any)
    
    let kcal = tdeeResult.maintenance
    if (p.goal === 'lose_weight') kcal = tdeeResult.deficit
    if (p.goal === 'gain_weight' || p.goal === 'build_muscle') kcal = tdeeResult.surplus
    
    // Very basic macro split: 30% P, 40% C, 30% F
    const protein = Math.round((kcal * 0.3) / 4)
    const carbs = Math.round((kcal * 0.4) / 4)
    const fat = Math.round((kcal * 0.3) / 9)
    
    // Water: ~35ml per kg
    const water = Math.min(Math.round(p.weight * 35), 4000)
    
    targetsForm.setValue('calories', kcal)
    targetsForm.setValue('protein', protein)
    targetsForm.setValue('carbs', carbs)
    targetsForm.setValue('fat', fat)
    targetsForm.setValue('water', water)
    targetsForm.setValue('steps', 10000) // Default active baseline
    
    toast.success('Targets auto-calculated based on profile.')
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-3xl tracking-tight">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column - Navigation (Optional/Placeholder for large screens) */}
        <div className="hidden md:block space-y-1">
          <Button variant="ghost" className="w-full justify-start bg-white/5">Profile</Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-white/5">Goals & Targets</Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-white/5">Account</Button>
        </div>

        {/* Right Column - Forms */}
        <div className="col-span-1 md:col-span-2 space-y-8">
          
          {/* PROFILE CARD */}
          <Card className="bg-[#09090B] border-white/10">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your personal information to ensure accurate calculations.</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="profile-form" onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="flex items-center gap-4 pb-4">
                  <Avatar className="w-16 h-16 border-2 border-white/10">
                    <AvatarFallback className="bg-white/5 text-xl font-bold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold">{user?.name}</span>
                    <span className="text-sm text-muted-foreground">{user?.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input {...profileForm.register('name')} className="bg-black/50 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input type="number" {...profileForm.register('age')} className="bg-black/50 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select onValueChange={(v) => profileForm.setValue('gender', v as any)} value={profileForm.watch('gender')}>
                      <SelectTrigger className="bg-black/50 border-white/10">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input type="number" {...profileForm.register('height')} className="bg-black/50 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Weight (kg)</Label>
                    <Input type="number" {...profileForm.register('weight')} className="bg-black/50 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Target Weight (kg)</Label>
                    <Input type="number" {...profileForm.register('targetWeight')} className="bg-black/50 border-white/10" placeholder="Not set" />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Goal</Label>
                    <Select onValueChange={(v) => profileForm.setValue('goal', v as any)} value={profileForm.watch('goal')}>
                      <SelectTrigger className="bg-black/50 border-white/10">
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lose_weight">Lose Weight</SelectItem>
                        <SelectItem value="maintain">Maintain Weight</SelectItem>
                        <SelectItem value="gain_weight">Gain Weight</SelectItem>
                        <SelectItem value="build_muscle">Build Muscle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Activity Level</Label>
                    <Select onValueChange={(v) => profileForm.setValue('activityLevel', v as any)} value={profileForm.watch('activityLevel')}>
                      <SelectTrigger className="bg-black/50 border-white/10">
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (0-1 days/wk)</SelectItem>
                        <SelectItem value="light">Lightly Active (1-3 days/wk)</SelectItem>
                        <SelectItem value="moderate">Moderately Active (3-5 days/wk)</SelectItem>
                        <SelectItem value="active">Very Active (6-7 days/wk)</SelectItem>
                        <SelectItem value="very_active">Athlete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t border-white/5 pt-4">
              <Button type="submit" form="profile-form" disabled={isSavingProfile} className="w-full sm:w-auto">
                {isSavingProfile ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save Profile
              </Button>
            </CardFooter>
          </Card>

          {/* TARGETS CARD */}
          <Card className="bg-[#09090B] border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Daily Targets</CardTitle>
                <CardDescription>Your macros, hydration, and activity goals.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={autoCalculateTargets} className="bg-white/5 border-white/10 hover:bg-white/10">
                Auto-Calculate
              </Button>
            </CardHeader>
            <CardContent>
              <form id="targets-form" onSubmit={targetsForm.handleSubmit(onTargetsSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Calories (kcal)</Label>
                  <Input type="number" {...targetsForm.register('calories')} className="bg-black/50 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Protein (g)</Label>
                  <Input type="number" {...targetsForm.register('protein')} className="bg-black/50 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Carbs (g)</Label>
                  <Input type="number" {...targetsForm.register('carbs')} className="bg-black/50 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Fat (g)</Label>
                  <Input type="number" {...targetsForm.register('fat')} className="bg-black/50 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Water (ml)</Label>
                  <Input type="number" {...targetsForm.register('water')} className="bg-black/50 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Steps</Label>
                  <Input type="number" {...targetsForm.register('steps')} className="bg-black/50 border-white/10" />
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t border-white/5 pt-4">
              <Button type="submit" form="targets-form" disabled={isSavingTargets} className="w-full sm:w-auto">
                {isSavingTargets ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save Targets
              </Button>
            </CardFooter>
          </Card>

          {/* DANGER ZONE */}
          <Card className="bg-[#1c0a0a] border-danger/20">
            <CardHeader>
              <CardTitle className="text-danger flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Danger Zone
              </CardTitle>
              <CardDescription>Irreversible account actions and session management.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-danger/10 bg-danger/5 rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">Sign out of session</h4>
                  <p className="text-sm text-muted-foreground">Clear local authentication and sign out.</p>
                </div>
                <Button variant="outline" onClick={logout} className="border-white/10 hover:bg-white/5 shrink-0">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-danger/20 bg-danger/10 rounded-lg">
                <div>
                  <h4 className="font-medium text-danger">Delete Account</h4>
                  <p className="text-sm text-danger/70">Permanently delete your account and all data.</p>
                </div>
                <Button variant="destructive" disabled className="shrink-0 opacity-50">
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
