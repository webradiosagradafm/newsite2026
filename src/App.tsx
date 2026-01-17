import React, { useState, useRef, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import LivePlayerBar from './components/LivePlayerBar';
import RecentlyPlayed from './components/RecentlyPlayed';
import { SCHEDULES } from './constants';
import { Program } from './types';

const STREAM_URL = 'https://stream.zeno.fm/hvwifp8ezc6tv';

const getChicagoDayAndTotalMinutes = () => {
  const now = new Date();
  const chicagoDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  return { day: chicagoDate.getDay(), total: chicagoDate.getHours() * 60 + chicagoDate.getMinutes() };
};

const AppContent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  const [liveMetadata, setLiveMetadata] = useState<any>(null);
  const [trackHistory, setTrackHistory] = useState<any[]>([]); // Para o Recent Tracks
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { day, total } = getChicagoDayAndTotalMinutes();
  
  const { currentProgram, queue } = useMemo(() => {
    const schedule = SCHEDULES[day] || SCHEDULES[1];
    const currentIndex = schedule.findIndex(p => {
      const [sH, sM] = p.startTime.split(':').map(Number);
      const [eH, eM] = p.endTime.split(':').map(Number);
      const start = sH * 60 + sM;
      const end = eH === 0 ? 1440 : eH * 60 + eM;
      return total >= start && total < end;
    });
    return { 
      currentProgram: currentIndex !== -1 ? schedule[currentIndex] : schedule[0], 
      queue: schedule.slice(currentIndex + 1, currentIndex + 5) 
    };
  }, [day, total]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (!isPlayerActive) setIsPlayerActive(true);
    isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    audioRef.current = new Audio(STREAM_URL);
    audioRef.current.crossOrigin = "anonymous";
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col dark:bg-[#000] ${isPlayerActive ? 'pb-[90px]' : ''}`}>
      <Navbar activeTab="home" theme="dark" onToggleTheme={() => {}} />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <>
              <Hero onListenClick={togglePlayback} isPlaying={isPlaying} currentProgram={currentProgram} queue={queue} />
              {/* SEÇÃO RECENT TRACKS RESTAURADA */}
              <RecentlyPlayed tracks={trackHistory} />
            </>
          } />
        </Routes>
      </main>

      <Footer />

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