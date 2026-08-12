'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { useUser } from '@/lib/context/UserContext'
import { saveSteps } from '@/lib/historyStore'

export interface FoodItem {
  id: string | number
  name: string
  portion: string
  kcal: number
  p: number
  c: number
  f: number
  qty?: number
  timestamp?: number
  date?: number
  meal?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'
  isDemo?: boolean
}

export interface WaterEntry { date: number; amount: number }
export interface StepsEntry { date: number; count: number }

export interface NutritionState {
  loggedMeals: FoodItem[]
  waterLog: WaterEntry[]
  stepsLog: StepsEntry[]
}

interface NutritionContextType {
  loggedMeals: FoodItem[]
  waterLog: WaterEntry[]
  stepsLog: StepsEntry[]
  waterAmount: number
  steps: number
  waterTarget: number
  stepsTarget: number
  dailyKcalTarget: number
  dailyPTarget: number
  dailyCTarget: number
  dailyFTarget: number
  isHydrated: boolean
  logMeal: (foods: FoodItem[]) => void
  removeMeal: (index: number) => void
  addWater: (amount: number) => void
  removeWater: (amount: number) => void
  addSteps: (amount: number) => void
  updateSteps: (amount: number) => void
  undo: () => void
  draftMeals: FoodItem[]
  saveDraftMeals: (foods: FoodItem[]) => void
  historyCount: number
}

import { useAuth } from './AuthContext'

const NutritionContext = React.createContext<NutritionContextType | undefined>(undefined)

