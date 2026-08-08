'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Plus, X, Utensils, ArrowLeft, CheckCircle2, Minus, History, Star, TrendingUp, Save
} from 'lucide-react'
import Link from 'next/link'
import { useNutrition, FoodItem } from '@/lib/context/NutritionContext'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const MOCK_FOOD_DB = [
  // Indian
  { id: 1, name: 'White Rice (Cooked)', portion: '1 Katori (150g)', kcal: 195, p: 4, c: 42, f: 0 },
  { id: 2, name: 'Jeera Rice', portion: '1 Katori (150g)', kcal: 220, p: 4, c: 43, f: 3 },
  { id: 3, name: 'Dal Tadka', portion: '1 Katori (150g)', kcal: 180, p: 9, c: 24, f: 6 },
  { id: 4, name: 'Rajma Masala', portion: '1 Katori (150g)', kcal: 210, p: 10, c: 30, f: 5 },
  { id: 5, name: 'Chole', portion: '1 Katori (150g)', kcal: 240, p: 12, c: 35, f: 8 },
  { id: 6, name: 'Wheat Roti', portion: '1 medium (30g)', kcal: 90, p: 3, c: 17, f: 1 },
  { id: 7, name: 'Chapati', portion: '1 medium (30g)', kcal: 100, p: 3, c: 18, f: 2 },
  { id: 8, name: 'Paneer (Raw)', portion: '100g', kcal: 296, p: 18, c: 1, f: 24 },
  { id: 9, name: 'Paneer Bhurji', portion: '1 Katori (150g)', kcal: 320, p: 20, c: 5, f: 26 },
  { id: 10, name: 'Paneer Tikka', portion: '6 pieces (150g)', kcal: 450, p: 25, c: 8, f: 35 },
  { id: 11, name: 'Chicken Curry', portion: '1 Katori (150g)', kcal: 250, p: 22, c: 5, f: 15 },
  { id: 12, name: 'Chicken Breast', portion: '100g (Cooked)', kcal: 165, p: 31, c: 0, f: 3 },
  { id: 13, name: 'Fish Fry', portion: '1 piece (100g)', kcal: 210, p: 18, c: 2, f: 14 },
  { id: 14, name: 'Boiled Egg', portion: '1 large (50g)', kcal: 78, p: 6, c: 1, f: 5 },
  { id: 15, name: 'Omelette', portion: '2 eggs', kcal: 180, p: 12, c: 2, f: 14 },
  { id: 16, name: 'Idli', portion: '2 pieces', kcal: 110, p: 4, c: 24, f: 0 },
  { id: 17, name: 'Dosa', portion: '1 plain', kcal: 160, p: 4, c: 28, f: 4 },
  { id: 18, name: 'Uttapam', portion: '1 medium', kcal: 200, p: 5, c: 32, f: 6 },
  { id: 19, name: 'Poha', portion: '1 Katori (150g)', kcal: 260, p: 5, c: 45, f: 7 },
  { id: 20, name: 'Upma', portion: '1 Katori (150g)', kcal: 280, p: 6, c: 48, f: 8 },
  { id: 21, name: 'Misal Pav', portion: '1 plate', kcal: 450, p: 15, c: 60, f: 18 },
  { id: 22, name: 'Pav Bhaji', portion: '1 plate (2 pav)', kcal: 400, p: 8, c: 55, f: 16 },
  { id: 23, name: 'Vada Pav', portion: '1 piece', kcal: 290, p: 5, c: 38, f: 14 },
  { id: 24, name: 'Samosa', portion: '1 piece', kcal: 260, p: 4, c: 26, f: 15 },
  { id: 25, name: 'Chicken Biryani', portion: '1 plate (300g)', kcal: 480, p: 25, c: 55, f: 16 },
  { id: 26, name: 'Khichdi', portion: '1 plate (200g)', kcal: 220, p: 7, c: 40, f: 4 },
  { id: 27, name: 'Curd', portion: '1 Katori (100g)', kcal: 98, p: 11, c: 3, f: 4 },
  { id: 28, name: 'Buttermilk', portion: '1 glass (200ml)', kcal: 40, p: 3, c: 4, f: 1 },
  { id: 29, name: 'Milk (Toned)', portion: '1 glass (250ml)', kcal: 150, p: 8, c: 12, f: 7 },
  { id: 30, name: 'Banana', portion: '1 medium', kcal: 105, p: 1, c: 27, f: 0 },
  { id: 31, name: 'Apple', portion: '1 medium', kcal: 95, p: 0, c: 25, f: 0 },
  { id: 32, name: 'Orange', portion: '1 medium', kcal: 62, p: 1, c: 15, f: 0 },
  { id: 33, name: 'Mango', portion: '1 cup sliced', kcal: 99, p: 1, c: 25, f: 0 },
  { id: 34, name: 'Oats', portion: '1 bowl cooked', kcal: 150, p: 5, c: 27, f: 3 },
  // Protein
  { id: 35, name: 'Whey Protein Isolate', portion: '1 scoop (30g)', kcal: 110, p: 25, c: 1, f: 0 },
  { id: 36, name: 'Protein Shake (Milk)', portion: '1 serving', kcal: 260, p: 33, c: 13, f: 7 },
  { id: 37, name: 'Mass Gainer', portion: '1 scoop', kcal: 350, p: 15, c: 65, f: 3 },
  { id: 38, name: 'Soy Chunks', portion: '50g (Raw)', kcal: 172, p: 26, c: 16, f: 0 },
  { id: 39, name: 'Tofu', portion: '100g', kcal: 76, p: 8, c: 2, f: 4 },
  { id: 40, name: 'Peanut Butter', portion: '1 Tbsp (15g)', kcal: 94, p: 4, c: 3, f: 8 },
  { id: 41, name: 'Greek Yogurt', portion: '1 cup (150g)', kcal: 100, p: 15, c: 6, f: 0 },
  // Packaged
  { id: 42, name: 'Protein Bar', portion: '1 bar', kcal: 220, p: 20, c: 22, f: 8 },
  { id: 43, name: 'Granola Bar', portion: '1 bar', kcal: 140, p: 3, c: 24, f: 4 },
  { id: 44, name: 'Potato Chips', portion: '1 small pack (30g)', kcal: 160, p: 2, c: 15, f: 10 },
  { id: 45, name: 'Biscuits (Marie)', portion: '4 pieces', kcal: 112, p: 2, c: 20, f: 2 },
  { id: 46, name: 'Cola / Soft Drink', portion: '1 Can (330ml)', kcal: 140, p: 0, c: 39, f: 0 },
  { id: 47, name: 'Fruit Juice', portion: '1 Glass (250ml)', kcal: 110, p: 0, c: 26, f: 0 },
  { id: 48, name: 'Chocolate (Dark)', portion: '2 pieces (20g)', kcal: 120, p: 2, c: 9, f: 8 },
  { id: 49, name: 'Ice Cream (Vanilla)', portion: '1 scoop', kcal: 137, p: 2, c: 15, f: 7 },
  // Fast Food
  { id: 50, name: 'Pizza (Margherita)', portion: '1 slice', kcal: 250, p: 10, c: 30, f: 10 },
  { id: 51, name: 'Burger (Chicken)', portion: '1 sandwich', kcal: 400, p: 20, c: 45, f: 15 },
  { id: 52, name: 'French Fries', portion: '1 small serving', kcal: 230, p: 3, c: 29, f: 11 },
  { id: 53, name: 'Pasta (White Sauce)', portion: '1 bowl', kcal: 380, p: 12, c: 45, f: 16 },
  { id: 54, name: 'Sandwich (Veg)', portion: '1 sandwich', kcal: 250, p: 8, c: 40, f: 6 },
  { id: 55, name: 'Momos (Chicken)', portion: '6 pieces', kcal: 180, p: 12, c: 24, f: 4 },
  { id: 56, name: 'Noodles (Hakka)', portion: '1 bowl', kcal: 320, p: 8, c: 50, f: 10 },
]

