import React, { useState, useRef, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LivePlayerBar from './components/LivePlayerBar';
import RecentlyPlayed from './components/RecentlyPlayed';
import { SCHEDULES } from './constants';

const STREAM_URL = 'https://stream.zeno.fm/hvwifp8ezc6tv';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Lógica de agendamento blindada
  const { currentProgram, queue } = useMemo(() => {
    const now = new Date();
    const chicago = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
    const total = chicago.getHours() * 60 + chicago.getMinutes();
    const day = chicago.getDay();
    
    const schedule = SCHEDULES[day] || SCHEDULES[1] || [];
    const index = schedule.findIndex(p => {
      const [sH, sM] = p.startTime.split(':').map(Number);
      const [eH, eM] = p.endTime.split(':').map(Number);
      return total >= (sH * 60 + sM) && total < (eH * 60 + eM);
    });

    return {
      currentProgram: index !== -1 ? schedule[index] : schedule[0],
      queue: index !== -1 ? schedule.slice(index + 1, index + 5) : []
    };
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(STREAM_URL);
      audioRef.current.crossOrigin = "anonymous";
    }
    if (!isPlayerActive) setIsPlayerActive(true);
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback failed", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <HashRouter>
      <div className={`min-h-screen bg-white dark:bg-black text-black dark:text-white ${isPlayerActive ? 'pb-24' : ''}`}>
        <Navbar activeTab="home" theme="dark" onToggleTheme={() => {}} />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero onListenClick={togglePlayback} isPlaying={isPlaying} currentProgram={currentProgram} queue={queue} />
                <RecentlyPlayed tracks={[]} />
              </>
            } />
          </Routes>
        </main>
        <LivePlayerBar isVisible={isPlayerActive} isPlaying={isPlaying} onTogglePlayback={togglePlayback} program={currentProgram} queue={queue} />
      </div>
    </HashRouter>
  );
}