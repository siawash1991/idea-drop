# 🚀 Idea Validator

پلتفرم هوشمند اعتبارسنجی ایده‌های کسب‌وکار با استفاده از هوش مصنوعی و داده‌های واقعی بازار

## ✨ ویژگی‌ها

- 🔐 **احراز هویت کامل**: ثبت‌نام، ورود و مدیریت کاربران با Supabase
- 📊 **تحلیل بازار واقعی**: جمع‌آوری داده از تلگرام، Reddit و دیجی‌کلا
- 🤖 **تحلیل هوش مصنوعی**: استفاده از Claude AI برای تحلیل احساسات و بازار
- 📈 **داشبورد جامع**: نمایش آمار، پیشرفت و نتایج به صورت بصری
- 💎 **سیستم اشتراک**: پلن‌های رایگان، حرفه‌ای و کسب‌وکار
- 🎨 **UI مدرن**: طراحی زیبا با shadcn/ui و Tailwind CSS
- 📱 **Responsive**: کاملاً سازگار با موبایل، تبلت و دسکتاپ

## 🛠 تکنولوژی‌ها

- **Framework**: Next.js 15 (App Router)
- **زبان**: TypeScript
- **استایل**: Tailwind CSS + shadcn/ui
- **دیتابیس**: Supabase (PostgreSQL)
- **احراز هویت**: Supabase Auth
- **هوش مصنوعی**: Anthropic Claude API
- **Scraping**: Axios + Cheerio
- **Validation**: Zod + React Hook Form

## 📋 پیش‌نیازها

- Node.js 18+
- npm یا yarn
- حساب Supabase (رایگان)
- کلید API Claude (Anthropic)

## 🚀 راه‌اندازی سریع

### 1. Clone کردن پروژه

```bash
git clone <your-repo-url>
cd idea-drop
```

### 2. نصب پکیج‌ها

```bash
npm install
```

### 3. تنظیمات Supabase

