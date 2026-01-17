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
import { SCHEDULES } from './constants';
import { Program } from './types';

const STREAM_URL = 'https://stream.zeno.fm/hvwifp8ezc6tv';
const METADATA_URL = 'https://api.zeno.fm/mounts/metadata/subscribe/hvwifp8ezc6tv';

const getChicagoDayAndTotalMinutes = () => {
  const now = new Date();
  const chicagoDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  const h = chicagoDate.getHours();
  const m = chicagoDate.getMinutes();
  return { day: chicagoDate.getDay(), total: h * 60 + m };
};

const AppContent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerActive, setIsPlayerActive] = useState(false); // NOVO: Controla exibição do miniplayer
  const [liveMetadata, setLiveMetadata] = useState<any | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('praise-theme') as 'light' | 'dark') || 'light');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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
    return { currentProgram: current, queue: schedule.slice(currentIndex + 1, currentIndex + 5) };
  }, [day, total]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    // Ativa o miniplayer no primeiro clique
    if (!isPlayerActive) setIsPlayerActive(true);

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    audioRef.current = new Audio(STREAM_URL);
    audioRef.current.crossOrigin = "anonymous";
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, []);

  return (
    <div className="min-h-screen flex flex-col pb-[120px] dark:bg-[#000]">
      <Navbar activeTab="home" theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <>
              <Hero onListenClick={togglePlayback} isPlaying={isPlaying} onNavigateToProgram={(p) => setSelectedProgram(p)} />
            </>
          } />
          {/* Adicione suas outras rotas aqui */}
        </Routes>
      </main>

      <Footer />

      {/* MINI PLAYER BAR: Só renderiza se isPlayerActive for true */}
      <LivePlayerBar 
        isVisible={isPlayerActive}
        isPlaying={isPlaying} 
        onTogglePlayback={togglePlayback} 
        program={currentProgram} 
        queue={queue}
        liveMetadata={liveMetadata}
      />
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