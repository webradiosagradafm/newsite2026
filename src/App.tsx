import React, { useState, useRef, useEffect, useMemo } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import RecentlyPlayed from './components/RecentlyPlayed'
import LivePlayerBar from './components/LivePlayerBar'
import ProgramDetail from './components/ProgramDetail'
import Playlist from './components/Playlist'
import ScheduleList from './components/ScheduleList'

import AdvertiserPanel from './pages/AdvertiserPanel'

import { SCHEDULES } from './constants'
import { Program } from './types'

const STREAM_URL = 'https://stream.zeno.fm/hvwifp8ezc6tv'
const METADATA_URL = 'https://api.zeno.fm/mounts/metadata/subscribe/hvwifp8ezc6tv'

const DEFAULT_ARTWORK =
  'https://res.cloudinary.com/dtecypmsh/image/upload/v1769820657/logo_hochsa.webp'

const BLOCKED_METADATA_KEYWORDS = [
  'praise fm',
  'praisefm',
  'commercial',
  'spot',
  'promo',
  'ident',
  'sweeper',
  'intro',
  'program',
  'announcement',
  'station id',
  'jingle',
  'bumper',
  'midnight grace',
  'ramp',
  'ramps',
]

interface LiveMetadata {
  artist: string
  title: string
  playedAt?: Date
  isMusic?: boolean
  artwork?: string
}

const getChicagoDayAndTotalMinutes = () => {
  const now = new Date()
  const chicagoDate = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Chicago' })
  )

  return {
    day: chicagoDate.getDay(),
    total: chicagoDate.getHours() * 60 + chicagoDate.getMinutes(),
  }
}

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const AdBanner = () => {
  const navigate = useNavigate()

  return (
    <section className="max-w-6xl mx-auto px-4 mt-6">
      <button
        onClick={() => navigate('/advertise')}
        className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black p-5 text-left shadow-md hover:scale-[1.01] transition"
      >
        <p className="text-xs uppercase font-bold tracking-widest">
          Advertising Opportunity
        </p>

        <h2 className="text-xl md:text-2xl font-extrabold">
          Promote Your Brand on Praise FM
        </h2>

        <p className="text-sm md:text-base mt-1">
          Reach a global Christian audience with daily radio ads.
        </p>
      </button>
    </section>
  )
}

const SimplePage = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-sm text-gray-600 dark:text-gray-300 hover:underline"
      >
        ← Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      <div className="text-gray-700 dark:text-gray-300 space-y-4">
        {children}
      </div>
    </div>
  )
}

