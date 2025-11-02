import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client for client-side operations
 * استفاده در کامپوننت‌های React
 */
export const supabase = createClientComponentClient()

/**
 * Supabase admin client با service role key
 * فقط در API routes استفاده شود (server-side)
 * این client می‌تونه Row Level Security رو bypass کنه
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

/**
 * Database types
 */
export interface Profile {
  id: string
  email: string
  full_name: string | null
  subscription_tier: 'free' | 'pro' | 'business'
  validations_used: number
  validations_limit: number
  created_at: string
  updated_at: string
}

export interface Validation {
  id: string
  user_id: string
  idea_title: string
  idea_description: string
  target_market: string | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

export interface AnalysisResult {
  id: string
  validation_id: string
  source: string
  sentiment_score: number | null
  sentiment_label: string | null
  key_insights: any | null
  pain_points: string[] | null
  feature_requests: string[] | null
  market_demand: string | null
  competition_level: string | null
  raw_data: any | null
  created_at: string
}

export interface ScrapedData {
  id: string
  validation_id: string
  source: string
  query: string
  data: any
  created_at: string
  expires_at: string
}
