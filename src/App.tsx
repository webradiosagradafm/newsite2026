import React, { useState, useRef, useMemo } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { 
  Play, Pause, ChevronRight, RotateCcw, RotateCw, 
  Volume2, ListMusic, Sun, Moon, Home, Music, Mic2, X 
} from 'lucide-react';

// --- INTERFACES (Resolve os erros do seu VS Code) ---
interface Program {
  title: string;
  host: string;
  startTime: string;
  endTime: string;
  image: string;
  description: string;
}

interface Track {
  title: string;
  artist: string;
  cover: string;
}

// --- CONFIGURAÇÃO ---
const LOGO_URL = "https://res.cloudinary.com/dtecypmsh/image/upload/v1766869698/SVGUSA_lduiui.webp";
const STREAM_URL = "https://stream.zeno.fm/hvwifp8ezc6tv";

const formatAMPM = (time24: string): string => {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m < 10 ? '0' + m : m} ${ampm}`;
};

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Exemplo de agendamento (Substitua pelos seus dados reais)
  const currentProgram: Program = {
    title: "Danny Howard's Club Mix",
    host: "Joshwa, Maxinne and more",
    startTime: formatAMPM("01:00"),
    endTime: formatAMPM("02:00"),
    image: "https://images.clothes.com/api/v1/images/8e5f2e3c", // Exemplo
    description: "The biggest new pop & all day vibes."
  };

  const queue: Program[] = [
    { title: "Benji B", host: "Ragz Originale", startTime: formatAMPM("23:00"), endTime: formatAMPM("01:00"), image: "", description: "Kicking off 2026 with a special mix." },
    { title: "Radio 1 Dance Presents", host: "DJ Heartstring", startTime: formatAMPM("01:00"), endTime: formatAMPM("02:00"), image: "", description: "Live from Parklife festival." }
  ];

  const recentTracks: Track[] = [
    { title: "Ain't I Good For You", artist: "Yazmin Lacey", cover: "https://i.scdn.co/image/ab67616d0000b273767f70c57c66d9c6c68e7f1e" },
    { title: "Zimbabwe", artist: "Ife Ogunjobi", cover: "" },
    { title: "Idea 5 (Call My Name)", artist: "Kokoroko", cover: "https://i.scdn.co/image/ab67616d0000b2733970b5d8a6a68f6a9e8e2b6a" }
  ];

  const togglePlayback = () => {
    if (!audioRef.current) audioRef.current = new Audio(STREAM_URL);
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 flex flex-col font-sans">
        
        {/* HEADER (Estilo BBC com Toggle) */}
        <nav className="h-16 border-b dark:border-white/10 flex items-center justify-between px-6 sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-50">
          <img src={LOGO_URL} alt="Logo" className="h-10 w-auto" />
          <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-widest text-gray-400">
            <span className="text-[#ff6600] flex items-center gap-2"><Home size={16}/> Home</span>
            <span className="hover:text-[#ff6600] cursor-pointer flex items-center gap-2"><Music size={16}/> Music</span>
            <span className="hover:text-[#ff6600] cursor-pointer flex items-center gap-2"><Mic2 size={16}/> Podcasts</span>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full bg-gray-100 dark:bg-white/5">
            {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
          </button>
        </nav>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-grow max-w-7xl mx-auto px-4 py-12 pb-32">
          
          {/* HERO (Foto INICIO.png) */}
          <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
            <div className="relative w-72 h-72">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#ff6600] relative shadow-2xl">
                <img src={currentProgram.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="absolute bottom-4 right-4 bg-black text-white w-14 h-14 rounded-full flex items-center justify-center font-black border-4 border-white dark:border-black text-2xl shadow-xl">1</div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[#ff6600] font-black text-xs uppercase tracking-[0.2em] mb-3 italic">● LIVE | {currentProgram.startTime} - {currentProgram.endTime}</p>
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 flex items-center justify-center md:justify-start">
                {currentProgram.title} <ChevronRight className="text-[#ff6600] w-12 h-12 ml-2" />
              </h1>
              <p className="text-2xl text-gray-500 font-medium italic">with {currentProgram.host}</p>
              <button onClick={togglePlayback} className="mt-8 bg-[#ff6600] text-white px-16 py-5 font-black uppercase tracking-tight flex items-center gap-4 mx-auto md:mx-0 shadow-2xl hover:scale-105 transition-transform">
                {isPlaying ? <Pause fill="white" size={32} /> : <Play fill="white" size={32} />} Play
              </button>
            </div>
          </div>

          {/* UP NEXT (Foto UPNEXT.png) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-12 border-t dark:border-white/10">
            {queue.map((prog, i) => (
              <div key={i} className="flex gap-6 items-start group cursor-pointer">
                <div className="w-28 h-28 bg-gray-900 rounded-sm overflow-hidden shadow-lg">
                  <img src={prog.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-[#ff6600] uppercase tracking-widest italic mb-1">Up Next: {prog.startTime}</p>
                  <h3 className="text-2xl font-black uppercase tracking-tight group-hover:underline">{prog.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 italic mt-1">{prog.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* RECENT TRACKS (Foto Recent Tracks.png) */}
          <section className="mt-20">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-10">Recent Tracks</h2>
            <div className="w-full">
              <div className="grid grid-cols-12 border-b dark:border-white/10 pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <div className="col-span-1">#</div>
                <div className="col-span-7">Track</div>
                <div className="col-span-4">Artist</div>
              </div>
              {recentTracks.map((track, i) => (
                <div key={i} className="grid grid-cols-12 items-center py-5 border-b dark:border-white/5 hover:bg-white/5 transition-colors">
                  <div className="col-span-1 text-gray-500 font-bold">{i + 1}.</div>
                  <div className="col-span-7 flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-200 dark:bg-white/10 overflow-hidden shadow-md">
                      {track.cover && <img src={track.cover} className="w-full h-full object-cover" />}
                    </div>
                    <span className="font-black text-sm uppercase tracking-tight">{track.title}</span>
                  </div>
                  <div className="col-span-4 text-sm text-gray-500 font-medium italic">{track.artist}</div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* MODAL DE SCHEDULE (Foto MINI PLAYER SMARTPHONE 2.png) */}
        {showSchedule && (
          <div className="fixed inset-0 z-[2000] bg-white dark:bg-[#0a0a0a] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="p-6 border-b dark:border-white/10 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Schedule</h2>
              <button onClick={() => setShowSchedule(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                <X size={32} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-6">
              {queue.map((item, idx) => (
                <div key={idx} className="flex gap-4 border-b dark:border-white/5 pb-4">
                  <div className="w-24 h-24 bg-gray-800 rounded-sm" />
                  <div>
                    <h4 className="font-black text-lg uppercase leading-tight">{item.title}</h4>
                    <p className="text-xs text-gray-500 font-bold">17/01/2026</p>
                    <p className="text-sm text-[#ff6600] font-black mt-1">{item.startTime} - {item.endTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MINI PLAYER (Foto MINIPLAYER.png) */}
        <div className="fixed bottom-0 left-0 right-0 h-[100px] bg-white dark:bg-[#0c0c0c] border-t dark:border-white/10 z-[1000] px-6 flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
          <div className="h-1.5 bg-gray-200 dark:bg-gray-800 w-full relative">
            <div className="absolute h-full bg-[#ff6600] w-[45%]" />
            <div className="absolute top-1/2 left-[45%] -translate-y-1/2 w-4 h-4 bg-[#ff6600] rounded-full shadow-[0_0_15px_#ff6600]" />
          </div>
          
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-4 w-1/3">
              <img src={currentProgram.image} className="w-14 h-14 rounded-full border-2 border-[#ff6600] shadow-lg" />
              <div className="hidden lg:block">
                <h4 className="font-black text-sm uppercase truncate w-48 tracking-tight">{currentProgram.title}</h4>
                <p className="text-[10px] text-[#ff6600] font-black uppercase tracking-widest italic">Praise FM Live</p>
              </div>
            </div>

            <div className="flex items-center gap-10">
              <RotateCcw size={24} className="text-gray-400 hover:text-white cursor-pointer" />
              <button onClick={togglePlayback} className="w-16 h-16 rounded-full border-2 border-black dark:border-white flex items-center justify-center hover:scale-110 transition-transform">
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
              </button>
              <RotateCw size={24} className="text-gray-400 hover:text-white cursor-pointer" />
            </div>

            <div className="flex items-center justify-end gap-8 w-1/3">
              <div className="hidden xl:flex items-center gap-3">
                <Volume2 size={20} className="text-gray-400" />
                <div className="w-24 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ff6600] w-[60%]" />
                </div>
              </div>
              <button onClick={() => setShowSchedule(true)} className="text-gray-400 hover:text-[#ff6600] transition-colors">
                <ListMusic size={28} />
              </button>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#ff6600] rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-[#ff6600] tracking-widest">LIVE</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}