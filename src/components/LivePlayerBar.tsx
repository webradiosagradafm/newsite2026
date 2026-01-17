import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, ListMusic, X } from 'lucide-react';

interface PlayerBarProps {
  isVisible: boolean;
  isPlaying: boolean;
  onTogglePlayback: () => void;
  program: any;
  queue: any[];
  liveMetadata: any; // Adicionado para resolver o erro de tipos
}

export default function LivePlayerBar({ isVisible, isPlaying, onTogglePlayback, program, queue, liveMetadata }: PlayerBarProps) {
  const [showQueue, setShowQueue] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] animate-in slide-in-from-bottom-full duration-500 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
      
      {/* Lista de Próximos (Agenda) */}
      {showQueue && (
        <div className="absolute bottom-[85px] right-6 w-[320px] bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10 rounded-xl shadow-2xl">
          <div className="p-4 border-b dark:border-white/5 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff6600]">Next Shows</span>
            <button onClick={() => setShowQueue(false)}><X size={16} /></button>
          </div>
          <div className="p-2">
            {queue.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                <img src={item.image} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-[11px] font-black uppercase leading-tight dark:text-white">{item.title}</p>
                  <p className="text-[10px] text-gray-400 font-bold">{item.startTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Barra Principal */}
      <div className="h-[85px] bg-white dark:bg-[#0c0c0c] border-t border-gray-100 dark:border-white/5 flex items-center px-6 relative">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-100 dark:bg-white/10">
          <div className="h-full bg-[#ff6600] w-[45%]" />
        </div>

        {/* Daniel Brooks Foto à Esquerda */}
        <div className="flex items-center space-x-4 w-1/3 min-w-0">
          <div className="relative">
            <img src={program?.image} className="w-14 h-14 rounded-full object-cover border-2 border-transparent" alt="" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0c0c0c] text-[9px] font-black text-white leading-none">1</div>
          </div>
          <div className="min-w-0">
            <h4 className="text-[14px] font-black uppercase tracking-tighter dark:text-white truncate">{program?.title}</h4>
            <p className="text-[12px] text-gray-400 font-bold truncate">with {program?.host}</p>
          </div>
        </div>

        {/* Play/Pause Central */}
        <div className="flex-1 flex items-center justify-center space-x-10">
          <button className="text-gray-400"><SkipBack size={26} /></button>
          
          <button 
            onClick={onTogglePlayback}
            className="w-14 h-14 rounded-full border-2 border-black dark:border-white flex items-center justify-center text-black dark:text-white hover:scale-105 transition-all"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>

          <button className="text-gray-400"><SkipForward size={26} /></button>
        </div>

        {/* Volume/Queue à Direita */}
        <div className="w-1/3 flex items-center justify-end">
          <button 
            onClick={() => setShowQueue(!showQueue)}
            className={`p-2 rounded-full transition-colors ${showQueue ? 'bg-[#ff6600] text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
          >
            <ListMusic size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}