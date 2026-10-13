import React, { useEffect, useState } from 'react'

type League = 'NFL' | 'NBA' | 'MLB'
type Score = { league: League; home: string; away: string; homeScore: string; awayScore: string; status: string; date: string; live: boolean }
const leagues: { id: League; emoji: string }[] = [
  { id: 'NFL', emoji: '🏈' }, { id: 'NBA', emoji: '🏀' }, { id: 'MLB', emoji: '⚾' }
]
export default function LatestSportsScores() {
  const [scores, setScores] = useState<Partial<Record<League, Score | null>>>({})
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    const refresh = async () => {
      try {
        const response = await fetch('/api/sports')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        if (active) setScores(previous => ({ ...previous, ...data }))
      } catch { /* Keep last known scores rather than showing fake results */ }
      if (active) setLoading(false)
    }
    void refresh()
    const timer = window.setInterval(() => void refresh(), 300000)
    return () => { active = false; window.clearInterval(timer) }
  }, [])
  return (
    <section aria-label="Latest US sports scores" className="w-full rounded-xl border border-white/20 bg-white/30 dark:bg-black/20 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Sports</span>
        <div className="grid grid-cols-3 gap-1.5 flex-1 min-w-0">
          {leagues.map(({ id, emoji }) => {
            const score = scores[id]
            return <div key={id} className="min-w-0 rounded-lg bg-white/45 dark:bg-white/10 px-1.5 py-2 text-center">
              <div className="text-[10px] font-bold text-gray-900 dark:text-white">{emoji} {id}</div>
              {score ? <>
                <div className="text-[10px] sm:text-xs font-semibold text-gray-900 dark:text-white tabular-nums break-words">{score.away} {score.awayScore}–{score.homeScore} {score.home}</div>
                <div className="text-[9px] text-gray-600 dark:text-gray-300" title={new Date(score.date).toLocaleString('en-US', {timeZone:'America/Chicago'})}>{score.live ? '● LIVE' : 'FINAL'} · {new Date(score.date).toLocaleDateString('en-US',{timeZone:'America/Chicago',month:'short',day:'numeric'})}</div>
              </> : <div className="text-[10px] text-gray-500 dark:text-gray-400">{loading ? 'Loading…' : 'No score'}</div>}
            </div>
          })}
        </div>
      </div>
    </section>
  )
}
