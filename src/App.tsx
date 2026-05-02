import React, { useState, useRef, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import RecentlyPlayed from './components/RecentlyPlayed'
import LivePlayerBar from './components/LivePlayerBar'
import Playlist from './components/Playlist'
import ScheduleList from './components/ScheduleList'

import AdvertiserPanel from './pages/AdvertiserPanel'

const STREAM_URL = 'https://stream.zeno.fm/hvwifp8ezc6tv'
const METADATA_URL = 'https://api.zeno.fm/mounts/metadata/subscribe/hvwifp8ezc6tv'

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

const AppContent = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [liveMetadata, setLiveMetadata] = useState<any>(null)
  const [trackHistory, setTrackHistory] = useState<any[]>([])

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

  // 🔥 METADATA SEM ERRO
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

        const meta = { artist, title }

        setLiveMetadata(meta)
        setTrackHistory((prev) => [meta, ...prev].slice(0, 10))

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

        <Routes>

          <Route path="/" element={
            <>
              <Hero
                onListenClick={togglePlayback}
                isPlaying={isPlaying}
                liveMetadata={liveMetadata}
              />

              <AdBanner />

              <RecentlyPlayed tracks={trackHistory} />
            </>
          } />

          <Route path="/schedule" element={<ScheduleList onNavigateToProgram={() => {}} onBack={() => navigate('/')} />} />
          <Route path="/music" element={<Playlist />} />

          <Route path="/advertise" element={
            <div className="p-6">
              <h1 className="text-2xl font-bold">Sales & Advertising</h1>
              <a href="/advertiser" className="text-blue-500">Dashboard</a>
            </div>
          } />

          <Route path="/advertiser" element={<AdvertiserPanel />} />

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>

      </main>

      <Footer />

      {/* 🔥 NÃO REMOVE ISSO */}
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