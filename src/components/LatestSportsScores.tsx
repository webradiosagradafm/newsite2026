import React, { useEffect, useState } from 'react'

type League = 'NFL' | 'NBA' | 'MLB'
type Score = {
  league: League
  home: string
  away: string
  homeScore: string
  awayScore: string
  status: string
  date: string
  live: boolean
}

const LEAGUES: { id: League; sport: string; league: string; emoji: string }[] = [
  { id: 'NFL', sport: 'football', league: 'nfl', emoji: '🏈' },
  { id: 'NBA', sport: 'basketball', league: 'nba', emoji: '🏀' },
  { id: 'MLB', sport: 'baseball', league: 'mlb', emoji: '⚾' }
]

const chicagoDate = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(date)

const dayCode = (date: Date) => chicagoDate(date).replace(/-/g, '')

async function latestScore(sport: string, league: string, signal: AbortSignal): Promise<Score | null> {
  // Query the last 14 calendar days to cover leagues that aren't playing every day.
  const now = new Date()
  const since = new Date(now.getTime() - 14 * 86400000)
  const endpoint = `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard?dates=${dayCode(since)}-${dayCode(now)}&limit=250`
  const response = await fetch(endpoint, { signal })
  if (!response.ok) throw new Error(`Score service returned ${response.status}`)
  const json = await response.json()
  const events: any[] = Array.isArray(json.events) ? json.events : []
  const valid = events.filter(e => {
    const competition = e.competitions?.[0]
    return competition?.competitors?.length === 2 &&
      competition.competitors.every((c: any) => c.score != null) &&
      e.status?.type?.state !== 'pre' &&
      new Date(e.date).getTime() <= now.getTime()
  })
  // Prefer an ongoing game, otherwise the most recently started game.
  valid.sort((a, b) => {
    const aLive = a.status?.type?.state === 'in' ? 1 : 0
    const bLive = b.status?.type?.state === 'in' ? 1 : 0
    return bLive - aLive || new Date(b.date).getTime() - new Date(a.date).getTime()
  })
  const event = valid[0]
  if (!event) return null
  const competitors: any[] = event.competitions[0].competitors
  const home = competitors.find(c => c.homeAway === 'home') || competitors[0]
  const away = competitors.find(c => c.homeAway === 'away') || competitors[1]
  return {
    league: league.toUpperCase() as League,
    home: home.team?.abbreviation || home.team?.shortDisplayName || 'HOME',
    away: away.team?.abbreviation || away.team?.shortDisplayName || 'AWAY',
    homeScore: String(home.score),
    awayScore: String(away.score),
    status: event.status?.type?.shortDetail || event.status?.type?.description || 'Latest',
    date: event.date,
    live: event.status?.type?.state === 'in'
  }
}

export default function LatestSportsScores() {
  const [scores, setScores] = useState<Partial<Record<League, Score | null>>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    const refresh = async () => {
      const results = await Promise.allSettled(
        LEAGUES.map(item => latestScore(item.sport, item.league, controller.signal))
      )
      if (!active) return
      setScores(previous => {
        const next = { ...previous }
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') next[LEAGUES[index].id] = result.value
          // Preserve previously loaded data on temporary network failure.
        })
        return next
      })
      setLoading(false)
    }
    void refresh()
    const interval = window.setInterval(() => void refresh(), 5 * 60 * 1000)
    return () => { active = false; controller.abort(); window.clearInterval(interval) }
  }, [])

  return (
    <section aria-label="Latest US sports scores" className="w-full border-b border-gray-200/50 dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
        <div className="flex items-center gap-3 overflow-x-auto [scrollbar-width:none]">
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Sports</span>
          {LEAGUES.map(item => {
            const score = scores[item.id]
            return (
              <div key={item.id} className="flex min-w-[145px] flex-1 items-center justify-center gap-2 rounded-lg bg-white/50 px-2 py-1.5 text-xs dark:bg-black/15">
                <span aria-hidden="true">{item.emoji}</span>
                <span className="font-bold text-gray-800 dark:text-gray-100">{item.id}</span>
                {score ? (
                  <div className="min-w-0 text-center">
                    <div className="whitespace-nowrap font-semibold tabular-nums text-gray-800 dark:text-gray-100">
                      {score.away} {score.awayScore}–{score.homeScore} {score.home}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400" title={new Date(score.date).toLocaleString('en-US', { timeZone: 'America/Chicago' })}>
                      {score.live ? '● LIVE' : score.status}
                    </div>
                  </div>
                ) : (
                  <span className="whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-400">{loading ? 'Loading…' : 'Unavailable'}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
