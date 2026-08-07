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
import { Button } from '@/components/ui/button'
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

  // Watch password for the strength indicator
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

      toast.success('Account created successfully!')
      // Redirect to onboarding after successful registration
      router.push('/auth/onboarding')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-foreground mb-2">
          Create account
        </h1>
        <p className="text-muted-foreground text-sm">
          Start your fitness journey today.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            disabled={isLoading}
            className="h-11 bg-white/5 border-white/10 focus:border-brand-500/50"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm font-medium text-danger animate-in fade-in">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            disabled={isLoading}
            className="h-11 bg-white/5 border-white/10 focus:border-brand-500/50"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm font-medium text-danger animate-in fade-in">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="Create a strong password"
            disabled={isLoading}
            showStrengthIndicator
            value={passwordValue} // Needed for strength indicator to react
            className="h-11 bg-white/5 border-white/10 focus:border-brand-500/50"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm font-medium text-danger animate-in fade-in">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm your password"
            disabled={isLoading}
            className="h-11 bg-white/5 border-white/10 focus:border-brand-500/50"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm font-medium text-danger animate-in fade-in">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-gradient-brand text-white text-sm font-semibold rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all mt-4"
          style={{ boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.39)' }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              Create Account <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link 
          href="/auth/login" 
          className="font-semibold text-foreground hover:text-brand-400 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
