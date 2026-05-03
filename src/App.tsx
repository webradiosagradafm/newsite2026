import React, { useState, useRef, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Play, Pause } from 'lucide-react';

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
  'praise fm', 'praisefm', 'commercial', 'spot', 'promo', 'ident', 'sweeper',
  'intro', 'program', 'announcement', 'station id', 'jingle', 'bumper'
];

interface LiveMetadata {
  artist: string;
  title: string;
  playedAt?: Date;
  isMusic?: boolean;
}

const getChicagoDayAndTotalMinutes = () => {
  const now = new Date();
  const chicagoDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));

  return {
    day: chicagoDate.getDay(),
    total: chicagoDate.getHours() * 60 + chicagoDate.getMinutes()
  };
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

  if (loading) return <div className="min-h-screen bg-white dark:bg-[#121212]" />;

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const HomeBBC = ({
  isPlaying,
  liveMetadata,
  currentProgram,
  queue,
  onListenClick,
  onNavigateToProgram,
  trackHistory
}: {
  isPlaying: boolean;
  liveMetadata: LiveMetadata | null;
  currentProgram?: Program;
  queue: Program[];
  onListenClick: () => void;
  onNavigateToProgram: (program: Program) => void;
  trackHistory: LiveMetadata[];
}) => {
  const nextOne = queue?.[0];
  const nextTwo = queue?.[1];

  return (
    <>
      <section className="bg-white dark:bg-[#121212] text-gray-950 dark:text-white">
        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="grid md:grid-cols-[220px_1fr] gap-10 items-center border-b border-gray-300 dark:border-white/10 pb-10">

            <div className="relative w-[190px] h-[190px]">
              <div className="absolute inset-0 rounded-full border-[5px] border-orange-500" />

              <div className="absolute inset-[10px] rounded-full overflow-hidden bg-gray-200">
                <img
                  src={DEFAULT_COVER}
                  alt="Praise FM"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute -right-3 bottom-1 w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-4xl font-black border-4 border-white dark:border-[#121212]">
                1
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="font-black">LIVE</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">
                  {currentProgram ? `${currentProgram.startTime} - ${currentProgram.endTime}` : '24/7'}
                </span>
              </div>

              <button
                onClick={() => currentProgram && onNavigateToProgram(currentProgram)}
                className="group text-left"
              >
                <h1 className="text-3xl md:text-4xl font-black leading-tight">
                  {currentProgram?.title || 'Praise FM Live'}
                  <span className="text-orange-500 ml-2 group-hover:ml-3 transition-all">›</span>
                </h1>
              </button>

              <p className="mt-2 text-xl text-gray-900 dark:text-gray-200">
                {liveMetadata?.title || 'Global Christian Radio'}
              </p>

              <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
                {liveMetadata?.artist || 'Streaming 24/7'}
              </p>

              <button
                onClick={onListenClick}
                className="mt-7 bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 font-black text-lg transition active:scale-95 inline-flex items-center gap-3"
              >
                {isPlaying ? <Pause size={22} /> : <Play size={22} fill="currentColor" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 border-b border-gray-300 dark:border-white/10 py-4">

            {nextOne && (
              <button
                onClick={() => onNavigateToProgram(nextOne)}
                className="flex gap-4 text-left"
              >
                <img src={DEFAULT_COVER} alt="Next" className="w-24 h-24 object-cover" />

                <div>
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span className="font-black text-orange-500 uppercase">Up Next</span>
                    <span className="text-gray-400">
                      {nextOne.startTime} - {nextOne.endTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold">
                    {nextOne.title}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {nextOne.description || 'Christian music and inspiration.'}
                  </p>
                </div>
              </button>
            )}

            {nextTwo && (
              <button
                onClick={() => onNavigateToProgram(nextTwo)}
                className="hidden md:flex gap-4 text-left"
              >
                <img src={DEFAULT_COVER} alt="Coming later" className="w-24 h-24 object-cover" />

                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    {nextTwo.startTime} - {nextTwo.endTime}
                  </p>

                  <h3 className="text-lg font-bold">
                    {nextTwo.title}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {nextTwo.description || 'More from Praise FM.'}
                  </p>
                </div>
              </button>
            )}

          </div>

          <div className="py-5">
            <p className="text-gray-700 dark:text-gray-300">
              Listen live to Praise FM — Christian music, worship and devotionals.
            </p>
          </div>

        </div>
      </section>

      <RecentlyPlayed tracks={trackHistory} />
    </>
  );
};

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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('praise-theme', theme);
  }, [theme]);

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

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: liveMetadata?.title || 'Praise FM USA',
      artist: liveMetadata?.artist || 'Live Radio',
      artwork: [{ src: DEFAULT_COVER, sizes: '512x512', type: 'image/png' }]
    });

    navigator.mediaSession.setActionHandler('play', () => {
      audioRef.current?.play().catch(() => {});
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      audioRef.current?.pause();
    });
  }, [liveMetadata]);

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

        if (BLOCKED_METADATA_KEYWORDS.some(k => fullText.includes(k))) return;

        setLiveMetadata(prev => {
          if (prev && prev.title === title && prev.artist === artist) return prev;

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
        // ignora metadata inválida
      }
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, []);

  const isAppRoute = location.pathname === '/app';

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
                <HomeBBC
                  isPlaying={isPlaying}
                  liveMetadata={liveMetadata}
                  currentProgram={currentProgram}
                  queue={queue}
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
            <Route path="/presenters" element={<PresentersPage onNavigateToProgram={setSelectedProgram} />} />
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