import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, ListMusic, X } from 'lucide-react';

interface PlayerBarProps {
  isVisible: boolean;
  isPlaying: boolean;
  onTogglePlayback: () => void;
  program: any;
  queue: any[];
}

export default function LivePlayerBar({ isVisible, isPlaying, onTogglePlayback, program, queue }: PlayerBarProps) {
  const [showQueue, setShowQueue] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] animate-in slide-in-from-bottom-full duration-500">
      
      {/* PAINEL DE AGENDA (Abre acima da barra) */}
      {showQueue && (
        <div className="absolute bottom-[90px] right-6 w-[350px] bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10 rounded-xl shadow-2xl">
          <div className="p-4 border-b dark:border-white/5 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Next on Praise FM</span>
            <button onClick={() => setShowQueue(false)}><X size={16} /></button>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2">
            {queue.map((item, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg">
                <img src={item.image} className="w-10 h-10 rounded-md object-cover" alt="" />
                <div>
                  <p className="text-[12px] font-black uppercase leading-tight dark:text-white">{item.title}</p>
                  <p className="text-[10px] text-gray-400 font-bold">{item.startTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BARRA PRINCIPAL */}
      <div className="h-[85px] bg-white dark:bg-[#0c0c0c] border-t border-gray-100 dark:border-white/5 flex items-center px-6 relative">
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gray-100 dark:bg-white/10 overflow-hidden">
          <div className="h-full bg-[#ff6600] w-[45%] animate-pulse" />
        </div>

        {/* Info do Programa (Daniel Brooks Foto) */}
        <div className="flex items-center space-x-4 w-1/3 min-w-0">
          <div className="relative flex-shrink-0">
            <img src={program?.image} className="w-14 h-14 rounded-full object-cover border-2 border-transparent" alt="" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0c0c0c] text-[10px] font-black text-white">1</div>
          </div>
          <div className="min-w-0">
            <h4 className="text-[14px] font-black uppercase tracking-tighter dark:text-white truncate leading-tight">{program?.title}</h4>
            <p className="text-[12px] text-gray-400 font-bold truncate">with {program?.host}</p>
          </div>
        </div>

        {/* Controles Centralizados */}
        <div className="flex-1 flex items-center justify-center space-x-8">
          <button className="text-gray-400 relative">
            <SkipBack size={26} /><span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold mt-1">20</span>
          </button>
          
          <button 
            onClick={onTogglePlayback}
            className="w-14 h-14 rounded-full border-2 border-black dark:border-white flex items-center justify-center text-black dark:text-white hover:scale-105 transition-all"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>

          <button className="text-gray-400 relative">
            <SkipForward size={26} /><span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold mt-1">20</span>
          </button>
        </div>

        {/* Lado Direito */}
        <div className="w-1/3 flex items-center justify-end space-x-4">
          <button 
            onClick={() => setShowQueue(!showQueue)}
            className={`p-2 rounded-full ${showQueue ? 'bg-[#ff6600] text-white' : 'text-gray-400'}`}
          >
            <ListMusic size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}