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
  'intro', 'outro', 'announcement', 'morning show', 'midday grace',
  'midnight grace', 'carpool', 'future artists', 'worship', 'non stop'
];

const getChicagoDayAndTotalMinutes = () => {
  const now = new Date();
  const chicagoDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  const h = chicagoDate.getHours();
  const m = chicagoDate.getMinutes();
  return { day: chicagoDate.getDay(), total: h * 60 + m };
};

interface LiveMetadata {
  artist: string;
  title: string;
  artwork?: string;
  playedAt?: Date;
  isMusic?: boolean;
}

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#121212]"></div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liveMetadata, setLiveMetadata] = useState<LiveMetadata | null>(null);
  const [trackHistory, setTrackHistory] = useState<LiveMetadata[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('praise-theme') as 'light' | 'dark') || 'dark');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // --- NOVO: Redirecionamento para o Modo App ---
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                       || (window.navigator as any).standalone 
                       || document.referrer.includes('android-app://');

    if (isStandalone && location.pathname === '/') {
      navigate('/app');
    }
  }, [location.pathname, navigate]);

  const { day, total } = getChicagoDayAndTotalMinutes();
  
  const { currentProgram, queue } = useMemo(() => {
    const schedule = SCHEDULES[day] || SCHEDULES[1];
    const currentIndex = schedule.findIndex(p => {
      const [sH, sM] = p.startTime.split(':').map(Number);
      const [eH, eM] = p.endTime.split(':').map(Number);
      const start = sH * 60 + sM;
      const end = eH === 0 ? 24 * 60 : eH * 60 + eM;
      return total >= start && total < end;
    });
    const current = currentIndex !== -1 ? schedule[currentIndex] : schedule[0];
    return { currentProgram: current, queue: schedule.slice(currentIndex + 1, currentIndex + 5) };
  }, [day, total]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('praise-theme', theme);
  }, [theme]);

  // Player Logic
  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.load();
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    audioRef.current = new Audio(STREAM_URL);
    audioRef.current.crossOrigin = "anonymous";
    return () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    };
  }, []);

  const isAppRoute = location.pathname === '/app';

  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-[#000] dark:text-white transition-colors duration-300">
      {!isAppRoute && (
        <Navbar 
          activeTab={location.pathname === '/' ? 'home' : location.pathname.split('/')[1]} 
          theme={theme}
          onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
        />
      )}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <>
              <Hero onListenClick={togglePlayback} isPlaying={isPlaying} liveMetadata={liveMetadata} onNavigateToProgram={(p) => setSelectedProgram(p)} />
              <RecentlyPlayed tracks={trackHistory} />
            </>
          } />
          {/* ROTA DO APP MODIFICADA */}
          <Route path="/app" element={<AppHomePage />} />
          
          <Route path="/music" element={<Playlist />} />
          <Route path="/schedule" element={<ScheduleList onNavigateToProgram={(p) => setSelectedProgram(p)} onBack={() => navigate('/')} />} />
          <Route path="/my-sounds" element={<ProtectedRoute><MySoundsPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAppRoute && <Footer />}
      
      {/* O Player bar não aparece na rota /app para não duplicar com o carrossel */}
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