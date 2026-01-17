import React from 'react';
import { Play, Pause, Volume2, ListMusic, RotateCcw, RotateCw } from 'lucide-react';

export default function LivePlayerBar({ isVisible, isPlaying, onTogglePlayback, program }) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0c0c0c] border-t border-white/10 z-[1000] h-[90px] flex flex-col">
      {/* Barra de Progresso - Laranja BBC */}
      <div className="h-1 bg-gray-800 w-full relative">
        <div className="absolute top-0 left-0 h-full bg-praise-orange w-[45%]" />
        <div className="absolute top-[-4px] left-[45%] w-3 h-3 bg-praise-orange rounded-full" />
      </div>

      <div className="flex items-center justify-between px-4 md:px-8 h-full">
        {/* Info Radio 1 Style */}
        <div className="flex items-center gap-4 w-1/3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-praise-orange flex-shrink-0">
             <img src={program?.image} className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block">
            <h4 className="font-black text-sm uppercase dark:text-white leading-tight">{program?.title}</h4>
            <p className="text-xs text-gray-500 italic">Radio 1 Dance</p>
          </div>
        </div>

        {/* Controles Centralizados - Foto MINIPLAYER.png */}
        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-white"><RotateCcw size={20} /></button>
          <button onClick={onTogglePlayback} className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center hover:scale-110 transition-transform">
            {isPlaying ? <Pause fill="white" /> : <Play fill="white" className="ml-1" />}
          </button>
          <button className="text-gray-400 hover:text-white"><RotateCw size={20} /></button>
        </div>

        {/* Volume e Schedule */}
        <div className="flex items-center gap-6 w-1/3 justify-end">
          <div className="hidden lg:flex items-center gap-3 group">
            <Volume2 size={20} className="text-gray-400" />
            <div className="w-24 h-1 bg-gray-800 rounded-full overflow-hidden">
               <div className="bg-praise-orange h-full w-[60%]" />
            </div>
          </div>
          <button className="text-gray-400 hover:text-praise-orange">
             <ListMusic size={24} />
          </button>
          <span className="text-[10px] bbc-title text-praise-orange animate-pulse">● LIVE</span>
        </div>
      </div>
    </div>
  );
}