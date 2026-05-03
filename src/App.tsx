import React, { useState, useRef, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Play, Pause, Radio, Music2 } from 'lucide-react';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RecentlyPlayed from './components/RecentlyPlayed';
import LivePlayerBar from './components/LivePlayerBar';
import ProgramDetail from './components/ProgramDetail';
import Playlist from './components/Playlist';
import ScheduleList from './components/ScheduleList';

import DevotionalPage from './pages/DevotionalPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MySoundsPage from './pages/MySoundsPage';
import ProfilePage from './pages/ProfilePage';
import FeaturedArtistsPage from './pages/FeaturedArtistsPage';
import PresentersPage from './pages/PresentersPage';
import NewReleasesPage from './pages/NewReleasesPage';
import LiveRecordingsPage from './pages/LiveRecordingsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import FeedbackPage from './pages/FeedbackPage';
import EventsPage from './pages/EventsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import CookiesPolicyPage from './pages/CookiesPolicyPage';
import AppHomePage from './pages/AppHomePage';

import { SCHEDULES } from './constants';
import { Program } from './types';

const STREAM_URL = 'https://stream.zeno.fm/hvwifp8ezc6tv';
const METADATA_URL = 'https://api.zeno.fm/mounts/metadata/subscribe/hvwifp8ezc6tv';

const DEFAULT_COVER = '/icon-512.png';

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
];

interface LiveMetadata {
  artist: string;
  title: string;
  playedAt?: Date;
  isMusic?: boolean;
}

/* -------------------- HELPERS -------------------- */

const getChicagoDayAndTotalMinutes = () => {
  const now = new Date();
  const chicagoDate = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Chicago' })
  );

  return {
    day: chicagoDate.getDay(),
    total: chicagoDate.getHours() * 60 + chicagoDate.getMinutes()
  };
};

