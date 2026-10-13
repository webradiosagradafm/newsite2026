// Vercel serverless function: /api/sports
// ESPN scoreboard endpoints are public but unofficial; keep a graceful fallback.
const LEAGUES = [
  { id: 'NFL', sport: 'football', league: 'nfl' },
  { id: 'NBA', sport: 'basketball', league: 'nba' },
  { id: 'MLB', sport: 'baseball', league: 'mlb' }
] as const

type Event = {
  date?: string
  status?: { type?: { state?: string; shortDetail?: string; description?: string } }
  competitions?: Array<{ competitors?: Array<{ homeAway?: string; score?: string | number; team?: { abbreviation?: string; shortDisplayName?: string } }> }>
}

function chicagoDay(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date)
  const get = (name: string) => parts.find(p => p.type === name)?.value || ''
  return `${get('year')}${get('month')}${get('day')}`
}

function normalize(event: Event, id: string) {
  const competitors = event.competitions?.[0]?.competitors || []
  if (competitors.length !== 2 || event.status?.type?.state === 'pre') return null
  const home = competitors.find(c => c.homeAway === 'home') || competitors[0]
  const away = competitors.find(c => c.homeAway === 'away') || competitors[1]
  if (home.score == null || away.score == null || !event.date) return null
  const when = Date.parse(event.date)
  if (!Number.isFinite(when) || when > Date.now()) return null
  return {
    league: id,
    home: home.team?.abbreviation || home.team?.shortDisplayName || 'HOME',
    away: away.team?.abbreviation || away.team?.shortDisplayName || 'AWAY',
    homeScore: String(home.score), awayScore: String(away.score),
    status: event.status?.type?.shortDetail || event.status?.type?.description || 'Final',
    date: event.date, live: event.status?.type?.state === 'in',
    sortDate: when
  }
}

async function latest(id: string, sport: string, league: string) {
  // Start with a broad range, then fall back to individual dates if the
  // provider ignores range queries. Covers bye weeks and offseason gaps.
  const offsets = [0, 1, 2, 3, 5, 7, 10, 14, 21, 30, 45, 60, 90]
  const base = `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard`
  const now = Date.now()
  const range = `${chicagoDay(new Date(now - 30 * 86400000))}-${chicagoDay(new Date(now))}`
  const urls = [`${base}?dates=${range}&limit=500`, ...offsets.map(days => `${base}?dates=${chicagoDay(new Date(now - days * 86400000))}&limit=100`)]
  for (const url of urls) {
    try {
      const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(6500) })
      if (!response.ok) continue
      const data = await response.json()
      const games = ((data.events || []) as Event[]).map(e => normalize(e, id)).filter(Boolean) as NonNullable<ReturnType<typeof normalize>>[]
      if (games.length) {
        games.sort((a, b) => Number(b.live) - Number(a.live) || b.sortDate - a.sortDate)
        const { sortDate, ...score } = games[0]
        return score
      }
    } catch { /* try an earlier date */ }
  }
  return null
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
  const entries = await Promise.all(LEAGUES.map(async l => [l.id, await latest(l.id, l.sport, l.league)] as const))
  return res.status(200).json(Object.fromEntries(entries))
}
