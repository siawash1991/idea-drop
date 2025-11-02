'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, type Validation, type AnalysisResult } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Lightbulb,
  AlertTriangle,
  Users,
  Target,
  BarChart3,
  ArrowLeft,
} from 'lucide-react'
import { getSentimentColor, formatPersianDate } from '@/lib/utils'

export default function ValidationResultPage() {
  const params = useParams()
  const router = useRouter()
  const validationId = params.id as string

  const [validation, setValidation] = useState<Validation | null>(null)
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()

    // اگر status processing است، هر 5 ثانیه refresh کن
    const interval = setInterval(() => {
      if (validation?.status === 'processing' || validation?.status === 'pending') {
        loadData()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [validationId, validation?.status])

  const loadData = async () => {
    try {
      // بارگذاری validation
      const { data: validationData, error: validationError } = await supabase
        .from('validations')
        .select('*')
        .eq('id', validationId)
        .single()

      if (validationError) {
        console.error('Error loading validation:', validationError)
        return
      }

      setValidation(validationData)

      // بارگذاری results
      if (validationData.status === 'completed') {
        const { data: resultsData, error: resultsError } = await supabase
          .from('analysis_results')
          .select('*')
          .eq('validation_id', validationId)

        if (!resultsError && resultsData) {
          setResults(resultsData)
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSentimentIcon = (score: number) => {
    if (score > 0.3) return <TrendingUp className="h-5 w-5 text-green-600" />
    if (score < -0.3) return <TrendingDown className="h-5 w-5 text-red-600" />
    return <Minus className="h-5 w-5 text-gray-600" />
  }

  const getSentimentLabel = (score: number) => {
    if (score > 0.3) return 'مثبت'
    if (score < -0.3) return 'منفی'
    return 'خنثی'
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

  if (!validation) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">اعتبارسنجی یافت نشد</h2>
        <Button onClick={() => router.push('/dashboard')}>
          بازگشت به داشبورد
        </Button>
      </div>
    )
  }

  // نمایش وضعیت در حال پردازش
  if (validation.status === 'processing' || validation.status === 'pending') {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Clock className="h-16 w-16 text-primary animate-spin mb-4" />
            <h2 className="text-2xl font-bold mb-2">در حال تحلیل ایده شما...</h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              این فرایند ممکن است چند دقیقه طول بکشد. داریم داده‌های واقعی از منابع مختلف جمع‌آوری می‌کنیم و با هوش مصنوعی تحلیل می‌کنیم.
            </p>
            <div className="w-full max-w-md">
              <Progress value={45} className="mb-2" />
              <p className="text-sm text-center text-gray-500">
                جمع‌آوری داده‌ها و تحلیل هوش مصنوعی...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // نمایش خطا
  if (validation.status === 'failed') {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">خطا در تحلیل</h2>
            <p className="text-gray-600 mb-6">
              متأسفانه مشکلی در تحلیل ایده شما پیش آمد. لطفاً دوباره تلاش کنید.
            </p>
            <Button onClick={() => router.push('/dashboard/new')}>
              اعتبارسنجی جدید
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // محاسبه داده‌های کلی
  const avgSentiment = results.length > 0
    ? results.reduce((sum, r) => sum + (r.sentiment_score || 0), 0) / results.length
    : 0

  const firstResult = results[0]
  const distribution = firstResult?.key_insights?.distribution || { positive: 33, negative: 33, neutral: 34 }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-2"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به داشبورد
          </Button>
          <h1 className="text-3xl font-bold">{validation.idea_title}</h1>
          <p className="text-gray-600 mt-2">{validation.idea_description}</p>
          {validation.target_market && (
            <p className="text-sm text-gray-500 mt-1">
              <Target className="inline h-4 w-4 ml-1" />
              بازار هدف: {validation.target_market}
            </p>
          )}
        </div>
        <Badge variant="default" className="text-lg py-2 px-4">
          <CheckCircle2 className="ml-2 h-5 w-5" />
          تکمیل شده
        </Badge>
      </div>

      <Separator />

      {/* احساسات کلی */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>احساسات کلی</span>
            {getSentimentIcon(avgSentiment)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getSentimentColor(avgSentiment)}`}>
                {getSentimentLabel(avgSentiment)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                امتیاز: {avgSentiment.toFixed(2)}
              </p>
            </div>
            <div className="col-span-2 space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">مثبت</span>
                  <span className="text-sm font-medium">{distribution.positive}%</span>
                </div>
                <Progress value={distribution.positive} className="bg-gray-200" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">خنثی</span>
                  <span className="text-sm font-medium">{distribution.neutral}%</span>
                </div>
                <Progress value={distribution.neutral} className="bg-gray-200" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">منفی</span>
                  <span className="text-sm font-medium">{distribution.negative}%</span>
                </div>
                <Progress value={distribution.negative} className="bg-gray-200" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* کارت‌های آمار */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="ml-2 h-5 w-5 text-primary" />
              تقاضای بازار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {firstResult?.market_demand === 'high' ? 'بالا' :
               firstResult?.market_demand === 'medium' ? 'متوسط' : 'پایین'}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              بر اساس تحلیل داده‌های جمع‌آوری شده
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className="ml-2 h-5 w-5 text-primary" />
              سطح رقابت
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {firstResult?.competition_level === 'high' ? 'بالا' :
               firstResult?.competition_level === 'medium' ? 'متوسط' : 'پایین'}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              میزان رقابت در این بازار
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs برای جزئیات */}
      <Tabs defaultValue="summary" dir="rtl">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">خلاصه</TabsTrigger>
          <TabsTrigger value="insights">بینش‌ها</TabsTrigger>
          <TabsTrigger value="pain-points">نقاط درد</TabsTrigger>
          <TabsTrigger value="recommendations">توصیه‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>خلاصه تحلیل</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {firstResult?.raw_data?.summary || 'خلاصه‌ای در دسترس نیست'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="ml-2 h-5 w-5 text-yellow-500" />
                یافته‌های کلیدی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {firstResult?.key_insights?.keyFindings?.map((finding: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-600 ml-2 mt-0.5 flex-shrink-0" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pain-points" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="ml-2 h-5 w-5 text-orange-500" />
                نقاط درد کاربران
              </CardTitle>
              <CardDescription>
                مشکلاتی که کاربران با آن دست و پنجه نرم می‌کنند
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {firstResult?.pain_points?.map((point: string, index: number) => (
                  <li key={index} className="flex items-start p-3 bg-orange-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600 ml-2 mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ویژگی‌های درخواستی</CardTitle>
              <CardDescription>
                ویژگی‌هایی که کاربران می‌خواهند
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {firstResult?.feature_requests?.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-center text-sm font-medium ml-2">
                      {index + 1}
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="ml-2 h-5 w-5 text-primary" />
                توصیه‌های عملی
              </CardTitle>
              <CardDescription>
                پیشنهادات برای بهبود و توسعه ایده
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {firstResult?.raw_data?.recommendations?.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-bold ml-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed">{rec}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Info */}
      <Card className="bg-gray-50">
        <CardContent className="py-4">
          <p className="text-sm text-gray-600 text-center">
            تحلیل شده در {formatPersianDate(validation.updated_at)} | منابع داده: تلگرام، Reddit، دیجی‌کلا
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
