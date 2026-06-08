import { NextResponse } from 'next/server'

// Shortcodes de los posts públicos de @laboticadelalma1
const IG_POSTS = [
  'DXb2Y4Kj_k0',
  'DXPa_AFlK6q',
  'DXIF-v6mgVf',
  'DW9ui6Kj5nH',
]

async function fetchThumbnail(shortcode: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.instagram.com/p/${shortcode}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'es-AR,es;q=0.9',
      },
      next: { revalidate: 3600 }, // cachea 1 hora
    })
    const html = await res.text()
    const match = html.match(/<meta property="og:image" content="([^"]+)"/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

export async function GET() {
  const results = await Promise.all(
    IG_POSTS.map(async (shortcode) => ({
      shortcode,
      link: `https://www.instagram.com/p/${shortcode}/`,
      thumbnail: await fetchThumbnail(shortcode),
    }))
  )
  return NextResponse.json(results, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  })
}
