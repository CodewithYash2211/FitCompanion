import { useState, useEffect } from 'react'

export interface WeightHistoryEntry {
  date: string
  weight: number
}

export interface StepsHistoryEntry {
  date: string
  steps: number
}

export function getLocalDateString(dateMs: number = Date.now()): string {
  const d = new Date(dateMs)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function getWeightHistory(userId: string = 'guest'): WeightHistoryEntry[] {
  if (typeof window === 'undefined') return []
  const STORAGE_KEY = `fc_weight_history_${userId}`
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []
    return JSON.parse(saved)
  } catch (e) {
    console.error('Failed to parse weight history', e)
    return []
  }
}

export function getStepsHistory(userId: string = 'guest'): StepsHistoryEntry[] {
  if (typeof window === 'undefined') return []
  const STORAGE_KEY = `fc_steps_history_${userId}`
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) return JSON.parse(saved)
  return []
}

export function saveWeight(userId: string, weight: number, dateMs: number = Date.now()) {
  if (typeof window === 'undefined') return
  const STORAGE_KEY = `fc_weight_history_${userId}`
  try {
    const dateStr = getLocalDateString(dateMs)
    const history = getWeightHistory(userId)
    const existingIndex = history.findIndex(h => h.date === dateStr)
    
    if (existingIndex >= 0) {
      history[existingIndex].weight = weight
    } else {
      history.push({ date: dateStr, weight })
    }
    
    history.sort((a, b) => a.date.localeCompare(b.date))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    window.dispatchEvent(new Event(`fc_history_updated_${userId}`))
  } catch (e) {
    console.error('Failed to save weight', e)
  }
}

export function saveSteps(userId: string, steps: number, dateMs: number = Date.now()) {
  if (typeof window === 'undefined') return
  const STORAGE_KEY = `fc_steps_history_${userId}`
  const dateStr = getLocalDateString(dateMs)
  const history = getStepsHistory(userId)
  const existingIndex = history.findIndex(h => h.date === dateStr)
  
  if (existingIndex >= 0) {
    history[existingIndex].steps = steps
  } else {
    history.push({ date: dateStr, steps })
  }
  
  history.sort((a, b) => a.date.localeCompare(b.date))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  window.dispatchEvent(new Event(`fc_history_updated_${userId}`))
}

export function seedHistoryIfEmpty(userId: string = 'guest') {
  if (typeof window === 'undefined') return
  
  const WEIGHT_KEY = `fc_weight_history_${userId}`
  const STEPS_KEY = `fc_steps_history_${userId}`
  
  const weightSaved = localStorage.getItem(WEIGHT_KEY)
  const stepsSaved = localStorage.getItem(STEPS_KEY)
  
  const now = Date.now()
  const DAY_MS = 86400000
  
  if (!weightSaved) {
    const weights = [54.8, 54.9, 54.7, 55.0, 55.1, 54.9, 55.2, 55.3, 55.1, 55.4, 55.5, 55.3, 55.6, 55.7, 55.5, 55.8, 55.9, 55.7, 56.0, 55.8, 56.1, 56.2, 56.0, 56.2, 56.3, 56.1, 56.4, 56.5, 56.3, 56.5]
    const weightHistory: WeightHistoryEntry[] = []
    for (let i = 29; i >= 0; i--) {
      weightHistory.push({ date: getLocalDateString(now - (i * DAY_MS)), weight: weights[29 - i] })
    }
    localStorage.setItem(WEIGHT_KEY, JSON.stringify(weightHistory))
  }
  
  if (!stepsSaved) {
    const steps = [6420, 7850, 8210, 5930, 9120, 7440, 6800, 10500, 8750, 7200, 9340, 8120, 6500, 9800, 7450, 8600, 7100, 10200, 8300, 7700, 9500, 6800, 8900, 7600, 10800, 8200, 7300, 9100, 8250, 6850]
    const stepsHistory: StepsHistoryEntry[] = []
    for (let i = 29; i >= 0; i--) {
      stepsHistory.push({ date: getLocalDateString(now - (i * DAY_MS)), steps: steps[29 - i] })
    }
    localStorage.setItem(STEPS_KEY, JSON.stringify(stepsHistory))
  }
}

export function resetDemoHistory(userId: string = 'guest') {
  localStorage.removeItem(`fc_weight_history_${userId}`)
  localStorage.removeItem(`fc_steps_history_${userId}`)
  seedHistoryIfEmpty(userId)
  window.dispatchEvent(new Event(`fc_history_updated_${userId}`))
}

export function useHistoryStore(userId: string = 'guest') {
  const [weights, setWeights] = useState<WeightHistoryEntry[]>([])
  const [steps, setSteps] = useState<StepsHistoryEntry[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  
  useEffect(() => {
    seedHistoryIfEmpty(userId)
    
    const update = () => {
      setWeights(getWeightHistory(userId))
      setSteps(getStepsHistory(userId))
    }
    
    update()
    setIsHydrated(true)
    
    const eventName = `fc_history_updated_${userId}`
    window.addEventListener(eventName, update)
    return () => window.removeEventListener(eventName, update)
  }, [userId])
  
  const saveWeightAction = (weight: number, dateMs?: number) => saveWeight(userId, weight, dateMs)
  const saveStepsAction = (steps: number, dateMs?: number) => saveSteps(userId, steps, dateMs)
  
  return { weights, steps, isHydrated, saveWeight: saveWeightAction, saveSteps: saveStepsAction }
}
