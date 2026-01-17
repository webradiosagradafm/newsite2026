import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, ListMusic, ChevronUp, ChevronDown, X } from 'lucide-react';

// Dados baseados no seu arquivo de programação 
const SCHEDULE = [
  { start: 0, end: 6, title: "Midnight Grace", host: "Daniel Brooks", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop" },
  { start: 6, end: 7, title: "Praise FM Worship", host: "Morning Adoration", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop" },
  { start: 7, end: 12, title: "Morning Show", host: "Stancy Cambpell", image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=200&h=200&fit=crop" },
  { start: 12, end: 13, title: "Praise FM Worship", host: "Noon Praise", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop" },
  { start: 13, end: 16, title: "Midday Grace", host: "Michael Ray", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=200&h=200&fit=crop" },
  { start: 16, end: 17, title: "Praise FM Non Stop", host: "Continuous Music", image: "https://images.unsplash.com/photo-1444464666168-49d633b867ad?w=200&h=200&fit=crop" },
];

export default function LivePlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQueuePC, setShowQueuePC] = useState(false);
  const [currentTimeChicago, setCurrentTimeChicago] = useState(new Date());

  // Atualiza o relógio no fuso de Chicago [cite: 1]
  useEffect(() => {
    const timer = setInterval(() => {
      const chicagoTime = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Chicago"}));
      setCurrentTimeChicago(chicagoTime);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = currentTimeChicago.getHours();
  
  // Encontra o programa atual e os próximos 4 
  const currentProgram = SCHEDULE.find(p => currentHour >= p.start && currentHour < p.end) || SCHEDULE[0];
  const nextPrograms = SCHEDULE.filter(p => p.start > currentHour).slice(0, 4);

  // Formatação AM/PM para o design BBC
  const formatAMPM = (hour: number) => {
    const ampm = hour >= 12 ? 'pm' : 'am';
    const h = hour % 12 || 12;
    return `${h}:00${ampm}`;
  };

  return (
    <>
      {/* QUEUE PARA PC */}
      {showQueuePC && (
        <div className="hidden md:block fixed bottom-[95px] right-6 w-[380px] bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl z-[101] animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-black dark:text-white uppercase tracking-tighter">Schedule</h3>
            <button onClick={() => setShowQueuePC(false)}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="p-2">
            {nextPrograms.map((prog, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors group">
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

      {/* MINI PLAYER PRINCIPAL */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0c0c0c] z-[100] transition-all duration-500 border-t border-gray-100 dark:border-white/5 ${
        isExpanded ? 'h-full md:h-[85px]' : 'h-[72px] md:h-[85px]'
      }`}>
        
        {/* Barra de Progresso Laranja no Topo */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-200 dark:bg-white/10">
          <div className="h-full bg-[#ff6600] w-[45%] relative transition-all" />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-between relative">
          
          {/* LADO ESQUERDO: Foto do Programa e Título */}
          <div 
            className="flex items-center justify-between w-full md:w-1/4 py-3 md:py-0 cursor-pointer md:cursor-default"
            onClick={() => window.innerWidth < 768 && setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="relative flex-shrink-0">
                <img src={currentProgram.image} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-transparent" alt="" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0c0c0c]">
                  <span className="text-[10px] font-bold text-white">1</span>
                </div>
              </div>
              <div className="min-w-0">
                <h4 className="text-[14px] md:text-[15px] font-extrabold text-black dark:text-white truncate uppercase tracking-tight">{currentProgram.title}</h4>
                <p className="text-[12px] md:text-[13px] text-gray-500 font-medium truncate">{currentProgram.host}</p>
              </div>
            </div>
            <div className="md:hidden">
               {isExpanded ? <ChevronDown /> : <ChevronUp className="text-gray-400" />}
            </div>
          </div>

          {/* MEIO: Play Distribuído */}
          <div className={`${isExpanded ? 'flex' : 'hidden md:flex'} flex-col md:flex-row flex-1 items-center justify-center w-full`}>
            
            {/* Agenda no Mobile */}
            <div className="w-full md:hidden mb-8 bg-gray-50 dark:bg-white/5 rounded-2xl p-4 mt-6">
               <h3 className="text-xs font-black text-gray-400 uppercase mb-4 tracking-widest">Next Programs</h3>
               {nextPrograms.map((prog, i) => (
                 <div key={i} className="flex items-center space-x-4 mb-4 last:mb-0">
                   <img src={prog.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                   <div className="flex-1 border-b border-gray-100 dark:border-white/5 pb-2">
                     <p className="text-sm font-bold">{prog.title}</p>
                     <p className="text-[11px] text-gray-500">{formatAMPM(prog.start)} - {formatAMPM(prog.end)}</p>
                   </div>
                 </div>
               ))}
            </div>

            <div className="flex items-center justify-center space-x-8 md:space-x-12">
              <button className="hidden lg:flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity">
                <RotateCcw className="w-5 h-5" />
                <span className="text-[9px] font-black uppercase mt-1">Start</span>
              </button>

              <button className="relative text-gray-400 hover:text-black dark:hover:text-white transition-all">
                <SkipBack className="w-8 h-8 md:w-7 md:h-7" strokeWidth={1.5} />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-[8px] font-bold mt-1">20</span>
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                className="w-16 h-16 md:w-14 md:h-14 rounded-full border-2 border-black dark:border-white flex items-center justify-center"
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
              </button>

              <button className="relative text-gray-400 hover:text-black dark:hover:text-white transition-all">
                <SkipForward className="w-8 h-8 md:w-7 md:h-7" strokeWidth={1.5} />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-[8px] font-bold mt-1">20</span>
              </button>
            </div>
          </div>

          {/* DIREITA: Volume SVG e Queue */}
          <div className={`${isExpanded ? 'flex' : 'hidden md:flex'} items-center justify-end md:w-1/4 space-x-6 w-full mt-12 md:mt-0 px-4`}>
            <div className="flex items-center space-x-3 flex-1 md:flex-none justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gray-400 group-hover:text-[#ff6600]">
                <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                type="range" min="0" max="100" value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full md:w-20 h-1 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff6600]" 
              />
              <span className="text-xs font-black text-gray-400">1×</span>
            </div>

            <button onClick={() => setShowQueuePC(!showQueuePC)} className={`p-2 rounded-full transition-all hidden md:block ${showQueuePC ? 'bg-[#ff6600] text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}>
              <ListMusic className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </>
  );
}