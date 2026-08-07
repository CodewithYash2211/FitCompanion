'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrengthIndicator?: boolean
}

const checkStrength = (pass: string) => {
  let score = 0
  if (!pass) return score
  if (pass.length >= 8) score += 1
  if (pass.match(/[A-Z]/)) score += 1
  if (pass.match(/[a-z]/)) score += 1
  if (pass.match(/[0-9]/)) score += 1
  if (pass.match(/[^A-Za-z0-9]/)) score += 1
  return Math.min(score, 4)
}

const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
const strengthColor = [
  'bg-danger/20', // 0
  'bg-danger',    // 1
  'bg-warning',   // 2
  'bg-success',   // 3
  'bg-brand-400', // 4
]

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrengthIndicator = false, value, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [score, setScore] = React.useState(0)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (showStrengthIndicator) {
        setScore(checkStrength(e.target.value))
      }
      if (onChange) {
        onChange(e)
      }
    }

    return (
      <div className="space-y-2 w-full">
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            className={cn('pr-10', className)}
            ref={ref}
            value={value}
            onChange={handleChange}
            {...props}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {showStrengthIndicator && (typeof value === 'string' && value.length > 0) && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex h-1 w-full gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-full flex-1 rounded-full transition-colors duration-300',
                    i < score ? strengthColor[score] : 'bg-white/10'
                  )}
                />
              ))}
            </div>
            <p className={cn('text-xs font-medium text-right', 
              score <= 1 ? 'text-danger' : 
              score === 2 ? 'text-warning' : 
              score === 3 ? 'text-success' : 'text-brand-400'
            )}>
              {strengthText[score]}
            </p>
          </div>
        )}
      </div>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
