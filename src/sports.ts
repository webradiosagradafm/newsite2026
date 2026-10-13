// Praise FM USA — Vercel function /api/sports
// ESPN's public scoreboard API is unofficial and can change.
const LEAGUES = [
  { id: 'NFL', sport: 'football', league: 'nfl' },
  { id: 'NBA', sport: 'basketball', league: 'nba' },
  { id: 'MLB', sport: 'baseball', league: 'mlb' }
] as const

type Competitor = {
  homeAway?: string
  score?: string | number
  team?: { abbreviation?: string; shortDisplayName?: string }
}
type Event = {
  date?: string
  status?: { type?: { state?: string; completed?: boolean; shortDetail?: string; description?: string } }
  competitions?: Array<{ competitors?: Competitor[] }>
}
type Score = {
  league: string
  home: string
  away: string
  homeScore: string
  awayScore: string
  status: string
  date: string
  live: boolean
  sortDate: number
}

function chicagoDay(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date)
  const value = (type: string) => parts.find(p => p.type === type)?.value ?? ''
  return `${value('year')}${value('month')}${value('day')}`
}

function normalize(event: Event, league: string): Score | null {
  const status = event.status?.type
  // Only final games. Never label a live/in-progress score as final.
  if (!(status?.completed === true || status?.state === 'post')) return null
  const competitors = event.competitions?.[0]?.competitors ?? []
  if (competitors.length !== 2 || !event.date) return null
  const home = competitors.find(c => c.homeAway === 'home')
  const away = competitors.find(c => c.homeAway === 'away')
  if (!home || !away || home.score == null || away.score == null) return null
  const sortDate = Date.parse(event.date)
  if (!Number.isFinite(sortDate) || sortDate > Date.now()) return null
  return {
    league,
    home: home.team?.abbreviation || home.team?.shortDisplayName || 'HOME',
    away: away.team?.abbreviation || away.team?.shortDisplayName || 'AWAY',
    homeScore: String(home.score),
    awayScore: String(away.score),
    status: status.shortDetail || status.description || 'Final',
    date: event.date,
    live: false,
    sortDate
  }
}

async function getEvents(url: string): Promise<Event[]> {
  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(4500)
    })
    if (!response.ok) return []
    const body = await response.json()
    return Array.isArray(body?.events) ? body.events : []
  } catch {
    return []
  }
}

async function latest(id: string, sport: string, league: string) {
  const base = `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard`
  const now = Date.now()
  const year = Number(chicagoDay(new Date()).slice(0, 4))

  // Try whole-season requests first: avoids 'No score' during off-days.
  // If the provider doesn't support season-wide queries, fall back to days.
  for (const seasonYear of [year, year - 1]) {
    const events = await getEvents(`${base}?dates=${seasonYear}&limit=1000`)
    const finals = events.map(e => normalize(e, id)).filter((e): e is Score => e !== null)
    if (finals.length) {
      finals.sort((a, b) => b.sortDate - a.sortDate)
      const { sortDate, ...score } = finals[0]
      return score
    }
  }

  // ESPN may reject year queries. Check real calendar days in batches,
  // newest first. Search up to 180 days for offseason coverage.
  for (let start = 0; start < 180; start += 7) {
    const offsets = Array.from({ length: Math.min(7, 180 - start) }, (_, i) => start + i)
    const eventGroups = await Promise.all(offsets.map(days => {
      const day = chicagoDay(new Date(now - days * 86400000))
      return getEvents(`${base}?dates=${day}&limit=100`)
    }))
    const finals = eventGroups.flat().map(e => normalize(e, id)).filter((e): e is Score => e !== null)
    if (finals.length) {
      finals.sort((a, b) => b.sortDate - a.sortDate)
      const { sortDate, ...score } = finals[0]
      return score
    }
  }
  return null
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
  const entries = await Promise.all(LEAGUES.map(async l =>
    [l.id, await latest(l.id, l.sport, l.league)] as const
  ))
  return res.status(200).json(Object.fromEntries(entries))
}
