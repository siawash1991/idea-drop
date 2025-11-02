'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { LogIn, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        toast({
          title: 'خطا در ورود',
          description: error.message === 'Invalid login credentials'
            ? 'ایمیل یا رمز عبور اشتباه است'
            : error.message,
          variant: 'destructive',
        })
        return
      }

      if (data.user) {
        toast({
          title: 'ورود موفق',
          description: 'در حال انتقال به داشبورد...',
        })
        router.push('/dashboard')
      }
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            ورود به حساب کاربری
          </CardTitle>
          <CardDescription className="text-center">
            برای دسترسی به داشبورد وارد شوید
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                placeholder="رمز عبور خود را وارد کنید"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال ورود...
                </>
              ) : (
                <>
                  <LogIn className="ml-2 h-4 w-4" />
                  ورود
                </>
              )}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              حساب کاربری ندارید؟{' '}
              <Link href="/auth/signup" className="text-primary hover:underline">
                ثبت نام کنید
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
