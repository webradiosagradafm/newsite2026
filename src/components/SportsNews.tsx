
import { useEffect, useState } from 'react'

type Story = {
  title: string
  link: string
  description: string
  image: string
  publishedAt: string
  league: string
}

export default function SportsNews() {
  const [news, setNews] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true

    fetch('/api/sports-news')
      .then((response) => {
        if (!response.ok) throw new Error('News unavailable')
        return response.json()
      })
      .then((data) => {
        if (active) setNews(Array.isArray(data.news) ? data.news : [])
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 text-white">
      <div className="mb-6">
        <p className="text-orange-400 text-xs font-bold uppercase tracking-[0.2em]">
          Latest updates
        </p>
        <h2 className="text-3xl font-black mt-1">Sports News</h2>
        <p className="text-gray-400 mt-2">
          The latest headlines from the world of sports.
        </p>
      </div>

      {loading && (
        <p className="text-gray-400 py-8">Loading latest sports news...</p>
      )}

      {!loading && error && (
        <p className="text-gray-400 py-8">
          News is temporarily unavailable. Please try again later.
        </p>
      )}

      {!loading && !error && news.length === 0 && (
        <p className="text-gray-400 py-8">
          No news is available right now.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {news.map((story) => (
          <article
            key={`${story.league}-${story.link}`}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] hover:border-orange-500/50 transition-colors"
          >
            {story.image && (
              <a href={story.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={story.image}
                  alt=""
                  loading="lazy"
                  className="w-full h-48 object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              </a>
            )}

            <div className="p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-orange-400 text-xs font-black uppercase">
                  {story.league}
                </span>
                <span className="text-gray-500 text-xs">
                  {story.publishedAt &&
                    !Number.isNaN(Date.parse(story.publishedAt)) &&
                    new Date(story.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                </span>
              </div>

              <h3 className="text-lg font-bold leading-snug">
                {story.title}
              </h3>

              {story.description && (
                <p className="text-sm text-gray-400 mt-3 line-clamp-3">
                  {story.description}
                </p>
              )}

              <a
                href={story.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-5 text-sm font-bold text-orange-400 hover:text-orange-300"
              >
                Read full story →
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-5">
        News articles are provided by their original publishers. Select a
        headline to read the full story.
      </p>
    </section>
  )
}
