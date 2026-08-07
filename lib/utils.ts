/**
 * General utility functions for FitCompanion.
 * cn() is the standard Shadcn UI class merger — do not remove.
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes without conflicts.
 * Required by all Shadcn UI components.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

/**
 * Format a date to YYYY-MM-DD (used as log identifiers).
 */
export function toDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]
}

/**
 * Format a date for display (e.g., "Thursday, 7 August").
 */
export function formatDisplayDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

/**
 * Format a date to short form (e.g., "7 Aug").
 */
export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

/**
 * Get the day abbreviation (e.g., "Mon", "Tue").
 */
export function getDayAbbr(date: Date): string {
  return date.toLocaleDateString('en-IN', { weekday: 'short' })
}

/**
 * Get a time-appropriate greeting.
 */
export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Good night'
}

/**
 * Get the 7-day week starting from Monday of the current week.
 */
export function getWeekDays(startDate: Date = new Date()): Date[] {
  const monday = new Date(startDate)
  const day = monday.getDay()
  const diff = day === 0 ? -6 : 1 - day
  monday.setDate(monday.getDate() + diff)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

// ─── Number Utilities ─────────────────────────────────────────────────────────

export function round(value: number, decimals: number = 1): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-IN')
}

export function formatWeight(kg: number): string {
  return `${round(kg, 1)} kg`
}

export function formatCalories(kcal: number): string {
  return `${formatNumber(Math.round(kcal))} kcal`
}

export function formatWater(ml: number): string {
  if (ml >= 1000) return `${round(ml / 1000, 1)} L`
  return `${ml} ml`
}

export function calcPercent(value: number, total: number): number {
  if (total === 0) return 0
  return Math.min(100, Math.round((value / total) * 100))
}

// ─── Streak Utilities ─────────────────────────────────────────────────────────

export function isYesterday(dateStr: string): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return toDateString(yesterday) === dateStr
}

export function isToday(dateStr: string): boolean {
  return toDateString() === dateStr
}

// ─── API Utilities ────────────────────────────────────────────────────────────

export function apiSuccess<T>(data: T, message?: string) {
  return Response.json({ success: true, data, message }, { status: 200 })
}

export function apiError(error: string, status: number = 400, details?: unknown) {
  return Response.json({ success: false, error, details }, { status })
}
