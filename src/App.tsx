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

import { AuthProvider, useAuth } from './contexts/AuthContext'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import RecentlyPlayed from './components/RecentlyPlayed'
import LivePlayerBar from './components/LivePlayerBar'
import ProgramDetail from './components/ProgramDetail'
import Playlist from './components/Playlist'
import ScheduleList from './components/ScheduleList'

import SEO from './components/SEO'

import DevotionalPage from './pages/DevotionalPage'

import FeaturedArtistsPage from './pages/FeaturedArtistsPage'
import PresentersPage from './pages/PresentersPage'
import NewReleasesPage from './pages/NewReleasesPage'
import LiveRecordingsPage from './pages/LiveRecordingsPage'
import HelpCenterPage from './pages/HelpCenterPage'
import FeedbackPage from './pages/FeedbackPage'
import EventsPage from './pages/EventsPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfUsePage from './pages/TermsOfUsePage'
import CookiesPolicyPage from './pages/CookiesPolicyPage'
import ProgramsPage from './pages/ProgramsPage'
import AdvertisePage from './pages/AdvertisePage'
import AppHomePage from './pages/AppHomePage'
import { SCHEDULES } from './constants'
import { Program } from './types'

const DEFAULT_COVER = '/logo.png'

const STREAM_URL =
  'https://stream.zeno.fm/hvwifp8ezc6tv'

const METADATA_URL =
  'https://api.zeno.fm/mounts/metadata/subscribe/hvwifp8ezc6tv'

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
  'midday grace'
]

interface LiveMetadata {
  artist: string
  title: string
  playedAt?: Date
  isMusic?: boolean
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

  const minute = String(minuteRaw || 0).padStart(
    2,
    '0'
  )

  const period = hourRaw >= 12 ? 'PM' : 'AM'

  return `${hour}:${minute} ${period}`
}

const formatRangeToAmPm = (
  start?: string,
  end?: string
) => {
  if (!start || !end) return '24/7'

  return `${formatToAmPm(
    start
  )} - ${formatToAmPm(end)}`
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

const getProgramProgress = (
  program?: Program
) => {
  if (!program) return 0

  const { total } =
    getChicagoDayAndTotalMinutes()

  const [sH, sM] = program.startTime
    .split(':')
    .map(Number)

  const [eH, eM] = program.endTime
    .split(':')
    .map(Number)

  const start = sH * 60 + sM
  const end =
    (eH === 0 ? 24 : eH) * 60 + eM

  if (total <= start) return 0
  if (total >= end) return 100

  return Math.round(
    ((total - start) / (end - start)) * 100
  )
}

const getProgramImage = (
  program?: Program
) => {
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
}: any) => {
  const nextOne = queue?.[0]
  const nextTwo = queue?.[1]
  const nextThree = queue?.[2]

  const presenterImage =
    getProgramImage(currentProgram)

  const progress =
    getProgramProgress(currentProgram)

  const navigate = useNavigate()

  return (
    <>
      <section className="bg-white dark:bg-[#121212] text-gray-950 dark:text-white">

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">

          <div className="flex flex-col md:grid md:grid-cols-[220px_1fr] gap-8 md:gap-10 items-center border-b border-gray-300 dark:border-white/10 pb-8 md:pb-10">

            <div className="relative w-[190px] h-[190px] mx-auto md:mx-0 flex-shrink-0">

              <div className="absolute inset-[14px] rounded-full overflow-hidden bg-gray-200 shadow-lg">
                <img
                  src={presenterImage}
                  alt={
                    currentProgram?.title ||
                    'Praise FM'
                  }
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      DEFAULT_COVER
                  }}
                />
              </div>
            </div>

            <div className="text-center md:text-left w-full">

              <div className="flex items-center justify-center md:justify-start gap-2 text-sm mb-2">

                <span className="font-black text-orange-500">
                  LIVE
                </span>

                <span className="text-gray-500">
                  ·
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

              <button
                onClick={() =>
                  currentProgram &&
                  onNavigateToProgram(
                    currentProgram
                  )
                }
                className="group text-center md:text-left w-full md:w-auto"
              >
                <h1 className="text-3xl md:text-4xl font-black leading-tight">

                  {currentProgram?.title ||
                    'Praise FM Live'}

                </h1>
              </button>

              <p className="mt-2 text-base md:text-lg text-gray-700 dark:text-gray-300">

                {currentProgram?.description ||
                  'Global Christian Radio'}

              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">

                {liveMetadata?.artist ||
                  'Streaming 24/7'}

              </p>

              <button
                onClick={onListenClick}
                className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-10 md:px-12 py-3 md:py-4 font-black text-lg transition active:scale-95 inline-flex items-center justify-center gap-3 mx-auto md:mx-0"
              >
                {isPlaying ? (
                  <Pause size={22} />
                ) : (
                  <Play
                    size={22}
                    fill="currentColor"
                  />
                )}

                {isPlaying
                  ? 'Pause'
                  : 'Play'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8 border-b border-gray-300 dark:border-white/10">

            {[nextOne, nextTwo, nextThree]
              .filter(Boolean)
              .map((program: Program) => (
                <button
                  key={program.title}
                  onClick={() =>
                    onNavigateToProgram(program)
                  }
                  className="flex gap-4 text-left group items-center bg-gray-100 dark:bg-[#1A1A1A] hover:bg-gray-200 dark:hover:bg-[#252525] p-4 transition-colors w-full"
                >

                  <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden">

                    <img
                      src={getProgramImage(
                        program
                      )}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">

                    <p className="text-[11px] font-black text-orange-500 uppercase tracking-wide mb-0.5">

                      {formatRangeToAmPm(
                        program.startTime,
                        program.endTime
                      )}

                    </p>

                    <h3 className="text-sm font-bold leading-tight group-hover:text-orange-500 transition-colors truncate">

                      {program.title}

                    </h3>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">

                      {program.host}

                    </p>
                  </div>
                </button>
              ))}
          </div>

          <div className="flex justify-center md:justify-end mt-3 mb-5">

            <button
              onClick={() =>
                navigate('/advertise')
              }
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-orange-500 transition-colors group"
            >

              <Megaphone className="w-3.5 h-3.5 group-hover:text-orange-500" />

              <span className="font-medium uppercase tracking-wider">
                Advertise with us
              </span>
            </button>
          </div>
        </div>
      </section>

      <RecentlyPlayed tracks={trackHistory} />
    </>
  )
}

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-black dark:text-white">

      <SEO
        title="Praise FM USA"
        description="24/7 Worship & Gospel Radio"
        url={window.location.href}
      />

      <Routes>

        <Route
          path="/"
          element={<div />}
        />

      </Routes>
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