1. به [supabase.com](https://supabase.com) بروید و پروژه جدید بسازید
2. از SQL Editor استفاده کنید و این کوئری‌ها را اجرا کنید:

```sql
-- جدول profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free',
  validations_used INTEGER DEFAULT 0,
  validations_limit INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول validations
CREATE TABLE public.validations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  idea_title TEXT NOT NULL,
  idea_description TEXT NOT NULL,
  target_market TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول analysis_results
CREATE TABLE public.analysis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  validation_id UUID REFERENCES public.validations(id) ON DELETE CASCADE NOT NULL,
  source TEXT NOT NULL,
  sentiment_score NUMERIC(3,2),
  sentiment_label TEXT,
  key_insights JSONB,
  pain_points TEXT[],
  feature_requests TEXT[],
  market_demand TEXT,
  competition_level TEXT,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول scraped_data برای cache
CREATE TABLE public.scraped_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  validation_id UUID REFERENCES public.validations(id) ON DELETE CASCADE NOT NULL,
  source TEXT NOT NULL,
  query TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '48 hours')
);

-- Indexes
CREATE INDEX idx_validations_user_id ON public.validations(user_id);
CREATE INDEX idx_analysis_results_validation_id ON public.analysis_results(validation_id);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users view own validations" ON public.validations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own validations" ON public.validations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own analysis" ON public.analysis_results FOR SELECT USING (
  validation_id IN (SELECT id FROM validations WHERE user_id = auth.uid())
);
```

### 4. تنظیم متغیرهای محیطی

فایل `.env.local` را ویرایش کنید:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Claude AI
ANTHROPIC_API_KEY=sk-ant-your-key-here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**چگونه کلیدها را پیدا کنیم:**

- **Supabase Keys**: Settings → API → Project URL و anon/service_role keys
- **Anthropic API**: از [console.anthropic.com](https://console.anthropic.com) دریافت کنید

### 5. اجرای پروژه

```bash
npm run dev
```

پروژه در `http://localhost:3000` در دسترس خواهد بود 🎉

## 📁 ساختار پروژه

```
idea-drop/
├── app/
│   ├── api/                    # API Routes
│   │   ├── validate/           # API اصلی اعتبارسنجی
│   │   └── scrape/             # API های scraping
│   ├── auth/                   # صفحات احراز هویت
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/              # داشبورد کاربر
│   │   ├── new/                # فرم validation جدید
│   │   └── validation/[id]/    # صفحه نتایج
│   ├── globals.css             # استایل‌های global
│   ├── layout.tsx              # Layout اصلی
│   └── page.tsx                # صفحه Landing
├── components/
│   └── ui/                     # کامپوننت‌های shadcn/ui
├── lib/
│   ├── claude/                 # کلاینت و analyzer Claude
│   ├── supabase/               # کلاینت Supabase
│   ├── utils.ts                # توابع کمکی
│   └── validation.ts           # schema های Zod
├── middleware.ts               # محافظت روت‌ها
└── .env.local                  # متغیرهای محیطی
```

## 🎯 نحوه استفاده

1. **ثبت‌نام**: حساب کاربری جدید بسازید
2. **ورود**: وارد داشبورد شوید
3. **ایده جدید**: روی "اعتبارسنجی جدید" کلیک کنید
4. **جزئیات ایده**: عنوان، توضیحات و بازار هدف را وارد کنید
5. **تحلیل**: منتظر بمانید تا سیستم داده‌ها را جمع‌آوری و تحلیل کند
6. **نتایج**: گزارش کامل با نمودارها و توصیه‌ها را مشاهده کنید

## 🔧 توسعه بیشتر

### اضافه کردن منبع scraping جدید

1. فایل جدید در `app/api/scrape/[source]/route.ts` بسازید
2. در `app/api/validate/route.ts` به لیست scraping اضافه کنید
3. داده‌ها را به فرمت استاندارد تبدیل کنید

### سفارشی‌سازی تحلیل Claude

فایل `lib/claude/analyzer.ts` را ویرایش کنید و prompt را تغییر دهید.

### اضافه کردن فیلد جدید به Profile

1. Schema را در Supabase تغییر دهید
2. Type را در `lib/supabase/client.ts` به‌روزرسانی کنید
3. UI را در صفحات مربوطه اضافه کنید

## 🚢 Deploy

### Vercel (توصیه می‌شود)

1. پروژه را به GitHub push کنید
2. به [vercel.com](https://vercel.com) بروید
3. Import repository
4. متغیرهای محیطی را اضافه کنید
5. Deploy!

### سایر پلتفرم‌ها

- Railway
- Netlify
- AWS Amplify
- DigitalOcean App Platform

## 📝 نکات مهم

- ⚠️ حتماً `.env.local` را در `.gitignore` نگه دارید
- 🔒 از Service Role Key فقط در server-side استفاده کنید
- 💰 Claude API هزینه دارد - استفاده را مانیتور کنید
- 🔄 در production از caching برای scraping استفاده کنید
- 🧪 قبل از deploy حتماً تست کنید

## 🐛 عیب‌یابی

### خطای "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### خطای Supabase Connection
- کلیدها را دوباره چک کنید
- URL را بررسی کنید
- Row Level Security را بررسی کنید

### خطای Claude API
- کلید API را بررسی کنید
- اعتبار حساب را چک کنید
- Rate limit را بررسی کنید

## 🤝 مشارکت

1. Fork کنید
2. Branch جدید بسازید (`git checkout -b feature/amazing-feature`)
3. Commit کنید (`git commit -m 'Add amazing feature'`)
4. Push کنید (`git push origin feature/amazing-feature`)
5. Pull Request باز کنید

## 📄 لایسنس

این پروژه تحت لایسنس MIT است.

## 👤 نویسنده

ساخته شده با ❤️ توسط Claude Code

## 🙏 تشکر

- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Anthropic Claude](https://anthropic.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

**نسخه**: 1.0.0
**آخرین به‌روزرسانی**: نوامبر 2025
