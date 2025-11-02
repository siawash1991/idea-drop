import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format Persian date
 */
export function formatPersianDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * Format date to relative time (e.g., "2 ساعت پیش")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'همین الان'
  if (diffMins < 60) return `${diffMins} دقیقه پیش`
  if (diffHours < 24) return `${diffHours} ساعت پیش`
  if (diffDays < 7) return `${diffDays} روز پیش`

  return formatPersianDate(d)
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(used: number, limit: number): number {
  if (limit === 0) return 0
  return Math.min(Math.round((used / limit) * 100), 100)
}

/**
 * Get subscription tier display name
 */
export function getSubscriptionTierName(tier: string): string {
  const tierNames: Record<string, string> = {
    free: 'رایگان',
    pro: 'حرفه‌ای',
    business: 'کسب‌وکار',
  }
  return tierNames[tier] || tier
}

/**
 * Get validation status display name
 */
export function getValidationStatusName(status: string): string {
  const statusNames: Record<string, string> = {
    pending: 'در انتظار',
    processing: 'در حال پردازش',
    completed: 'تکمیل شده',
    failed: 'ناموفق',
  }
  return statusNames[status] || status
}

/**
 * Get sentiment label in Persian
 */
export function getSentimentLabel(score: number): string {
  if (score > 0.3) return 'مثبت'
  if (score < -0.3) return 'منفی'
  return 'خنثی'
}

/**
 * Get sentiment color class
 */
export function getSentimentColor(score: number): string {
  if (score > 0.3) return 'text-green-600'
  if (score < -0.3) return 'text-red-600'
  return 'text-gray-600'
}
