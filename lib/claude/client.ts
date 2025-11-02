import Anthropic from '@anthropic-ai/sdk'

/**
 * Claude AI client برای تحلیل هوش مصنوعی
 */
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

/**
 * مدل Claude که استفاده می‌کنیم
 * claude-sonnet-4 جدیدترین و بهترین مدل Claude است
 */
export const CLAUDE_MODEL = 'claude-sonnet-4-20250514'

/**
 * تنظیمات پیش‌فرض برای API calls
 */
export const CLAUDE_CONFIG = {
  max_tokens: 4096,
  temperature: 0.7,
}
