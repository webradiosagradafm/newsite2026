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

const formatToAmPm = (time?: string) => {
  if (!time) return '';
  const [hourRaw, minuteRaw] = time.split(':').map(Number);
  const hour = hourRaw === 0 ? 12 : hourRaw > 12 ? hourRaw - 12 : hourRaw;
  const minute = String(minuteRaw || 0).padStart(2, '0');
  const period = hourRaw >= 12 ? 'PM' : 'AM';
  return `${hour}:${minute} ${period}`;
};

const formatRangeToAmPm = (start?: string, end?: string) => {
  if (!start || !end) return '24/7';
  return `${formatToAmPm(start)} - ${formatToAmPm(end)}`;
};

const getChicagoDayAndTotalMinutes = () => {
  const now = new Date();
  const chicagoDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  return {
    day: chicagoDate.getDay(),
    total: chicagoDate.getHours() * 60 + chicagoDate.getMinutes()
  };
};

const getProgramProgress = (program?: Program) => {
  if (!program) return 0;
  const { total } = getChicagoDayAndTotalMinutes();
  const [sH, sM] = program.startTime.split(':').map(Number);
  const [eH, eM] = program.endTime.split(':').map(Number);
  const start = sH * 60 + sM;
  const end = (eH === 0 ? 24 : eH) * 60 + eM;
  if (total <= start) return 0;
  if (total >= end) return 100;
  return Math.round(((total - start) / (end - start)) * 100);
};

