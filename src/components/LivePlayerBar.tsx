import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, ListMusic, X } from 'lucide-react';

export default function LivePlayerBar({ isVisible, isPlaying, onTogglePlayback, program, queue, liveMetadata }: any) {
  const [showQueue, setShowQueue] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] animate-in slide-in-from-bottom-full duration-500">
      
      {/* PAINEL SCHEDULE (LATERAL BBC) */}
      {showQueue && (
        <div className="absolute bottom-[90px] right-0 w-full md:w-[400px] h-[500px] bg-white dark:bg-[#0c0c0c] shadow-2xl border-l dark:border-white/10 flex flex-col">
          <div className="p-6 border-b dark:border-white/10 flex justify-between items-center">
            <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Schedule</h3>
            <button onClick={() => setShowQueue(false)} className="hover:rotate-90 transition-transform"><X /></button>
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {queue.map((item: any, i: number) => (
              <div key={i} className="flex space-x-4 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-all">
                <img src={item.image} className="w-20 h-20 object-cover" />
                <div>
                  <h4 className="font-black text-sm dark:text-white uppercase">{item.title}</h4>
                  <p className="text-xs text-[#ff6600] font-bold mb-1">{item.startTime}</p>
                  <p className="text-[11px] text-gray-500 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BARRA PRINCIPAL */}
      <div className="h-[90px] bg-white dark:bg-[#0c0c0c] border-t border-gray-100 dark:border-white/10 flex items-center px-4 md:px-8 relative">
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-gray-100 dark:bg-white/10">
          <div className="h-full bg-[#ff6600] w-[40%]" />
        </div>

        {/* LOGO PRAISE FM USA (Estilo Blocos BBC) */}
        <div className="hidden lg:flex items-center border-r dark:border-white/10 pr-8 mr-6">
           <div className="flex flex-col leading-none">
              <span className="text-xl font-black dark:text-white tracking-tighter">PRAISE</span>
              <span className="text-[10px] font-black bg-[#ff6600] text-white px-1 self-start mt-0.5">FM USA</span>
           </div>
        </div>

        {/* INFO ATUAL */}
        <div className="flex items-center space-x-4 min-w-0 flex-grow md:flex-grow-0 md:w-1/3">
          <img src={program?.image} className="w-14 h-14 rounded-full object-cover border-2 border-transparent shadow-lg" />
          <div className="min-w-0">
            <h4 className="text-[14px] font-black uppercase dark:text-white truncate tracking-tight">{program?.title}</h4>
            <p className="text-[12px] text-gray-500 font-bold truncate">with {program?.host}</p>
          </div>
        </div>

        {/* CONTROLES CENTRAIS */}
        <div className="flex-1 flex items-center justify-center space-x-8">
          <button className="text-gray-400 hover:text-black dark:hover:text-white"><SkipBack size={28} /></button>
          <button 
            onClick={onTogglePlayback}
            className="w-14 h-14 rounded-full border-2 border-black dark:border-white flex items-center justify-center text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-xl"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          <button className="text-gray-400 hover:text-black dark:hover:text-white"><SkipForward size={28} /></button>
        </div>

        {/* BOTÃO QUEUE (ÍCONE LARANJA QUANDO ATIVO) */}
        <div className="flex items-center justify-end w-1/3 space-x-4">
          <button 
            onClick={() => setShowQueue(!showQueue)}
            className={`p-2 transition-colors ${showQueue ? 'text-[#ff6600]' : 'text-gray-400'}`}
          >
            <ListMusic size={32} />
          </button>
        </div>
      </div>
    </div>
  );
}