'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader2, Sparkles, Copy, CheckCircle2, Trash2 } from 'lucide-react'
import { useNutrition } from '@/lib/context/NutritionContext'
import { useWorkout } from '@/lib/context/WorkoutContext'
import { useUser } from '@/lib/context/UserContext'

type Message = {
  id: string
  role: 'user' | 'model'
  text: string
  timestamp: number
  isError?: boolean
}

const QUICK_PROMPTS = [
  { icon: '🍽️', text: 'What should I eat today?' },
  { icon: '💪', text: 'Plan today\'s workout' },
  { icon: '🥩', text: 'Help me hit my protein goal' },
  { icon: '🔥', text: 'Analyze my progress' },
  { icon: '💧', text: 'Check my hydration' },
]

export default function AICoachPage() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  
  const bottomRef = React.useRef<HTMLDivElement>(null)

  const { loggedMeals, waterAmount, steps } = useNutrition()
  const { workoutHistory } = useWorkout()
  const { profile, targets, currentWeight } = useUser()

  // Hydrate chat from local storage
  React.useEffect(() => {
    const saved = localStorage.getItem('fc_chat_history')
    if (saved) {
      try { setMessages(JSON.parse(saved)) } catch (e) {}
    } else {
      setMessages([{
        id: 'welcome',
        role: 'model',
        text: "Hi! I'm your FitCompanion AI Coach. How can I help you reach your goals today?",
        timestamp: Date.now()
      }])
    }
  }, [])

  React.useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('fc_chat_history', JSON.stringify(messages))
    }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const clearChat = () => {
    if (confirm('Are you sure you want to clear your chat history?')) {
      const init: Message[] = [{
        id: 'welcome',
        role: 'model',
        text: "Chat cleared! How can I help you today?",
        timestamp: Date.now()
      }]
      setMessages(init)
      localStorage.setItem('fc_chat_history', JSON.stringify(init))
    }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    // Context bundle
    const consumedKcal = loggedMeals.reduce((acc, curr) => acc + (curr.kcal * (curr.qty || 1)), 0)
    const consumedProtein = loggedMeals.reduce((acc, curr) => acc + (curr.p * (curr.qty || 1)), 0)
    const totalWater = 2100 + waterAmount 
    
    const todayStart = new Date().setHours(0,0,0,0)
    const workoutsToday = workoutHistory.filter(w => w.startTime >= todayStart)

    const contextData = {
      user: {
        goal: profile.goal,
        weight: currentWeight ? `${currentWeight}kg` : "Not provided",
        height: profile.height ? `${profile.height}cm` : "Not provided",
        age: profile.age,
        gender: profile.gender,
        activityLevel: profile.activityLevel
      },
      nutrition: {
        caloriesConsumed: consumedKcal,
        calorieTarget: targets.calories,
        proteinConsumed: consumedProtein,
        proteinTarget: targets.protein,
        water: totalWater,
        waterTarget: targets.water,
      },
      workouts: {
        today: workoutsToday.map(w => w.name),
        recent: workoutHistory.slice(0, 3).map(w => ({ name: w.name, date: new Date(w.startTime).toDateString() })),
        streak: workoutHistory.length > 0 ? 1 : 0
      },
      currentDate: new Date().toDateString()
    }

    const apiMessages = [...messages, userMsg].map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, context: contextData })
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch AI response')
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.text,
        timestamp: Date.now()
      }])
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Sorry, I am having trouble connecting to my servers right now. Please try again later.',
        timestamp: Date.now(),
        isError: true
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-screen bg-[#020202] text-white">
      {/* Header */}
      <header className="flex-none p-4 md:p-6 border-b border-white/10 flex items-center justify-between bg-black/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl uppercase tracking-wider">AI Coach</h1>
            <div className="text-[10px] font-bold text-success uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span> Online
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-white/40 hover:text-danger hover:bg-white/5 rounded-full transition-colors"
          title="Clear Chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
        {messages.map((m) => (
          <motion.div 
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 flex items-center justify-center mt-1 border ${
              m.role === 'user' ? 'bg-[#18181B] border-white/10' : 'bg-white border-white'
            }`}>
              {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-5 h-5 text-black" />}
            </div>
            
            {/* Message Bubble */}
            <div className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
              <div className={`px-4 py-3 md:px-5 md:py-4 rounded-2xl md:rounded-[24px] text-sm md:text-base leading-relaxed relative group ${
                m.role === 'user' 
                  ? 'bg-white text-black rounded-tr-sm' 
                  : m.isError 
                    ? 'bg-danger/10 border border-danger/30 text-white rounded-tl-sm'
                    : 'bg-[#121214] border border-white/10 text-white rounded-tl-sm'
              }`}>
                {m.text}
                
                {/* Actions (Model only) */}
                {m.role === 'model' && !m.isError && (
                  <div className="absolute -bottom-3 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => copyToClipboard(m.text, m.id)}
                      className="w-7 h-7 bg-black border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10"
                    >
                      {copiedId === m.id ? <CheckCircle2 className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3 text-white/50" />}
                    </button>
                  </div>
                )}
              </div>
              <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-2 px-1">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4 flex-row"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-white flex-shrink-0 flex items-center justify-center mt-1">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <div className="bg-[#121214] border border-white/10 px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-white/50 animate-spin" />
              <span className="text-white/50 text-sm font-medium">Analyzing data...</span>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="flex-none p-4 md:p-6 border-t border-white/10 bg-black/50 backdrop-blur-md">
        
        {/* Quick Prompts */}
        <div className="flex overflow-x-auto gap-2 mb-4 pb-2 scrollbar-hide">
          {QUICK_PROMPTS.map((qp, i) => (
            <button 
              key={i}
              onClick={() => sendMessage(qp.text)}
              disabled={isLoading}
              className="flex-shrink-0 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white/70 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <span>{qp.icon}</span> {qp.text}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="ASK ABOUT YOUR FITNESS GOALS..."
            disabled={isLoading}
            className="w-full bg-[#121214] border border-white/20 rounded-full h-14 pl-6 pr-14 text-sm md:text-base text-white focus:outline-none focus:border-white transition-colors disabled:opacity-50 font-bold uppercase tracking-wide placeholder:tracking-widest"
          />
          <button 
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-white/90 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center text-[10px] font-bold text-white/30 uppercase tracking-widest mt-3">
          AI can make mistakes. Verify important medical or health info.
        </div>
      </div>
    </div>
  )
}
