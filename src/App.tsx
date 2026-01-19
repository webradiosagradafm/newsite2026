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
import LoginPage from './pages/LoginPage';
import MySoundsPage from './pages/MySoundsPage';
import AppHomePage from './pages/AppHomePage';
import { SCHEDULES } from './constants';
import { Program } from './types';

// URLs Oficiais do Projeto
const STREAM_URL = 'https://stream.zeno.fm/hvwifp8ezc6tv'; 
const METADATA_URL = 'https://api.zeno.fm/mounts/metadata/subscribe/hvwifp8ezc6tv'; 

const AppContent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Detecta se o app está rodando de forma instalada (PWA) 
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                       || (window.navigator as any).standalone;

    if (isStandalone && location.pathname === '/') {
      navigate('/app');
    }
  }, [location.pathname, navigate]);

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
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-[#000] dark:text-white">
      {!isAppRoute && <Navbar theme="dark" onToggleTheme={() => {}} />} 
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Hero onListenClick={togglePlayback} isPlaying={isPlaying} />} />
          <Route path="/app" element={<AppHomePage />} />
          <Route path="/schedule" element={<ScheduleList onBack={() => navigate('/')} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAppRoute && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
}