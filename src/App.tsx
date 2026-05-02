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

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

/* 🔥 BANNER DE ANÚNCIO */
const AdBanner = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-6xl mx-auto px-4 mt-6">
      <button
        onClick={() => navigate('/advertise')}
        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 p-5 rounded-2xl text-black text-left hover:scale-[1.01] transition"
      >
        <p className="text-xs uppercase font-bold">Advertising Opportunity</p>
        <h2 className="text-xl font-bold">Promote Your Brand on Praise FM</h2>
        <p className="text-sm">Reach a global Christian audience 24/7</p>
      </button>
    </div>
  )
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
  const [liveMetadata, setLiveMetadata] = useState<any>(null)
  const [trackHistory, setTrackHistory] = useState<any[]>([])
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const location = useLocation()
  const navigate = useNavigate()

  const { day, total } = useMemo(() => {
    const now = new Date()
    return { day: now.getDay(), total: now.getHours() * 60 + now.getMinutes() }
  }, [])

  const { currentProgram, queue } = useMemo(() => {
    const schedule = SCHEDULES[day] || SCHEDULES[1]
    const currentProgram = schedule[0]
    return { currentProgram, queue: [] }
  }, [day])

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
    <div className="min-h-screen flex flex-col">

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

                {/* 🔥 BANNER NOVO */}
                <AdBanner />

                <RecentlyPlayed tracks={trackHistory} />
              </>
            } />

            <Route path="/schedule" element={
              <ScheduleList onNavigateToProgram={setSelectedProgram} onBack={() => navigate('/')} />
            } />

            <Route path="/music" element={<Playlist />} />

            {/* 💰 SALES */}
            <Route path="/advertise" element={
              <SimplePage title="Sales & Advertising">

                <p>Promote your brand globally.</p>

                <div className="grid md:grid-cols-3 gap-4 mt-6">

                  <div className="p-4 bg-gray-100 rounded-xl">
                    <h3>Starter</h3>
                    <p>$25 / €23</p>
                  </div>

                  <div className="p-4 bg-yellow-100 rounded-xl">
                    <h3>Standard</h3>
                    <p>$40 / €37</p>
                  </div>

                  <div className="p-4 bg-gray-100 rounded-xl">
                    <h3>Premium</h3>
                    <p>$70 / €65</p>
                  </div>

                </div>

                <a
                  href="https://wa.me/5521971099200"
                  className="mt-6 inline-block bg-yellow-500 px-6 py-3 rounded-xl"
                >
                  Get Your Ad On Air
                </a>

              </SimplePage>
            } />

            <Route path="/events" element={<EventsPage />} />
            <Route path="/artists" element={<FeaturedArtistsPage />} />

            <Route path="*" element={<Navigate to="/" />} />

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