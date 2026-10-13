// Praise FM USA - Vercel API /api/sports
// Data source: TheSportsDB v1 (free tier). Returns latest verified final game per league.
const LEAGUES = [
  { id: 'NFL', leagueId: '4391' },
  { id: 'NBA', leagueId: '4387' },
  { id: 'MLB', leagueId: '4424' }
] as const

const BASE = 'https://www.thesportsdb.com/api/v1/json/123'

type SportsEvent = {
  idEvent?: string
  strLeague?: string
  idLeague?: string
  strHomeTeam?: string
  strAwayTeam?: string
  intHomeScore?: string | number | null
  intAwayScore?: string | number | null
  strStatus?: string | null
  strProgress?: string | null
  dateEvent?: string | null
  strTimestamp?: string | null
  strTime?: string | null
}

type Score = {
  league: string
  home: string
  away: string
  homeScore: string
  awayScore: string
  status: string
  date: string
  live: false
}

function normalize(event: SportsEvent, league: string, leagueId: string): (Score & { sortTime: number }) | null {
  if (event.idLeague && event.idLeague !== leagueId) return null
  if (event.strLeague && event.strLeague.toUpperCase() !== league) return null
  if (!event.strHomeTeam || !event.strAwayTeam) return null
  if (event.intHomeScore == null || event.intAwayScore == null) return null
  if (String(event.intHomeScore).trim() === '' || String(event.intAwayScore).trim() === '') return null

  const status = (event.strStatus || '').trim().toUpperCase()
  const progress = (event.strProgress || '').trim().toUpperCase()
  // Never display in-progress, postponed or scheduled games as final.
  const finished = ['FT', 'AOT', 'FINAL', 'FINISHED', 'AFTER EXTRA TIME'].includes(status) ||
    /\b(FINAL|FULL TIME|FINISHED)\b/.test(progress)
  if (!finished) return null

  const date = event.strTimestamp || event.dateEvent
  if (!date) return null
  const sortTime = Date.parse(date.includes('T') ? date : `${date}T00:00:00Z`)
  if (!Number.isFinite(sortTime) || sortTime > Date.now()) return null

  return {
    league,
    home: event.strHomeTeam,
    away: event.strAwayTeam,
    homeScore: String(event.intHomeScore),
    awayScore: String(event.intAwayScore),
    status: 'Final',
    date: date.includes('T') ? date : `${date}T00:00:00Z`,
    live: false,
    sortTime
  }
}

async function getEvents(url: string): Promise<SportsEvent[]> {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(6500)
  })
  if (!response.ok) throw new Error(`TheSportsDB HTTP ${response.status}`)
  const data = await response.json()
  return Array.isArray(data.events) ? data.events : []
}

function utcDateOffset(daysAgo: number) {
  const d = new Date(Date.now() - daysAgo * 86400000)
  return d.toISOString().slice(0, 10)
}

async function latest(league: string, leagueId: string): Promise<Score | null> {
  const candidates: Array<Score & { sortTime: number }> = []
  // First: league's recent events (one API request per league).
  try {
    const events = await getEvents(`${BASE}/eventspastleague.php?id=${leagueId}`)
    for (const e of events) {
      const item = normalize(e, league, leagueId)
      if (item) candidates.push(item)
    }
  } catch (error) {
    console.error(`${league} recent league request:`, error)
  }

  // Free API may return very few events. Try dates if recent league data is empty.
  if (!candidates.length) {
    for (const daysAgo of [0, 1, 2, 3, 5, 7, 10, 14]) {
      try {
        const date = utcDateOffset(daysAgo)
        const events = await getEvents(`${BASE}/eventsday.php?d=${date}&l=${leagueId}`)
        for (const e of events) {
          const item = normalize(e, league, leagueId)
          if (item) candidates.push(item)
        }
        if (candidates.length) break
      } catch (error) {
        console.error(`${league} ${daysAgo}d request:`, error)
      }
    }
  }

  candidates.sort((a, b) => b.sortTime - a.sortTime)
  if (!candidates.length) return null
  const { sortTime, ...result } = candidates[0]
  return result
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
  const results = await Promise.all(LEAGUES.map(async l => [l.id, await latest(l.id, l.leagueId)] as const))
  return res.status(200).json(Object.fromEntries(results))
}
