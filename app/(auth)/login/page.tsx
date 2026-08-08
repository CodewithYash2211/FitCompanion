'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, ArrowRight } from 'lucide-react'

import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to login')
      }

      toast.success('System Authenticated.')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
      <div className="mb-10 text-center">
        <h1 className="font-display font-bold text-4xl uppercase tracking-tighter mb-3">
          Initialize
        </h1>
        <p className="text-white/50 font-medium">
          Enter your credentials to access the engine.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="email" className="uppercase tracking-widest text-xs font-bold text-white/70">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="ACCESS_ID@DOMAIN.COM"
            disabled={isLoading}
            className="h-14 bg-[#09090B] border-white/10 text-white placeholder:text-white/20 focus:border-white/50 rounded-none font-mono tracking-wider"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs font-bold text-danger uppercase tracking-wide animate-in fade-in">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="uppercase tracking-widest text-xs font-bold text-white/70">Password</Label>
            <Link 
              href="/auth/forgot-password" 
              className="text-[10px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest"
            >
              Reset Key
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            disabled={isLoading}
            className="h-14 bg-[#09090B] border-white/10 text-white focus:border-white/50 rounded-none font-mono"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs font-bold text-danger uppercase tracking-wide animate-in fade-in">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 mt-4 bg-white text-black font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Grant Access <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-10 text-center border-t border-white/10 pt-8 flex flex-col gap-2">
        <p className="text-sm font-bold text-white/40 uppercase tracking-widest">
          <Link 
            href="/register" 
            className="text-white hover:text-white/70 transition-colors"
          >
            Create another account
          </Link>
        </p>
      </div>
    </div>
  )
}
