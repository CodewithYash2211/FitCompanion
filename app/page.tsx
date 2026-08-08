'use client'

import * as React from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, Activity, Flame, Droplet, 
  Moon, Zap, Shield, Play, ChevronRight, CheckCircle2,
  Brain, Utensils, TrendingUp, Sparkles, BookOpen, Quote
} from 'lucide-react'

// ─── NAV ──────────────────────────────────────────────────────────────────
function TopNav() {
  const { scrollYProgress } = useScroll()
  
  return (
    <>
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-[60]"
        style={{ scaleX: scrollYProgress }}
      />
      <nav className="fixed top-1 w-full z-50 transition-all duration-500 bg-black/50 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
          <span className="font-display font-bold text-xl tracking-tighter uppercase text-white">FITCOMPANION</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Hostel Mode', 'Testimonials'].map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-sm font-bold text-white/50 hover:text-white uppercase tracking-widest transition-colors">
              {link}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-white/50 hover:text-white uppercase tracking-widest transition-colors hidden md:block">
            Login
          </Link>
          <Link href="/register" className="h-10 px-6 bg-white text-black font-bold text-sm uppercase tracking-widest flex items-center justify-center hover:bg-white/90 transition-all">
            Get Access
          </Link>
        </div>
      </div>
    </nav>
    </>
  )
}