export default function MealLogPage() {
  const router = useRouter()
  const { logMeal, draftMeals, saveDraftMeals } = useNutrition()
  
  const [search, setSearch] = React.useState('')
  const [isSearchFocused, setIsSearchFocused] = React.useState(false)
  const [activeMeal, setActiveMeal] = React.useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('Lunch')
  const [stagingFoods, setStagingFoods] = React.useState<FoodItem[]>(draftMeals || [])

  // Auto-save drafts
  React.useEffect(() => {
    if (stagingFoods.length > 0 || draftMeals.length > 0) {
      saveDraftMeals(stagingFoods)
    }
  }, [stagingFoods, saveDraftMeals])

  const filteredFoods = search 
    ? MOCK_FOOD_DB.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
    : []

  const handleAdd = (food: any) => {
    setStagingFoods([...stagingFoods, { ...food, meal: activeMeal, qty: 1 }])
    setSearch('')
    setIsSearchFocused(false)
    toast(`${food.name} added to ${activeMeal}`, { duration: 1500 })
  }

  const handleUpdateQty = (index: number, delta: number) => {
    setStagingFoods(prev => {
      const updated = [...prev]
      const newQty = Math.max(0.5, updated[index].qty! + delta)
      updated[index] = { ...updated[index], qty: newQty }
      return updated
    })
  }

  const handleRemove = (index: number) => {
    const food = stagingFoods[index]
    setStagingFoods(stagingFoods.filter((_, i) => i !== index))
    toast(`${food.name} removed`, { duration: 1500, style: { background: '#1c1c1f', color: '#fff', border: '1px solid #27272a' } })
  }

  const handleSave = () => {
    logMeal(stagingFoods)
    toast.success('Meal Saved Successfully!', { 
      description: 'Your dashboard and nutrition charts have been updated.',
      duration: 3000
    })
    setStagingFoods([])
    setTimeout(() => router.push('/nutrition'), 1000)
  }

  const mealKcal = stagingFoods.reduce((acc, curr) => acc + (curr.kcal * curr.qty!), 0)
  const mealP = stagingFoods.reduce((acc, curr) => acc + (curr.p * curr.qty!), 0)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="min-h-screen bg-[#020202] text-white p-6 md:p-12 pb-24 font-sans max-w-4xl mx-auto"
    >
      <header className="mb-12 flex justify-between items-start">
        <div>
          <Link href="/nutrition" className="text-white/50 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="font-display font-bold text-4xl uppercase tracking-tighter leading-none mb-8">
            Log Meal.
          </h1>

          <div className="flex flex-wrap gap-2">
            {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
              <button
                key={meal}
                onClick={() => setActiveMeal(meal as any)}
                className={`h-10 px-6 font-bold uppercase tracking-widest text-xs transition-colors border ${
                  activeMeal === meal 
                    ? 'bg-white text-black border-white' 
                    : 'bg-black text-white/50 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {meal}
              </button>
            ))}
          </div>
        </div>
        
        {stagingFoods.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleSave}
            className="h-12 px-8 bg-success text-black font-bold uppercase tracking-widest hover:bg-[#2ae05d] transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" /> Save Meal
          </motion.button>
        )}
      </header>

      {/* Search Bar */}
      <div className="relative mb-12">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-white/40" />
        </div>
        <input 
          type="text"
          placeholder={`Search for ${activeMeal}...`}
          value={search}
          onFocus={() => setIsSearchFocused(true)}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-14 bg-[#0a0a0c] border border-white/20 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white transition-colors uppercase tracking-wider text-sm font-medium"
        />

        <AnimatePresence>
          {isSearchFocused && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 left-0 w-full bg-[#0a0a0c] border border-white/10 shadow-2xl z-50 max-h-96 overflow-y-auto"
            >
              <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black sticky top-0 z-10">
                <span className="font-bold text-xs uppercase tracking-widest text-white/50">
                  {search ? 'Search Results' : 'Suggestions'}
                </span>
                <button onClick={() => setIsSearchFocused(false)} className="text-white/40 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!search ? (
                // Empty state suggestions
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <History className="w-3 h-3" /> Recent
                    </h3>
                    <div className="space-y-1">
                      {[MOCK_FOOD_DB[0], MOCK_FOOD_DB[34], MOCK_FOOD_DB[11]].map(f => (
                        <button key={f.id} onClick={() => handleAdd(f)} className="w-full text-left p-3 hover:bg-white/[0.02] border border-transparent hover:border-white/5 flex justify-between items-center group transition-colors">
                          <span className="text-sm font-medium">{f.name}</span>
                          <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-success" /> Popular
                    </h3>
                    <div className="space-y-1">
                      {[MOCK_FOOD_DB[35], MOCK_FOOD_DB[13], MOCK_FOOD_DB[30]].map(f => (
                        <button key={f.id} onClick={() => handleAdd(f)} className="w-full text-left p-3 hover:bg-white/[0.02] border border-transparent hover:border-white/5 flex justify-between items-center group transition-colors">
                          <span className="text-sm font-medium">{f.name}</span>
                          <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : filteredFoods.length === 0 ? (
                <div className="p-6 text-center text-white/50 text-sm font-bold uppercase tracking-widest">No foods found.</div>
              ) : (
                filteredFoods.map(food => (
                  <div key={food.id} className="flex justify-between items-center p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <div>
                      <div className="font-bold uppercase tracking-wider text-sm">{food.name}</div>
                      <div className="text-[10px] font-mono text-white/50 mt-1">{food.portion} • {food.kcal} kcal • {food.p}g P</div>
                    </div>
                    <button 
                      onClick={() => handleAdd(food)}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Logged Foods */}
      <div className="bg-black border border-white/10 p-8 min-h-[300px] flex flex-col relative">
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
          <h2 className="font-bold text-white/80 uppercase tracking-widest text-lg">{activeMeal}</h2>
          <div className="text-right">
            <div className="font-display font-bold text-3xl">{Math.round(mealKcal)} <span className="text-sm font-sans text-white/40 uppercase tracking-widest">kcal</span></div>
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{Math.round(mealP)}g Protein</div>
          </div>
        </div>

        <div className="flex-1">
          <AnimatePresence>
            {stagingFoods.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-white/30 py-12"
              >
                <Utensils className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-xs">Search to add items to {activeMeal}</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {stagingFoods.map((food, i) => (
                  <motion.div 
                    key={i}
                    layout
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-white/10 bg-[#0a0a0c] group hover:border-white/30 transition-colors gap-4"
                  >
                    <div className="flex-1">
                      <div className="font-bold uppercase tracking-wider text-sm">{food.name}</div>
                      <div className="text-xs font-mono text-white/50">{food.portion} (Base: {food.kcal} kcal)</div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-white/20 bg-black">
                        <button 
                          onClick={() => handleUpdateQty(i, -0.5)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <div className="w-12 text-center font-bold text-sm">{food.qty}</div>
                        <button 
                          onClick={() => handleUpdateQty(i, 0.5)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right min-w-[80px]">
                        <div className="font-bold text-white text-lg">{Math.round(food.kcal * food.qty!)} kcal</div>
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">P: {Math.round(food.p * food.qty!)}g</div>
                      </div>

                      <button 
                        onClick={() => handleRemove(i)}
                        className="text-white/20 hover:text-danger hover:bg-danger/10 transition-colors p-2 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Insight Mini */}
        {stagingFoods.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 pt-6 border-t border-white/10 flex items-start gap-4"
          >
             <div className="w-8 h-8 bg-white/10 flex items-center justify-center shrink-0">
               <Star className="w-4 h-4 text-warning fill-warning/20" />
             </div>
             <div>
               <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">AI Meal Analysis</div>
               <p className="text-sm font-medium text-white/70">
                 {mealP > 25 ? 'High protein meal! Great for muscle protein synthesis post-workout.' : 'Consider adding a protein source (like Whey or Paneer) to hit your macros faster.'}
               </p>
             </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
