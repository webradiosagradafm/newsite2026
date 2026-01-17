import React, { useState, useRef, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LivePlayerBar from './components/LivePlayerBar';
import RecentlyPlayed from './components/RecentlyPlayed';
import { SCHEDULES } from './constants';

const STREAM_URL = 'https://stream.zeno.fm/hvwifp8ezc6tv';

// Função para formatar 24h em AM/PM
const formatAMPM = (time24: string) => {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m < 10 ? '0' + m : m} ${ampm}`;
};

const getChicagoTime = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    weekday: 'narrow'
  });
  
  const parts = formatter.formatToParts(now);
  const h = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
  const m = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
  
  // GetDay ajustado para Chicago
  const chicagoDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  return { day: chicagoDate.getDay(), totalMinutes: h * 60 + m };
};

const AppContent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { currentProgram, queue } = useMemo(() => {
    const { day, totalMinutes } = getChicagoTime();
    const schedule = SCHEDULES[day] || SCHEDULES[1];
    
    const index = schedule.findIndex(p => {
      const [sH, sM] = p.startTime.split(':').map(Number);
      const [eH, eM] = p.endTime.split(':').map(Number);
      const start = sH * 60 + sM;
      const end = (eH === 0 && eM === 0) ? 1440 : eH * 60 + eM;
      return totalMinutes >= start && totalMinutes < end;
    });

    const current = index !== -1 ? schedule[index] : schedule[0];
    // Formata as horas do programa atual para AM/PM
    const currentFormatted = {
      ...current,
      startTime: formatAMPM(current.startTime),
      endTime: formatAMPM(current.endTime)
    };

    // Formata a fila (Up Next)
    const nextOnes = schedule.slice(index + 1, index + 5).map(p => ({
      ...p,
      startTime: formatAMPM(p.startTime),
      endTime: formatAMPM(p.endTime)
    }));

    return { currentProgram: currentFormatted, queue: nextOnes };
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(STREAM_URL);
      audioRef.current.crossOrigin = "anonymous";
    }
    if (!isPlayerActive) setIsPlayerActive(true);
    isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`min-h-screen dark:bg-black text-white ${isPlayerActive ? 'pb-[90px]' : ''}`}>
      <Navbar activeTab="home" theme="dark" onToggleTheme={() => {}} />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero 
                onListenClick={togglePlayback} 
                isPlaying={isPlaying} 
                currentProgram={currentProgram} 
                queue={queue} 
              />
              <RecentlyPlayed tracks={[]} />
            </>
          } />
        </Routes>
      </main>
      <LivePlayerBar 
        isVisible={isPlayerActive} 
        isPlaying={isPlaying} 
        onTogglePlayback={togglePlayback} 
        program={currentProgram} 
      />
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}