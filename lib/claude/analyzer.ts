import { anthropic, CLAUDE_MODEL, CLAUDE_CONFIG } from './client'

/**
 * Interface برای داده‌های scrape شده
 */
interface ScrapedDataItem {
  source: string
  data: any[]
}

/**
 * Interface برای نتیجه تحلیل
 */
export interface AnalysisOutput {
  sentiment: {
    score: number // از -1 تا 1
    label: 'positive' | 'negative' | 'neutral'
    distribution: {
      positive: number
      negative: number
      neutral: number
    }
  }
  insights: {
    keyFindings: string[]
    painPoints: string[]
    featureRequests: string[]
    marketDemand: 'high' | 'medium' | 'low'
    competitionLevel: 'high' | 'medium' | 'low'
  }
  recommendations: string[]
  summary: string
}

/**
 * تحلیل ایده با استفاده از Claude AI
 *
 * @param ideaTitle - عنوان ایده
 * @param ideaDescription - توضیحات ایده
 * @param targetMarket - بازار هدف (اختیاری)
 * @param scrapedData - داده‌های جمع‌آوری شده از منابع مختلف
 * @returns نتیجه تحلیل شامل احساسات، بینش‌ها و توصیه‌ها
 */
export async function analyzeIdeaWithClaude(
  ideaTitle: string,
  ideaDescription: string,
  targetMarket: string | null,
  scrapedData: ScrapedDataItem[]
): Promise<AnalysisOutput> {
  // ساخت prompt برای Claude
  const prompt = buildAnalysisPrompt(
    ideaTitle,
    ideaDescription,
    targetMarket,
    scrapedData
  )

  try {
    // فراخوانی Claude API
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: CLAUDE_CONFIG.max_tokens,
      temperature: CLAUDE_CONFIG.temperature,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    // استخراج متن از response
    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Invalid response type from Claude')
    }

    // Parse کردن JSON response
    const analysisResult = parseClaudeResponse(content.text)
    return analysisResult
  } catch (error) {
    console.error('Error analyzing idea with Claude:', error)

    // برگشت یه default result در صورت خطا
    return getDefaultAnalysisResult()
  }
}

/**
 * ساخت prompt برای Claude
 */
function buildAnalysisPrompt(
  ideaTitle: string,
  ideaDescription: string,
  targetMarket: string | null,
  scrapedData: ScrapedDataItem[]
): string {
  let prompt = `شما یک تحلیلگر بازار و کسب‌وکار هستید. یک ایده کسب‌وکار را تحلیل کنید و بر اساس داده‌های واقعی بازار، نظر خود را بدهید.

## اطلاعات ایده:
- **عنوان**: ${ideaTitle}
- **توضیحات**: ${ideaDescription}
${targetMarket ? `- **بازار هدف**: ${targetMarket}` : ''}

## داده‌های جمع‌آوری شده از بازار:
`

  // اضافه کردن داده‌های هر منبع
  for (const item of scrapedData) {
    prompt += `\n### منبع: ${item.source}\n`
    prompt += `تعداد داده‌ها: ${item.data.length}\n`
    prompt += `نمونه داده‌ها:\n${JSON.stringify(item.data.slice(0, 20), null, 2)}\n`
  }

  prompt += `

## وظیفه شما:
لطفاً این ایده را به صورت کامل تحلیل کنید و خروجی را به صورت JSON بدهید:

{
  "sentiment": {
    "score": [عدد بین -1 تا 1، مثلاً 0.6],
    "label": ["positive" یا "negative" یا "neutral"],
    "distribution": {
      "positive": [درصد نظرات مثبت، مثلاً 65],
      "negative": [درصد نظرات منفی، مثلاً 15],
      "neutral": [درصد نظرات خنثی، مثلاً 20]
    }
  },
  "insights": {
    "keyFindings": [
      "یافته کلیدی 1",
      "یافته کلیدی 2",
      "یافته کلیدی 3"
    ],
    "painPoints": [
      "مشکل 1 که کاربران دارند",
      "مشکل 2",
      "مشکل 3"
    ],
    "featureRequests": [
      "ویژگی 1 که کاربران می‌خواهند",
      "ویژگی 2",
      "ویژگی 3"
    ],
    "marketDemand": "high" | "medium" | "low",
    "competitionLevel": "high" | "medium" | "low"
  },
  "recommendations": [
    "توصیه 1 برای بهبود ایده",
    "توصیه 2",
    "توصیه 3"
  ],
  "summary": "خلاصه کلی تحلیل در 2-3 جمله"
}

فقط JSON را برگردانید، بدون توضیحات اضافی.`

  return prompt
}

/**
 * Parse کردن response از Claude
 */
function parseClaudeResponse(responseText: string): AnalysisOutput {
  try {
    // حذف markdown code blocks اگر وجود داشت
    let jsonText = responseText.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '')
    }

    const parsed = JSON.parse(jsonText)
    return parsed as AnalysisOutput
  } catch (error) {
    console.error('Error parsing Claude response:', error)
    console.error('Response text:', responseText)

    // اگر parse نشد، یه default برگردون
    return getDefaultAnalysisResult()
  }
}

/**
 * نتیجه پیش‌فرض در صورت خطا
 */
function getDefaultAnalysisResult(): AnalysisOutput {
  return {
    sentiment: {
      score: 0,
      label: 'neutral',
      distribution: {
        positive: 33,
        negative: 33,
        neutral: 34,
      },
    },
    insights: {
      keyFindings: ['داده‌های کافی برای تحلیل در دسترس نیست'],
      painPoints: ['نیاز به جمع‌آوری داده‌های بیشتر'],
      featureRequests: ['تحقیقات بیشتر مورد نیاز است'],
      marketDemand: 'medium',
      competitionLevel: 'medium',
    },
    recommendations: [
      'جمع‌آوری داده‌های بیشتر از بازار',
      'مصاحبه با مشتریان بالقوه',
      'بررسی رقبا',
    ],
    summary: 'تحلیل کامل امکان‌پذیر نبود. لطفاً داده‌های بیشتری جمع‌آوری کنید.',
  }
}
