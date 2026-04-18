import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom';

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

// 🔥 NOVAS PÁGINAS SEO
import ProgramsPage from './pages/ProgramsPage';
import ChristianRadioPage from './pages/ChristianRadioPage';
import GospelRadioPage from './pages/GospelRadioPage';
import WorshipRadioPage from './pages/WorshipRadioPage';

import { SCHEDULES } from './constants';
import { Program } from './types';

const STREAM_URL = 'https://stream.zeno.fm/hvwifp8ezc6tv';
const METADATA_URL = 'https://api.zeno.fm/mounts/metadata/subscribe/hvwifp8ezc6tv';

const BLOCKED_METADATA_KEYWORDS = [
  'praise fm', 'praisefm', 'commercial', 'spot', 'promo', 'ident'
];

interface LiveMetadata {
  artist: string;
  title: string;
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
  if (loading) return null;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liveMetadata, setLiveMetadata] = useState<LiveMetadata | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const audio = new Audio(STREAM_URL);
    audioRef.current = audio;
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen flex flex-col pb-[120px] bg-white dark:bg-[#121212]">

      <h1 className="sr-only">
        Praise FM Global - Christian Radio Online 24/7
      </h1>

      <Navbar />

      <main className="flex-grow">

        <Routes>

          {/* HOME */}
          <Route
            path="/"
            element={
              <>
                <Hero
                  onListenClick={togglePlayback}
                  isPlaying={isPlaying}
                  liveMetadata={liveMetadata}
                />
                <RecentlyPlayed tracks={[]} />
              </>
            }
          />

          {/* SEO PAGES 🔥 */}
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/christian-radio" element={<ChristianRadioPage />} />
          <Route path="/gospel-radio" element={<GospelRadioPage />} />
          <Route path="/worship-radio" element={<WorshipRadioPage />} />

          {/* OUTRAS */}
          <Route path="/music" element={<Playlist />} />
          <Route path="/schedule" element={<ScheduleList />} />
          <Route path="/devotional" element={<DevotionalPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/new-releases" element={<NewReleasesPage />} />
          <Route path="/artists" element={<FeaturedArtistsPage />} />
          <Route path="/presenters" element={<PresentersPage />} />
          <Route path="/live-recordings" element={<LiveRecordingsPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />

          {/* AUTH */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* LEGAL */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfUsePage />} />
          <Route path="/cookies" element={<CookiesPolicyPage />} />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>

      </main>

      <Footer />

      <LivePlayerBar
        isPlaying={isPlaying}
        onTogglePlayback={togglePlayback}
        program={null}
        liveMetadata={liveMetadata}
        queue={[]}
        audioRef={audioRef}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}