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

interface LiveMetadata {
  artist: string
  title: string
  artwork?: string
}

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

const AdBanner = () => {
  const navigate = useNavigate()
  return (
    <div className="max-w-6xl mx-auto px-4 mt-6">
      <button
        onClick={() => navigate('/advertise')}
        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 p-5 rounded-2xl text-black"
      >
        <h2 className="text-xl font-bold">Promote Your Brand on Praise FM</h2>
        <p>Global audience 24/7</p>
      </button>
    </div>
  )
}

const SimplePage = ({ title, children }: any) => {
  const navigate = useNavigate()
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button onClick={() => navigate('/')} className="mb-4">← Back</button>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      {children}
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

  useEffect(() => {
    const audio = new Audio(STREAM_URL)
    audioRef.current = audio
  }, [])

  const togglePlayback = () => {
    if (!audioRef.current) return
    isPlaying ? audioRef.current.pause() : audioRef.current.play()
    setIsPlaying(!isPlaying)
  }

  // 🔥 METADATA CORRIGIDA (SEM ERRO)
  useEffect(() => {
    const es = new EventSource(METADATA_URL)

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data || '{}')
        const streamTitle = data?.streamTitle || ''

        if (!streamTitle || !streamTitle.includes(' - ')) return

        const [artist, ...rest] = streamTitle.split(' - ')
        const title = rest.join(' - ')

        if (!artist || !title) return

        const meta = {
          artist,
          title,
          artwork: DEFAULT_ARTWORK,
        }

        setLiveMetadata(meta)
        setTrackHistory((prev) => [meta, ...prev].slice(0, 10))

        // MEDIA SESSION (sem quebrar)
        if ('mediaSession' in navigator) {
          try {
            navigator.mediaSession.metadata = new window.MediaMetadata({
              title,
              artist,
              artwork: [{ src: DEFAULT_ARTWORK, sizes: '512x512', type: 'image/webp' }],
            })
          } catch {}
        }

      } catch {}
    }

    return () => es.close()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">

      <Navbar
        activeTab={location.pathname === '/' ? 'home' : location.pathname.replace('/', '')}
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

                <AdBanner />

                <RecentlyPlayed tracks={trackHistory} />
              </>
            } />

            <Route path="/schedule" element={
              <ScheduleList
                onNavigateToProgram={setSelectedProgram}
                onBack={() => navigate('/')}
              />
            } />

            <Route path="/music" element={<Playlist />} />

            {/* SALES */}
            <Route path="/advertise" element={
              <SimplePage title="Sales & Advertising">

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

                <a href="/advertiser" className="block mt-6 text-blue-500">
                  Access Advertiser Dashboard
                </a>

              </SimplePage>
            } />

            <Route path="/advertiser" element={<AdvertiserPanel />} />

            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        )}

      </main>

      <Footer />

      <LivePlayerBar
        isPlaying={isPlaying}
        onTogglePlayback={togglePlayback}
        program={{} as any}
        liveMetadata={liveMetadata}
        queue={[]}
        audioRef={audioRef}
      />

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