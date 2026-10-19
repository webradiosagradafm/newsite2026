
import { Link, useParams } from 'react-router-dom'
import LatestSportsScores from '../components/LatestSportsScores'

const leagues = {
  nfl: {
    name: 'NFL',
    title: 'National Football League',
    emoji: '🏈',
  },
  nba: {
    name: 'NBA',
    title: 'National Basketball Association',
    emoji: '🏀',
  },
  mlb: {
    name: 'MLB',
    title: 'Major League Baseball',
    emoji: '⚾',
  },
}

export default function SportsLeaguePage() {
  const { league } = useParams<{ league: string }>()
  const current = league ? leagues[league.toLowerCase() as keyof typeof leagues] : undefined

  if (!current) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12 text-white">
        <h1 className="text-2xl font-bold">League not found</h1>
        <Link className="mt-4 inline-block text-orange-400" to="/sports">
          ← Back to Sports
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-10 text-white">
      <Link
        to="/sports"
        className="inline-block text-sm text-orange-400 hover:text-orange-300"
      >
        ← All Sports
      </Link>

      <header className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="text-4xl" aria-hidden="true">{current.emoji}</div>
        <h1 className="mt-3 text-3xl font-black">{current.name}</h1>
        <p className="mt-2 text-white/70">{current.title}</p>
      </header>

      <section>
        <h2 className="mb-3 text-xl font-bold">Latest scores</h2>
        <LatestSportsScores />
        <p className="mt-3 text-sm text-white/50">
          Scores show the latest finalized games provided by our sports API.
        </p>
      </section>
    </main>
  )
}