const getCoverFromMetadata = (metadata: LiveMetadata | null) => {
  if (!metadata?.artist || !metadata?.title) return DEFAULT_COVER;

  /**
   * Aqui fica o fallback.
   * Se depois você tiver API de capa, dá para trocar essa função.
   */
  return DEFAULT_COVER;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-white dark:bg-[#121212]" />;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

/* -------------------- PROFESSIONAL HOME -------------------- */

interface ProfessionalHomeProps {
  isPlaying: boolean;
  liveMetadata: LiveMetadata | null;
  currentProgram?: Program;
  onListenClick: () => void;
  onNavigateToProgram: (program: Program) => void;
  trackHistory: LiveMetadata[];
}

const ProfessionalHome: React.FC<ProfessionalHomeProps> = ({
  isPlaying,
  liveMetadata,
  currentProgram,
  onListenClick,
  onNavigateToProgram,
  trackHistory
}) => {
  const cover = getCoverFromMetadata(liveMetadata);

  return (
    <>
      <section className="relative overflow-hidden bg-[#f7f7f7] dark:bg-[#121212]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.20),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.08),transparent_35%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_35%)]" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
            
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/10 border border-black/5 dark:border-white/10 shadow-sm mb-6">
                <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-orange-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {isPlaying ? 'Live now' : 'Praise FM Online'}
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-950 dark:text-white leading-tight">
                Global Christian Radio.
                <span className="block text-orange-500">Streaming 24/7.</span>
              </h2>

              <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                Worship, gospel, devotionals and uplifting music from Praise FM.
                A clean listening experience focused on faith and music.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onListenClick}
                  className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/25 transition-all active:scale-95"
                >
                  {isPlaying ? <Pause size={22} /> : <Play size={22} fill="currentColor" />}
                  {isPlaying ? 'Pause Live' : 'Listen Live'}
                </button>

                {currentProgram && (
                  <button
                    onClick={() => onNavigateToProgram(currentProgram)}
                    className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-white dark:bg-white/10 text-gray-900 dark:text-white font-bold border border-black/10 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/15 transition-all"
                  >
                    <Radio size={21} />
                    Current Program
                  </button>
                )}
              </div>

              {currentProgram && (
                <div className="mt-8 p-5 rounded-3xl bg-white/80 dark:bg-white/10 border border-black/5 dark:border-white/10 shadow-sm max-w-xl">
                  <p className="text-xs uppercase tracking-[0.22em] text-orange-500 font-black mb-2">
                    On air
                  </p>
                  <h3 className="text-xl font-black text-gray-950 dark:text-white">
                    {currentProgram.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {currentProgram.startTime} - {currentProgram.endTime}
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT - NOW PLAYING CARD */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-5 bg-orange-500/20 blur-3xl rounded-full" />

                <div className="relative rounded-[2.2rem] bg-white/90 dark:bg-[#1c1c1c]/95 border border-black/5 dark:border-white/10 shadow-2xl p-7 sm:p-8">
                  
                  <div className="flex items-center justify-between mb-7">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-orange-500 font-black">
                        Now Playing
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Praise FM Live
                      </p>
                    </div>

                    <div className="w-11 h-11 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <Music2 size={22} />
                    </div>
                  </div>

                  <div className="flex justify-center py-4">
                    <div className="relative w-60 h-60 sm:w-72 sm:h-72">
                      
                      {/* Glow */}
                      <div
                        className={`absolute inset-2 rounded-full bg-orange-500/20 blur-2xl ${
                          isPlaying ? 'animate-pulse' : ''
                        }`}
                      />

                      {/* Ring */}
                      <div
                        className={`absolute inset-0 rounded-full border-[5px] border-transparent border-t-orange-500 border-r-orange-500 shadow-[0_0_35px_rgba(249,115,22,0.35)] ${
                          isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''
                        }`}
                      />

                      {/* Second soft ring */}
                      <div
                        className={`absolute inset-4 rounded-full border border-orange-500/25 ${
                          isPlaying ? 'animate-[spin_14s_linear_infinite_reverse]' : ''
                        }`}
                      />

                      {/* Cover */}
                      <div className="absolute inset-7 rounded-full overflow-hidden bg-gray-100 dark:bg-[#2a2a2a] shadow-xl">
                        <img
                          src={cover}
                          alt="Praise FM cover"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_COVER;
                          }}
                        />
                      </div>

                      {/* Center dot */}
                      <div className="absolute left-1/2 top-1/2 w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white dark:bg-[#111] shadow-lg border border-black/10 dark:border-white/10" />
                    </div>
                  </div>

                  <div className="text-center mt-5">
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white leading-tight">
                      {liveMetadata?.title || 'Praise FM'}
                    </h3>

                    <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">
                      {liveMetadata?.artist || 'Live Christian Radio'}
                    </p>
                  </div>

                  <div className="mt-7">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-2">
                      <span>LIVE</span>
                      <span>{isPlaying ? 'ON AIR' : 'READY'}</span>
                    </div>

                    <div className="relative h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                      <div
                        className={`absolute left-0 top-0 h-full rounded-full bg-orange-500 ${
                          isPlaying ? 'animate-[liveProgress_4s_ease-in-out_infinite]' : 'w-1/3'
                        }`}
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

        <style>{`
          @keyframes liveProgress {
            0% { width: 8%; }
            50% { width: 72%; }
            100% { width: 100%; }
          }
        `}</style>
      </section>

      <RecentlyPlayed tracks={trackHistory} />
    </>
  );
};

/* -------------------- APP CONTENT -------------------- */

const AppContent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liveMetadata, setLiveMetadata] = useState<LiveMetadata | null>(null);
  const [trackHistory, setTrackHistory] = useState<LiveMetadata[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('praise-theme') as 'light' | 'dark') || 'light'
  );
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  /* -------------------- SCHEDULE -------------------- */

  const { day, total } = getChicagoDayAndTotalMinutes();

  const { currentProgram, queue } = useMemo(() => {
    const schedule = SCHEDULES[day] || SCHEDULES[1];

    const index = schedule.findIndex(p => {
      const [sH, sM] = p.startTime.split(':').map(Number);
      const [eH, eM] = p.endTime.split(':').map(Number);

      const start = sH * 60 + sM;
      const end = (eH === 0 ? 24 : eH) * 60 + eM;

      return total >= start && total < end;
    });

    return {
      currentProgram: schedule[index !== -1 ? index : 0],
      queue: index !== -1 ? schedule.slice(index + 1, index + 5) : schedule.slice(1, 5)
    };
  }, [day, total]);

  /* -------------------- THEME -------------------- */

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('praise-theme', theme);
  }, [theme]);

  /* -------------------- AUDIO -------------------- */

  useEffect(() => {
    const audio = new Audio(STREAM_URL);

    audio.crossOrigin = 'anonymous';
    (audio as any).playsInline = true;
    audio.preload = 'none';
    audio.volume = parseFloat(localStorage.getItem('praise-volume') || '0.8');

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    audioRef.current = audio;

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      return;
    }

    audioRef.current.play().catch(() => {
      setIsPlaying(false);
    });
  };

  /* -------------------- MEDIA SESSION -------------------- */

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: liveMetadata?.title || 'Praise FM USA',
      artist: liveMetadata?.artist || 'Live Radio',
      artwork: [
        {
          src: DEFAULT_COVER,
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    });

    navigator.mediaSession.setActionHandler('play', () => {
      audioRef.current?.play().catch(() => {});
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      audioRef.current?.pause();
    });
  }, [liveMetadata]);

  /* -------------------- METADATA -------------------- */

  useEffect(() => {
    const es = new EventSource(METADATA_URL, { withCredentials: false });
    eventSourceRef.current = es;

    es.onmessage = e => {
      try {
        const data = JSON.parse(e.data);
        const streamTitle = data.streamTitle || '';

        if (!streamTitle.includes(' - ')) return;

        const [artistRaw, ...rest] = streamTitle.split(' - ');
        const artist = artistRaw.trim();
        const title = rest.join(' - ').trim();

        if (!artist || !title) return;

        const fullText = `${artist} ${title}`.toLowerCase();

        if (BLOCKED_METADATA_KEYWORDS.some(k => fullText.includes(k))) {
          return;
        }

        setLiveMetadata(prev => {
          if (prev && prev.title === title && prev.artist === artist) {
            return prev;
          }

          const meta: LiveMetadata = {
            artist,
            title,
            playedAt: new Date(),
            isMusic: true
          };

          setTrackHistory(history => [meta, ...history].slice(0, 10));

          return meta;
        });
      } catch {
        // Ignore malformed metadata
      }
    };

    es.onerror = () => {
      // Mantém o site funcionando mesmo se a metadata cair
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, []);

  const isAppRoute = location.pathname === '/app';

  /* -------------------- RENDER -------------------- */

  return (
    <div className="min-h-screen flex flex-col pb-[120px] bg-white dark:bg-[#121212] transition-colors">
      <h1 className="sr-only">Praise FM USA - 24/7 Gospel Radio Station</h1>

      {!isAppRoute && (
        <Navbar
          activeTab={location.pathname === '/' ? 'home' : location.pathname.split('/')[1]}
          theme={theme}
          onToggleTheme={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
        />
      )}

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
            <Route
              path="/"
              element={
                <ProfessionalHome
                  isPlaying={isPlaying}
                  liveMetadata={liveMetadata}
                  currentProgram={currentProgram}
                  onListenClick={togglePlayback}
                  onNavigateToProgram={setSelectedProgram}
                  trackHistory={trackHistory}
                />
              }
            />

            <Route path="/app" element={<AppHomePage />} />

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

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            <Route
              path="/my-sounds"
              element={
                <ProtectedRoute>
                  <MySoundsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfUsePage />} />
            <Route path="/cookies" element={<CookiesPolicyPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>

      {!isAppRoute && <Footer />}

      {!isAppRoute && currentProgram && (
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
  );
};

/* -------------------- ROOT -------------------- */

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <ScrollToTop />
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
}