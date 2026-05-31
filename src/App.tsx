import React, { useState, useRef, useEffect, useMemo } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom'

import { Play, Pause, Megaphone } from 'lucide-react'
import { SpeedInsights } from '@vercel/speed-insights/react'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RecentlyPlayed from './components/RecentlyPlayed'
import LivePlayerBar from './components/LivePlayerBar'
import ProgramDetail from './components/ProgramDetail'
import Playlist from './components/Playlist'
import ScheduleList from './components/ScheduleList'
import SEO from './components/SEO'

import ProgramsPage from './pages/ProgramsPage'
import ProgramEpisodesPage from './pages/ProgramEpisodesPage'
import DevotionalPage from './pages/DevotionalPage'
import EventsPage from './pages/EventsPage'
import NewReleasesPage from './pages/NewReleasesPage'
import FeaturedArtistsPage from './pages/FeaturedArtistsPage'
import PresentersPage from './pages/PresentersPage'
import LiveRecordingsPage from './pages/LiveRecordingsPage'
import ListenAgainPage from './pages/ListenAgainPage'
import HelpCenterPage from './pages/HelpCenterPage'
import FeedbackPage from './pages/FeedbackPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfUsePage from './pages/TermsOfUsePage'
import CookiesPolicyPage from './pages/CookiesPolicyPage'
import AdvertisePage from './pages/AdvertisePage'

import { SCHEDULES } from './constants'
import { Program } from './types'

const DEFAULT_COVER = '/logo.png'
const STREAM_URL = 'https://stream.zeno.fm/hvwifp8ezc6tv'
const METADATA_URL = 'https://api.zeno.fm/mounts/metadata/subscribe/hvwifp8ezc6tv'

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
  'bumper'
]

interface LiveMetadata {
  artist: string
  title: string
  playedAt?: Date
  isMusic?: boolean
}

const formatToAmPm = (time?: string) => {
  if (!time) return ''

  const [hourRaw, minuteRaw] = time.split(':').map(Number)
  const hour = hourRaw === 0 ? 12 : hourRaw > 12 ? hourRaw - 12 : hourRaw
  const minute = String(minuteRaw || 0).padStart(2, '0')
  const period = hourRaw >= 12 ? 'PM' : 'AM'

  return `${hour}:${minute} ${period}`
}

const formatRangeToAmPm = (start?: string, end?: string) => {
  if (!start || !end) return '24/7'
  return `${formatToAmPm(start)} - ${formatToAmPm(end)}`
}

const getChicagoDayAndTotalMinutes = () => {
  const now = new Date()

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  const parts = formatter.formatToParts(now)
  const weekday = parts.find((p) => p.type === 'weekday')?.value || 'Mon'
  const hour = Number(parts.find((p) => p.type === 'hour')?.value || 0)
  const minute = Number(parts.find((p) => p.type === 'minute')?.value || 0)

  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6
  }

  return {
    day: dayMap[weekday] ?? 1,
    total: hour * 60 + minute
  }
}

const getProgramProgress = (program?: Program) => {
  if (!program) return 0

  const { total } = getChicagoDayAndTotalMinutes()

  const [sH, sM] = program.startTime.split(':').map(Number)
  const [eH, eM] = program.endTime.split(':').map(Number)

  const start = sH * 60 + sM
  let end = eH * 60 + eM

  if (end === 0 || end <= start) end = 24 * 60

  if (total <= start) return 0
  if (total >= end) return 100

  return Math.round(((total - start) / (end - start)) * 100)
}

