'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, ArrowRight } from 'lucide-react'

import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const passwordValue = watch('password', '')

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to register')
      }

      toast.success('Clearance granted.')
      router.push('/onboarding')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
      <div className="mb-10 text-center">
        <h1 className="font-display font-bold text-4xl uppercase tracking-tighter mb-3">
          New Protocol
        </h1>
        <p className="text-white/50 font-medium">
          Create your profile to start tracking.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="uppercase tracking-widest text-xs font-bold text-white/70">Full Name</Label>
          <Input
            id="name"
            placeholder="JANE DOE"
            disabled={isLoading}
            className="h-12 bg-[#09090B] border-white/10 text-white placeholder:text-white/20 focus:border-white/50 rounded-none font-mono tracking-wider"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-xs font-bold text-danger uppercase tracking-wide animate-in fade-in">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="uppercase tracking-widest text-xs font-bold text-white/70">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="ACCESS_ID@DOMAIN.COM"
            disabled={isLoading}
            className="h-12 bg-[#09090B] border-white/10 text-white placeholder:text-white/20 focus:border-white/50 rounded-none font-mono tracking-wider"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs font-bold text-danger uppercase tracking-wide animate-in fade-in">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="uppercase tracking-widest text-xs font-bold text-white/70">Secure Password</Label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            disabled={isLoading}
            showStrengthIndicator
            value={passwordValue}
            className="h-12 bg-[#09090B] border-white/10 text-white focus:border-white/50 rounded-none font-mono"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs font-bold text-danger uppercase tracking-wide animate-in fade-in">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="uppercase tracking-widest text-xs font-bold text-white/70">Verify Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="••••••••"
            disabled={isLoading}
            className="h-12 bg-[#09090B] border-white/10 text-white focus:border-white/50 rounded-none font-mono"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-xs font-bold text-danger uppercase tracking-wide animate-in fade-in">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 mt-6 bg-white text-black font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Deploy Profile <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-10 text-center border-t border-white/10 pt-8 flex flex-col gap-2">
        <p className="text-sm font-bold text-white/40 uppercase tracking-widest">
          Already have an account?{' '}
          <Link 
            href="/login" 
            className="text-white hover:text-white/70 transition-colors"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}
