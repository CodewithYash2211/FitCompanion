'use client'

import * as React from 'react'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { useAuth } from './AuthContext'

export interface ExerciseDef {
  id: string
  name: string
  category: 'Chest' | 'Back' | 'Shoulders' | 'Biceps' | 'Triceps' | 'Legs' | 'Core' | 'Cardio' | 'Mobility'
  primaryMuscle: string
  equipment: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  calPerMin: number
  instructions: string
  mistakes: string
}

export const EXERCISE_DB: ExerciseDef[] = [
  // CHEST
  { id: 'c1', name: 'Barbell Bench Press', category: 'Chest', primaryMuscle: 'Pectoralis Major', equipment: 'Barbell', difficulty: 'Intermediate', calPerMin: 6, instructions: 'Keep feet flat, arch back slightly, lower bar to mid-chest.', mistakes: 'Bouncing bar off chest, flaring elbows.' },
  { id: 'c2', name: 'Incline Dumbbell Press', category: 'Chest', primaryMuscle: 'Upper Pectoralis', equipment: 'Dumbbells', difficulty: 'Intermediate', calPerMin: 5, instructions: 'Set bench to 30-45 degrees, press straight up.', mistakes: 'Pressing out in front instead of straight up.' },
  { id: 'c3', name: 'Pec Deck Fly', category: 'Chest', primaryMuscle: 'Pectoralis Major', equipment: 'Machine', difficulty: 'Beginner', calPerMin: 4, instructions: 'Keep slight bend in elbows, squeeze at the center.', mistakes: 'Using momentum, dropping arms too far back.' },
  { id: 'c4', name: 'Push Ups', category: 'Chest', primaryMuscle: 'Pectoralis Major', equipment: 'Bodyweight', difficulty: 'Beginner', calPerMin: 7, instructions: 'Keep core tight, lower until chest is near floor.', mistakes: 'Sagging hips, flaring elbows.' },
  // BACK
  { id: 'b1', name: 'Pull Ups', category: 'Back', primaryMuscle: 'Latissimus Dorsi', equipment: 'Bodyweight', difficulty: 'Advanced', calPerMin: 8, instructions: 'Pull chest to bar, control the descent.', mistakes: 'Kipping, half reps.' },
  { id: 'b2', name: 'Lat Pulldown', category: 'Back', primaryMuscle: 'Latissimus Dorsi', equipment: 'Cable', difficulty: 'Beginner', calPerMin: 5, instructions: 'Pull bar to upper chest, squeeze lats.', mistakes: 'Leaning too far back.' },
  { id: 'b3', name: 'Barbell Row', category: 'Back', primaryMuscle: 'Latissimus Dorsi', equipment: 'Barbell', difficulty: 'Intermediate', calPerMin: 6, instructions: 'Keep back straight, pull to lower stomach.', mistakes: 'Rounding lower back.' },
  { id: 'b4', name: 'Deadlift', category: 'Back', primaryMuscle: 'Lower Back/Hamstrings', equipment: 'Barbell', difficulty: 'Advanced', calPerMin: 9, instructions: 'Drive through floor, keep bar close to shins.', mistakes: 'Rounding back, hips rising too fast.' },
  // LEGS
  { id: 'l1', name: 'Barbell Squat', category: 'Legs', primaryMuscle: 'Quadriceps', equipment: 'Barbell', difficulty: 'Advanced', calPerMin: 8, instructions: 'Squat below parallel, keep chest up.', mistakes: 'Knees caving in, heels lifting.' },
  { id: 'l2', name: 'Leg Press', category: 'Legs', primaryMuscle: 'Quadriceps', equipment: 'Machine', difficulty: 'Beginner', calPerMin: 6, instructions: 'Lower until knees are 90 degrees.', mistakes: 'Locking out knees at the top.' },
  { id: 'l3', name: 'Romanian Deadlift', category: 'Legs', primaryMuscle: 'Hamstrings', equipment: 'Barbell', difficulty: 'Intermediate', calPerMin: 7, instructions: 'Hinge at hips, keep slight knee bend.', mistakes: 'Bending knees too much, rounding back.' },
  // SHOULDERS
  { id: 's1', name: 'Overhead Press', category: 'Shoulders', primaryMuscle: 'Anterior Deltoid', equipment: 'Barbell', difficulty: 'Intermediate', calPerMin: 6, instructions: 'Press straight up, push head through at top.', mistakes: 'Excessive arching of lower back.' },
  { id: 's2', name: 'Lateral Raise', category: 'Shoulders', primaryMuscle: 'Lateral Deltoid', equipment: 'Dumbbells', difficulty: 'Beginner', calPerMin: 4, instructions: 'Raise arms to side, slight bend in elbow.', mistakes: 'Using momentum, shrugging shoulders.' },
  // ARMS
  { id: 'a1', name: 'Barbell Curl', category: 'Biceps', primaryMuscle: 'Biceps', equipment: 'Barbell', difficulty: 'Beginner', calPerMin: 4, instructions: 'Curl weight up, keep elbows fixed.', mistakes: 'Swinging weight, moving elbows forward.' },
  { id: 'a2', name: 'Tricep Pushdown', category: 'Triceps', primaryMuscle: 'Triceps', equipment: 'Cable', difficulty: 'Beginner', calPerMin: 4, instructions: 'Keep elbows tucked, extend fully.', mistakes: 'Using lats to push down.' },
  // CORE & CARDIO
  { id: 'r1', name: 'Plank', category: 'Core', primaryMuscle: 'Abs', equipment: 'Bodyweight', difficulty: 'Beginner', calPerMin: 5, instructions: 'Hold straight line from head to heels.', mistakes: 'Hips too high or sagging.' },
  { id: 'r2', name: 'Treadmill Running', category: 'Cardio', primaryMuscle: 'Full Body', equipment: 'Machine', difficulty: 'Beginner', calPerMin: 12, instructions: 'Maintain steady pace.', mistakes: 'Holding on to rails.' },
]

