import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, ListMusic, ChevronUp, ChevronDown, X } from 'lucide-react';

const SCHEDULE = [
  { start: 0, end: 6, title: "Midnight Grace", host: "Daniel Brooks", image: "https://praisefmusa.com/wp-content/uploads/2024/01/daniel-brooks.jpg" },
  { start: 6, end: 7, title: "Praise FM Worship", host: "Morning Adoration", image: "https://praisefmusa.com/wp-content/uploads/2024/01/worship-icon.jpg" },
  { start: 7, end: 12, title: "Morning Show", host: "Stancy Cambpell", image: "https://praisefmusa.com/wp-content/uploads/2024/01/stancy-host.jpg" },
  { start: 12, end: 13, title: "Praise FM Worship", host: "Noon Praise", image: "https://praisefmusa.com/wp-content/uploads/2024/01/worship-icon.jpg" },
  { start: 13, end: 16, title: "Midday Grace", host: "Michael Ray", image: "https://praisefmusa.com/wp-content/uploads/2024/01/michael-ray.jpg" },
];

export default function LivePlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQueuePC, setShowQueuePC] = useState(false);
  const [chicagoTime, setChicagoTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const chicago = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
      setChicagoTime(chicago);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = chicagoTime.getHours();
  const currentProgram = SCHEDULE.find(p => currentHour >= p.start && currentHour < p.end) || SCHEDULE[0];
  const nextPrograms = SCHEDULE.filter(p => p.start > currentHour).slice(0, 4);

  const formatAMPM = (hour: number) => {
    const ampm = hour >= 12 ? 'pm' : 'am';
    const h = hour % 12 || 12;
    return `${h}:00${ampm}`;
  };

  return (
    <>
      {/* QUEUE PARA PC - Só aparece se showQueuePC for true e houver play */}
      {showQueuePC && isPlaying && (
        <div className="hidden md:block fixed bottom-[95px] right-6 w-[380px] bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl z-[101] animate-in slide-in-from-bottom-4">
          <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-black dark:text-white uppercase tracking-tighter">Schedule</h3>
            <button onClick={() => setShowQueuePC(false)}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="p-2">
            {nextPrograms.map((prog, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                <img src={prog.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-black dark:text-white truncate">{prog.title}</p>
                  <p className="text-[11px] text-gray-500 font-medium">{formatAMPM(prog.start)} - {formatAMPM(prog.end)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MINI PLAYER BAR */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0c0c0c] z-[100] border-t border-gray-100 dark:border-white/5 transition-all duration-300 ${isExpanded ? 'h-full md:h-[85px]' : 'h-[75px] md:h-[85px]'}`}>
        
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-200 dark:bg-white/10">
          <div className="h-full bg-[#ff6600] w-[45%]" />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 h-full flex items-center relative">
          
          {/* ESQUERDA: FOTO E INFO */}
          <div className="flex items-center space-x-3 w-[300px] z-10">
            <div className="relative flex-shrink-0">
              <img src={currentProgram.image} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-transparent shadow-lg" alt="" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0c0c0c]">
                <span className="text-[10px] font-bold text-white">1</span>
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="text-[14px] md:text-[15px] font-extrabold text-black dark:text-white truncate uppercase tracking-tighter leading-tight">{currentProgram.title}</h4>
              <p className="text-[12px] md:text-[13px] text-gray-500 font-medium truncate">{currentProgram.host}</p>
            </div>
          </div>

          {/* MEIO: CONTROLES CENTRALIZADOS */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center space-x-8 md:space-x-12 pointer-events-auto">
              <button className="hidden lg:flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity">
                <RotateCcw className="w-5 h-5" />
                <span className="text-[9px] font-black uppercase mt-1">Start</span>
              </button>

              <button className="text-gray-400 hover:text-black dark:hover:text-white relative">
                <SkipBack className="w-8 h-8 md:w-7 md:h-7" strokeWidth={1.5} />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-[8px] font-bold mt-1">20</span>
              </button>

              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 md:w-14 md:h-14 rounded-full border-2 border-black dark:border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
              </button>

              <button className="text-gray-400 hover:text-black dark:hover:text-white relative">
                <SkipForward className="w-8 h-8 md:w-7 md:h-7" strokeWidth={1.5} />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-[8px] font-bold mt-1">20</span>
              </button>
            </div>
          </div>

          {/* DIREITA: VOLUME SVG E QUEUE */}
          <div className="ml-auto flex items-center space-x-6 z-10">
            <div className="flex items-center space-x-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                <path d="M11 5L6 9H2V15H6L11 19V5Z" />
                <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12" />
              </svg>
              <input 
                type="range" min="0" max="100" value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20 h-1 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff6600]" 
              />
              <span className="text-xs font-black text-gray-400">1×</span>
            </div>

            <button 
              onClick={() => setShowQueuePC(!showQueuePC)}
              className={`p-2 rounded-full hidden md:block transition-all ${showQueuePC ? 'bg-[#ff6600] text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
            >
              <ListMusic className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </>
  );
}