export function NutritionProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()
  const userId = user?._id || 'guest'
  
  const STORAGE_KEY = `fc_nutrition_state_${userId}`
  const DRAFT_KEY = `fc_nutrition_draft_${userId}`

  const [isHydrated, setIsHydrated] = React.useState(false)
  
  // State
  const [loggedMeals, setLoggedMeals] = React.useState<FoodItem[]>([])
  const [waterLog, setWaterLog] = React.useState<WaterEntry[]>([])
  const [stepsLog, setStepsLog] = React.useState<StepsEntry[]>([])
  const [draftMeals, setDraftMeals] = React.useState<FoodItem[]>([])

  // Undo History Stack
  const [history, setHistory] = React.useState<NutritionState[]>([])
  
  // Pull targets from UserContext instead of hardcoding
  const { targets } = useUser()

  const waterTarget = targets.water
  const stepsTarget = targets.steps
  const dailyKcalTarget = targets.calories
  const dailyPTarget = targets.protein
  const dailyCTarget = targets.carbs
  const dailyFTarget = targets.fat

  // Load from localStorage on mount
  React.useEffect(() => {
    if (authLoading) return

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      let parsedMeals: FoodItem[] = []
      let parsedWaterLog: WaterEntry[] = []
      let parsedStepsLog: StepsEntry[] = []

      if (saved) {
        const parsed = JSON.parse(saved)
        parsedMeals = parsed.loggedMeals || []
        
        // Migration from old flat numbers if present
        if (parsed.waterLog) parsedWaterLog = parsed.waterLog
        else if (parsed.waterAmount) parsedWaterLog = [{ date: Date.now(), amount: parsed.waterAmount }]
        
        if (parsed.stepsLog) parsedStepsLog = parsed.stepsLog
        else if (parsed.steps) parsedStepsLog = [{ date: Date.now(), count: parsed.steps }]
      }


      setLoggedMeals(parsedMeals)
      setWaterLog(parsedWaterLog)
      setStepsLog(parsedStepsLog)
    } catch(e) {
      console.error('Failed to parse nutrition state', e)
    }
    
    const draft = localStorage.getItem(DRAFT_KEY)
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft)
        if (parsedDraft && parsedDraft.length > 0) {
          setDraftMeals(parsedDraft)
          toast('Draft restored successfully.', { style: { background: '#1c1c1f', color: '#fff', border: '1px solid #27272a' } })
        }
      } catch (e) {}
    }

    setIsHydrated(true)
  }, [authLoading, userId, STORAGE_KEY, DRAFT_KEY])

  // Save to localStorage whenever state changes (if hydrated)
  React.useEffect(() => {
    if (isHydrated && !authLoading) {
      const stateToSave = { loggedMeals, waterLog, stepsLog }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
    }
  }, [loggedMeals, waterLog, stepsLog, isHydrated, authLoading, STORAGE_KEY])

  // Save drafts
  const saveDraftMeals = React.useCallback((foods: FoodItem[]) => {
    setDraftMeals(foods)
    localStorage.setItem(DRAFT_KEY, JSON.stringify(foods))
  }, [DRAFT_KEY])

  // Helper to push to history
  const saveToHistory = React.useCallback(() => {
    setHistory(prev => [...prev, { loggedMeals, waterLog, stepsLog }])
  }, [loggedMeals, waterLog, stepsLog])

  const undo = React.useCallback(() => {
    if (history.length === 0) {
      toast('Nothing to undo', { duration: 1500 })
      return
    }
    const previousState = history[history.length - 1]
    setLoggedMeals(previousState.loggedMeals)
    setWaterLog(previousState.waterLog)
    setStepsLog(previousState.stepsLog)
    setHistory(prev => prev.slice(0, -1))
    toast.success('Action undone successfully', { duration: 2000 })
  }, [history])

  const logMeal = React.useCallback((foods: FoodItem[]) => {
    saveToHistory()
    const now = new Date()
    
    const foodsWithTime = foods.map(f => {
      let ts = now.getTime()
      if (f.meal === 'Breakfast') {
        const t = new Date(now)
        t.setHours(9, 0, 0, 0)
        ts = t.getTime()
      } else if (f.meal === 'Lunch') {
        const t = new Date(now)
        t.setHours(13, 30, 0, 0)
        ts = t.getTime()
      } else if (f.meal === 'Dinner') {
        const t = new Date(now)
        t.setHours(20, 0, 0, 0)
        ts = t.getTime()
      }
      return { ...f, timestamp: ts }
    })
    
    setLoggedMeals(prev => {
      const updated = [...prev, ...foodsWithTime]
      return updated.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
    })
    
    // Clear drafts on save
    setDraftMeals([])
    localStorage.removeItem(DRAFT_KEY)
  }, [saveToHistory, DRAFT_KEY])

  const removeMeal = React.useCallback((index: number) => {
    saveToHistory()
    const food = loggedMeals[index]
    setLoggedMeals(prev => prev.filter((_, i) => i !== index))
    toast(`🗑️ ${food.name} deleted.`, {
      action: { label: 'Undo', onClick: () => undo() },
      duration: 4000
    })
  }, [loggedMeals, saveToHistory, undo])

  const addWater = React.useCallback((amount: number) => {
    saveToHistory()
    setWaterLog(prev => {
      const todayStart = new Date().setHours(0,0,0,0)
      const existing = prev.find(p => new Date(p.date).setHours(0,0,0,0) === todayStart)
      if (existing) {
        return prev.map(p => p.date === existing.date ? { ...p, amount: p.amount + amount } : p)
      }
      return [...prev, { date: Date.now(), amount }]
    })
    toast.success(`💧 Added ${amount}ml water.`)
  }, [saveToHistory])

  const removeWater = React.useCallback((amount: number) => {
    saveToHistory()
    setWaterLog(prev => {
      const todayStart = new Date().setHours(0,0,0,0)
      const existing = prev.find(p => new Date(p.date).setHours(0,0,0,0) === todayStart)
      if (existing) {
        return prev.map(p => p.date === existing.date ? { ...p, amount: Math.max(0, p.amount - amount) } : p)
      }
      return prev
    })
    toast(`Removed ${amount}ml water.`)
  }, [saveToHistory])

  const addSteps = React.useCallback((amount: number) => {
    // Determine today's count from the dedicated store and add to it
    const store = require('@/lib/historyStore')
    const hist = store.getStepsHistory()
    const todayStr = store.getLocalDateString()
    const existing = hist.find((h: any) => h.date === todayStr)
    const newCount = (existing ? existing.steps : 0) + amount
    saveSteps(userId, newCount)
  }, [userId])

  const updateSteps = React.useCallback((count: number) => {
    saveSteps(userId, count)
  }, [userId])

  const todayStart = new Date().setHours(0,0,0,0)
  const waterAmount = React.useMemo(() => {
    return waterLog.find(p => new Date(p.date).setHours(0,0,0,0) === todayStart)?.amount || 0
  }, [waterLog, todayStart])
  
  const steps = React.useMemo(() => {
    return stepsLog.find(p => new Date(p.date).setHours(0,0,0,0) === todayStart)?.count || 0
  }, [stepsLog, todayStart])

  if (authLoading || (!isHydrated && user)) {
    return <div className="flex h-screen items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading Nutrition...</div></div>
  }

  return (
    <NutritionContext.Provider value={{
      loggedMeals,
      waterLog,
      stepsLog,
      waterAmount,
      waterTarget,
      steps,
      stepsTarget,
      dailyKcalTarget,
      dailyPTarget,
      dailyCTarget,
      dailyFTarget,
      isHydrated,
      logMeal,
      removeMeal,
      addWater,
      removeWater,
      addSteps,
      updateSteps,
      undo,
      draftMeals,
      saveDraftMeals,
      historyCount: history.length
    }}>
      {children}
    </NutritionContext.Provider>
  )
}

export function useNutrition() {
  const context = React.useContext(NutritionContext)
  if (context === undefined) {
    throw new Error('useNutrition must be used within a NutritionProvider')
  }
  return context
}
