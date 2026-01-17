import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, SkipBack, SkipForward, ListMusic, ChevronUp, X } from 'lucide-react';

// Interface para facilitar a manutenção da programação
interface Program {
  title: string;
  time: string;
  image: string;
}

export default function LivePlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70); // 1. Volume Funcional
  const [showQueue, setShowQueue] = useState(false);
  
  // 2. Foto dinâmica do programa (Exemplo vindo do Midnight Grace)
  const currentProgram = {
    title: "Midnight Grace",
    host: "Daniel Brooks",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop"
  };

  // 3. Queue com apenas 4 programas seguintes (Design BBC)
  const nextPrograms: Program[] = [
    { title: "Praise FM Worship", time: "06:00 - 07:00", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop" },
    { title: "Morning Show", time: "07:00 - 12:00", image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=100&h=100&fit=crop" },
    { title: "Gospel Hits", time: "12:00 - 14:00", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=100&h=100&fit=crop" },
    { title: "Evening Prayer", time: "18:00 - 20:00", image: "https://images.unsplash.com/photo-1444464666168-49d633b867ad?w=100&h=100&fit=crop" },
  ];

  return (
    <>
      {/* PAINEL DE QUEUE (Aparece ao clicar no ícone de lista) */}
      {showQueue && (
        <div className="fixed bottom-[85px] right-4 w-[350px] bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10 rounded-t-2xl shadow-2xl z-[101] animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-black dark:text-white tracking-tight">Schedule</h3>
            <button onClick={() => setShowQueue(false)}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="p-2">
            {nextPrograms.map((prog, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer group">
                <img src={prog.image} className="w-12 h-12 rounded-lg object-cover" alt={prog.title} />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-black dark:text-white truncate tracking-tight">{prog.title}</p>
                  <p className="text-[11px] text-gray-500 font-medium">{prog.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0c0c0c] border-t border-gray-100 dark:border-white/5 z-[100] transition-all h-[85px]">
        {/* Barra de Progresso BBC */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-200 dark:bg-white/10">
          <div className="h-full bg-[#ff6600] w-[45%]" />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 h-full flex items-center justify-between gap-4">
          
          {/* LADO ESQUERDO: Ícone Redondo (Foto do Programa) */}
          <div className="flex items-center space-x-3 min-w-0 flex-1 md:flex-none">
            <div className="relative flex-shrink-0">
              <img 
                src={currentProgram.image} 
                alt={currentProgram.title} 
                className="w-14 h-14 rounded-full object-cover border-2 border-transparent hover:border-[#ff6600] transition-all cursor-pointer shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0c0c0c]">
                <span className="text-[10px] font-bold text-white uppercase">1</span>
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="text-[15px] font-extrabold text-black dark:text-white truncate tracking-tight leading-tight">
                {currentProgram.title}
              </h4>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 truncate font-medium">
                {currentProgram.host}
              </p>
            </div>
          </div>

          {/* CENTRO: Controles BBC */}
          <div className="flex items-center space-x-4 md:space-x-10 flex-1 justify-center">
            <button className="hidden md:flex flex-col items-center group opacity-50 hover:opacity-100 transition-opacity">
              <RotateCcw className="w-5 h-5 text-gray-500" />
              <span className="text-[9px] font-black uppercase mt-1 tracking-tighter">Start</span>
            </button>

            <button className="text-gray-400 hover:text-black dark:hover:text-white transition-all relative group">
              <SkipBack className="w-7 h-7" strokeWidth={1.5} />
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold mt-1">20</span>
            </button>

            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 rounded-full border-2 border-black dark:border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause className="fill-black dark:fill-white" /> : <Play className="fill-black dark:fill-white ml-1" />}
            </button>

            <button className="text-gray-400 hover:text-black dark:hover:text-white transition-all relative">
              <SkipForward className="w-7 h-7" strokeWidth={1.5} />
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold mt-1">20</span>
            </button>
          </div>

          {/* DIREITA: Volume Funcional e Ícone de Queue */}
          <div className="hidden md:flex items-center justify-end space-x-6 flex-1 md:flex-none">
            <div className="flex items-center space-x-3 group">
              <Volume2 className="w-5 h-5 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
              {/* INPUT DE VOLUME REAL */}
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume} 
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20 h-1 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff6600]"
              />
            </div>
            
            <button className="text-sm font-black text-gray-500 hover:text-black dark:hover:text-white transition-colors">1×</button>

            <button 
              onClick={() => setShowQueue(!showQueue)}
              className={`p-2 rounded-full transition-colors ${showQueue ? 'bg-[#ff6600]/10 text-[#ff6600]' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'}`}
            >
              <ListMusic className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </>
  );
}