export interface WorkoutSet {
  id: string
  reps: number
  weight: number
  completed: boolean
}

export interface ActiveExercise {
  id: string // maps to ExerciseDef
  sets: WorkoutSet[]
}

export interface WorkoutSession {
  id: string
  name: string
  startTime: number
  exercises: ActiveExercise[]
  elapsedSeconds: number
  isPaused: boolean
}

export interface WorkoutHistoryEntry extends WorkoutSession {
  endTime: number
  totalVolume: number
  caloriesBurned: number
  totalSets: number
  totalReps: number
  isDemo?: boolean
}

interface PRRecord {
  exerciseId: string
  weight: number
  reps: number
  date: number
}

interface WorkoutContextType {
  activeSession: WorkoutSession | null
  workoutHistory: WorkoutHistoryEntry[]
  personalRecords: PRRecord[]
  
  restRemaining: number | null
  isResting: boolean
  restIsPaused: boolean
  restDuration: number // To track total duration for progress ring
  
  showSummaryModal: WorkoutHistoryEntry | null
  
  startWorkout: (name?: string) => void
  pauseWorkout: () => void
  resumeWorkout: () => void
  finishWorkout: () => void
  cancelWorkout: () => void
  dismissSummaryModal: () => void
  
  addExerciseToSession: (exerciseId: string) => void
  addSet: (activeExerciseIndex: number) => void
  removeSet: (activeExerciseIndex: number, setIndex: number) => void
  updateSet: (activeExerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: number) => void
  toggleSetComplete: (activeExerciseIndex: number, setIndex: number) => void
  
  startRestTimer: (seconds: number) => void
  pauseRestTimer: () => void
  resumeRestTimer: () => void
  skipRestTimer: () => void
  
  deleteWorkoutHistory: (id: string) => void
}

const WorkoutContext = React.createContext<WorkoutContextType | undefined>(undefined)

