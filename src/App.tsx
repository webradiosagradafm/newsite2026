import React, { useState, useRef, useEffect, useMemo } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'

import { AuthProvider } from './contexts/AuthContext'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import RecentlyPlayed from './components/RecentlyPlayed'
import LivePlayerBar from './components/LivePlayerBar'
import ProgramDetail from './components/ProgramDetail'
import Playlist from './components/Playlist'
import ScheduleList from './components/ScheduleList'

import DevotionalPage from './pages/DevotionalPage'
import ProfilePage from './pages/ProfilePage'
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
import ChristianRadioPage from './pages/ChristianRadioPage'
import GospelRadioPage from './pages/GospelRadioPage'
import WorshipRadioPage from './pages/WorshipRadioPage'

import { SCHEDULES } from './constants'
import { Program } from './types'

const STREAM_URL = 'https://stream.zeno.fm/hvwifp8ezc6tv'
const METADATA_URL = 'https://api.zeno.fm/mounts/metadata/subscribe/hvwifp8ezc6tv'

interface LiveMetadata {
  artist: string
  title: string
  playedAt?: Date
  isMusic?: boolean
}

const getChicagoTime = () => {
  const now = new Date()
  const chicago = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }))
  return {
    day: chicago.getDay(),
    total: chicago.getHours() * 60 + chicago.getMinutes(),
  }
}

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

const SimplePage = ({ title, children }: any) => {
  const navigate = useNavigate()
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button onClick={() => navigate('/')} className="mb-6 text-sm hover:underline">
        ← Back to Home
      </button>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

const AppContent = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [liveMetadata, setLiveMetadata] = useState<LiveMetadata | null>(null)
  const [trackHistory, setTrackHistory] = useState<LiveMetadata[]>([])
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const location = useLocation()
  const navigate = useNavigate()

  const { day, total } = getChicagoTime()

  const { currentProgram, queue } = useMemo(() => {
    const schedule = SCHEDULES[day] || SCHEDULES[1]

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
    const queue = [...remaining, ...(SCHEDULES[nextDay] || [])].slice(0, 4)

    return { currentProgram, queue }
  }, [day, total])

  useEffect(() => {
    const audio = new Audio(STREAM_URL)
    audioRef.current = audio
  }, [])

  const togglePlayback = () => {
    if (!audioRef.current) return
    isPlaying ? audioRef.current.pause() : audioRef.current.play()
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">

      <Navbar
        activeTab={location.pathname === '/' ? 'home' : location.pathname.split('/')[1]}
        theme="light"
        onToggleTheme={() => {}}
      />

      <main className="flex-grow">
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

            <Route path="/" element={
              <>
                <Hero
                  onListenClick={togglePlayback}
                  isPlaying={isPlaying}
                  liveMetadata={liveMetadata}
                  onNavigateToProgram={setSelectedProgram}
                />
                <RecentlyPlayed tracks={trackHistory} />
              </>
            } />

            <Route path="/music" element={<Playlist />} />

            <Route path="/schedule" element={
              <ScheduleList
                onNavigateToProgram={setSelectedProgram}
                onBack={() => navigate('/')}
              />
            } />

            {/* 💰 SALES PAGE */}
            <Route path="/advertise" element={
              <SimplePage title="Sales & Advertising">

                <p>
                  Promote your brand to a global Christian audience.
                  Reach listeners worldwide 24/7.
                </p>

                <div className="grid gap-4 md:grid-cols-3 mt-6">

                  <div className="p-5 rounded-2xl bg-gray-100 dark:bg-gray-900">
                    <h3 className="font-bold">Starter</h3>
                    <p>5 ads/day</p>
                    <p className="font-semibold">$25 / €23</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-400">
                    <h3 className="font-bold">Standard</h3>
                    <p>10 ads/day</p>
                    <p className="font-semibold">$40 / €37</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-gray-100 dark:bg-gray-900">
                    <h3 className="font-bold">Premium</h3>
                    <p>20 ads/day</p>
                    <p className="font-semibold">$70 / €65</p>
                  </div>

                </div>

                <a
                  href="https://wa.me/5521971099200"
                  target="_blank"
                  className="mt-6 inline-block bg-yellow-500 px-6 py-3 rounded-xl font-semibold"
                >
                  Get Your Ad On Air
                </a>

              </SimplePage>
            } />

            <Route path="/events" element={<EventsPage />} />
            <Route path="/artists" element={<FeaturedArtistsPage />} />
            <Route path="/presenters" element={<PresentersPage onNavigateToProgram={setSelectedProgram} />} />

            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfUsePage />} />
            <Route path="/cookies" element={<CookiesPolicyPage />} />

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
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
      <SpeedInsights />
    </AuthProvider>
  )
}