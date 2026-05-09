import React, { useState, useRef, useEffect, useMemo } from 'react'

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom'

import {
  Play,
  Pause,
  Megaphone
} from 'lucide-react'

import { SpeedInsights } from '@vercel/speed-insights/react'

import { AuthProvider } from './contexts/AuthContext'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RecentlyPlayed from './components/RecentlyPlayed'
import LivePlayerBar from './components/LivePlayerBar'
import ProgramDetail from './components/ProgramDetail'
import Playlist from './components/Playlist'
import ScheduleList from './components/ScheduleList'
import SEO from './components/SEO'

import DevotionalPage from './pages/DevotionalPage'
import EventsPage from './pages/EventsPage'
import NewReleasesPage from './pages/NewReleasesPage'
import FeaturedArtistsPage from './pages/FeaturedArtistsPage'
import PresentersPage from './pages/PresentersPage'
import LiveRecordingsPage from './pages/LiveRecordingsPage'
import HelpCenterPage from './pages/HelpCenterPage'
import FeedbackPage from './pages/FeedbackPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfUsePage from './pages/TermsOfUsePage'
import CookiesPolicyPage from './pages/CookiesPolicyPage'

import { SCHEDULES } from './constants'
import { Program } from './types'

const DEFAULT_COVER = '/logo.png'

const STREAM_URL =
  'https://stream.zeno.fm/hvwifp8ezc6tv'

const METADATA_URL =
  'https://api.zeno.fm/mounts/metadata/subscribe/hvwifp8ezc6tv'

interface LiveMetadata {
  artist: string
  title: string
}

const formatToAmPm = (time?: string) => {
  if (!time) return ''

  const [hourRaw, minuteRaw] =
    time.split(':').map(Number)

  const hour =
    hourRaw === 0
      ? 12
      : hourRaw > 12
      ? hourRaw - 12
      : hourRaw

  const minute = String(minuteRaw || 0).padStart(2, '0')

  const period = hourRaw >= 12 ? 'PM' : 'AM'

  return `${hour}:${minute} ${period}`
}

const formatRangeToAmPm = (
  start?: string,
  end?: string
) => {
  if (!start || !end) return '24/7'

  return `${formatToAmPm(start)} - ${formatToAmPm(end)}`
}

const getChicagoDayAndTotalMinutes = () => {
  const now = new Date()

  const chicagoDate = new Date(
    now.toLocaleString('en-US', {
      timeZone: 'America/Chicago'
    })
  )

  return {
    day: chicagoDate.getDay(),
    total:
      chicagoDate.getHours() * 60 +
      chicagoDate.getMinutes()
  }
}

