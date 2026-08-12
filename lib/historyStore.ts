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
  // Disabled: No longer generating demo weight/steps for new users.
}

export function resetDemoHistory(userId: string = 'guest') {
  localStorage.removeItem(`fc_weight_history_${userId}`)
  localStorage.removeItem(`fc_steps_history_${userId}`)
  // Disabled: seedHistoryIfEmpty(userId)
  window.dispatchEvent(new Event(`fc_history_updated_${userId}`))
}

export function useHistoryStore(userId: string | null) {
  const [weights, setWeights] = useState<WeightHistoryEntry[]>([])
  const [steps, setSteps] = useState<StepsHistoryEntry[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  
  useEffect(() => {
    if (!userId) {
      setWeights([])
      setSteps([])
      setIsHydrated(false)
      return
    }

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
  
  const saveWeightAction = (weight: number, dateMs?: number) => {
    if (userId) saveWeight(userId, weight, dateMs)
  }
  const saveStepsAction = (steps: number, dateMs?: number) => {
    if (userId) saveSteps(userId, steps, dateMs)
  }
  
  return { weights, steps, isHydrated, saveWeight: saveWeightAction, saveSteps: saveStepsAction }
}
