import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware برای محافظت از روت‌های protected
 * و redirect کردن کاربران لاگین‌شده از صفحات auth
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // بررسی session کاربر
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
  const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard')

  // اگر کاربر لاگین کرده و می‌خواد به صفحات auth بره، به dashboard redirect کن
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // اگر کاربر لاگین نکرده و می‌خواد به dashboard بره، به login redirect کن
  if (!session && isDashboardPage) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
  ],
}
