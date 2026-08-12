'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { saveWeight, getWeightHistory } from '@/lib/historyStore'
import { useAuth } from './AuthContext'

export interface WeightEntry {
  id: string
  date: number
  weight: number
}

export interface UserProfile {
  name: string
  age?: number
  gender?: 'male' | 'female' | 'other'
  height?: number // in cm
  targetWeight?: number // in kg
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goal?: 'lose_weight' | 'maintain' | 'gain_weight' | 'build_muscle'
  dietaryPref?: 'vegetarian' | 'non_vegetarian' | 'vegan' | 'eggetarian'
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced'
  equipment?: 'gym' | 'home' | 'none'
}

export interface UserTargets {
  calories: number
  protein: number
  carbs: number
  fat: number
  water: number // in ml
  steps: number
}

export interface UserContextType {
  profile: UserProfile
  targets: UserTargets
  isHydrated: boolean
  currentWeight: number | null
  
  updateProfile: (profile: Partial<UserProfile>) => void
  updateTargets: (targets: Partial<UserTargets>) => void
  logWeight: (weight: number, date?: number) => void
  deleteWeight: (id: string) => void
}

const UserContext = React.createContext<UserContextType | undefined>(undefined)

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  age: undefined,
  gender: undefined,
  height: undefined,
  activityLevel: undefined,
  goal: undefined,
  dietaryPref: undefined,
  fitnessLevel: undefined,
  equipment: undefined
}

const DEFAULT_TARGETS: UserTargets = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  water: 0,
  steps: 0
}

// Helpers for backward compatibility
function mapLegacyGender(sex?: string): 'male' | 'female' | 'other' {
  if (!sex) return 'male'
  const lower = sex.toLowerCase()
  if (lower === 'male' || lower === 'female' || lower === 'other') return lower as any
  return 'male'
}

function mapLegacyGoal(goal?: string): 'lose_weight' | 'maintain' | 'gain_weight' | 'build_muscle' {
  if (!goal) return 'maintain'
  if (goal === 'Lose Weight') return 'lose_weight'
  if (goal === 'Maintain Weight') return 'maintain'
  if (goal === 'Gain Weight') return 'gain_weight'
  return goal as any
}

function mapLegacyActivity(activity?: string): 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' {
  if (!activity) return 'moderate'
  if (activity === 'Sedentary') return 'sedentary'
  if (activity === 'Lightly Active') return 'light'
  if (activity === 'Moderately Active') return 'moderate'
  if (activity === 'Very Active') return 'active'
  if (activity === 'Extremely Active') return 'very_active'
  return activity as any
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()
  
  const [isHydrated, setIsHydrated] = React.useState(false)
  const [profile, setProfile] = React.useState<UserProfile>(DEFAULT_PROFILE)
  const [targets, setTargets] = React.useState<UserTargets>(DEFAULT_TARGETS)
  const [currentWeight, setCurrentWeight] = React.useState<number | null>(null)

  const userId = user?._id || 'guest'
  const STORAGE_KEY_PROFILE = `fc_user_profile_${userId}`
  const STORAGE_KEY_TARGETS = `fc_user_targets_${userId}`
  const STORAGE_KEY_WEIGHT_CURRENT = `fc_user_current_weight_${userId}`

  // Hydrate local state when user is loaded
  React.useEffect(() => {
    if (authLoading) return

    try {
      let activeProfile = { ...DEFAULT_PROFILE, name: user?.name || '' }

      // Priority 1: MongoDB Profile
      if (user && user._id && user._id !== 'guest') {
        if (user.profile && Object.keys(user.profile).length > 0) {
          activeProfile = { ...activeProfile, ...user.profile }
        }
      } else {
        // Priority 2: LocalStorage Profile (only for guest/unauthenticated users)
        const savedStr = localStorage.getItem(STORAGE_KEY_PROFILE)
        if (savedStr) {
          const saved = JSON.parse(savedStr)
          activeProfile = {
            ...activeProfile,
            ...saved,
            gender: saved.gender || mapLegacyGender(saved.sex),
            goal: mapLegacyGoal(saved.goal),
            activityLevel: mapLegacyActivity(saved.activityLevel),
          }
        }
      }
      setProfile(activeProfile)
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(activeProfile))

      // Targets
      const savedTargets = localStorage.getItem(STORAGE_KEY_TARGETS)
      if (savedTargets) {
        setTargets(JSON.parse(savedTargets))
      }
      // If user profile has daily targets from DB, use them
      if (user?.profile?.dailyCalorieGoal || user?.profile?.dailyWaterGoal) {
        setTargets(prev => ({
          ...prev,
          calories: user.profile.dailyCalorieGoal || prev.calories,
          water: user.profile.dailyWaterGoal || prev.water,
        }))
      }

      // Current Weight
      const savedWeight = localStorage.getItem(STORAGE_KEY_WEIGHT_CURRENT)
      if (savedWeight) {
        setCurrentWeight(parseFloat(savedWeight))
      } else {
        const histStore = require('@/lib/historyStore')
        const wHist = histStore.getWeightHistory(userId)
        if (wHist.length > 0) {
          setCurrentWeight(wHist[wHist.length - 1].weight)
        } else if (user?.profile?.weight) {
          setCurrentWeight(user.profile.weight)
        }
      }
    } catch (e) {
      console.error('Failed to load user state', e)
    }
    
    setIsHydrated(true)
  }, [authLoading, user, userId, STORAGE_KEY_PROFILE, STORAGE_KEY_TARGETS, STORAGE_KEY_WEIGHT_CURRENT])

  // Sync to local storage on change
  React.useEffect(() => {
    if (!isHydrated || authLoading) return
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile))
    localStorage.setItem(STORAGE_KEY_TARGETS, JSON.stringify(targets))
    if (currentWeight !== null) {
      localStorage.setItem(STORAGE_KEY_WEIGHT_CURRENT, currentWeight.toString())
    }
  }, [profile, targets, currentWeight, isHydrated, authLoading, STORAGE_KEY_PROFILE, STORAGE_KEY_TARGETS, STORAGE_KEY_WEIGHT_CURRENT])

  const updateProfile = React.useCallback(async (newProfile: Partial<UserProfile>) => {
    const updated = { ...profile, ...newProfile }
    setProfile(updated)
    
    // Sync to MongoDB
    try {
      await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile),
      })
    } catch (err) {
      console.error('Failed to sync profile to server', err)
    }

    toast.success('Profile updated')
  }, [profile])

  const updateTargets = React.useCallback(async (newTargets: Partial<UserTargets>) => {
    const updated = { ...targets, ...newTargets }
    setTargets(updated)
    
    try {
      await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dailyCalorieGoal: updated.calories,
          dailyWaterGoal: updated.water,
        }),
      })
    } catch (err) {
      console.error('Failed to sync targets to server', err)
    }
    
    toast.success('Targets updated successfully')
  }, [targets])

  const logWeightAction = React.useCallback((weight: number, date: number = Date.now()) => {
    saveWeight(userId, weight, date)
    setCurrentWeight(weight)
    toast.success(`Logged weight: ${weight}kg`)
  }, [userId])

  const deleteWeight = React.useCallback((id: string) => {
    // Deprecated
  }, [])

  if (authLoading || (!isHydrated && user)) {
    return <div className="flex h-screen items-center justify-center"><div className="animate-pulse text-muted-foreground">Initializing User Context...</div></div>
  }

  return (
    <UserContext.Provider value={{
      profile,
      targets,
      isHydrated,
      currentWeight,
      updateProfile,
      updateTargets,
      logWeight: logWeightAction,
      deleteWeight
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

