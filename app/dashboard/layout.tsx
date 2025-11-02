'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Profile } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut, Home, PlusCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error loading profile:', error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: 'خروج موفق',
        description: 'از حساب خود خارج شدید',
      })
      router.push('/')
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'مشکلی در خروج پیش آمد',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8 space-x-reverse">
              <Link href="/dashboard" className="flex items-center">
                <h1 className="text-xl font-bold text-primary">
                  Idea Validator
                </h1>
              </Link>
              <nav className="hidden md:flex space-x-4 space-x-reverse">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <Home className="ml-2 h-4 w-4" />
                    داشبورد
                  </Button>
                </Link>
                <Link href="/dashboard/new">
                  <Button variant="ghost" size="sm">
                    <PlusCircle className="ml-2 h-4 w-4" />
                    اعتبارسنجی جدید
                  </Button>
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              {profile && (
                <div className="hidden md:block text-sm">
                  <p className="font-medium">{profile.full_name}</p>
                  <p className="text-gray-500 text-xs">
                    {profile.subscription_tier === 'free' ? 'رایگان' :
                     profile.subscription_tier === 'pro' ? 'حرفه‌ای' : 'کسب‌وکار'}
                  </p>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="ml-2 h-4 w-4" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