// ─── 1. HERO SECTION ────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative w-full min-h-[100vh] flex items-center pt-20 overflow-hidden bg-black">
      {/* Background Video with exact requirements */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay (65%) */}
        <div className="absolute inset-0 bg-black/65" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-90" />
        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
        
        {/* Very soft light rays */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[20%] w-[20%] h-[150%] bg-gradient-to-b from-white/10 to-transparent rotate-45 blur-3xl transform -translate-x-1/2" />
          <div className="absolute top-[-20%] left-[80%] w-[15%] h-[150%] bg-gradient-to-b from-white/5 to-transparent -rotate-45 blur-3xl transform -translate-x-1/2" />
        </div>

        {/* Animated particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`hero-particle-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              left: Math.random() * 100 + 'vw',
              top: Math.random() * 100 + 'vh',
            }}
            animate={{
              y: [0, -100 - Math.random() * 100],
              opacity: [0, Math.random() * 0.4 + 0.1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT: Copy */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white/80 mb-6 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full bg-white opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 bg-white"></span>
            </span>
            System Online
          </div>
          
          <h1 className="font-display font-bold text-6xl md:text-[80px] lg:text-[100px] text-white tracking-tighter leading-[0.9] mb-6 uppercase">
            Outwork <br />
            <span className="text-white/40">Yesterday.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/60 font-medium mb-10 max-w-lg leading-snug">
            The intelligent fitness engine engineered specifically for students. Adapt to hostel food, survive exam stress, and hit your goals.
          </p>
          
          <div className="flex flex-wrap items-center gap-6 mb-12">
            <Link href="/register" className="h-14 px-8 bg-white text-black font-bold text-lg inline-flex items-center justify-center hover:bg-white/90 transition-all uppercase tracking-wide">
              Initialize Profile <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button className="h-14 px-8 border border-white/20 text-white font-bold text-lg inline-flex items-center justify-center hover:bg-white/5 transition-all uppercase tracking-wide backdrop-blur-sm">
              <Play className="mr-2 w-5 h-5" /> Watch Demo
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-8 w-full max-w-md">
            <div>
              <div className="text-3xl font-display font-bold text-white mb-1">10k+</div>
              <div className="text-xs font-bold text-white/40 uppercase tracking-widest">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-white mb-1">98%</div>
              <div className="text-xs font-bold text-white/40 uppercase tracking-widest">Goal Reached</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-white mb-1">24/7</div>
              <div className="text-xs font-bold text-white/40 uppercase tracking-widest">AI Guidance</div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT: Floating Live Dashboard */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative lg:h-[600px] hidden lg:block"
          style={{ perspective: 1000 }}
        >
          {/* Main Dashboard Widget */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] bg-black/60 backdrop-blur-2xl border border-white/10 p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
              <div>
                <h3 className="font-bold text-white text-xl tracking-tight uppercase">Fit Score™</h3>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Live Telemetry</p>
              </div>
              <div className="text-5xl font-display font-bold text-white">
                82
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                { label: 'Nutrition', value: '+35', color: 'text-white' },
                { label: 'Workout', value: '+25', color: 'text-white' },
                { label: 'Recovery', value: '+12', color: 'text-white/60' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="text-sm font-bold text-white/70 uppercase tracking-widest">{item.label}</div>
                  <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Priority Target</div>
              <div className="text-white font-bold tracking-wide">Increase Protein Intake (+40g)</div>
            </div>
          </motion.div>

          {/* Floating Quick Action 1 */}
          <motion.div 
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-12 top-20 bg-black/80 backdrop-blur-xl border border-white/10 p-4 shadow-xl flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">2,450</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Kcal Burned</div>
            </div>
          </motion.div>

          {/* Floating Quick Action 2 */}
          <motion.div 
            animate={{ y: [-15, 15, -15] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -left-12 bottom-32 bg-black/80 backdrop-blur-xl border border-white/10 p-4 shadow-xl flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Droplet className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">2.4L</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Hydration</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── 2. WHY FITCOMPANION ──────────────────────────────────────────────────
function WhySection() {
  return (
    <section id="features" className="py-32 bg-black border-t border-white/5 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          className="mb-24 md:w-2/3"
        >
          <h2 className="font-display font-bold text-5xl md:text-7xl uppercase tracking-tighter mb-6 leading-none">
            Built for <br /><span className="text-white/40">Student Reality.</span>
          </h2>
          <p className="text-xl text-white/50 font-medium">
            Generic fitness apps assume you have a perfect kitchen and unlimited time. We know you have hostel mess food and exams.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Hostel Lifestyle",
              desc: "Algorithms that understand mess menus and local street food to keep your macros on track.",
              icon: Utensils
            },
            {
              title: "Exam Stress",
              desc: "Automatically scales down workout volume during midterms to prioritize CNS recovery.",
              icon: Brain
            },
            {
              title: "No Guidance",
              desc: "A 24/7 AI coach trained on sports science to answer every micro-adjustment you need.",
              icon: Sparkles
            }
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 border border-white/10 hover:bg-white/[0.02] transition-colors relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <feat.icon className="w-8 h-8 text-white mb-8" />
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">{feat.title}</h3>
              <p className="text-white/50 font-medium leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 3. INTERACTIVE DASHBOARD SHOWCASE ────────────────────────────────────
function DashboardShowcase() {
  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center mb-20">
         <h2 className="font-display font-bold text-4xl md:text-6xl uppercase tracking-tighter">Command Center</h2>
      </div>
      
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          className="border border-white/10 bg-black p-4 md:p-8 shadow-2xl relative"
        >
          {/* Simulated Dashboard UI */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="h-64 border border-white/5 bg-white/[0.02] p-6 flex flex-col justify-between group hover:border-white/20 transition-all cursor-crosshair">
                <div className="text-sm font-bold text-white/40 uppercase tracking-widest">Weekly Load</div>
                {/* Fake Chart bars */}
                <div className="flex items-end gap-2 h-32 w-full mt-auto">
                  {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: false, margin: "-100px" }}
                      transition={{ delay: i * 0.1, duration: 1 }}
                      className="flex-1 bg-white/20 group-hover:bg-white transition-colors"
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="h-32 border border-white/5 bg-white/[0.02] p-6">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Total Volume</div>
                  <div className="text-3xl font-display font-bold">12,450 kg</div>
                </div>
                <div className="h-32 border border-white/5 bg-white/[0.02] p-6">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Active Streak</div>
                  <div className="text-3xl font-display font-bold">14 Days</div>
                </div>
              </div>
            </div>
            <div className="border border-white/5 bg-white/[0.02] p-6 flex flex-col">
              <div className="text-sm font-bold text-white/40 uppercase tracking-widest mb-8">AI Insights</div>
              <div className="space-y-4 flex-1">
                <div className="p-4 border border-white/5 bg-black">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold uppercase tracking-widest">Recovery Alert</span>
                  </div>
                  <p className="text-sm text-white/60">CNS fatigue detected. Consider swapping heavy deadlifts for machine pulls today.</p>
                </div>
                <div className="p-4 border border-white/5 bg-black">
                  <div className="flex items-center gap-2 mb-2">
                    <Utensils className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold uppercase tracking-widest">Nutrition</span>
                  </div>
                  <p className="text-sm text-white/60">Missing 30g protein for today's target. A scoop of whey will hit it.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── 4. HOSTEL MODE & 5. EXAM MODE ────────────────────────────────────────
function FeatureModes() {
  return (
    <section id="hostel-mode" className="py-32 bg-black border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 space-y-32">
        {/* Hostel Mode */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            className="order-2 lg:order-1"
          >
            <div className="h-[500px] border border-white/10 bg-[#050505] p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?q=80&w=1000')] bg-cover bg-center opacity-20 grayscale group-hover:scale-105 transition-transform duration-1000" />
              <div className="relative z-10 h-full flex flex-col justify-end">
                <div className="bg-black/80 backdrop-blur-md border border-white/10 p-6 max-w-sm">
                  <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Logged Meal</div>
                  <div className="text-xl font-bold uppercase mb-1">Mess Dal & Rice</div>
                  <div className="flex justify-between text-sm text-white/60 mt-4">
                    <span>450 Kcal</span>
                    <span>12g Protein</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            className="order-1 lg:order-2"
          >
            <h2 className="font-display font-bold text-4xl md:text-6xl uppercase tracking-tighter mb-6">
              Hostel Mode.
            </h2>
            <p className="text-xl text-white/50 font-medium mb-8">
              We know you can't cook salmon and asparagus. Our database includes standard Indian mess food, canteen snacks, and street food so you can track reality, not fiction.
            </p>
            <ul className="space-y-4">
              {['Mess food database', 'Low-budget protein alternatives', 'Canteen macro estimation'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-white" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Exam Mode */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
          >
            <h2 className="font-display font-bold text-4xl md:text-6xl uppercase tracking-tighter mb-6">
              Exam Mode.
            </h2>
            <p className="text-xl text-white/50 font-medium mb-8">
              During finals, your body is under immense stress. Exam Mode automatically deloads your workout volume, increases sleep targets, and adjusts calories for maintenance.
            </p>
            <button className="h-12 px-6 border border-white/20 text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
              Explore Protocols
            </button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            className="h-[400px] border border-white/10 bg-[#050505] p-8 flex flex-col justify-center gap-6"
          >
             <div className="p-6 border border-white/5 bg-black relative overflow-hidden">
                <div className="absolute left-0 top-0 w-1 h-full bg-white" />
                <div className="text-sm font-bold text-white/40 uppercase tracking-widest mb-1">Status</div>
                <div className="text-2xl font-display font-bold uppercase text-white">Exam Mode Active</div>
                <div className="mt-4 text-white/50 font-mono text-sm">Volume reduced by 40%</div>
             </div>
             <div className="p-6 border border-white/5 bg-white/[0.02]">
                <div className="text-sm font-bold text-white/40 uppercase tracking-widest mb-1">Next Action</div>
                <div className="text-lg font-bold text-white">20 Min Mobility + Sleep</div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── 6,7,8,9. CORE FEATURES GRID ──────────────────────────────────────────
function CoreFeatures() {
  return (
    <section className="py-32 bg-[#020202] border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="text-center mb-24">
          <h2 className="font-display font-bold text-4xl md:text-6xl uppercase tracking-tighter mb-4">The Complete Stack</h2>
          <p className="text-white/40 font-medium uppercase tracking-widest">Everything you need to grow.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* AI Coach */}
          <div className="border border-white/10 p-10 bg-black hover:border-white/30 transition-colors group">
            <Brain className="w-10 h-10 text-white mb-8" />
            <h3 className="text-2xl font-bold uppercase mb-4">AI Coach</h3>
            <p className="text-white/50 mb-8 h-20">Real-time adjustments based on your daily feedback. Sore? Didn't sleep well? The AI adapts your plan instantly.</p>
            <div className="p-4 border border-white/5 bg-white/[0.02] font-mono text-sm text-white/70">
              <span className="text-white font-bold">User:</span> My lower back is tight today.<br/>
              <span className="text-white font-bold opacity-50 mt-2 block">System:</span> Swapping Barbell Squats for Leg Press. Generating mobility routine...
            </div>
          </div>

          {/* Workout Planner */}
          <div className="border border-white/10 p-10 bg-black hover:border-white/30 transition-colors group">
            <Activity className="w-10 h-10 text-white mb-8" />
            <h3 className="text-2xl font-bold uppercase mb-4">Workout Engine</h3>
            <p className="text-white/50 mb-8 h-20">Periodized programming that actually works. Log reps, track RPE, and watch your 1RM climb.</p>
            <div className="space-y-2">
              <div className="h-10 bg-white/[0.05] border border-white/5 flex items-center px-4 justify-between">
                <span className="font-bold text-sm uppercase">Bench Press</span>
                <span className="font-mono text-white/50">4 x 8 @ 80kg</span>
              </div>
              <div className="h-10 bg-white/[0.05] border border-white/5 flex items-center px-4 justify-between">
                <span className="font-bold text-sm uppercase">Incline DB Press</span>
                <span className="font-mono text-white/50">3 x 10 @ 30kg</span>
              </div>
            </div>
          </div>

          {/* Diet Planner */}
          <div className="border border-white/10 p-10 bg-black hover:border-white/30 transition-colors group">
            <Utensils className="w-10 h-10 text-white mb-8" />
            <h3 className="text-2xl font-bold uppercase mb-4">Macro Tracking</h3>
            <p className="text-white/50 mb-8 h-20">Stop guessing. Precision macro tracking built for Indian diets, from raw ingredients to cooked meals.</p>
            <div className="flex gap-4">
               <div className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center font-bold">P</div>
               <div className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center font-bold">C</div>
               <div className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center font-bold">F</div>
            </div>
          </div>

          {/* Analytics */}
          <div className="border border-white/10 p-10 bg-black hover:border-white/30 transition-colors group">
            <TrendingUp className="w-10 h-10 text-white mb-8" />
            <h3 className="text-2xl font-bold uppercase mb-4">Deep Analytics</h3>
            <p className="text-white/50 mb-8 h-20">Measure what matters. Track weight trends, strength progressions, and adherence over time.</p>
            <div className="h-24 border border-white/5 relative overflow-hidden flex items-end p-2 gap-1">
              {[20,30,25,40,35,50,60,55,70,65,80].map((h, i) => (
                <div key={i} className="flex-1 bg-white/20" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 10. TESTIMONIALS ─────────────────────────────────────────────────────
function Testimonials() {
  const reviews = [
    { text: "I lost 12kg while living in a hostel. The mess food alternatives feature is a lifesaver.", author: "Rahul M.", role: "Engineering Student" },
    { text: "Exam mode kept me sane during finals. I maintained my muscle mass without burning out.", author: "Sneha P.", role: "Medical Student" },
    { text: "The brutalist design makes me want to work out. It's like having a hardcore coach in my pocket.", author: "Vikram K.", role: "Design Student" }
  ]

  return (
    <section id="testimonials" className="py-32 bg-black border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <h2 className="font-display font-bold text-4xl md:text-6xl uppercase tracking-tighter mb-16">Field Reports</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ delay: i * 0.1 }}
              className="p-8 border border-white/10 bg-[#050505] flex flex-col justify-between"
            >
              <Quote className="w-8 h-8 text-white/20 mb-6" />
              <p className="text-lg font-medium text-white/80 leading-relaxed mb-10">"{rev.text}"</p>
              <div>
                <div className="font-bold uppercase tracking-wider">{rev.author}</div>
                <div className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">{rev.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 11. FAQ ──────────────────────────────────────────────────────────────
function FAQ() {
  const faqs = [
    { q: "Is it free for students?", a: "The core engine is free forever. Premium analytics and AI coaching are available for a small monthly fee." },
    { q: "Does it work for home workouts?", a: "Yes. The AI adjusts your protocol based on available equipment, from zero gear to full gym." },
    { q: "How does Hostel Mode actually work?", a: "You select your mess menu items, and the engine estimates macros based on average Indian cooking standards." }
  ]
  return (
    <section className="py-32 bg-[#020202] border-t border-white/5">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        <h2 className="font-display font-bold text-4xl uppercase tracking-tighter mb-16 text-center">Intel</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/10 p-6 bg-black">
              <h3 className="font-bold uppercase tracking-wider mb-2">{faq.q}</h3>
              <p className="text-white/50 font-medium">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 12. PREMIUM FOOTER ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-20 bg-black border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
            <span className="font-display font-bold text-2xl tracking-tighter uppercase">FITCOMPANION</span>
          </div>
          <p className="text-white/40 font-medium mb-8">
            The intelligent engine for your physical health. Engineered for those who demand performance.
          </p>
          <Link href="/register" className="h-12 px-6 bg-white text-black font-bold uppercase tracking-widest inline-flex items-center justify-center hover:bg-white/90 transition-all">
            Initialize
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-16">
          <div>
            <h4 className="font-bold text-white/30 uppercase tracking-widest text-xs mb-6">System</h4>
            <ul className="space-y-4">
              {['Dashboard', 'Fit Score™', 'AI Engine', 'Protocols'].map(link => (
                <li key={link}><a href="#" className="font-bold uppercase tracking-wider text-sm hover:text-white/70 transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white/30 uppercase tracking-widest text-xs mb-6">Legal</h4>
            <ul className="space-y-4">
              {['Privacy', 'Terms', 'Contact'].map(link => (
                <li key={link}><a href="#" className="font-bold uppercase tracking-wider text-sm hover:text-white/70 transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-20 pt-8 border-t border-white/5 text-center md:text-left">
        <p className="text-white/20 font-bold uppercase tracking-widest text-[10px]">© 2026 FitCompanion Core. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

// ─── MAIN PAGE COMPONENT ──────────────────────────────────────────────────
export default function LandingPage() {
  const [showTop, setShowTop] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-black overflow-x-hidden selection:bg-white/20 text-white font-sans"
    >
      <TopNav />
      <HeroSection />
      <WhySection />
      <DashboardShowcase />
      <FeatureModes />
      <CoreFeatures />
      <Testimonials />
      <FAQ />
      <Footer />
      
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 w-12 h-12 bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] z-50 hover:scale-110 active:scale-95 transition-all"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
