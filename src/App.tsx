import React, { useState, useRef, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Play, Pause, ChevronRight, RotateCcw, RotateCw, Volume2, ListMusic, Sun, Moon, Home, Music, Mic2 } from 'lucide-react';
import { SCHEDULES } from './constants';

const STREAM_URL = 'https://stream.zeno.fm/hvwifp8ezc6tv';
const LOGO_URL = "https://res.cloudinary.com/dtecypmsh/image/upload/v1766869698/SVGUSA_lduiui.webp";

// --- UTILITÁRIOS ---
const formatAMPM = (time24: string) => {
  if (!time24) return "";
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m < 10 ? '0' + m : m} ${ampm}`;
};

const getChicagoTime = () => {
  const now = new Date();
  const chicagoDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  return { day: chicagoDate.getDay(), totalMinutes: chicagoDate.getHours() * 60 + chicagoDate.getMinutes() };
};

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Alternar Tema
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const { currentProgram, queue } = useMemo(() => {
    const { day, totalMinutes } = getChicagoTime();
    const schedule = SCHEDULES[day] || SCHEDULES[1] || [];
    const index = schedule.findIndex(p => {
      const [sH, sM] = p.startTime.split(':').map(Number);
      const [eH, eM] = p.endTime.split(':').map(Number);
      return totalMinutes >= (sH * 60 + sM) && totalMinutes < (eH * 60 + eM);
    });

    const current = index !== -1 ? schedule[index] : schedule[0];
    return {
      currentProgram: { ...current, startTime: formatAMPM(current?.startTime), endTime: formatAMPM(current?.endTime) },
      queue: schedule.slice(index + 1, index + 5).map(p => ({ ...p, startTime: formatAMPM(p.startTime) }))
    };
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
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        
        {/* --- HEADER COM LOGO E DARK MODE --- */}
        <nav className="h-16 border-b border-gray-100 dark:border-white/10 flex items-center justify-between px-4 sticky top-0 bg-white dark:bg-black z-50">
          <img src={LOGO_URL} alt="Logo" className="h-10 w-auto object-contain" />
          
          <div className="hidden md:flex items-center gap-6 font-bold text-xs uppercase tracking-widest text-gray-400">
            <span className="text-[#ff6600] flex items-center gap-2"><Home size={16}/> Home</span>
            <span className="hover:text-[#ff6600] cursor-pointer flex items-center gap-2"><Music size={16}/> Music</span>
            <span className="hover:text-[#ff6600] cursor-pointer flex items-center gap-2"><Mic2 size={16}/> Podcasts</span>
          </div>

          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-white/5 hover:scale-110 transition-transform">
            {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
          </button>
        </nav>

        {/* --- HERO (FOTO INICIO.PNG) --- */}
        <main className={`max-w-7xl mx-auto px-4 pt-12 ${isPlayerActive ? 'pb-32' : 'pb-12'}`}>
          <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
            <div className="relative w-64 h-64 flex-shrink-0">
              <img src={currentProgram?.image} className="w-full h-full rounded-full object-cover border-4 border-[#ff6600] shadow-2xl" />
              <div className="absolute bottom-4 right-4 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center font-black border-4 border-white dark:border-black text-xl">1</div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[#ff6600] font-black text-xs uppercase tracking-widest mb-2 italic">● Live Now | {currentProgram?.startTime}</p>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 flex items-center justify-center md:justify-start">
                {currentProgram?.title} <ChevronRight className="text-[#ff6600] w-12 h-12 ml-2" />
              </h1>
              <p className="text-xl text-gray-500 mb-8 font-medium italic text-lg">with {currentProgram?.host}</p>
              <button onClick={togglePlayback} className="bg-[#ff6600] text-white px-14 py-4 font-black uppercase flex items-center gap-4 mx-auto md:mx-0 shadow-xl hover:brightness-110 active:scale-95 transition-all">
                {isPlaying ? <Pause fill="white" size={32} /> : <Play fill="white" size={32} />} Listen Live
              </button>
            </div>
          </div>

          {/* --- UP NEXT (FOTO UPNEXT.PNG) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10 border-t border-gray-100 dark:border-white/10">
            {queue.slice(0, 2).map((prog: any, i: number) => (
              <div key={i} className="flex gap-6 items-start group">
                <img src={prog.image} className="w-24 h-24 object-cover rounded shadow-lg" />
                <div>
                  <p className="text-[11px] font-black text-[#ff6600] uppercase italic">Up Next • {prog.startTime}</p>
                  <h3 className="text-xl font-black uppercase group-hover:underline">{prog.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 italic">{prog.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* --- RECENT TRACKS (FOTO RECENT TRACKS.PNG) --- */}
          <section className="mt-20">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">Recent Tracks</h2>
            <div className="border-t border-gray-100 dark:border-white/10">
              {[
                { t: "Ain't I Good For You", a: "Yazmin Lacey", c: "https://i.scdn.co/image/ab67616d0000b273767f70c57c66d9c6c68e7f1e" },
                { t: "Zimbabwe", a: "Ife Ogunjobi", c: "" },
                { t: "Idea 5 (Call My Name)", a: "Kokoroko", c: "https://i.scdn.co/image/ab67616d0000b2733970b5d8a6a68f6a9e8e2b6a" }
              ].map((track, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <div className="col-span-1 text-gray-500 font-bold">{i + 1}.</div>
                  <div className="col-span-7 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-white/10 rounded overflow-hidden">
                      {track.c && <img src={track.c} className="w-full h-full object-cover" />}
                    </div>
                    <span className="font-bold text-sm">{track.t}</span>
                  </div>
                  <div className="col-span-4 text-sm text-gray-500">{track.a}</div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* --- FOOTER (CONSERTADO) --- */}
        <footer className="bg-gray-50 dark:bg-[#0c0c0c] py-16 border-t border-gray-200 dark:border-white/5 text-center">
          <img src={LOGO_URL} className="h-8 mx-auto opacity-30 grayscale mb-6" />
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">
            © 2026 Praise FM USA. All Rights Reserved.
          </p>
        </footer>

        {/* --- LIVE PLAYER BAR (MINIPLAYER.PNG) --- */}
        {isPlayerActive && (
          <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-white dark:bg-[#0c0c0c] border-t border-gray-200 dark:border-white/10 px-6 flex items-center justify-between z-[1000] shadow-2xl">
            <div className="absolute top-0 left-0 h-[3px] bg-[#ff6600] w-[40%]" />
            
            <div className="flex items-center gap-4 w-1/3">
              <img src={currentProgram?.image} className="w-12 h-12 rounded-full border-2 border-[#ff6600]" />
              <div className="hidden md:block">
                <h4 className="font-black text-xs uppercase truncate w-40">{currentProgram?.title}</h4>
                <p className="text-[10px] text-[#ff6600] font-bold uppercase italic tracking-tighter">Praise Live</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <RotateCcw size={20} className="text-gray-400" />
              <button onClick={togglePlayback} className="w-12 h-12 rounded-full border-2 border-black dark:border-white flex items-center justify-center">
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
              </button>
              <RotateCw size={20} className="text-gray-400" />
            </div>

            <div className="flex items-center justify-end gap-6 w-1/3 text-gray-400">
              <Volume2 size={20} className="hidden lg:block" />
              <ListMusic size={24} />
              <span className="text-[10px] font-black text-[#ff6600] animate-pulse">LIVE</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}