'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, supabaseAdmin } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { UserPlus, Loader2 } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // مرحله 1: ثبت نام کاربر
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      })

      if (authError) {
        toast({
          title: 'خطا در ثبت نام',
          description: authError.message === 'User already registered'
            ? 'این ایمیل قبلاً ثبت شده است'
            : authError.message,
          variant: 'destructive',
        })
        return
      }

      if (authData.user) {
        // مرحله 2: ساخت profile در دیتابیس
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            full_name: formData.fullName,
            subscription_tier: 'free',
            validations_used: 0,
            validations_limit: 2,
          })

        if (profileError) {
          console.error('Error creating profile:', profileError)
          // اگر profile ساخته نشد، کاربر رو حذف می‌کنیم
          // (این در production باید بهتر handle بشه)
        }

        toast({
          title: 'ثبت نام موفق',
          description: 'حساب شما با موفقیت ساخته شد. لطفاً وارد شوید.',
        })

        // انتقال به صفحه ورود
        setTimeout(() => {
          router.push('/auth/login')
        }, 1500)
      }
    } catch (error) {
      console.error('Signup error:', error)
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
            ساخت حساب کاربری
          </CardTitle>
          <CardDescription className="text-center">
            برای استفاده از پلتفرم ثبت نام کنید
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">نام کامل</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="نام و نام خانوادگی"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                disabled={loading}
                minLength={2}
              />
            </div>
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
                placeholder="حداقل 6 کاراکتر"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
                minLength={6}
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
                  در حال ثبت نام...
                </>
              ) : (
                <>
                  <UserPlus className="ml-2 h-4 w-4" />
                  ثبت نام
                </>
              )}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              حساب کاربری دارید؟{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                وارد شوید
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
