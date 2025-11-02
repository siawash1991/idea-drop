import { NextRequest, NextResponse } from 'next/server'

/**
 * API Route برای scraping داده‌های تلگرام
 *
 * برای MVP از mock data استفاده می‌کنیم
 * در production باید از Telegram API واقعی استفاده شود
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
    // در production باید از Telegram API استفاده شود
    const mockData = generateMockTelegramData(query, limit)

    return NextResponse.json({
      success: true,
      data: mockData,
      count: mockData.length,
      source: 'telegram',
    })
  } catch (error) {
    console.error('Error in telegram scraping:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * تولید داده‌های mock برای تلگرام
 */
function generateMockTelegramData(query: string, limit: number) {
  const sentiments = ['positive', 'negative', 'neutral']
  const data = []

  const positiveMessages = [
    `عالیه! دنبال ${query} می‌گشتم`,
    `این ${query} خیلی کاربردیه`,
    `واقعاً به ${query} نیاز داشتم`,
    `${query} مشکل من رو حل کرد`,
    `پیشنهاد می‌کنم حتماً ${query} رو امتحان کنید`,
  ]

  const negativeMessages = [
    `${query} خیلی گرونه`,
    `هنوز ${query} رو پیدا نکردم که کار کنه`,
    `مشکل ${query} اینه که پیچیده است`,
    `${query} خیلی وقت می‌گیره`,
    `بازار ${query} اشباع شده`,
  ]

  const neutralMessages = [
    `${query} چیه؟ کسی می‌دونه؟`,
    `کسی با ${query} کار کرده؟`,
    `نظرتون درباره ${query} چیه؟`,
    `${query} رو از کجا می‌تونم پیدا کنم؟`,
    `قیمت ${query} چقدره؟`,
  ]

  for (let i = 0; i < limit; i++) {
    const sentiment = sentiments[i % 3]
    let text = ''

    if (sentiment === 'positive') {
      text = positiveMessages[i % positiveMessages.length]
    } else if (sentiment === 'negative') {
      text = negativeMessages[i % negativeMessages.length]
    } else {
      text = neutralMessages[i % neutralMessages.length]
    }

    data.push({
      id: `tg_${i}`,
      text,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      views: Math.floor(Math.random() * 10000) + 100,
      sentiment,
      channel: `کانال ${Math.floor(Math.random() * 10) + 1}`,
    })
  }

  return data
}
