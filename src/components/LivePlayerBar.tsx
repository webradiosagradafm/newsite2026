import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, ListMusic, X } from 'lucide-react';

interface PlayerBarProps {
  isVisible: boolean;
  isPlaying: boolean;
  onTogglePlayback: () => void;
  program: any;
  queue: any[];
  liveMetadata: any;
}

export default function LivePlayerBar({ isVisible, isPlaying, onTogglePlayback, program, queue, liveMetadata }: PlayerBarProps) {
  const [showQueue, setShowQueue] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] animate-in slide-in-from-bottom-full duration-500 shadow-[0_-15px_50px_rgba(0,0,0,0.3)]">
      
      {/* PAINEL UP NEXT (AGENDA) */}
      {showQueue && (
        <div className="absolute bottom-[90px] right-6 w-[350px] bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-4 border-b dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/5">
            <div>
              <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-[#ff6600]">Up Next</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase">On Praise FM USA</p>
            </div>
            <button onClick={() => setShowQueue(false)} className="hover:rotate-90 transition-transform p-1">
              <X size={18} />
            </button>
          </div>
          <div className="p-2 max-h-[350px] overflow-y-auto">
            {queue.map((item, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-all group">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <img src={item.image} className="w-full h-full rounded-md object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div className="absolute top-0 right-0 w-2 h-2 bg-[#ff6600] rounded-full animate-pulse" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-black uppercase leading-tight dark:text-white truncate">{item.title}</p>
                  <p className="text-[10px] text-gray-400 font-bold">{item.startTime} - {item.host}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BARRA DO PLAYER */}
      <div className="h-[90px] bg-white dark:bg-[#0c0c0c] border-t border-gray-100 dark:border-white/5 flex items-center px-4 md:px-8 relative">
        
        {/* Linha de Progresso BBC */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-100 dark:bg-white/10">
          <div className="h-full bg-[#ff6600] w-[60%] shadow-[0_0_10px_#ff6600]" />
        </div>

        {/* ESQUERDA: LOGO + FOTO DANIEL BROOKS */}
        <div className="flex items-center space-x-4 md:space-x-6 w-1/3 min-w-0">
          {/* Logo da Rádio Estilo BBC */}
          <div className="hidden lg:flex flex-col border-r border-gray-200 dark:border-white/10 pr-6 mr-2">
            <span className="text-[16px] font-black tracking-tighter dark:text-white leading-none">PRAISE</span>
            <span className="text-[10px] font-black bg-[#ff6600] text-white px-1 mt-0.5 self-start leading-none">FM USA</span>
          </div>

          <div className="flex items-center space-x-3 min-w-0">
            <div className="relative flex-shrink-0">
              <img src={program?.image} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-transparent" alt="" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0c0c0c]">
                <span className="text-[9px] font-black text-white">LIVE</span>
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="text-[13px] md:text-[14px] font-black uppercase tracking-tighter dark:text-white truncate">
                {liveMetadata?.title || program?.title}
              </h4>
              <p className="text-[11px] md:text-[12px] text-[#ff6600] font-bold truncate uppercase tracking-widest">
                {liveMetadata?.artist || program?.host}
              </p>
            </div>
          </div>
        </div>

        {/* CENTRO: CONTROLES */}
        <div className="flex-1 flex items-center justify-center space-x-6 md:space-x-12">
          <button className="text-gray-400 hover:text-black dark:hover:text-white transition-colors relative">
            <SkipBack size={24} />
            <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold mt-1">20</span>
          </button>
          
          <button 
            onClick={onTogglePlayback}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-black dark:border-white flex items-center justify-center text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
          >
            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
          </button>

          <button className="text-gray-400 hover:text-black dark:hover:text-white transition-colors relative">
            <SkipForward size={24} />
            <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold mt-1">20</span>
          </button>
        </div>

        {/* DIREITA: BOTÃO UP NEXT (LIST MUSIC) */}
        <div className="w-1/3 flex items-center justify-end">
          <button 
            onClick={() => setShowQueue(!showQueue)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all ${showQueue ? 'bg-[#ff6600] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}
          >
            <span className="hidden md:block text-[10px] font-black uppercase tracking-widest">Up Next</span>
            <ListMusic size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}