const AppContent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [liveMetadata, setLiveMetadata] = useState<LiveMetadata | null>(null)
  const [trackHistory, setTrackHistory] = useState<LiveMetadata[]>([])
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('praise-theme') as 'light' | 'dark') || 'light'
  )

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const location = useLocation()
  const navigate = useNavigate()

  const { day, total } = getChicagoDayAndTotalMinutes()

  const { currentProgram, queue } = useMemo(() => {
    const schedule = SCHEDULES[day] || SCHEDULES[1] || []

    if (!schedule.length) {
      return { currentProgram: null, queue: [] }
    }

    const index = schedule.findIndex((p) => {
      const [sH, sM] = p.startTime.split(':').map(Number)
      const [eH, eM] = p.endTime.split(':').map(Number)

      const start = sH * 60 + sM
      const end = (eH === 0 ? 24 : eH) * 60 + eM

      return total >= start && total < end
    })

    const currentIndex = index !== -1 ? index : 0
    const currentProgram = schedule[currentIndex]

    const remaining = schedule.slice(currentIndex + 1)
    const nextDay = (day + 1) % 7
    const nextSchedule = SCHEDULES[nextDay] || SCHEDULES[1] || []
    const queue = [...remaining, ...nextSchedule].slice(0, 4)

    return { currentProgram, queue }
  }, [day, total])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('praise-theme', theme)
  }, [theme])

  useEffect(() => {
    const audio = new Audio()
    audio.src = STREAM_URL
    audio.preload = 'none'
    audio.volume = parseFloat(localStorage.getItem('praise-volume') || '0.8')

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleVolumeChange = () => {
      localStorage.setItem('praise-volume', String(audio.volume))
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('volumechange', handleVolumeChange)

    audioRef.current = audio

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('volumechange', handleVolumeChange)
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      return
    }

    audioRef.current.play().catch((err) => {
      console.error('Playback failed:', err)
      setIsPlaying(false)
    })
  }

  useEffect(() => {
    const es = new EventSource(METADATA_URL)

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data || '{}')
        const streamTitle = String(data?.streamTitle || '').trim()

        if (!streamTitle || !streamTitle.includes(' - ')) return

        const [rawArtist, ...rest] = streamTitle.split(' - ')
        const artist = rawArtist?.trim()
        const title = rest.join(' - ').trim()

        if (!artist || !title) return

        const combined = `${artist} ${title}`.toLowerCase()

        if (BLOCKED_METADATA_KEYWORDS.some((keyword) => combined.includes(keyword))) {
          return
        }

        const meta: LiveMetadata = {
          artist,
          title,
          playedAt: new Date(),
          isMusic: true,
          artwork: DEFAULT_ARTWORK,
        }

        setLiveMetadata((prev) => {
          if (prev?.artist === artist && prev?.title === title) return prev

          setTrackHistory((history) => [meta, ...history].slice(0, 10))

          return meta
        })

        if ('mediaSession' in navigator && 'MediaMetadata' in window) {
          try {
            navigator.mediaSession.metadata = new window.MediaMetadata({
              title,
              artist,
              album: 'Praise FM',
              artwork: [
                {
                  src: DEFAULT_ARTWORK,
                  sizes: '512x512',
                  type: 'image/webp',
                },
              ],
            })
          } catch (err) {
            console.warn('MediaMetadata failed:', err)
          }
        }
      } catch (err) {
        console.error('Metadata parse error:', err)
      }
    }

    es.onerror = () => {
      console.warn('Metadata EventSource disconnected')
    }

    return () => es.close()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
      <Navbar
        activeTab={location.pathname === '/' ? 'home' : location.pathname.split('/')[1]}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
      />

      <main className={`flex-grow ${isPlaying ? 'pb-[110px] md:pb-[96px]' : ''}`}>
        {selectedProgram ? (
          <ProgramDetail
            program={selectedProgram}
            onBack={() => setSelectedProgram(null)}
            onViewSchedule={() => navigate('/schedule')}
            onListenClick={togglePlayback}
            isPlaying={isPlaying}
          />
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero
                    onListenClick={togglePlayback}
                    isPlaying={isPlaying}
                    liveMetadata={liveMetadata}
                    onNavigateToProgram={setSelectedProgram}
                  />

                  <AdBanner />

                  <RecentlyPlayed tracks={trackHistory} />
                </>
              }
            />

            <Route path="/music" element={<Playlist />} />

            <Route
              path="/schedule"
              element={
                <ScheduleList
                  onNavigateToProgram={setSelectedProgram}
                  onBack={() => navigate('/')}
                />
              }
            />

            <Route
              path="/advertise"
              element={
                <SimplePage title="Sales & Advertising">
                  <p>
                    Promote your business, church, event, ministry, or brand with Praise FM.
                    Reach a global Christian audience every day through online radio and website visibility.
                  </p>

                  <h2 className="text-xl font-semibold mt-6">Advertising Packages</h2>

                  <div className="grid gap-4 md:grid-cols-3 mt-4">
                    <div className="p-5 rounded-2xl bg-gray-100 dark:bg-gray-900">
                      <h3 className="text-lg font-bold">Starter</h3>
                      <p className="mt-2">5 radio ads per day</p>
                      <p className="mt-2 font-semibold">$25/month or €23/month</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-400">
                      <h3 className="text-lg font-bold">Standard</h3>
                      <p className="mt-2">10 radio ads per day</p>
                      <p className="mt-2 font-semibold">$40/month or €37/month</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-gray-100 dark:bg-gray-900">
                      <h3 className="text-lg font-bold">Premium</h3>
                      <p className="mt-2">20 radio ads per day + priority placement</p>
                      <p className="mt-2 font-semibold">$70/month or €65/month</p>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold mt-6">Why Advertise With Us?</h2>

                  <ul className="list-disc pl-5">
                    <li>Global Christian audience 24/7</li>
                    <li>Daily exposure for your brand</li>
                    <li>Affordable monthly packages</li>
                    <li>Radio + website promotion opportunities</li>
                    <li>Ideal for churches, events, local businesses, and ministries</li>
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <a
                      href="https://wa.me/5521971099200"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-600 transition"
                    >
                      Get Your Ad On Air
                    </a>

                    <a
                      href="/advertiser"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-black font-semibold hover:opacity-90 transition"
                    >
                      Access Advertiser Dashboard
                    </a>
                  </div>
                </SimplePage>
              }
            />

            <Route path="/advertiser" element={<AdvertiserPanel />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>

      <Footer />

      {currentProgram && (
        <LivePlayerBar
          isPlaying={isPlaying}
          onTogglePlayback={togglePlayback}
          program={currentProgram}
          liveMetadata={liveMetadata}
          queue={queue}
          audioRef={audioRef}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
      <SpeedInsights />
    </BrowserRouter>
  )
}