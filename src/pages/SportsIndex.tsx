
import React from 'react'
import { Link } from 'react-router-dom'
import LatestSportsScores from '../components/LatestSportsScores'

const leagues = [
  { name: 'NFL', description: 'Professional American football', emoji: '🏈' },
  { name: 'NBA', description: 'Professional basketball', emoji: '🏀' },
  { name: 'MLB', description: 'Major League Baseball', emoji: '⚾' },
  { name: 'NHL', description: 'Professional ice hockey', emoji: '🏒' },
  { name: 'College Football', description: 'US college football', emoji: '🎓' },
]

export default function SportsIndex() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 text-white md:px-6 md:py-12">
      <header className="mb-8 rounded-2xl border border-white/10 bg-black/30 p-6 md:p-10">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
          Praise FM USA
        </p>

        <h1 className="text-4xl font-black tracking-tight md:text-6xl">
          Sports Center
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
          Your destination for American sports scores, game updates and
          the latest sports stories.
        </p>

        <a
          href="#latest-scores"
          className="mt-6 inline-flex rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600"
        >
          View Latest Scores
        </a>
      </header>

      <section id="latest-scores" className="mb-10 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-extrabold md:text-3xl">
          Latest Scores
        </h2>

        <LatestSportsScores />

        <p className="mt-3 text-sm text-white/50">
          Scores are provided by ESPN public endpoints and may not always
          be available or up to date.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-extrabold md:text-3xl">
          Explore the Leagues
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leagues.map((league) => (
            <article
              key={league.name}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-orange-400/50 hover:bg-white/[0.07]"
            >
              <div className="mb-3 text-3xl" aria-hidden="true">
                {league.emoji}
              </div>

              <h3 className="text-xl font-bold">{league.name}</h3>

              <p className="mt-2 text-sm leading-6 text-white/60">
                {league.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 md:p-8">
        <h2 className="text-2xl font-extrabold">
          More from Praise FM
        </h2>

        <p className="mt-3 max-w-2xl leading-7 text-white/70">
          Stay connected with Praise FM USA for uplifting music,
          programming and new stories.
        </p>

        <Link
          to="/"
          className="mt-5 inline-flex font-bold text-orange-400 hover:text-orange-300"
        >
          Listen to Praise FM Live →
        </Link>
      </section>
    </main>
  )
}
