import React, { useState, useRef, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
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

const BLOCKED_METADATA_KEYWORDS = [
  'praise fm', 'praisefm', 'commercial', 'spot', 'promo', 'ident', 'sweeper',
  'intro', 'outro', 'announcement', 'station id', 'jingle', 'bumper'
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
      queue: schedule.slice(index + 1, index + 5)
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
    audio.playsInline = true;
    audio.preload = 'none';
    audio.volume = parseFloat(localStorage.getItem('praise-volume') || '0.8');

    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(() => {});
  };

  /* -------------------- MEDIA SESSION (SPOTIFY STYLE) -------------------- */

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: liveMetadata?.title || 'Praise FM USA',
      artist: liveMetadata?.artist || 'Live Radio',
      artwork: [{ src: '/icon-512.png', sizes: '512x512', type: 'image/png' }]
    });

    navigator.mediaSession.setActionHandler('play', togglePlayback);
    navigator.mediaSession.setActionHandler('pause', togglePlayback);
  }, [liveMetadata, isPlaying]);

  /* -------------------- METADATA -------------------- */

  useEffect(() => {
    const es = new EventSource(METADATA_URL, { withCredentials: false });
    eventSourceRef.current = es;

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        const streamTitle = data.streamTitle || '';
        if (!streamTitle.includes(' - ')) return;

        const [artist, ...rest] = streamTitle.split(' - ');
        const title = rest.join(' - ');

        if (
          BLOCKED_METADATA_KEYWORDS.some(k =>
            `${artist} ${title}`.toLowerCase().includes(k)
          )
        ) return;

        setLiveMetadata(prev => {
          if (prev?.title === title && prev.artist === artist) return prev;
          const meta = { artist, title, playedAt: new Date(), isMusic: true };
          setTrackHistory(h => [meta, ...h].slice(0, 10));
          return meta;
        });
      } catch {}
    };

    return () => es.close();
  }, []);

  const isAppRoute = location.pathname === '/app';

  /* -------------------- RENDER -------------------- */

  return (
    <div className="min-h-screen flex flex-col pb-[120px] bg-white dark:bg-[#121212] transition-colors">
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
            <Route path="/" element={<><Hero onListenClick={togglePlayback} isPlaying={isPlaying} liveMetadata={liveMetadata} /><RecentlyPlayed tracks={trackHistory} /></>} />
            <Route path="/app" element={<AppHomePage />} />
            <Route path="/music" element={<Playlist />} />
            <Route path="/schedule" element={<ScheduleList onNavigateToProgram={setSelectedProgram} onBack={() => navigate('/')} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/my-sounds" element={<ProtectedRoute><MySoundsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
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