const getProgramImage = (program?: Program) => {
  const p = program as any;
  return p?.image || p?.cover || p?.presenterImage || p?.presenter?.image || DEFAULT_COVER;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-black" />;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

// ============================================================
// HOME COMPONENT - BBC RADIO 1 STYLE
// ============================================================
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
  const nextThree = queue?.[2];

  const presenterImage = getProgramImage(currentProgram);
  const progress = getProgramProgress(currentProgram);

  const size = 220;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  return (
    <>
      {/* HERO SECTION */}
      <section className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
          
          {/* TITLE BAR */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-3 h-3 bg-[#00FFD1] rounded-full animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.4em] text-[#00FFD1]">
              On Air Now
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {currentProgram ? formatRangeToAmPm(currentProgram.startTime, currentProgram.endTime) : '24/7'}
            </span>
          </div>

          {/* MAIN PLAYER */}
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-14">
            
            {/* ALBUM ART */}
            <div className="relative w-[220px] h-[220px] flex-shrink-0">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
                <circle cx={center} cy={center} r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} fill="none" />
                <circle cx={center} cy={center} r={radius} stroke="#00FFD1" strokeWidth={strokeWidth} fill="none" strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress / 100)}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-[18px] overflow-hidden bg-gray-900">
                <img src={presenterImage} alt={currentProgram?.title || 'Praise FM'}
                  className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = DEFAULT_COVER; }} />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-black text-[#00FFD1] px-4 py-2 font-black text-sm tracking-wider border-2 border-[#00FFD1]">
                LIVE
              </div>
            </div>

            {/* PROGRAM INFO */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block bg-[#00FFD1] text-black px-3 py-1 text-xs font-black uppercase tracking-wider mb-4">
                {currentProgram?.host || 'Praise FM'}
              </div>
              
              <button onClick={() => currentProgram && onNavigateToProgram(currentProgram)} className="group w-full md:w-auto">
                <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight hover:text-[#00FFD1] transition-colors">
                  {currentProgram?.title || 'Praise FM'}
                </h1>
              </button>

              <p className="mt-4 text-xl text-gray-300 font-medium max-w-xl">
                {liveMetadata?.title || currentProgram?.description || 'The biggest tunes and nonstop vibes.'}
              </p>

              {/* PLAY BUTTON */}
              <button onClick={onListenClick}
                className="mt-8 bg-[#00FFD1] hover:bg-white text-black px-12 py-5 font-black text-lg uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 inline-flex items-center gap-3">
                {isPlaying ? (
                  <><Pause size={22} fill="currentColor" /><span>Stop</span></>
                ) : (
                  <><Play size={22} fill="currentColor" /><span>Listen Now</span></>
                )}
              </button>
            </div>
          </div>

          {/* UP NEXT */}
          <div className="border-t border-gray-800 pt-10">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 mb-6">
              Up Next
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* NEXT 1 */}
              {nextOne && (
                <button onClick={() => onNavigateToProgram(nextOne)}
                  className="group flex gap-4 items-center text-left bg-[#1A1A1A] hover:bg-[#252525] p-4 transition-all duration-200 w-full">
                  <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden">
                    <img src={getProgramImage(nextOne)} alt={nextOne.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => { e.currentTarget.src = DEFAULT_COVER; }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#00FFD1] mb-1">Next</p>
                    <h3 className="text-sm font-bold leading-tight group-hover:text-[#00FFD1] transition-colors truncate">{nextOne.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{formatRangeToAmPm(nextOne.startTime, nextOne.endTime)}</p>
                  </div>
                </button>
              )}

              {/* NEXT 2 */}
              {nextTwo && (
                <button onClick={() => onNavigateToProgram(nextTwo)}
                  className="group hidden md:flex gap-4 items-center text-left bg-[#1A1A1A] hover:bg-[#252525] p-4 transition-all duration-200 w-full">
                  <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden">
                    <img src={getProgramImage(nextTwo)} alt={nextTwo.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => { e.currentTarget.src = DEFAULT_COVER; }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">Later</p>
                    <h3 className="text-sm font-bold leading-tight group-hover:text-[#00FFD1] transition-colors truncate">{nextTwo.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{formatRangeToAmPm(nextTwo.startTime, nextTwo.endTime)}</p>
                  </div>
                </button>
              )}

              {/* NEXT 3 */}
              {nextThree && (
                <button onClick={() => onNavigateToProgram(nextThree)}
                  className="group hidden md:flex gap-4 items-center text-left bg-[#1A1A1A] hover:bg-[#252525] p-4 transition-all duration-200 w-full">
                  <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden">
                    <img src={getProgramImage(nextThree)} alt={nextThree.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => { e.currentTarget.src = DEFAULT_COVER; }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">
                      {formatRangeToAmPm(nextThree.startTime, nextThree.endTime)}
                    </p>
                    <h3 className="text-sm font-bold leading-tight group-hover:text-[#00FFD1] transition-colors truncate">{nextThree.title}</h3>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* RECENT TRACKS */}
      <RecentlyPlayed tracks={trackHistory} />
    </>
  );
};

// ============================================================
// APP CONTENT
// ============================================================
const AppContent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liveMetadata, setLiveMetadata] = useState<LiveMetadata | null>(null);
  const [trackHistory, setTrackHistory] = useState<LiveMetadata[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('praise-theme') as 'light' | 'dark') || 'dark'
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

    const currentIdx = index !== -1 ? index : 0;

    const nextPrograms: Program[] = [];
    for (let i = 1; i <= 4; i++) {
      const nextIdx = (currentIdx + i) % schedule.length;
      nextPrograms.push(schedule[nextIdx]);
    }

    return {
      currentProgram: schedule[currentIdx],
      queue: nextPrograms
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
    audioRef.current.play().catch(() => setIsPlaying(false));
  };

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: liveMetadata?.title || 'Praise FM USA',
      artist: liveMetadata?.artist || 'Live Radio',
      artwork: [{ src: DEFAULT_COVER, sizes: '512x512', type: 'image/png' }]
    });
    navigator.mediaSession.setActionHandler('play', () => audioRef.current?.play().catch(() => {}));
    navigator.mediaSession.setActionHandler('pause', () => audioRef.current?.pause());
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
          const meta: LiveMetadata = { artist, title, playedAt: new Date(), isMusic: true };
          setTrackHistory(history => [meta, ...history].slice(0, 10));
          return meta;
        });
      } catch {}
    };

    return () => { es.close(); eventSourceRef.current = null; };
  }, []);

  const isAppRoute = location.pathname === '/app';

  return (
    <div className="min-h-screen flex flex-col pb-[100px] bg-black transition-colors">
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
            <Route path="/" element={
              <HomeBBC isPlaying={isPlaying} liveMetadata={liveMetadata} currentProgram={currentProgram}
                queue={queue} onListenClick={togglePlayback} onNavigateToProgram={setSelectedProgram} trackHistory={trackHistory} />
            } />
            <Route path="/app" element={<AppHomePage />} />
            <Route path="/music" element={<Playlist />} />
            <Route path="/schedule" element={<ScheduleList onNavigateToProgram={setSelectedProgram} onBack={() => navigate('/')} />} />
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
            <Route path="/my-sounds" element={<ProtectedRoute><MySoundsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfUsePage />} />
            <Route path="/cookies" element={<CookiesPolicyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>

      {!isAppRoute && <Footer />}

      {!isAppRoute && currentProgram && (
        <LivePlayerBar isPlaying={isPlaying} onTogglePlayback={togglePlayback} program={currentProgram}
          liveMetadata={liveMetadata} queue={queue} audioRef={audioRef} />
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