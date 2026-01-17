import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, ListMusic, X, Volume2 } from 'lucide-react';

export default function LivePlayerBar({ isVisible, isPlaying, onTogglePlayback, program, queue, liveMetadata }: any) {
  const [showQueue, setShowQueue] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] animate-in slide-in-from-bottom-full duration-500">
      
      {/* PAINEL SCHEDULE LATERAL */}
      {showQueue && (
        <div className="absolute bottom-[90px] right-0 w-full md:w-[400px] h-[70vh] bg-white dark:bg-[#0c0c0c] shadow-2xl border-l dark:border-white/10 flex flex-col">
          <div className="p-6 border-b dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
            <h3 className="text-xl font-black dark:text-white uppercase">Schedule</h3>
            <button onClick={() => setShowQueue(false)}><X /></button>
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {queue.map((item: any, i: number) => (
              <div key={i} className="flex space-x-4 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-all group">
                <img src={item.image} className="w-16 h-16 object-cover rounded shadow-md group-hover:scale-105 transition-transform" />
                <div>
                  <h4 className="font-black text-[13px] dark:text-white uppercase leading-tight">{item.title}</h4>
                  <p className="text-[11px] text-[#ff6600] font-bold">{item.startTime} - {item.host}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BARRA PRINCIPAL */}
      <div className="h-[90px] bg-white dark:bg-[#121212] border-t border-gray-100 dark:border-white/10 flex items-center px-4 md:px-8 relative shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
        
        {/* Barra de Progresso Superior */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-200 dark:bg-white/10">
          <div className="h-full bg-[#ff6600] w-[35%] shadow-[0_0_15px_#ff6600]" />
        </div>

        {/* Lado Esquerdo: Logo + Foto */}
        <div className="flex items-center space-x-6 w-1/3">
          <div className="hidden lg:flex flex-col leading-none border-r dark:border-white/10 pr-6">
            <span className="text-lg font-black dark:text-white tracking-tighter">PRAISE</span>
            <span className="text-[9px] font-black bg-[#ff6600] text-white px-1 mt-0.5 self-start">FM USA</span>
          </div>

          <div className="flex items-center space-x-3 min-w-0">
            <div className="relative flex-shrink-0">
              <img src={program?.image} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-[#ff6600]" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full animate-pulse border-2 border-white dark:border-[#121212]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[13px] font-black uppercase dark:text-white truncate tracking-tight">
                {liveMetadata?.title || program?.title}
              </h4>
              <p className="text-[11px] text-gray-500 font-bold truncate">with {program?.host}</p>
            </div>
          </div>
        </div>

        {/* Centro: Controles */}
        <div className="flex-1 flex items-center justify-center space-x-10">
          <button className="text-gray-400 hover:text-[#ff6600] transition-colors"><SkipBack size={26} /></button>
          <button 
            onClick={onTogglePlayback}
            className="w-14 h-14 rounded-full border-2 border-black dark:border-white flex items-center justify-center text-black dark:text-white hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          <button className="text-gray-400 hover:text-[#ff6600] transition-colors"><SkipForward size={26} /></button>
        </div>

        {/* Lado Direito: Schedule Button */}
        <div className="w-1/3 flex items-center justify-end">
           <button 
            onClick={() => setShowQueue(!showQueue)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${showQueue ? 'bg-[#ff6600] text-white' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
          >
            <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Schedule</span>
            <ListMusic size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}