const getProgramImage = (program?: Program) => {
  const p = program as any

  return (
    p?.image ||
    p?.cover ||
    p?.presenterImage ||
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

const HomePage = ({
  isPlaying,
  liveMetadata,
  currentProgram,
  queue,
  onListenClick,
  onNavigateToProgram,
  trackHistory
}: any) => {
  return (
    <>
      <section className="bg-white dark:bg-[#121212] text-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">

          <div className="grid md:grid-cols-[220px_1fr] gap-10 items-center">

            <div className="w-[200px] h-[200px] rounded-full overflow-hidden shadow-2xl mx-auto">
              <img
                src={getProgramImage(currentProgram)}
                alt="Praise FM"
                className="w-full h-full object-cover"
              />
            </div>

            <div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-orange-500 font-black">
                  LIVE
                </span>

                <span className="text-gray-500">
                  •
                </span>

                <span className="text-gray-500">
                  {currentProgram
                    ? formatRangeToAmPm(
                        currentProgram.startTime,
                        currentProgram.endTime
                      )
                    : '24/7'}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black">
                {currentProgram?.title ||
                  'Praise FM USA'}
              </h1>

              <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
                {currentProgram?.description ||
                  'Global Christian Radio'}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {liveMetadata?.artist || 'Streaming 24/7'}
              </p>

              <button
                onClick={onListenClick}
                className="mt-8 bg-orange-500 hover:bg-orange-600 transition px-10 py-4 text-white font-black flex items-center gap-3"
              >
                {isPlaying ? (
                  <Pause size={22} />
                ) : (
                  <Play
                    size={22}
                    fill="currentColor"
                  />
                )}

                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-10">

            {queue?.slice(0, 3).map((program: Program) => (
              <button
                key={program.title}
                onClick={() =>
                  onNavigateToProgram(program)
                }
                className="bg-gray-100 dark:bg-[#1c1c1c] hover:bg-gray-200 dark:hover:bg-[#262626] transition p-4 text-left"
              >
                <img
                  src={getProgramImage(program)}
                  alt={program.title}
                  className="w-full h-40 object-cover mb-4"
                />

                <p className="text-xs uppercase text-orange-500 font-bold">
                  {formatRangeToAmPm(
                    program.startTime,
                    program.endTime
                  )}
                </p>

                <h3 className="font-black text-lg mt-1">
                  {program.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {program.host}
                </p>
              </button>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500">
              <Megaphone size={16} />
              Advertise with us
            </button>
          </div>
        </div>
      </section>

      <RecentlyPlayed tracks={trackHistory} />
    </>
  )
}

const AppContent = () => {
  const [isPlaying, setIsPlaying] =
    useState(false)

  const [liveMetadata, setLiveMetadata] =
    useState<LiveMetadata | null>(null)

  const [trackHistory, setTrackHistory] =
    useState<any[]>([])

  const [selectedProgram, setSelectedProgram] =
    useState<Program | null>(null)

  const audioRef =
    useRef<HTMLAudioElement | null>(null)

  const location = useLocation()

  const { day, total } =
    getChicagoDayAndTotalMinutes()

  const { currentProgram, queue } = useMemo(() => {
    const schedule =
      SCHEDULES[day] || SCHEDULES[1]

    const current =
      schedule.find((p: Program) => {
        const [sH, sM] =
          p.startTime.split(':').map(Number)

        const [eH, eM] =
          p.endTime.split(':').map(Number)

        const start = sH * 60 + sM
        const end = eH * 60 + eM

        return total >= start && total < end
      }) || schedule[0]

    return {
      currentProgram: current,
      queue: schedule.slice(1, 4)
    }
  }, [day, total])

  useEffect(() => {
    const audio = new Audio(STREAM_URL)

    audio.volume = 0.8

    audioRef.current = audio

    return () => {
      audio.pause()
    }
  }, [])

  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    const es = new EventSource(METADATA_URL)

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        const streamTitle =
          data.streamTitle || ''

        if (!streamTitle.includes(' - '))
          return

        const [artist, title] =
          streamTitle.split(' - ')

        const meta = {
          artist,
          title
        }

        setLiveMetadata(meta)

        setTrackHistory((prev) => [
          meta,
          ...prev
        ].slice(0, 10))
      } catch {}
    }

    return () => {
      es.close()
    }
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-black dark:text-white pb-[120px]">

      <SEO
        title="Praise FM USA"
        description="24/7 Worship & Gospel Radio"
        url={window.location.href}
      />

      <Navbar
        activeTab={
          location.pathname === '/'
            ? 'home'
            : location.pathname.replace('/', '')
        }
      />

      <main>

        {selectedProgram ? (
          <ProgramDetail
            program={selectedProgram}
            onBack={() =>
              setSelectedProgram(null)
            }
            onListenClick={togglePlayback}
            isPlaying={isPlaying}
          />
        ) : (
          <Routes>

            <Route
              path="/"
              element={
                <HomePage
                  isPlaying={isPlaying}
                  liveMetadata={liveMetadata}
                  currentProgram={currentProgram}
                  queue={queue}
                  onListenClick={togglePlayback}
                  onNavigateToProgram={
                    setSelectedProgram
                  }
                  trackHistory={trackHistory}
                />
              }
            />

            <Route
              path="/music"
              element={<Playlist />}
            />

            <Route
              path="/schedule"
              element={
                <ScheduleList
                  onNavigateToProgram={
                    setSelectedProgram
                  }
                />
              }
            />

            <Route
              path="/devotional"
              element={<DevotionalPage />}
            />

            <Route
              path="/events"
              element={<EventsPage />}
            />

            <Route
              path="/new-releases"
              element={<NewReleasesPage />}
            />

            <Route
              path="/artists"
              element={<FeaturedArtistsPage />}
            />

            <Route
              path="/presenters"
              element={
                <PresentersPage
                  onNavigateToProgram={
                    setSelectedProgram
                  }
                />
              }
            />

            <Route
              path="/live-recordings"
              element={<LiveRecordingsPage />}
            />

            <Route
              path="/help"
              element={<HelpCenterPage />}
            />

            <Route
              path="/feedback"
              element={<FeedbackPage />}
            />

            <Route
              path="/privacy"
              element={<PrivacyPolicyPage />}
            />

            <Route
              path="/terms"
              element={<TermsOfUsePage />}
            />

            <Route
              path="/cookies"
              element={<CookiesPolicyPage />}
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />

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
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
        <SpeedInsights />
      </BrowserRouter>
    </AuthProvider>
  )
}