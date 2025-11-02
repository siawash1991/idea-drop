import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Zap, Users, CheckCircle2, ArrowLeft } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-4" variant="secondary">
              پلتفرم اعتبارسنجی هوشمند
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              ایده‌تان را قبل از سرمایه‌گذاری
              <br />
              <span className="text-primary">اعتبارسنجی کنید</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              با استفاده از هوش مصنوعی و داده‌های واقعی بازار، ایده کسب‌وکار خود را تحلیل کنید و تصمیمات آگاهانه‌تری بگیرید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg px-8">
                  شروع رایگان
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  ورود به حساب
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              چرا Idea Validator؟
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              با ابزارهای پیشرفته، ایده خود را از زوایای مختلف بررسی کنید
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>تحلیل بازار واقعی</CardTitle>
                <CardDescription>
                  جمع‌آوری داده‌های واقعی از تلگرام، Reddit و دیجی‌کلا
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 ml-2" />
                    نظرات کاربران واقعی
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 ml-2" />
                    شناسایی ترندها
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 ml-2" />
                    بررسی رقبا
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>تحلیل هوش مصنوعی</CardTitle>
                <CardDescription>
                  استفاده از Claude AI برای تحلیل عمیق و دقیق
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 ml-2" />
                    تحلیل احساسات
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 ml-2" />
                    شناسایی نقاط درد
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 ml-2" />
                    پیشنهادات هوشمند
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>گزارش جامع</CardTitle>
                <CardDescription>
                  دریافت گزارش کامل با نمودارها و توصیه‌های عملی
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 ml-2" />
                    نمودارهای تعاملی
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 ml-2" />
                    آمار دقیق
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 ml-2" />
                    توصیه‌های عملی
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              پلن مناسب خود را انتخاب کنید
            </h2>
            <p className="text-xl text-gray-600">
              با پلن رایگان شروع کنید و در صورت نیاز ارتقا دهید
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">رایگان</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">0</span>
                  <span className="text-gray-600"> تومان</span>
                  <span className="text-gray-500 text-sm block mt-1">برای همیشه</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
                    2 اعتبارسنجی در ماه
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
                    تحلیل پایه
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
                    گزارش ساده
                  </li>
                </ul>
                <Link href="/auth/signup" className="block">
                  <Button variant="outline" className="w-full">
                    شروع کنید
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-primary relative">
              <div className="absolute -top-4 right-1/2 transform translate-x-1/2">
                <Badge className="bg-primary text-white">محبوب</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">حرفه‌ای</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-gray-600"> / ماه</span>
                  <span className="text-gray-500 text-sm block mt-1">برای کسب‌وکارهای کوچک</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
                    10 اعتبارسنجی در ماه
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
                    تحلیل پیشرفته
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
                    گزارش کامل با نمودار
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
                    پشتیبانی ایمیل
                  </li>
                </ul>
                <Link href="/auth/signup" className="block">
                  <Button className="w-full">
                    انتخاب پلن
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Business Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">کسب‌وکار</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$129</span>
                  <span className="text-gray-600"> / ماه</span>
                  <span className="text-gray-500 text-sm block mt-1">برای شرکت‌ها</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
                    50 اعتبارسنجی در ماه
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
                    تحلیل تخصصی
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
                    گزارش‌های سفارشی
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
                    پشتیبانی اختصاصی
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
                    API دسترسی
                  </li>
                </ul>
                <Link href="/auth/signup" className="block">
                  <Button variant="outline" className="w-full">
                    تماس با فروش
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            آماده‌اید ایده خود را اعتبارسنجی کنید؟
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            همین الان به صورت رایگان شروع کنید و تصمیمات هوشمندانه‌تری بگیرید
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              شروع رایگان
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-white text-xl font-bold mb-2">Idea Validator</h3>
          <p className="text-sm mb-4">پلتفرم هوشمند اعتبارسنجی ایده‌های کسب‌وکار</p>
          <p className="text-xs">
            © {new Date().getFullYear()} تمامی حقوق محفوظ است
          </p>
        </div>
      </footer>
    </div>
  )
}
