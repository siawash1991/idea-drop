'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { ideaValidationSchema, type IdeaValidationInput } from '@/lib/validation'

export default function NewValidationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<IdeaValidationInput>({
    title: '',
    description: '',
    targetMarket: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation با Zod
    const result = ideaValidationSchema.safeParse(formData)
    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message
        }
      })
      setErrors(newErrors)
      toast({
        title: 'خطا در اعتبارسنجی',
        description: 'لطفاً فیلدها را بررسی کنید',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      // گرفتن user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // بررسی limit
      const { data: profile } = await supabase
        .from('profiles')
        .select('validations_used, validations_limit')
        .eq('id', user.id)
        .single()

      if (profile && profile.validations_used >= profile.validations_limit) {
        toast({
          title: 'محدودیت استفاده',
          description: 'شما به حد مجاز اعتبارسنجی رسیده‌اید. لطفاً اشتراک خود را ارتقا دهید.',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }

      // ساخت validation record
      const { data: validation, error: validationError } = await supabase
        .from('validations')
        .insert({
          user_id: user.id,
          idea_title: formData.title,
          idea_description: formData.description,
          target_market: formData.targetMarket || null,
          status: 'pending',
        })
        .select()
        .single()

      if (validationError) {
        console.error('Error creating validation:', validationError)
        toast({
          title: 'خطا',
          description: 'مشکلی در ایجاد اعتبارسنجی پیش آمد',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }

      // به‌روزرسانی validations_used
      await supabase
        .from('profiles')
        .update({
          validations_used: (profile?.validations_used || 0) + 1
        })
        .eq('id', user.id)

      // فراخوانی API برای شروع پردازش
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          validation_id: validation.id,
        }),
      })

      if (!response.ok) {
        console.error('Error starting validation:', await response.text())
        toast({
          title: 'هشدار',
          description: 'اعتبارسنجی ایجاد شد اما پردازش با مشکل مواجه شد',
        })
      } else {
        toast({
          title: 'موفق',
          description: 'اعتبارسنجی شروع شد. در حال انتقال به صفحه نتایج...',
        })
      }

      // انتقال به صفحه نتایج
      setTimeout(() => {
        router.push(`/dashboard/validation/${validation.id}`)
      }, 1000)

    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'خطا',
        description: 'مشکلی پیش آمده است',
        variant: 'destructive',
      })
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          اعتبارسنجی ایده جدید
        </h1>
        <p className="text-gray-600">
          ایده خود را وارد کنید تا با استفاده از هوش مصنوعی و داده‌های واقعی بازار تحلیل شود
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="ml-2 h-5 w-5 text-primary" />
            جزئیات ایده
          </CardTitle>
          <CardDescription>
            هرچه اطلاعات بیشتری وارد کنید، تحلیل دقیق‌تری دریافت خواهید کرد
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                عنوان ایده <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="مثال: اپلیکیشن سفارش غذای سالم برای ورزشکاران"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={loading}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                توضیحات ایده <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="ایده شما چیست؟ چه مشکلی را حل می‌کند؟ چه ویژگی‌هایی دارد؟"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
                rows={8}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
              <p className="text-sm text-gray-500">
                {formData.description.length} / 2000 کاراکتر
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetMarket">
                بازار هدف (اختیاری)
              </Label>
              <Input
                id="targetMarket"
                placeholder="مثال: ورزشکاران حرفه‌ای 20 تا 35 سال در تهران"
                value={formData.targetMarket}
                onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                disabled={loading}
                className={errors.targetMarket ? 'border-red-500' : ''}
              />
              {errors.targetMarket && (
                <p className="text-sm text-red-500">{errors.targetMarket}</p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                چه اتفاقی می‌افتد؟
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• جمع‌آوری داده‌های واقعی از تلگرام، Reddit و دیجی‌کلا</li>
                <li>• تحلیل احساسات کاربران با هوش مصنوعی Claude</li>
                <li>• شناسایی نقاط درد و درخواست‌های کاربران</li>
                <li>• ارائه توصیه‌های عملی برای بهبود ایده</li>
              </ul>
            </div>

            <div className="flex space-x-4 space-x-reverse pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                    در حال پردازش...
                  </>
                ) : (
                  <>
                    <ArrowRight className="ml-2 h-5 w-5" />
                    شروع اعتبارسنجی
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.push('/dashboard')}
                disabled={loading}
              >
                انصراف
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
