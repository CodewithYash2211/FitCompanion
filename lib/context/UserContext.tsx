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
  age: number
  sex: 'Male' | 'Female' | 'Other'
  height: number // in cm
  activityLevel: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active' | 'Extremely Active'
  goal: 'Lose Weight' | 'Maintain Weight' | 'Gain Weight'
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
  age: 21,
  sex: 'Male',
  height: 175,
  activityLevel: 'Moderately Active',
  goal: 'Maintain Weight'
}

const DEFAULT_TARGETS: UserTargets = {
  calories: 2600,
  protein: 160,
  carbs: 300,
  fat: 80,
  water: 3000,
  steps: 10000
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
      // Priority 1: MongoDB Profile (Option B)
      if (user?.profile) {
        const remoteProfile = user.profile
        const mergedProfile = { ...DEFAULT_PROFILE, name: user.name, ...remoteProfile }
        setProfile(mergedProfile)
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(mergedProfile))
      } else {
        // Priority 2: LocalStorage Profile
        const savedProfile = localStorage.getItem(STORAGE_KEY_PROFILE)
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile))
        } else if (user) {
          setProfile({ ...DEFAULT_PROFILE, name: user.name })
        }
      }

      // Targets
      const savedTargets = localStorage.getItem(STORAGE_KEY_TARGETS)
      if (savedTargets) setTargets(JSON.parse(savedTargets))

      // Current Weight
      const savedWeight = localStorage.getItem(STORAGE_KEY_WEIGHT_CURRENT)
      if (savedWeight) {
        setCurrentWeight(parseFloat(savedWeight))
      } else {
        const histStore = require('@/lib/historyStore')
        const wHist = histStore.getWeightHistory(userId)
        if (wHist.length > 0) {
          setCurrentWeight(wHist[wHist.length - 1].weight)
        }
      }
    } catch (e) {
      console.error('Failed to load user state from localStorage', e)
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

  const updateTargets = React.useCallback((newTargets: Partial<UserTargets>) => {
    setTargets(prev => ({ ...prev, ...newTargets }))
    toast.success('Targets updated successfully')
  }, [])

  const logWeightAction = React.useCallback((weight: number, date: number = Date.now()) => {
    saveWeight(userId, weight, date)
    setCurrentWeight(weight)
    toast.success(`Logged weight: ${weight}kg`)
  }, [userId])

  const deleteWeight = React.useCallback((id: string) => {
    // Deprecated
  }, [])

  // Do not render children until hydration is complete to prevent layout shift and data leak bugs
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