const getProgramImage = (program?: Program) => {
  const p = program as any

  return (
    p?.image ||
    p?.cover ||
    p?.presenterImage ||
    p?.presenter?.image ||
    DEFAULT_COVER
  )
}

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const HomeBBC = ({
  isPlaying,
  liveMetadata,
  currentProgram,
  queue,
  onListenClick,
  onNavigateToProgram,
  trackHistory
}: {
  isPlaying: boolean
  liveMetadata: LiveMetadata | null
  currentProgram?: Program
  queue: Program[]
  onListenClick: () => void
  onNavigateToProgram: (program: Program) => void
  trackHistory: LiveMetadata[]
}) => {
  const navigate = useNavigate()

  const nextOne = queue?.[0]
  const nextTwo = queue?.[1]
  const nextThree = queue?.[2]

  const presenterImage = getProgramImage(currentProgram)
  const progress = getProgramProgress(currentProgram)

  const size = 190
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  return (
    <>
      <section className="bg-white dark:bg-[#121212] text-gray-950 dark:text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
          <div className="flex flex-col md:grid md:grid-cols-[220px_1fr] gap-8 md:gap-10 items-center border-b border-gray-300 dark:border-white/10 pb-8 md:pb-10">
            <div className="relative w-[190px] h-[190px] mx-auto md:mx-0 flex-shrink-0">
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox={`0 0 ${size} ${size}`}
              >
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  fill="none"
                  className="text-gray-300 dark:text-gray-700"
                  opacity={0.3}
                />

                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke="#f97316"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress / 100)}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-[14px] rounded-full overflow-hidden bg-gray-200 shadow-lg">
                <img
                  src={presenterImage}
                  alt={currentProgram?.title || 'Praise FM'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_COVER
                  }}
                />
              </div>

              <div className="absolute -right-3 bottom-1 w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-4xl font-black border-4 border-white dark:border-[#121212] shadow-lg">
                1
              </div>
            </div>

            <div className="text-center md:text-left w-full">
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm mb-2">
                <span className="font-black text-orange-500">LIVE</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">
                  {currentProgram
                    ? formatRangeToAmPm(currentProgram.startTime, currentProgram.endTime)
                    : '24/7'}
                </span>
              </div>

              <button
                onClick={() => currentProgram && onNavigateToProgram(currentProgram)}
                className="group text-center md:text-left w-full md:w-auto"
              >
                <h1 className="text-3xl md:text-4xl font-black leading-tight">
                  {currentProgram?.title || 'Praise FM Live'}
                  <span className="text-orange-500 ml-2 group-hover:ml-3 transition-all">
                    ›
                  </span>
                </h1>
              </button>

              <p className="mt-2 text-base md:text-lg text-gray-700 dark:text-gray-300">
                {currentProgram?.description || 'Global Christian Radio'}
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {liveMetadata?.artist || 'Streaming 24/7'}
              </p>

              <button
                onClick={onListenClick}
                className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-10 md:px-12 py-3 md:py-4 font-black text-lg transition active:scale-95 inline-flex items-center justify-center gap-3 mx-auto md:mx-0 rounded-xl"
              >
                {isPlaying ? <Pause size={22} /> : <Play size={22} fill="currentColor" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8 border-b border-gray-300 dark:border-white/10">
            {[nextOne, nextTwo, nextThree].filter(Boolean).map((program) => (
              <button
                key={(program as Program).id || (program as Program).title}
                onClick={() => onNavigateToProgram(program as Program)}
                className="flex gap-4 text-left group items-center bg-gray-100 dark:bg-[#1A1A1A] hover:bg-gray-200 dark:hover:bg-[#252525] p-4 transition-colors w-full rounded-2xl"
              >
                <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-xl">
                  <img
                    src={getProgramImage(program as Program)}
                    alt={(program as Program).title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-black text-orange-500 uppercase tracking-wide mb-0.5">
                    {formatRangeToAmPm(
                      (program as Program).startTime,
                      (program as Program).endTime
                    )}
                  </p>

                  <h3 className="text-sm font-bold leading-tight group-hover:text-orange-500 transition-colors truncate">
                    {(program as Program).title}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {(program as Program).host}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-center md:justify-end mt-3 mb-5">
            <button
              onClick={() => navigate('/advertise')}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-orange-500 transition-colors group"
            >
              <Megaphone className="w-3.5 h-3.5 group-hover:text-orange-500" />
              <span className="font-medium uppercase tracking-wider">
                Advertise with us
              </span>
            </button>
          </div>

          <div className="py-4">
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed text-center md:text-left">
              {currentProgram?.description ||
                'Listen live to Praise FM — Christian music, worship and devotionals.'}
            </p>
          </div>
        </div>
      </section>

      <RecentlyPlayed tracks={trackHistory} />
    </>
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
  const eventSourceRef = useRef<EventSource | null>(null)

  const location = useLocation()
  const navigate = useNavigate()

  const { day, total } = getChicagoDayAndTotalMinutes()

  const { currentProgram, queue } = useMemo(() => {
    const schedule = SCHEDULES[day] || SCHEDULES[1]

    const currentIndex = schedule.findIndex((p: Program) => {
      const [sH, sM] = p.startTime.split(':').map(Number)
      const [eH, eM] = p.endTime.split(':').map(Number)

      const start = sH * 60 + sM
      let end = eH * 60 + eM

      if (end === 0 || end <= start) end = 24 * 60

      return total >= start && total < end
    })

    const safeIndex = currentIndex === -1 ? 0 : currentIndex
    const currentProgram = schedule[safeIndex]

    const nextPrograms: Program[] = []

    for (let i = 1; i <= 4; i++) {
      const nextIndex = (safeIndex + i) % schedule.length
      nextPrograms.push(schedule[nextIndex])
    }

    return {
      currentProgram,
      queue: nextPrograms
    }
  }, [day, total])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('praise-theme', theme)
  }, [theme])

  useEffect(() => {
    const audio = new Audio(STREAM_URL)

    audio.crossOrigin = 'anonymous'
    audio.preload = 'none'
    audio.volume = parseFloat(localStorage.getItem('praise-volume') || '0.8')

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    audioRef.current = audio

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
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

    audioRef.current.play().catch(() => setIsPlaying(false))
  }

  const openProgramPage = (program: Program) => {
    setSelectedProgram(program)
    navigate('/program')
  }

  useEffect(() => {
    const es = new EventSource(METADATA_URL, {
      withCredentials: false
    })

    eventSourceRef.current = es

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        const streamTitle = data.streamTitle || ''

        if (!streamTitle.includes(' - ')) return

        const [artistRaw, ...rest] = streamTitle.split(' - ')
        const artist = artistRaw.trim()
        const title = rest.join(' - ').trim()

        if (!artist || !title) return

        const fullText = `${artist} ${title}`.toLowerCase()

        if (BLOCKED_METADATA_KEYWORDS.some((k) => fullText.includes(k))) {
          return
        }

        setLiveMetadata((prev) => {
          if (prev && prev.title === title && prev.artist === artist) {
            return prev
          }

          const meta: LiveMetadata = {
            artist,
            title,
            playedAt: new Date(),
            isMusic: true
          }

          setTrackHistory((history) => [meta, ...history].slice(0, 10))

          return meta
        })
      } catch {}
    }

    return () => {
      es.close()
      eventSourceRef.current = null
    }
  }, [])

  const seo = {
    title: 'Praise FM USA - 24/7 Worship & Gospel Radio',
    description:
      'Listen live to Praise FM USA — 24/7 Christian radio streaming worship music, gospel hits, devotionals, and uplifting shows.'
  }

  return (
    <div className="min-h-screen flex flex-col pb-[120px] bg-white dark:bg-[#121212] transition-colors">
      <SEO title={seo.title} description={seo.description} url={window.location.href} />

      <Navbar
        activeTab={location.pathname === '/' ? 'home' : location.pathname.split('/')[1]}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
      />

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <HomeBBC
                isPlaying={isPlaying}
                liveMetadata={liveMetadata}
                currentProgram={currentProgram}
                queue={queue}
                onListenClick={togglePlayback}
                onNavigateToProgram={openProgramPage}
                trackHistory={trackHistory}
              />
            }
          />

          <Route
            path="/program"
            element={
              selectedProgram ? (
                <ProgramDetail
                  program={selectedProgram}
                  liveMetadata={liveMetadata}
                  trackHistory={trackHistory}
                  isPlaying={isPlaying}
                  onListenClick={togglePlayback}
                  onBack={() => navigate(-1)}
                  onViewSchedule={() => navigate('/schedule')}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route path="/programs" element={<ProgramsPage />} />

          <Route path="/program/:slug" element={<ProgramEpisodesPage />} />

          <Route path="/music" element={<Playlist />} />

          <Route
            path="/schedule"
            element={
              <ScheduleList
                onNavigateToProgram={openProgramPage}
                onBack={() => navigate('/')}
              />
            }
          />

          <Route path="/devotional" element={<DevotionalPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/new-releases" element={<NewReleasesPage />} />
          <Route path="/artists" element={<FeaturedArtistsPage />} />

          <Route
            path="/presenters"
            element={<PresentersPage onNavigateToProgram={openProgramPage} />}
          />

          <Route path="/live-recordings" element={<LiveRecordingsPage />} />
          <Route path="/listen-again" element={<ListenAgainPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/advertise" element={<AdvertisePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfUsePage />} />
          <Route path="/cookies" element={<CookiesPolicyPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
