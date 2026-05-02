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

const SvgIcon = ({
  type,
}: {
  type: 'schedule' | 'contact' | 'ads' | 'support' | 'song'
}) => {
  const common = 'w-7 h-7'

  if (type === 'schedule') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (type === 'contact') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 5h16v14H4V5Z" stroke="currentColor" strokeWidth="2" />
        <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'ads') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 10v4a2 2 0 0 0 2 2h2l3 4v-4h2l7 3V5l-7 3H6a2 2 0 0 0-2 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (type === 'support') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 21s-7-4.4-9-9.2C1.4 7.9 3.7 4 7.5 4c2.1 0 3.5 1.2 4.5 2.6C13 5.2 14.4 4 16.5 4c3.8 0 6.1 3.9 4.5 7.8C19 16.6 12 21 12 21Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 18V5l11-2v13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

const HomeActionButtons = () => {
  const whatsappNumber = '5521971099200'

  const buttons = [
    {
      href: '/schedule',
      label: 'Schedule',
      icon: 'schedule' as const,
      className:
        'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200',
    },
    {
      href: '/contact',
      label: 'Contact Us',
      icon: 'contact' as const,
      className: 'bg-red-600 text-white hover:bg-red-700',
    },
    {
      href: '/advertise',
      label: 'Sales & Advertising',
      icon: 'ads' as const,
      className: 'bg-yellow-500 text-black hover:bg-yellow-600 font-semibold',
    },
    {
      href: '/support',
      label: 'Support Praise FM',
      icon: 'support' as const,
      className: 'bg-purple-600 text-white hover:bg-purple-700',
    },
    {
      href: `https://wa.me/${whatsappNumber}`,
      label: 'Request a Song',
      icon: 'song' as const,
      className: 'bg-blue-600 text-white hover:bg-blue-700',
      external: true,
    },
  ]

  return (
    <section className="max-w-6xl mx-auto px-4 mt-6 mb-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {buttons.map((button) => (
          <a
            key={button.label}
            href={button.href}
            target={button.external ? '_blank' : undefined}
            rel={button.external ? 'noopener noreferrer' : undefined}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl text-center transition shadow-sm ${button.className}`}
          >
            <SvgIcon type={button.icon} />
            <span className="text-sm md:text-base">{button.label}</span>
          </a>
        ))}
      </div>
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
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('praise-theme') as 'light' | 'dark') || 'light'
  )
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const location = useLocation()
  const navigate = useNavigate()

  const { day, total } = getChicagoDayAndTotalMinutes()

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
    const nextSchedule = SCHEDULES[nextDay] || SCHEDULES[1]
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

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    audioRef.current = audio

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.pause()
      audio.src = ''
    }
  }, [])

  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch((err) => {
        console.error('Playback failed:', err)
      })
    }
  }

  useEffect(() => {
    const es = new EventSource(METADATA_URL)

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        const streamTitle = data.streamTitle || ''

        if (!streamTitle.includes(' - ')) return

        const [artist, ...rest] = streamTitle.split(' - ')
        const title = rest.join(' - ')

        if (!artist?.trim() || !title?.trim()) return

        if (
          BLOCKED_METADATA_KEYWORDS.some((k) =>
            `${artist} ${title}`.toLowerCase().includes(k)
          )
        ) {
          return
        }

        setLiveMetadata((prev) => {
          if (prev && prev.title === title && prev.artist === artist) return prev

          const meta: LiveMetadata = {
            artist,
            title,
            playedAt: new Date(),
            isMusic: true,
          }

          setTrackHistory((h) => [meta, ...h].slice(0, 10))
          return meta
        })
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

                  <HomeActionButtons />

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
                    Reach a loyal Christian audience every day through online radio and website visibility.
                  </p>

                  <h2 className="text-xl font-semibold mt-6">Advertising Packages</h2>

                  <div className="grid gap-4 md:grid-cols-3 mt-4">
                    <div className="p-5 rounded-2xl bg-gray-100 dark:bg-gray-900">
                      <h3 className="text-lg font-bold">Starter</h3>
                      <p className="mt-2">5 radio ads per day</p>
                      <p className="mt-2 font-semibold">R$120/month</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-400">
                      <h3 className="text-lg font-bold">Standard</h3>
                      <p className="mt-2">10 radio ads per day</p>
                      <p className="mt-2 font-semibold">R$200/month</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-gray-100 dark:bg-gray-900">
                      <h3 className="text-lg font-bold">Premium</h3>
                      <p className="mt-2">20 radio ads per day + priority placement</p>
                      <p className="mt-2 font-semibold">R$350/month</p>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold mt-6">Why Advertise With Us?</h2>

                  <ul className="list-disc pl-5">
                    <li>Christian audience 24/7</li>
                    <li>Daily exposure for your brand</li>
                    <li>Affordable monthly packages</li>
                    <li>Radio + website promotion opportunities</li>
                    <li>Ideal for churches, events, local businesses, and ministries</li>
                  </ul>

                  <a
                    href="https://wa.me/5521971099200"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center mt-6 px-6 py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-600 transition"
                  >
                    Start Advertising Now
                  </a>
                </SimplePage>
              }
            />

            <Route
              path="/support"
              element={
                <SimplePage title="Support Praise FM">
                  <p>Help us keep spreading faith, hope, and Christian music 24/7.</p>

                  <div className="p-5 rounded-2xl bg-gray-100 dark:bg-gray-900">
                    <p className="font-semibold">PIX Key:</p>
                    <p>+5521981963459</p>
                  </div>

                  <p>Thank you for supporting this mission.</p>
                </SimplePage>
              }
            />

            <Route
              path="/contact"
              element={
                <SimplePage title="Contact Us">
                  <p>Get in touch with Praise FM.</p>

                  <p>Email: praisefmradio@gmail.com</p>

                  <a
                    href="https://wa.me/5521971099200"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                  >
                    Chat on WhatsApp
                  </a>
                </SimplePage>
              }
            />

            <Route path="/devotional" element={<DevotionalPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/new-releases" element={<NewReleasesPage />} />
            <Route path="/artists" element={<FeaturedArtistsPage />} />

            <Route
              path="/presenters"
              element={<PresentersPage onNavigateToProgram={setSelectedProgram} />}
            />

            <Route path="/live-recordings" element={<LiveRecordingsPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />

            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/christian-radio" element={<ChristianRadioPage />} />
            <Route path="/gospel-radio" element={<GospelRadioPage />} />
            <Route path="/worship-radio" element={<WorshipRadioPage />} />

            <Route path="/profile" element={<ProfilePage />} />

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