// Praise FM USA — Vercel Serverless API: /api/sports
// ESPN scoreboard is a public, unofficial endpoint and can change without notice.
// Returns the latest COMPLETED game for each league in the shape expected by
// LatestSportsScores.tsx: { NFL: Score|null, NBA: Score|null, MLB: Score|null }.

type League = { id: 'NFL' | 'NBA' | 'MLB'; path: string }
const LEAGUES: League[] = [
  { id: 'NFL', path: 'football/nfl' },
  { id: 'NBA', path: 'basketball/nba' },
  { id: 'MLB', path: 'baseball/mlb' },
]

type Competitor = {
  homeAway?: 'home' | 'away'
  score?: string | number
  team?: { abbreviation?: string; shortDisplayName?: string; displayName?: string }
}
type ESPNEvent = {
  date?: string
  status?: { type?: { completed?: boolean; state?: string; shortDetail?: string; description?: string } }
  competitions?: Array<{ competitors?: Competitor[] }>
}
type Score = {
  league: League['id']
  home: string
  away: string
  homeScore: string
  awayScore: string
  status: string
  date: string
  live: false
}

const DAY_MS = 86_400_000
const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports'

function chicagoDate(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date)
  const part = (name: string) => parts.find(p => p.type === name)?.value ?? ''
  return `${part('year')}${part('month')}${part('day')}`
}

function normalize(event: ESPNEvent, league: League['id']): Score | null {
  if (!event.status?.type?.completed) return null
  if (!event.date || !Number.isFinite(Date.parse(event.date))) return null
  const competitors = event.competitions?.[0]?.competitors ?? []
  if (competitors.length !== 2) return null
  const home = competitors.find(c => c.homeAway === 'home')
  const away = competitors.find(c => c.homeAway === 'away')
  if (!home || !away || home.score == null || away.score == null) return null
  return {
    league,
    home: home.team?.abbreviation || home.team?.shortDisplayName || home.team?.displayName || 'HOME',
    away: away.team?.abbreviation || away.team?.shortDisplayName || away.team?.displayName || 'AWAY',
    homeScore: String(home.score),
    awayScore: String(away.score),
    status: event.status.type.shortDetail || 'Final',
    date: event.date,
    live: false,
  }
}

async function fetchScoreboard(path: string, dates: string): Promise<ESPNEvent[]> {
  const url = `${ESPN_BASE}/${path}/scoreboard?dates=${dates}&limit=500`
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(4500),
  })
  if (!response.ok) throw new Error(`ESPN ${path} ${dates}: HTTP ${response.status}`)
  const payload: unknown = await response.json()
  if (!payload || typeof payload !== 'object' || !('events' in payload)) return []
  const events = (payload as { events?: unknown }).events
  return Array.isArray(events) ? events as ESPNEvent[] : []
}

async function latest(league: League): Promise<Score | null> {
  const now = Date.now()
  // Recent daily searches, then older monthly searches for bye weeks/offseason.
  // Monthly queries are an optimization; if unsupported by ESPN, daily fallbacks
  // below still provide coverage for the past two weeks.
  const dailyDates = Array.from({ length: 15 }, (_, i) => chicagoDate(new Date(now - i * DAY_MS)))
  const monthlyDates = Array.from({ length: 10 }, (_, i) => {
    const date = new Date(now)
    date.setUTCDate(1)
    date.setUTCMonth(date.getUTCMonth() - i)
    return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, '0')}`
  })

  // Check recent days in parallel batches, choosing the latest final by actual date.
  for (let i = 0; i < dailyDates.length; i += 5) {
    const batch = await Promise.allSettled(dailyDates.slice(i, i + 5).map(d => fetchScoreboard(league.path, d)))
    const scores = batch.flatMap(r => r.status === 'fulfilled' ? r.value : [])
      .map(e => normalize(e, league.id))
      .filter((s): s is Score => s !== null)
      .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    if (scores.length) return scores[0]
  }

  // Search monthly scoreboards for leagues with no recent completed games.
  for (const month of monthlyDates) {
    try {
      const scores = (await fetchScoreboard(league.path, month))
        .map(e => normalize(e, league.id))
        .filter((s): s is Score => s !== null)
        .filter(s => Date.parse(s.date) <= now)
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
      if (scores.length) return scores[0]
    } catch {
      // ESPN may reject month-format requests. Continue without fabricating data.
    }
  }
  return null
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
  const results = await Promise.all(LEAGUES.map(async league => {
    try { return [league.id, await latest(league)] as const }
    catch (error) {
      console.error(`[sports] ${league.id}`, error)
      return [league.id, null] as const
    }
  }))
  return res.status(200).json(Object.fromEntries(results))
}
