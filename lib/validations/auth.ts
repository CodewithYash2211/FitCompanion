import * as z from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export type RegisterInput = z.infer<typeof registerSchema>

export const onboardingSchema = z.object({
  age: z.coerce.number().min(10, 'Age must be at least 10').max(120, 'Age must be at most 120'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select your gender',
  }),
  height: z.coerce.number().min(100, 'Height must be at least 100 cm').max(250, 'Height must be at most 250 cm'),
  weight: z.coerce.number().min(20, 'Weight must be at least 20 kg').max(400, 'Weight must be at most 400 kg'),
  targetWeight: z.coerce.number().min(20).max(400).optional(),
  goal: z.enum(['lose_weight', 'maintain', 'gain_weight', 'build_muscle'], {
    required_error: 'Please select your primary goal',
  }),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active'], {
    required_error: 'Please select your activity level',
  }),
  dietaryPref: z.enum(['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian'], {
    required_error: 'Please select your dietary preference',
  }),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Please select your fitness level',
  }),
  equipment: z.enum(['gym', 'home', 'none']),
  hostelMode: z.boolean().optional(),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>
