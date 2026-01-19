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
  'midnight grace', 'carpool', 'future artists', 'worship', 'non stop',
  'classics', 'pop hits', 'live show', 'station id', 'ramp', 'advertising',
  'jingle', 'bumper', 'teaser', 'coming up'
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-white dark:bg-[#121212]"></div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liveMetadata, setLiveMetadata] = useState<LiveMetadata | null>(null);
  const [trackHistory, setTrackHistory] = useState<LiveMetadata[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('praise-theme') as 'light' | 'dark') || 'light');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

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
    const nextFour = schedule.slice(currentIndex + 1, currentIndex + 5);
    
    return { currentProgram: current, queue: nextFour };
  }, [day, total]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('praise-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (selectedProgram) {
      setSelectedProgram(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const connectMetadata = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      
      try {
        const es = new EventSource(METADATA_URL);
        eventSourceRef.current = es;

        es.onmessage = (event) => {
          if (!event.data) return;
          try {
            const data = JSON.parse(event.data);
            const streamTitle = data.streamTitle || "";
            if (streamTitle.includes(' - ')) {
              const [artistPart, ...titleParts] = streamTitle.split(' - ');
              const artist = artistPart.trim();
              const title = titleParts.join(' - ').trim();
              if (!artist || !title) return;
              
              const musicCheck = !BLOCKED_METADATA_KEYWORDS.some(k => 
                `${artist} ${title}`.toLowerCase().includes(k)
              );
              
              const newMetadata: LiveMetadata = { 
                artist, 
                title, 
                playedAt: new Date(), 
                isMusic: musicCheck 
              };
              
              setLiveMetadata(prev => {
                const isNewTrack = !prev || prev.title !== newMetadata.title || prev.artist !== newMetadata.artist;
                if (isNewTrack) {
                  if (newMetadata.isMusic) {
                    setTrackHistory(h => {
                      if (h.length > 0 && h[0].title === newMetadata.title && h[0].artist === newMetadata.artist) {
                        return h;
                      }
                      return [newMetadata, ...h].slice(0, 10);
                    });
                  }
                  return newMetadata;
                }
                return prev;
              });
            }
          } catch (err) { }
        };

        es.onerror = () => {
          if (es) es.close();
          if (reconnectTimeoutRef.current) window.clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = window.setTimeout(connectMetadata, 5000);
        };
      } catch (err) { }
    };
    
    connectMetadata();
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) window.clearTimeout(reconnectTimeoutRef.current);
    };
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.load();
      audioRef.current.play().catch(e => {
        if (e.name !== 'AbortError' && !e.message?.includes('interrupted')) {
          console.error("Playback failed", e);
        }
      });
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    audioRef.current = new Audio(STREAM_URL);
    audioRef.current.crossOrigin = "anonymous";
    const savedVol = localStorage.getItem('praise-volume');
    const initialVol = savedVol ? parseFloat(savedVol) : 0.8;
    audioRef.current.volume = initialVol;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  const handleNavigateToProgram = (program: Program) => {
    setSelectedProgram(program);
    window.scrollTo(0, 0);
  };

  const activeTab = location.pathname === '/' ? 'home' : location.pathname.split('/')[1];

  // Verifica se está na rota do app (sem navbar/footer)
  const isAppRoute = location.pathname === '/app';

  return (
    <div className="min-h-screen flex flex-col pb-[120px] bg-white text-black dark:bg-[#121212] dark:text-white transition-colors duration-300">
      {!isAppRoute && (
        <Navbar 
          activeTab={activeTab} 
          theme={theme}
          onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
        />
      )}
      
      <main className="flex-grow">
        {selectedProgram ? (
          <ProgramDetail 
            program={selectedProgram} 
            onBack={() => setSelectedProgram(null)} 
            onViewSchedule={() => { setSelectedProgram(null); navigate('/schedule'); }} 
            onListenClick={togglePlayback}
            isPlaying={isPlaying}
          />
        ) : (
          <Routes>
            <Route path="/" element={
              <>
                <Hero onListenClick={togglePlayback} isPlaying={isPlaying} liveMetadata={liveMetadata} onNavigateToProgram={handleNavigateToProgram} />
                <RecentlyPlayed tracks={trackHistory} />
              </>
            } />
            <Route path="/app" element={<AppHomePage />} />
            <Route path="/music" element={<Playlist />} />
            <Route path="/new-releases" element={<NewReleasesPage />} />
            <Route path="/live-recordings" element={<LiveRecordingsPage />} />
            <Route path="/artists" element={<FeaturedArtistsPage />} />
            <Route path="/schedule" element={<ScheduleList onNavigateToProgram={handleNavigateToProgram} onBack={() => navigate('/')} />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/presenters" element={<PresentersPage onNavigateToProgram={handleNavigateToProgram} />} />
            <Route path="/devotional" element={<DevotionalPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfUsePage />} />
            <Route path="/cookies" element={<CookiesPolicyPage />} />
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