import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

/**
 * API Route برای scraping داده‌های Reddit
 *
 * استفاده از Reddit JSON API (بدون نیاز به authentication)
 */

export async function POST(request: NextRequest) {
  try {
    const { query, subreddit = 'all', limit = 20 } = await request.json()

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      )
    }

    // فراخوانی Reddit JSON API
    try {
      const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&sort=relevance`

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'IdeaValidator/1.0',
        },
        timeout: 10000,
      })

      const posts = response.data?.data?.children || []

      const data = posts.map((post: any) => ({
        id: post.data.id,
        title: post.data.title,
        text: post.data.selftext || '',
        score: post.data.score,
        num_comments: post.data.num_comments,
        created: new Date(post.data.created_utc * 1000).toISOString(),
        url: `https://reddit.com${post.data.permalink}`,
        subreddit: post.data.subreddit,
      }))

      return NextResponse.json({
        success: true,
        data,
        count: data.length,
        source: 'reddit',
      })
    } catch (apiError) {
      console.error('Reddit API error:', apiError)

      // اگر API کار نکرد، از mock data استفاده کن
      const mockData = generateMockRedditData(query, limit)

      return NextResponse.json({
        success: true,
        data: mockData,
        count: mockData.length,
        source: 'reddit',
        note: 'Using mock data due to API limitations',
      })
    }
  } catch (error) {
    console.error('Error in reddit scraping:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * تولید داده‌های mock برای Reddit
 */
function generateMockRedditData(query: string, limit: number) {
  const data = []

  const titles = [
    `Looking for ${query} recommendations`,
    `Is ${query} worth it?`,
    `My experience with ${query}`,
    `${query} alternatives?`,
    `Best ${query} for beginners`,
    `${query} pricing discussion`,
    `${query} features I wish existed`,
    `Why ${query} is amazing`,
    `${query} didn't work for me`,
    `${query} vs competitors`,
  ]

  const bodies = [
    `I've been searching for a good ${query} solution...`,
    `Has anyone tried ${query}? What's your opinion?`,
    `I really need ${query} but can't find a good option`,
    `The problem with ${query} is that it's too expensive`,
    `${query} would be perfect if it had these features...`,
  ]

  for (let i = 0; i < Math.min(limit, titles.length); i++) {
    data.push({
      id: `reddit_${i}`,
      title: titles[i],
      text: bodies[i % bodies.length],
      score: Math.floor(Math.random() * 1000) + 1,
      num_comments: Math.floor(Math.random() * 100) + 1,
      created: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      url: `https://reddit.com/r/example/comments/${i}`,
      subreddit: 'example',
    })
  }

  return data
}
