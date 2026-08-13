import { useState, useEffect, useCallback } from 'react'

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

// ---------------------------------------------
// LEGACY GUEST/LOCAL FUNCTIONS
// ---------------------------------------------

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

export function seedHistoryIfEmpty(userId: string = 'guest') {}

export function resetDemoHistory(userId: string = 'guest') {
  localStorage.removeItem(`fc_weight_history_${userId}`)
  localStorage.removeItem(`fc_steps_history_${userId}`)
  window.dispatchEvent(new Event(`fc_history_updated_${userId}`))
}

export async function saveWeight(userId: string, weight: number, dateMs: number = Date.now()) {
  if (userId === 'guest' || !userId) return
  const date = getLocalDateString(dateMs)
  try {
    const res = await fetch('/api/weight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weight, date })
    })
    if (res.ok) {
      window.dispatchEvent(new Event(`fc_history_updated_${userId}`))
    }
  } catch (err) {
    console.error('Failed to save weight to API', err)
  }
}

// ---------------------------------------------
// HOOK (MONGODB FOR WEIGHT, LOCAL FOR STEPS)
// ---------------------------------------------

export function useHistoryStore(userId: string | null) {
  const [weights, setWeights] = useState<WeightHistoryEntry[]>([])
  const [steps, setSteps] = useState<StepsHistoryEntry[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    let mounted = true
    
    if (!userId) {
      setWeights([])
      setSteps([])
      setIsHydrated(false)
      setIsLoading(false)
      return
    }

    const loadData = async () => {
      setIsLoading(true)
      
      try {
        // 1. Fetch Weight from MongoDB
        const res = await fetch('/api/weight')
        if (res.ok) {
          const data = await res.json()
          if (mounted && data.history) {
            // Re-map to match UI expectations, sort oldest first for charts
            const mapped = data.history.map((r: any) => ({
              date: r.date,
              weight: r.weight
            })).sort((a: any, b: any) => a.date.localeCompare(b.date))
            setWeights(mapped)
          }
        } else {
          // If fetch fails, we don't fall back to guest data
          if (mounted) setWeights([])
        }

        // 2. Load Steps from LocalStorage (Steps not migrated to DB yet)
        if (mounted) {
          setSteps(getStepsHistory(userId))
        }

      } catch (err) {
        console.error('Failed to fetch history', err)
      } finally {
        if (mounted) {
          setIsHydrated(true)
          setIsLoading(false)
        }
      }
    }

    loadData()
    
    // Steps still uses local events
    const updateSteps = () => {
      if (mounted) setSteps(getStepsHistory(userId))
    }
    const eventName = `fc_history_updated_${userId}`
    window.addEventListener(eventName, updateSteps)
    
    return () => {
      mounted = false
      window.removeEventListener(eventName, updateSteps)
    }
  }, [userId])
  
  const saveWeightAction = useCallback(async (weight: number, dateMs?: number) => {
    if (!userId || userId === 'guest') return // Only real users via API supported here for now, or you can implement guest fallback if needed

    const date = dateMs ? getLocalDateString(dateMs) : getLocalDateString()
    try {
      const res = await fetch('/api/weight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight, date })
      })
      if (res.ok) {
        // Optimistically reload from API or update state
        const data = await res.json()
        if (data.record) {
          setWeights(prev => {
            const next = [...prev]
            const existingIdx = next.findIndex(w => w.date === data.record.date)
            if (existingIdx >= 0) {
              next[existingIdx].weight = data.record.weight
            } else {
              next.push({ date: data.record.date, weight: data.record.weight })
            }
            return next.sort((a, b) => a.date.localeCompare(b.date))
          })
        }
      }
    } catch (err) {
      console.error('Failed to save weight to API', err)
    }
  }, [userId])

  const saveStepsAction = useCallback((stepsNum: number, dateMs?: number) => {
    if (userId) saveSteps(userId, stepsNum, dateMs)
  }, [userId])
  
  return { 
    weights, 
    steps, 
    isHydrated, 
    isLoading, // useful for UI
    saveWeight: saveWeightAction, 
    saveSteps: saveStepsAction 
  }
}
