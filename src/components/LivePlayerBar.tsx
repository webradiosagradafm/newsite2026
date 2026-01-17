import React from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, ListMusic } from 'lucide-react';

export default function LivePlayerBar({ isVisible, isPlaying, onTogglePlayback, program }: any) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-white dark:bg-[#0c0c0c] border-t border-white/10 h-[90px] shadow-2xl flex flex-col">
      {/* Barra de progresso igual à foto do Miniplayer */}
      <div className="h-[3px] bg-gray-800 w-full relative">
        <div className="absolute top-0 left-0 h-full bg-[#ff6600] w-[40%]" />
        <div className="absolute top-[-4px] left-[40%] w-3 h-3 bg-[#ff6600] rounded-full shadow-[0_0_10px_#ff6600]" />
      </div>

      <div className="flex items-center justify-between px-6 h-full">
        {/* Lado Esquerdo: Info */}
        <div className="flex items-center gap-4 w-1/3">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#ff6600] flex-shrink-0 shadow-lg">
            <img src={program?.image} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="hidden md:block overflow-hidden">
            <h4 className="font-black text-sm uppercase dark:text-white truncate tracking-tight">{program?.title}</h4>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest italic">Radio 1 Dance</p>
          </div>
        </div>

        {/* Centro: Controles foto MINIPLAYER.png */}
        <div className="flex items-center gap-8">
          <button className="text-gray-400 hover:text-white transition-colors"><RotateCcw size={22} /></button>
          <button 
            onClick={onTogglePlayback}
            className="w-14 h-14 rounded-full border-2 border-black dark:border-white flex items-center justify-center text-black dark:text-white hover:bg-white hover:text-black transition-all shadow-xl"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          <button className="text-gray-400 hover:text-white transition-colors"><RotateCw size={22} /></button>
        </div>

        {/* Lado Direito: Utils */}
        <div className="flex items-center justify-end gap-6 w-1/3">
          <div className="hidden lg:flex items-center gap-3">
            <Volume2 size={20} className="text-gray-400" />
            <div className="w-20 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="bg-[#ff6600] h-full w-[70%]" />
            </div>
          </div>
          <button className="text-gray-400 hover:text-[#ff6600] transition-colors">
            <ListMusic size={24} />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#ff6600] rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase text-[#ff6600] tracking-widest">LIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}