function playBeep() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1)
    
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3)
    
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    
    oscillator.start()
    oscillator.stop(audioCtx.currentTime + 0.3)
  } catch (e) {
    console.error('AudioContext error', e)
  }
}

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()
  const userId = user?._id || 'guest'
  
  const STORAGE_KEY_HISTORY = `fc_workout_history_${userId}`
  const STORAGE_KEY_ACTIVE = `fc_workout_active_${userId}`
  const STORAGE_KEY_PRS = `fc_workout_prs_${userId}`

  const [activeSession, setActiveSession] = React.useState<WorkoutSession | null>(null)
  const [workoutHistory, setWorkoutHistory] = React.useState<WorkoutHistoryEntry[]>([])
  const [personalRecords, setPersonalRecords] = React.useState<PRRecord[]>([])
  
  const [showSummaryModal, setShowSummaryModal] = React.useState<WorkoutHistoryEntry | null>(null)
  
  // Timers
  const [restRemaining, setRestRemaining] = React.useState<number | null>(null)
  const [restDuration, setRestDuration] = React.useState<number>(0)
  const [isResting, setIsResting] = React.useState(false)
  const [restIsPaused, setRestIsPaused] = React.useState(false)
  
  // Hydration
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    if (authLoading) return

    try {
      let parsedHistory: WorkoutHistoryEntry[] = []
      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY)
      if (savedHistory) {
        parsedHistory = JSON.parse(savedHistory)
      }
      

      
      setWorkoutHistory(parsedHistory)
      
      const savedActive = localStorage.getItem(STORAGE_KEY_ACTIVE)
      if (savedActive) setActiveSession(JSON.parse(savedActive))
      
      const savedPRs = localStorage.getItem(STORAGE_KEY_PRS)
      if (savedPRs) setPersonalRecords(JSON.parse(savedPRs))
    } catch (e) {
      console.error('Failed to parse workout history', e)
    }
    setIsHydrated(true)
  }, [authLoading, userId, STORAGE_KEY_HISTORY, STORAGE_KEY_ACTIVE, STORAGE_KEY_PRS])

  // Auto-save active session
  React.useEffect(() => {
    if (!isHydrated || authLoading) return
    if (activeSession) {
      localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(activeSession))
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE)
    }
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(workoutHistory))
    localStorage.setItem(STORAGE_KEY_PRS, JSON.stringify(personalRecords))
  }, [activeSession, workoutHistory, personalRecords, isHydrated, authLoading, STORAGE_KEY_ACTIVE, STORAGE_KEY_HISTORY, STORAGE_KEY_PRS])

  // Workout Timer Engine
  React.useEffect(() => {
    if (!activeSession || activeSession.isPaused) return
    const interval = setInterval(() => {
      setActiveSession(prev => prev ? { ...prev, elapsedSeconds: prev.elapsedSeconds + 1 } : null)
    }, 1000)
    return () => clearInterval(interval)
  }, [activeSession !== null, activeSession?.isPaused])

  // Rest Timer Engine
  React.useEffect(() => {
    if (!isResting || restIsPaused || restRemaining === null) return
    if (restRemaining <= 0) {
      setIsResting(false)
      setRestRemaining(null)
      playBeep()
      toast.success('Rest Complete — Time for your next set.', { duration: 4000, position: 'top-center' })
      return
    }
    const interval = setInterval(() => {
      setRestRemaining(prev => prev !== null ? prev - 1 : null)
    }, 1000)
    return () => clearInterval(interval)
  }, [isResting, restIsPaused, restRemaining])

  const checkPR = React.useCallback((exerciseId: string, weight: number, reps: number) => {
    const existing = personalRecords.find(pr => pr.exerciseId === exerciseId)
    if (!existing || weight > existing.weight || (weight === existing.weight && reps > existing.reps)) {
      setPersonalRecords(prev => {
        const filtered = prev.filter(pr => pr.exerciseId !== exerciseId)
        return [...filtered, { exerciseId, weight, reps, date: Date.now() }]
      })
      const exName = EXERCISE_DB.find(e => e.id === exerciseId)?.name || 'Exercise'
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.2 } })
      toast(`🏆 New PR! ${exName}: ${weight}kg × ${reps}`, {
        style: { background: '#fbbf24', color: '#000', border: 'none' }
      })
    }
  }, [personalRecords])

  const startWorkout = (name = 'Evening Session') => {
    setActiveSession({
      id: Date.now().toString(),
      name,
      startTime: Date.now(),
      exercises: [],
      elapsedSeconds: 0,
      isPaused: false
    })
  }
  
  const pauseWorkout = () => {
    if (!activeSession) return
    setActiveSession(prev => prev ? { ...prev, isPaused: true } : null)
  }
  
  const resumeWorkout = () => {
    if (!activeSession) return
    setActiveSession(prev => prev ? { ...prev, isPaused: false } : null)
  }

  const finishWorkout = () => {
    if (!activeSession) return
    
    let totalVolume = 0
    let totalSets = 0
    let totalReps = 0
    let totalCalories = 0 // basic estimate
    
    activeSession.exercises.forEach(ex => {
      const def = EXERCISE_DB.find(d => d.id === ex.id)
      const calPerMin = def?.calPerMin || 5
      
      const completedSets = ex.sets.filter(s => s.completed)
      totalSets += completedSets.length
      completedSets.forEach(s => {
        totalVolume += (s.weight * s.reps)
        totalReps += s.reps
      })
      // Rough calc: assume 2 mins per completed set
      totalCalories += (completedSets.length * 2 * calPerMin)
    })

    const newHistoryEntry: WorkoutHistoryEntry = {
      ...activeSession,
      endTime: Date.now(),
      totalVolume,
      totalSets,
      totalReps,
      caloriesBurned: Math.round(totalCalories)
    }

    setShowSummaryModal(newHistoryEntry)
    setWorkoutHistory(prev => [newHistoryEntry, ...prev])
    setActiveSession(null)
    setIsResting(false)
    setRestRemaining(null)
  }
  
  const dismissSummaryModal = () => {
    setShowSummaryModal(null)
  }

  const cancelWorkout = () => {
    setActiveSession(null)
    setIsResting(false)
    setRestRemaining(null)
  }

  const addExerciseToSession = (exerciseId: string) => {
    if (!activeSession) return
    setActiveSession(prev => {
      if (!prev) return null
      return {
        ...prev,
        exercises: [...prev.exercises, {
          id: exerciseId,
          sets: [{ id: Math.random().toString(), reps: 10, weight: 20, completed: false }]
        }]
      }
    })
  }

  const addSet = (idx: number) => {
    if (!activeSession) return
    setActiveSession(prev => {
      if (!prev) return null
      const ex = [...prev.exercises]
      const lastSet = ex[idx].sets[ex[idx].sets.length - 1]
      ex[idx].sets.push({ 
        id: Math.random().toString(), 
        reps: lastSet ? lastSet.reps : 10, 
        weight: lastSet ? lastSet.weight : 20, 
        completed: false 
      })
      return { ...prev, exercises: ex }
    })
  }

  const removeSet = (idx: number, setIdx: number) => {
    if (!activeSession) return
    setActiveSession(prev => {
      if (!prev) return null
      const ex = [...prev.exercises]
      ex[idx].sets = ex[idx].sets.filter((_, i) => i !== setIdx)
      return { ...prev, exercises: ex }
    })
  }

  const updateSet = (idx: number, setIdx: number, field: 'reps' | 'weight', value: number) => {
    if (!activeSession) return
    setActiveSession(prev => {
      if (!prev) return null
      const ex = [...prev.exercises]
      ex[idx].sets[setIdx] = { ...ex[idx].sets[setIdx], [field]: Math.max(0, value) }
      return { ...prev, exercises: ex }
    })
  }

  const toggleSetComplete = (idx: number, setIdx: number) => {
    if (!activeSession) return
    setActiveSession(prev => {
      if (!prev) return null
      const ex = [...prev.exercises]
      const targetSet = ex[idx].sets[setIdx]
      targetSet.completed = !targetSet.completed
      
      if (targetSet.completed) {
        setTimeout(() => checkPR(ex[idx].id, targetSet.weight, targetSet.reps), 100)
        startRestTimer(60) // default 60s
      }
      
      return { ...prev, exercises: ex }
    })
  }

  const startRestTimer = (seconds: number) => {
    setIsResting(true)
    setRestIsPaused(false)
    setRestRemaining(seconds)
    setRestDuration(seconds)
  }
  
  const pauseRestTimer = () => setRestIsPaused(true)
  const resumeRestTimer = () => setRestIsPaused(false)
  const skipRestTimer = () => {
    setIsResting(false)
    setRestRemaining(null)
  }

  const deleteWorkoutHistory = (id: string) => {
    setWorkoutHistory(prev => prev.filter(w => w.id !== id))
    toast('Workout deleted', { duration: 2000 })
  }

  if (authLoading || (!isHydrated && user)) {
    return <div className="flex h-screen items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading Workout Data...</div></div>
  }

  return (
    <WorkoutContext.Provider value={{
      activeSession,
      workoutHistory,
      personalRecords,
      restRemaining,
      isResting,
      restIsPaused,
      restDuration,
      showSummaryModal,
      startWorkout,
      pauseWorkout,
      resumeWorkout,
      finishWorkout,
      cancelWorkout,
      dismissSummaryModal,
      addExerciseToSession,
      addSet,
      removeSet,
      updateSet,
      toggleSetComplete,
      startRestTimer,
      pauseRestTimer,
      resumeRestTimer,
      skipRestTimer,
      deleteWorkoutHistory
    }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkout() {
  const context = React.useContext(WorkoutContext)
  if (context === undefined) {
    throw new Error('useWorkout must be used within WorkoutProvider')
  }
  return context
}
