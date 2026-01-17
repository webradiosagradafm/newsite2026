import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, SkipBack, SkipForward, ListMusic, ChevronUp } from 'lucide-react';

export default function LivePlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress] = useState(35); // Exemplo de progresso da transmissão

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0c0c0c] border-t border-gray-100 dark:border-white/5 z-[100] transition-all duration-300 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      
      {/* 1. Barra de Progresso no Topo (Design BBC) */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-200 dark:bg-white/10 cursor-pointer group">
        <div 
          className="h-full bg-[#ff6600] relative transition-all duration-300" 
          style={{ width: `${progress}%` }}
        >
          {/* O marcador (dot) que aparece na BBC */}
          <div className="absolute right-[-6px] top-[-4px] w-3 h-3 bg-[#ff6600] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 h-[72px] md:h-[85px] flex items-center justify-between gap-4">
        
        {/* 2. Info da Rádio (Lado Esquerdo) */}
        <div className="flex items-center space-x-3 min-w-0 flex-1 md:flex-none">
          <div className="relative flex-shrink-0">
            <img 
              src="https://res.cloudinary.com/dtecypmsh/image/upload/v1766869698/SVGUSA_lduiui.webp" 
              alt="Live" 
              className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border border-gray-100 dark:border-white/10"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0c0c0c]">
              <span className="text-[10px] font-bold text-white">1</span>
            </div>
          </div>
          <div className="min-w-0">
            <h4 className="text-[15px] font-bold text-black dark:text-white truncate leading-tight">
              Praise FM USA
            </h4>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 truncate">
              Midnight Grace with Daniel Brooks
            </p>
          </div>
          {/* Badge LIVE estilo BBC */}
          <div className="hidden lg:flex items-center space-x-1 ml-4 text-[#00b2b2] font-bold text-[11px] uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00b2b2] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00b2b2]"></span>
            </span>
            <span>Live</span>
          </div>
        </div>

        {/* 3. Controles Centrais (Design da Imagem) */}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="flex items-center space-x-4 md:space-x-10">
            {/* Start Over */}
            <button className="hidden md:flex flex-col items-center group transition-colors">
              <RotateCcw className="w-5 h-5 text-gray-400 group-hover:text-black dark:group-hover:text-white" />
              <span className="text-[9px] font-black uppercase mt-1 tracking-tighter">Start</span>
            </button>

            {/* Back 20s */}
            <button className="text-gray-400 hover:text-black dark:hover:text-white transition-all relative group">
              <SkipBack className="w-7 h-7" strokeWidth={1.5} />
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold mt-1 group-hover:scale-110">20</span>
            </button>

            {/* PLAY / PAUSE (Círculo Vazado da BBC) */}
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-black dark:border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-black dark:fill-white text-black dark:text-white" />
              ) : (
                <Play className="w-6 h-6 fill-black dark:fill-white text-black dark:text-white ml-1" />
              )}
            </button>

            {/* Forward 20s */}
            <button className="text-gray-400 hover:text-black dark:hover:text-white transition-all relative group">
              <SkipForward className="w-7 h-7" strokeWidth={1.5} />
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold mt-1 group-hover:scale-110">20</span>
            </button>

            {/* Live Toggle */}
            <button className="hidden md:flex flex-col items-center opacity-30 cursor-not-allowed">
              <SkipForward className="w-5 h-5" />
              <span className="text-[9px] font-black uppercase mt-1 tracking-tighter">Live</span>
            </button>
          </div>
        </div>

        {/* 4. Volume e Extras (Lado Direito) */}
        <div className="hidden md:flex items-center justify-end space-x-6 flex-1 md:flex-none">
          <div className="flex items-center space-x-2 group">
            <Volume2 className="w-5 h-5 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
            <div className="w-20 h-[3px] bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div className="w-[70%] h-full bg-gray-600 dark:bg-gray-400"></div>
            </div>
          </div>
          
          <button className="text-sm font-black text-gray-500 hover:text-black dark:hover:text-white">1×</button>

          <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
            <ListMusic className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Botão Mobile para abrir detalhes */}
        <div className="md:hidden flex items-center">
            <ChevronUp className="w-6 h-6 text-gray-400 animate-bounce" />
        </div>

      </div>
    </div>
  );
}