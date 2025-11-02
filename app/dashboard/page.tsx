'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Profile, type Validation } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { calculateProgress, formatRelativeTime, getValidationStatusName } from '@/lib/utils'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [validations, setValidations] = useState<Validation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // بارگذاری profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
      }

      // بارگذاری validations
      const { data: validationsData } = await supabase
        .from('validations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (validationsData) {
        setValidations(validationsData)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: 'default',
      processing: 'secondary',
      failed: 'destructive',
      pending: 'outline',
    }
    return (
      <Badge variant={variants[status] || 'outline'}>
        {getValidationStatusName(status)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  const completedCount = validations.filter(v => v.status === 'completed').length
  const processingCount = validations.filter(v => v.status === 'processing').length
  const usagePercentage = profile ? calculateProgress(profile.validations_used, profile.validations_limit) : 0

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          خوش آمدید{profile?.full_name ? `، ${profile.full_name}` : ''}
        </h2>
        <p className="mt-2 text-gray-600">
          داشبورد اعتبارسنجی ایده‌های شما
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              استفاده شده
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile?.validations_used || 0} / {profile?.validations_limit || 0}
            </div>
            <Progress value={usagePercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {usagePercentage}% از ظرفیت استفاده شده
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              تکمیل شده
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground mt-2">
              اعتبارسنجی‌های موفق
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              در حال پردازش
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingCount}</div>
            <p className="text-xs text-muted-foreground mt-2">
              در صف تحلیل
            </p>
          </CardContent>
        </Card>
      </div>

      {/* New Validation Button */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <PlusCircle className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            اعتبارسنجی جدید
          </h3>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            ایده جدید خود را وارد کنید و از تحلیل هوش مصنوعی و داده‌های واقعی بازار بهره‌مند شوید
          </p>
          <Link href="/dashboard/new">
            <Button size="lg">
              <PlusCircle className="ml-2 h-5 w-5" />
              شروع کنید
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Validations */}
      <Card>
        <CardHeader>
          <CardTitle>آخرین اعتبارسنجی‌ها</CardTitle>
          <CardDescription>
            5 اعتبارسنجی اخیر شما
          </CardDescription>
        </CardHeader>
        <CardContent>
          {validations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              هنوز اعتبارسنجی انجام نداده‌اید
            </div>
          ) : (
            <div className="space-y-4">
              {validations.map((validation) => (
                <div
                  key={validation.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/validation/${validation.id}`)}
                >
                  <div className="flex items-center space-x-4 space-x-reverse flex-1">
                    {getStatusIcon(validation.status)}
                    <div className="flex-1">
                      <h4 className="font-medium">{validation.idea_title}</h4>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {validation.idea_description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatRelativeTime(validation.created_at)}
                      </p>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(validation.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
