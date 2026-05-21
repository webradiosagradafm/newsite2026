import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc
} from 'firebase/firestore'
import {
  ArrowLeft,
  Clock,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2
} from 'lucide-react'

import { db } from '../firebase'

interface Episode {
  id: string
  title: string
  presenter?: string
  description: string
  duration: string
  date: string
  audioUrl: string
  image: string
}

interface ProgramData {
  title: string
  presenter: string
  description: string
  image: string
  start: string
  end: string
}

interface EpisodePlayerProps {
  episode: Episode
  image: string
  fallbackPresenter: string
}

const DEFAULT_COVER = '/logo.png'

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00'

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)

  return `${mins}:${String(secs).padStart(2, '0')}`
}

const EpisodePlayer = ({
  episode,
  image,
  fallbackPresenter
}: EpisodePlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.85)

  const progress =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0

  const presenter = episode.presenter || fallbackPresenter

  const togglePlay = async () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    try {
      await audioRef.current.play()
      setIsPlaying(true)
    } catch (error) {
      console.error('Error playing episode:', error)
    }
  }

  const seekTo = (value: number) => {
    if (!audioRef.current || !duration) return

    const nextTime = (value / 100) * duration
    audioRef.current.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  const skip = (seconds: number) => {
    if (!audioRef.current) return

    const nextTime = Math.max(
      0,
      Math.min(audioRef.current.currentTime + seconds, duration || 0)
    )

    audioRef.current.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  const changeVolume = (value: number) => {
    setVolume(value)

    if (audioRef.current) {
      audioRef.current.volume = value
    }
  }

  return (
    <div className="rounded-[2rem] bg-[#111111] border border-white/10 overflow-hidden shadow-2xl">
      <audio
        ref={audioRef}
        preload="metadata"
        src={episode.audioUrl}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration || 0)
          e.currentTarget.volume = volume
        }}
        onTimeUpdate={(e) => {
          setCurrentTime(e.currentTarget.currentTime || 0)
        }}
        onEnded={() => {
          setIsPlaying(false)
          setCurrentTime(0)
        }}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
        <div className="relative min-h-[280px] bg-black">
          <img
            src={image}
            alt={episode.title}
            className="absolute inset-0 h-full w-full object-cover opacity-90"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_COVER
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          <button
            onClick={togglePlay}
            className="absolute left-6 bottom-6 w-20 h-20 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-2xl transition active:scale-95"
          >
            {isPlaying ? (
              <Pause size={34} fill="currentColor" />
            ) : (
              <Play size={34} fill="currentColor" className="ml-1" />
            )}
          </button>
        </div>

        <div className="p-6 md:p-8 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-wide text-orange-500 mb-3">
            <span>{episode.date}</span>
            <span>•</span>
            <span>{episode.duration}</span>
          </div>

          <h3 className="text-3xl md:text-5xl font-black leading-tight mb-2">
            {episode.title}
          </h3>

          <p className="text-gray-300 mb-3">
            with <strong>{presenter}</strong>
          </p>

          <p className="text-gray-400 mb-8 max-w-3xl">
            {episode.description}
          </p>

          <div className="rounded-3xl bg-black/50 border border-white/10 p-5">
            <div className="flex items-center gap-4 mb-5">
              <button
                onClick={() => skip(-15)}
                className="hidden sm:flex w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition"
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-xl transition active:scale-95"
              >
                {isPlaying ? (
                  <Pause size={28} fill="currentColor" />
                ) : (
                  <Play size={28} fill="currentColor" className="ml-1" />
                )}
              </button>

              <button
                onClick={() => skip(30)}
                className="hidden sm:flex w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition"
              >
                <SkipForward size={20} />
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wide text-gray-400 mb-2">
                  <span>{isPlaying ? 'Now Playing' : 'Ready to Play'}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => seekTo(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />

                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <Volume2 size={18} className="text-gray-400" />

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => changeVolume(Number(e.target.value))}
                className="w-40 accent-orange-500 cursor-pointer"
              />

              <span className="text-xs text-gray-500">
                {Math.round(volume * 100)}%
              </span>
            </div>

            <div className="h-12 flex items-end gap-1 overflow-hidden">
              {Array.from({ length: 80 }).map((_, index) => {
                const active = index < Math.round(progress * 0.8)
                const height = 20 + ((index * 13) % 28)

                return (
                  <div
                    key={index}
                    className={`w-1 rounded-full transition-all ${
                      active ? 'bg-orange-500' : 'bg-white/10'
                    }`}
                    style={{ height }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProgramEpisodesPage() {
  const { slug } = useParams()

  const [program, setProgram] = useState<ProgramData | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgramAndEpisodes = async () => {
      if (!slug) return

      try {
        setLoading(true)

        const programRef = doc(db, 'programs', slug)
        const programSnap = await getDoc(programRef)

        if (programSnap.exists()) {
          setProgram(programSnap.data() as ProgramData)
        }

        const episodesRef = collection(
          db,
          'programs',
          slug,
          'episodes'
        )

        const q = query(episodesRef, orderBy('date', 'desc'))
        const snapshot = await getDocs(q)

        const episodeData = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        })) as Episode[]

        setEpisodes(episodeData)
      } catch (error) {
        console.error('Error loading program episodes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgramAndEpisodes()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        Loading program...
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        Program not found.
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <Link
          to="/programs"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-orange-500 transition mb-8"
        >
          <ArrowLeft size={18} />
          Back to Programs
        </Link>

        <section className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 lg:gap-12 items-center">
          <div className="rounded-[2rem] overflow-hidden bg-[#151515] shadow-2xl">
            <img
              src={program.image || DEFAULT_COVER}
              alt={program.title}
              className="w-full aspect-square object-cover"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_COVER
              }}
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
                Program
              </span>

              <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                <Clock size={15} />
                {program.start} - {program.end}
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-none mb-4">
              {program.title}
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              with <strong>{program.presenter}</strong>
            </p>

            <p className="text-gray-400 max-w-3xl leading-relaxed text-lg">
              {program.description}
            </p>
          </div>
        </section>

        <section className="mt-14 md:mt-20">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-black">
                Episodes
              </h2>

              <p className="text-gray-400 mt-2">
                Listen again to the latest episodes.
              </p>
            </div>

            <span className="text-sm text-gray-500">
              {episodes.length} episode{episodes.length === 1 ? '' : 's'}
            </span>
          </div>

          {episodes.length === 0 ? (
            <div className="rounded-3xl bg-[#151515] p-8 text-gray-400">
              No episodes available yet.
            </div>
          ) : (
            <div className="space-y-8">
              {episodes.map((episode) => (
                <EpisodePlayer
                  key={episode.id}
                  episode={episode}
                  image={episode.image || program.image || DEFAULT_COVER}
                  fallbackPresenter={program.presenter}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
