import React, { useState } from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, ListMusic, ChevronUp, ChevronDown, X } from 'lucide-react';

interface Program {
  title: string;
  time: string;
  image: string;
}

export default function LivePlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isExpanded, setIsExpanded] = useState(false); // Para Mobile
  const [showQueuePC, setShowQueuePC] = useState(false); // Para PC

  const currentProgram = {
    title: "Midnight Grace",
    host: "Daniel Brooks",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop"
  };

  const nextPrograms: Program[] = [
    { title: "Praise FM Worship", time: "06:00 - 07:00", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop" },
    { title: "Morning Show", time: "07:00 - 12:00", image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=100&h=100&fit=crop" },
    { title: "Gospel Hits", time: "12:00 - 14:00", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=100&h=100&fit=crop" },
    { title: "Evening Prayer", time: "18:00 - 20:00", image: "https://images.unsplash.com/photo-1444464666168-49d633b867ad?w=100&h=100&fit=crop" },
  ];

  return (
    <>
      {/* 1. QUEUE PARA PC (Painel Suspenso) */}
      {showQueuePC && (
        <div className="hidden md:block fixed bottom-[95px] right-6 w-[380px] bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl z-[101] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-black dark:text-white uppercase tracking-tighter">Schedule</h3>
            <button onClick={() => setShowQueuePC(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="max-h-[400px] overflow-y-auto p-2">
            {nextPrograms.map((prog, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer group">
                <img src={prog.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-black dark:text-white truncate">{prog.title}</p>
                  <p className="text-[11px] text-gray-500 font-medium">{prog.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. PLAYER BAR PRINCIPAL */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0c0c0c] z-[100] transition-all duration-500 ease-in-out border-t border-gray-100 dark:border-white/5 ${
        isExpanded ? 'h-full md:h-[85px]' : 'h-[72px] md:h-[85px]'
      }`}>
        
        {/* Barra de Progresso BBC */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-200 dark:bg-white/10">
          <div className="h-full bg-[#ff6600] w-[45%] relative">
             <div className="absolute right-[-6px] top-[-4px] w-3 h-3 bg-[#ff6600] rounded-full hidden md:block" />
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-between relative">
          
          {/* INFO ARTISTA (Esquerda) */}
          <div 
            className="flex items-center justify-between w-full md:w-1/4 py-3 md:py-0 cursor-pointer md:cursor-default"
            onClick={() => window.innerWidth < 768 && setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="relative flex-shrink-0">
                <img src={currentProgram.image} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover shadow-lg" alt="" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0c0c0c]">
                  <span className="text-[10px] font-bold text-white">1</span>
                </div>
              </div>
              <div className="min-w-0">
                <h4 className="text-[14px] md:text-[15px] font-extrabold text-black dark:text-white truncate tracking-tight">{currentProgram.title}</h4>
                <p className="text-[12px] md:text-[13px] text-gray-500 font-medium truncate">Praise FM USA</p>
              </div>
            </div>
            <div className="md:hidden">
               {isExpanded ? <ChevronDown /> : <ChevronUp className="text-gray-400" />}
            </div>
          </div>

          {/* CONTROLES DISTRIBUÍDOS (Meio) */}
          <div className={`${isExpanded ? 'flex' : 'hidden md:flex'} flex-col md:flex-row flex-1 items-center justify-center w-full`}>
            
            {/* Agenda Integrada no Mobile */}
            <div className="w-full md:hidden mb-8 bg-gray-50 dark:bg-white/5 rounded-2xl p-4 mt-4">
               {nextPrograms.map((prog, i) => (
                 <div key={i} className="flex items-center space-x-4 mb-4 last:mb-0">
                   <img src={prog.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                   <div className="flex-1 border-b border-gray-100 dark:border-white/5 pb-2">
                     <p className="text-sm font-bold">{prog.title}</p>
                     <p className="text-[11px] text-gray-500">{prog.time}</p>
                   </div>
                 </div>
               ))}
            </div>

            {/* Play/Pause e Skips */}
            <div className="flex items-center justify-center space-x-8 md:space-x-12">
              <button className="flex flex-col items-center group opacity-50 hover:opacity-100 transition-opacity hidden lg:flex">
                <RotateCcw className="w-5 h-5" />
                <span className="text-[9px] font-black uppercase mt-1">Start</span>
              </button>

              <button className="relative group text-gray-400 hover:text-black dark:hover:text-white transition-all">
                <SkipBack className="w-8 h-8 md:w-7 md:h-7" strokeWidth={1.5} />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-[8px] font-bold mt-1">20</span>
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                className="w-16 h-16 md:w-14 md:h-14 rounded-full border-2 border-black dark:border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
              </button>

              <button className="relative group text-gray-400 hover:text-black dark:hover:text-white transition-all">
                <SkipForward className="w-8 h-8 md:w-7 md:h-7" strokeWidth={1.5} />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-[8px] font-bold mt-1">20</span>
              </button>
            </div>
          </div>

          {/* VOLUME SVG E QUEUE (Direita) */}
          <div className={`${isExpanded ? 'flex' : 'hidden md:flex'} items-center justify-end md:w-1/4 space-x-6 w-full mt-10 md:mt-0`}>
            <div className="flex items-center space-x-3 flex-1 md:flex-none justify-center">
              {/* ÍCONE VOLUME SVG CUSTOMIZADO */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.54 8.46C16.4771 9.39764 17.004 10.6692 17.004 12C17.004 13.3308 16.4771 14.6024 15.54 15.54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
              <input 
                type="range" 
                min="0" max="100" 
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full md:w-20 h-1 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff6600]" 
              />
              <span className="text-xs font-black text-gray-400">1×</span>
            </div>

            <button 
              onClick={() => setShowQueuePC(!showQueuePC)}
              className={`p-2 rounded-full transition-all hidden md:block ${showQueuePC ? 'bg-[#ff6600] text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
            >
              <ListMusic className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </>
  );
}