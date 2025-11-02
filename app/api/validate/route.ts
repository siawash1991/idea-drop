import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { analyzeIdeaWithClaude } from '@/lib/claude/analyzer'

/**
 * API Route اصلی برای اعتبارسنجی ایده
 *
 * این endpoint:
 * 1. validation را از دیتابیس می‌خواند
 * 2. status را به processing تغییر می‌دهد
 * 3. داده‌ها را از منابع مختلف scrape می‌کند
 * 4. داده‌ها را با Claude AI تحلیل می‌کند
 * 5. نتایج را در دیتابیس ذخیره می‌کند
 * 6. status را به completed تغییر می‌دهد
 */

export async function POST(request: NextRequest) {
  try {
    const { validation_id } = await request.json()

    if (!validation_id) {
      return NextResponse.json(
        { success: false, error: 'validation_id is required' },
        { status: 400 }
      )
    }

    // مرحله 1: خواندن validation از دیتابیس
    const { data: validation, error: validationError } = await supabaseAdmin
      .from('validations')
      .select('*')
      .eq('id', validation_id)
      .single()

    if (validationError || !validation) {
      console.error('Validation not found:', validationError)
      return NextResponse.json(
        { success: false, error: 'Validation not found' },
        { status: 404 }
      )
    }

    // مرحله 2: تغییر status به processing
    await supabaseAdmin
      .from('validations')
      .update({ status: 'processing', updated_at: new Date().toISOString() })
      .eq('id', validation_id)

    // مرحله 3: Scraping داده‌ها از منابع مختلف
    console.log('Starting data scraping...')

    const scrapingPromises = [
      // تلگرام
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/scrape/telegram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: validation.idea_title,
          limit: 15,
        }),
      }),
      // Reddit
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/scrape/reddit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: validation.idea_title,
          subreddit: 'all',
          limit: 15,
        }),
      }),
      // دیجی‌کلا
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/scrape/digikala`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: validation.idea_title,
          limit: 15,
        }),
      }),
    ]

    const scrapingResults = await Promise.allSettled(scrapingPromises)

    const scrapedData: any[] = []

    for (const result of scrapingResults) {
      if (result.status === 'fulfilled') {
        const json = await result.value.json()
        if (json.success && json.data) {
          scrapedData.push({
            source: json.source,
            data: json.data,
          })

          // ذخیره raw data در جدول scraped_data
          await supabaseAdmin.from('scraped_data').insert({
            validation_id: validation_id,
            source: json.source,
            query: validation.idea_title,
            data: json.data,
          })
        }
      } else {
        console.error('Scraping failed:', result.reason)
      }
    }

    console.log(`Scraped data from ${scrapedData.length} sources`)

    // مرحله 4: تحلیل با Claude AI
    console.log('Starting AI analysis...')

    let analysisResult
    try {
      analysisResult = await analyzeIdeaWithClaude(
        validation.idea_title,
        validation.idea_description,
        validation.target_market,
        scrapedData
      )
    } catch (aiError) {
      console.error('AI analysis error:', aiError)

      // در صورت خطا، status را failed می‌کنیم
      await supabaseAdmin
        .from('validations')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', validation_id)

      return NextResponse.json(
        { success: false, error: 'AI analysis failed' },
        { status: 500 }
      )
    }

    console.log('AI analysis completed')

    // مرحله 5: ذخیره نتایج در دیتابیس
    // برای هر منبع یک رکورد جداگانه
    for (const source of scrapedData) {
      await supabaseAdmin.from('analysis_results').insert({
        validation_id: validation_id,
        source: source.source,
        sentiment_score: analysisResult.sentiment.score,
        sentiment_label: analysisResult.sentiment.label,
        key_insights: {
          keyFindings: analysisResult.insights.keyFindings,
          marketDemand: analysisResult.insights.marketDemand,
          competitionLevel: analysisResult.insights.competitionLevel,
          distribution: analysisResult.sentiment.distribution,
        },
        pain_points: analysisResult.insights.painPoints,
        feature_requests: analysisResult.insights.featureRequests,
        market_demand: analysisResult.insights.marketDemand,
        competition_level: analysisResult.insights.competitionLevel,
        raw_data: {
          recommendations: analysisResult.recommendations,
          summary: analysisResult.summary,
        },
      })
    }

    // مرحله 6: تغییر status به completed
    await supabaseAdmin
      .from('validations')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('id', validation_id)

    console.log('Validation completed successfully')

    return NextResponse.json({
      success: true,
      message: 'Validation completed successfully',
      validation_id: validation_id,
    })
  } catch (error) {
    console.error('Error in validation process:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
