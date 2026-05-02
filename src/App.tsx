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
        <h2 className="text-xl font-bold">
          Promote Your Brand on Praise FM
        </h2>
        <p>Global audience 24/7</p>
      </button>
    </div>
  )
}

const SimplePage = ({ title, children }: any) => {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button onClick={() => navigate('/')} className="mb-4">
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      {children}
    </div>
  )
}

const AppContent = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    audioRef.current = new Audio(STREAM_URL)
  }, [])

  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play()

    setIsPlaying(!isPlaying)
  }

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
                liveMetadata={null}
              />

              <AdBanner />

              <RecentlyPlayed tracks={[]} />
            </>
          } />

          <Route path="/schedule" element={<ScheduleList onNavigateToProgram={() => {}} onBack={() => navigate('/')} />} />
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

              <a
                href="/advertiser"
                className="block mt-6 text-blue-500"
              >
                Access Advertiser Dashboard
              </a>

            </SimplePage>
          } />

          <Route path="/advertiser" element={<AdvertiserPanel />} />

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>

      </main>

      <Footer />

      <LivePlayerBar
        isPlaying={isPlaying}
        onTogglePlayback={togglePlayback}
        program={{} as any}
        liveMetadata={null}
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