import React, { useState, useRef, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Play, Pause, ChevronRight, RotateCcw, RotateCw, Volume2, ListMusic, Sun, Moon, Home, Music, Mic2 } from 'lucide-react';
import { SCHEDULES } from './constants';

const STREAM_URL = 'https://stream.zeno.fm/hvwifp8ezc6tv';
const LOGO_URL = "https://res.cloudinary.com/dtecypmsh/image/upload/v1766869698/SVGUSA_lduiui.webp";

// --- FORMATAÇÃO DE HORA CHICAGO ---
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

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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
      <div className="min-h-screen bg-white dark:bg-[#000] text-black dark:text-white transition-colors duration-300 flex flex-col">
        
        {/* HEADER */}
        <nav className="h-16 border-b border-gray-100 dark:border-white/10 flex items-center justify-between px-4 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-50">
          <img src={LOGO_URL} alt="Logo" className="h-10 w-auto object-contain" />
          <div className="hidden md:flex items-center gap-6 font-bold text-[11px] uppercase tracking-widest text-gray-400">
            <span className="text-[#ff6600] flex items-center gap-2"><Home size={16}/> Home</span>
            <span className="hover:text-[#ff6600] cursor-pointer flex items-center gap-2"><Music size={16}/> Music</span>
            <span className="hover:text-[#ff6600] cursor-pointer flex items-center gap-2"><Mic2 size={16}/> Podcasts</span>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-white/5 transition-all">
            {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
          </button>
        </nav>

        <main className={`flex-grow max-w-7xl mx-auto px-4 pt-12 ${isPlayerActive ? 'pb-32' : 'pb-12'}`}>
          <HashRouter>
            <Routes>
              <Route path="/" element={
                <>
                  {/* HERO SECTION */}
                  <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
                    <div className="relative w-64 h-64 flex-shrink-0">
                      <img src={currentProgram?.image} className="w-full h-full rounded-full object-cover border-4 border-[#ff6600] shadow-2xl" />
                      <div className="absolute bottom-4 right-4 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center font-black border-4 border-white dark:border-black">1</div>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-[#ff6600] font-black text-xs uppercase tracking-widest italic mb-2">● LIVE | {currentProgram?.startTime}</p>
                      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 flex items-center justify-center md:justify-start">
                        {currentProgram?.title} <ChevronRight className="text-[#ff6600] w-12 h-12 ml-2" />
                      </h1>
                      <p className="text-xl text-gray-500 mb-8 font-medium italic">with {currentProgram?.host}</p>
                      <button onClick={togglePlayback} className="bg-[#ff6600] text-white px-12 py-4 font-black uppercase flex items-center gap-4 mx-auto md:mx-0 hover:brightness-110 active:scale-95 transition-all shadow-xl">
                        {isPlaying ? <Pause fill="white" size={28} /> : <Play fill="white" size={28} />} Listen Live
                      </button>
                    </div>
                  </div>

                  {/* UP NEXT */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10 border-t border-gray-100 dark:border-white/10">
                    {queue.slice(0, 2).map((prog: any, i: number) => (
                      <div key={i} className="flex gap-6 group">
                        <img src={prog.image} className="w-24 h-24 object-cover rounded shadow-lg" />
                        <div>
                          <p className="text-[11px] font-black text-[#ff6600] uppercase italic">Up Next • {prog.startTime}</p>
                          <h3 className="text-xl font-black uppercase group-hover:underline">{prog.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2 italic">{prog.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* RECENT TRACKS */}
                  <section className="mt-16">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">Recent Tracks</h2>
                    <div className="border-t border-gray-100 dark:border-white/10">
                      {[
                        { t: "Ain't I Good For You", a: "Yazmin Lacey", c: "https://i.scdn.co/image/ab67616d0000b273767f70c57c66d9c6c68e7f1e" },
                        { t: "Zimbabwe", a: "Ife Ogunjobi", c: "" },
                        { t: "Idea 5 (Call My Name)", a: "Kokoroko", c: "https://i.scdn.co/image/ab67616d0000b2733970b5d8a6a68f6a9e8e2b6a" }
                      ].map((track, i) => (
                        <div key={i} className="grid grid-cols-12 gap-4 items-center py-4 border-b dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <div className="col-span-1 text-gray-400 font-bold">{i + 1}.</div>
                          <div className="col-span-7 flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-white/10 rounded overflow-hidden">
                              {track.c && <img src={track.c} className="w-full h-full object-cover" />}
                            </div>
                            <span className="font-bold text-sm">{track.t}</span>
                          </div>
                          <div className="col-span-4 text-sm text-gray-400">{track.a}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              } />
            </Routes>
          </HashRouter>
        </main>

        {/* FOOTER */}
        <footer className="bg-gray-50 dark:bg-[#0c0c0c] py-12 border-t border-gray-200 dark:border-white/5 text-center mt-auto">
          <img src={LOGO_URL} className="h-8 mx-auto opacity-30 grayscale mb-4" />
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">© 2026 Praise FM USA</p>
        </footer>

        {/* PLAYER BAR */}
        {isPlayerActive && (
          <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-white dark:bg-[#0c0c0c] border-t dark:border-white/10 px-6 flex items-center justify-between z-[1000] shadow-2xl">
            <div className="absolute top-0 left-0 h-[3px] bg-[#ff6600] w-[35%]" />
            <div className="flex items-center gap-4 w-1/3">
              <img src={currentProgram?.image} className="w-12 h-12 rounded-full border-2 border-[#ff6600]" />
              <div className="hidden md:block">
                <h4 className="font-black text-xs uppercase truncate w-32">{currentProgram?.title}</h4>
                <p className="text-[10px] text-[#ff6600] font-bold uppercase italic">Praise Live</p>
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