import { NextRequest, NextResponse } from 'next/server'

/**
 * API Route برای scraping داده‌های دیجی‌کلا
 *
 * برای MVP از mock data استفاده می‌کنیم
 * در production باید از web scraping واقعی یا API استفاده شود
 */

export async function POST(request: NextRequest) {
  try {
    const { query, limit = 20 } = await request.json()

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      )
    }

    // Mock data برای MVP
    // در production باید از web scraping یا API واقعی استفاده شود
    const mockData = generateMockDigikalaData(query, limit)

    return NextResponse.json({
      success: true,
      data: mockData,
      count: mockData.length,
      source: 'digikala',
    })
  } catch (error) {
    console.error('Error in digikala scraping:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * تولید داده‌های mock برای دیجی‌کلا (نظرات کاربران)
 */
function generateMockDigikalaData(query: string, limit: number) {
  const data = []

  const positiveComments = [
    `محصول ${query} عالی بود، خیلی راضی هستم`,
    `کیفیت ${query} بسیار خوبه، پیشنهاد می‌کنم`,
    `${query} دقیقاً همونیه که می‌خواستم`,
    `قیمت ${query} مناسبه، ارزش خریدش رو داره`,
    `سرویس ${query} فوق‌العاده است`,
  ]

  const negativeComments = [
    `${query} با توضیحات فرق داره، ناامید شدم`,
    `قیمت ${query} خیلی بالاست`,
    `کیفیت ${query} انتظارم رو نداشت`,
    `${query} به درد من نخورد`,
    `مشکل ${query} اینه که پشتیبانی نداره`,
  ]

  const neutralComments = [
    `${query} متوسطه، نه خوب نه بد`,
    `برای این قیمت، ${query} قابل قبوله`,
    `${query} کار می‌کنه ولی چیز خاصی نیست`,
    `نمی‌دونم آیا ${query} مناسب منه یا نه`,
    `${query} رو امتحان کردم، نظر خاصی ندارم`,
  ]

  for (let i = 0; i < limit; i++) {
    const rand = Math.random()
    let comment = ''
    let rating = 0
    let sentiment = ''

    if (rand < 0.5) {
      // 50% positive
      comment = positiveComments[i % positiveComments.length]
      rating = 4 + Math.random()
      sentiment = 'positive'
    } else if (rand < 0.8) {
      // 30% neutral
      comment = neutralComments[i % neutralComments.length]
      rating = 2.5 + Math.random() * 1.5
      sentiment = 'neutral'
    } else {
      // 20% negative
      comment = negativeComments[i % negativeComments.length]
      rating = 1 + Math.random() * 2
      sentiment = 'negative'
    }

    data.push({
      id: `dk_${i}`,
      comment,
      rating: Math.round(rating * 10) / 10,
      date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      helpful_count: Math.floor(Math.random() * 50),
      verified_purchase: Math.random() > 0.3,
      sentiment,
    })
  }

  return data
}
