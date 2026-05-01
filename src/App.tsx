import React, { useState, useRef, useEffect, useMemo } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
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

import DevotionalPage from './pages/DevotionalPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import MySoundsPage from './pages/MySoundsPage'
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
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-white dark:bg-black" />
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />
}

const AppContent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [liveMetadata, setLiveMetadata] = useState<LiveMetadata | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('praise-theme') as 'light' | 'dark') || 'light'
  )

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const location = useLocation()
  const navigate = useNavigate()

  const { day, total } = getChicagoDayAndTotalMinutes()

  const currentProgram = useMemo(() => {
    const schedule = SCHEDULES[day] || SCHEDULES[1]

    return schedule.find((p) => {
      const [sH, sM] = p.startTime.split(':').map(Number)
      const [eH, eM] = p.endTime.split(':').map(Number)

      const start = sH * 60 + sM
      const end = (eH === 0 ? 24 : eH) * 60 + eM

      return total >= start && total < end
    })
  }, [day, total])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('praise-theme', theme)
  }, [theme])

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
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
      />

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero
                  onListenClick={togglePlayback}
                  isPlaying={isPlaying}
                  liveMetadata={liveMetadata}
                  onNavigateToProgram={() => {}}
                />
                <RecentlyPlayed tracks={[]} />
              </>
            }
          />
        </Routes>
      </main>

      <Footer />

      {currentProgram && (
        <LivePlayerBar
          isPlaying={isPlaying}
          onTogglePlayback={togglePlayback}
          program={currentProgram}
          liveMetadata={liveMetadata}
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