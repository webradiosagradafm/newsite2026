import React, { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

interface Track {
  artist: string
  title: string
  artwork?: string
  playedAt?: Date
  isMusic?: boolean
}

interface RecentlyPlayedProps {
  tracks: Track[]
}

const RecentlyPlayed: React.FC<RecentlyPlayedProps> = ({ tracks }) => {
  const [artworks, setArtworks] = useState<Record<string, string>>({})
  const { user } = useAuth()
  const navigate = useNavigate()

  // 🔥 BLOQUEIO PESADO (nível rádio)
  const blockedKeywords = [
    'commercial',
    'promo',
    'sweeper',
    'station id',
    'ident',
    'program',
    'show',
    'radio',
    'live',
    'talk',
    'news',
    'interview',
    'announcement',
    'prayer',
    'devotional',
    'worship flow',
    'grace hour',
    'faith talks',
    'drive with',
    'voices of praise',
    'night encounter',
    'daily devotional',
  ]

  const isValidMusic = (track: Track) => {
    const text = `${track.artist} ${track.title}`.toLowerCase()

    // 🚫 bloqueio forte
    if (blockedKeywords.some((word) => text.includes(word))) {
      return false
    }

    // 🚫 precisa ter artista e título reais
    if (!track.artist || !track.title) return false

    // 🚫 evita lixo tipo "Praise FM"
    if (track.artist.length < 2 || track.title.length < 2) return false

    // 🚫 evita coisas repetitivas ou genéricas
    if (track.artist === track.title) return false

    return true
  }

  const displayedTracks = Array.isArray(tracks)
    ? tracks.filter(isValidMusic).slice(0, 6)
    : []

  useEffect(() => {
    const fetchArtworks = async () => {
      const newArtworks = { ...artworks }
      let changed = false

      for (const track of displayedTracks) {
        const key = `${track.artist}-${track.title}`

        if (!newArtworks[key] && !track.artwork) {
          try {
            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
              `${track.artist} ${track.title}`
            )}&media=music&limit=1`

            const res = await fetch(url)
            let image = ''

            if (res.ok) {
              const data = await res.json()
              if (data.results?.length) {
                image = data.results[0].artworkUrl100
              }
            }

            if (!image) {
              image = `https://picsum.photos/seed/${encodeURIComponent(key)}/100/100`
            }

            newArtworks[key] = image
            changed = true
          } catch {
            newArtworks[key] = `https://picsum.photos/seed/${encodeURIComponent(key)}/100/100`
            changed = true
          }
        }
      }

      if (changed) setArtworks(newArtworks)
    }

    if (displayedTracks.length > 0) {
      fetchArtworks()
    }
  }, [displayedTracks])

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!user) {
      navigate('/login')
    }
  }

  return (
    <section className="bg-white dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-3xl text-gray-900 dark:text-white mb-6">
          Recent Tracks
        </h2>

        {displayedTracks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Waiting for music...
          </p>
        ) : (
          <div className="flex flex-col">

            {displayedTracks.map((track, idx) => {
              const key = `${track.artist}-${track.title}`

              const artwork =
                artworks[key] ||
                track.artwork ||
                `https://picsum.photos/seed/${encodeURIComponent(key)}/100/100`

              return (
                <div
                  key={key}
                  className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 px-2 transition group"
                >
                  <div className="flex items-center gap-4">

                    <span className="text-sm text-gray-400 w-5">
                      {idx + 1}
                    </span>

                    <img
                      src={artwork}
                      className="w-11 h-11 object-cover rounded"
                    />

                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-black dark:text-white">
                        {track.title}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {track.artist}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleFavorite}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              )
            })}

          </div>
        )}

      </div>
    </section>
  )
}

export default RecentlyPlayed