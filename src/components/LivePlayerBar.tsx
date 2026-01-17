import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, SkipBack, SkipForward, ListMusic, ChevronUp, ChevronDown, X } from 'lucide-react';

interface Program {
  title: string;
  time: string;
  image: string;
}

export default function LivePlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isExpanded, setIsExpanded] = useState(false); // Estado para abrir no Smartphone

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
    <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0c0c0c] z-[100] transition-all duration-500 ease-in-out border-t border-gray-100 dark:border-white/5 ${
      isExpanded ? 'h-full md:h-[85px]' : 'h-[72px] md:h-[85px]'
    }`}>
      
      {/* BARRA DE PROGRESSO (Sempre no topo) */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-200 dark:bg-white/10">
        <div className="h-full bg-[#ff6600] w-[45%] transition-all" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 h-full flex flex-col md:flex-row md:items-center justify-between">
        
        {/* CABEÇALHO DO PLAYER (Visível sempre, clique expande no mobile) */}
        <div 
          className="flex items-center justify-between w-full md:w-auto py-3 md:py-0 cursor-pointer md:cursor-default"
          onClick={() => window.innerWidth < 768 && setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-3 min-w-0">
            <img src={currentProgram.image} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover shadow-lg" alt="Program" />
            <div className="min-w-0">
              <h4 className="text-[14px] md:text-[15px] font-extrabold text-black dark:text-white truncate">{currentProgram.title}</h4>
              <p className="text-[12px] md:text-[13px] text-gray-500 font-medium">Praise FM USA</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 md:hidden">
            {!isExpanded && (
              <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}>
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
            )}
            {isExpanded ? <ChevronDown className="w-6 h-6" /> : <ChevronUp className="w-6 h-6 text-gray-400" />}
          </div>
        </div>

        {/* CONTEÚDO EXPANSÍVEL (Smartphone Full Menu / Desktop Normal) */}
        <div className={`${isExpanded ? 'flex' : 'hidden md:flex'} flex-col md:flex-row flex-1 items-center justify-between w-full animate-in fade-in slide-in-from-bottom-10 md:animate-none`}>
          
          {/* LISTA DE PRÓXIMOS PROGRAMAS (Estilo BBC Smartphone) */}
          <div className="w-full md:hidden mt-4 mb-8 bg-gray-50 dark:bg-white/5 rounded-2xl p-4">
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-gray-400">Schedule</h3>
            <div className="space-y-4">
              {nextPrograms.map((prog, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <img src={prog.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                  <div className="flex-1 border-b border-gray-200 dark:border-white/5 pb-2">
                    <p className="text-sm font-bold">{prog.title}</p>
                    <p className="text-[11px] text-gray-500">{prog.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CONTROLES DE ÁUDIO (Centralizados) */}
          <div className="flex flex-col items-center space-y-8 md:space-y-0 w-full md:w-auto">
            <div className="flex items-center space-x-8 md:space-x-10">
              <button className="flex flex-col items-center group md:hidden lg:flex">
                <RotateCcw className="w-6 h-6 md:w-5 md:h-5 text-gray-400" />
                <span className="text-[9px] font-black uppercase mt-1">Start</span>
              </button>

              <button className="relative group">
                <SkipBack className="w-8 h-8 md:w-7 md:h-7 text-gray-400" strokeWidth={1.5} />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-[8px] font-bold mt-1">20</span>
              </button>

              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 md:w-14 md:h-14 rounded-full border-2 border-black dark:border-white flex items-center justify-center"
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </button>

              <button className="relative group">
                <SkipForward className="w-8 h-8 md:w-7 md:h-7 text-gray-400" strokeWidth={1.5} />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-[8px] font-bold mt-1">20</span>
              </button>
            </div>

            {/* VOLUME E EXTRAS (Apenas visível no Expanded Mobile ou Desktop) */}
            <div className="flex items-center justify-between w-full md:hidden px-4 pb-10 mt-auto">
                <Volume2 className="w-6 h-6 text-gray-400" />
                <input 
                  type="range" 
                  className="flex-1 mx-4 accent-[#ff6600]"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                />
                <span className="text-sm font-bold text-gray-400">1×</span>
            </div>
          </div>

          {/* DESKTOP VOLUME (Invisível no Mobile) */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <input type="range" className="w-20 accent-[#ff6600]" value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
            </div>
            <button className="p-2 text-gray-500 hover:text-black dark:hover:text-white"><ListMusic className="w-5 h-5" /></button>
          </div>
        </div>

      </div>
    </div>
  );
}