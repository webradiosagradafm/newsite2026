import React from 'react';
import { Play, Pause, ChevronRight } from 'lucide-react';

export default function Hero({ onListenClick, isPlaying, currentProgram, queue }: any) {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-10">
      {/* Layout igual a foto INICIO.png */}
      <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
        <div className="relative w-64 h-64 flex-shrink-0">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#ff6600] shadow-2xl">
            <img src={currentProgram?.image} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="absolute bottom-4 right-4 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center font-black border-4 border-white dark:border-black text-xl shadow-lg">1</div>
        </div>

        <div className="flex-grow text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-3 text-gray-400 font-bold uppercase tracking-tighter text-sm">
            <span className="text-[#ff6600]">● LIVE</span>
            <span>{currentProgram?.startTime} - {currentProgram?.endTime}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 dark:text-white flex items-center justify-center md:justify-start group cursor-pointer">
            {currentProgram?.title}
            <ChevronRight className="text-[#ff6600] w-12 h-12 ml-2 transition-transform group-hover:translate-x-2" />
          </h1>
          <p className="text-xl text-gray-400 mb-8 font-medium">with {currentProgram?.host}</p>
          
          <button 
            onClick={onListenClick}
            className="bg-[#ff6600] text-white px-12 py-4 rounded-sm font-black uppercase tracking-tight flex items-center gap-4 mx-auto md:mx-0 hover:brightness-110 active:scale-95 transition-all shadow-xl"
          >
            {isPlaying ? <Pause fill="white" size={28} /> : <Play fill="white" size={28} />}
            <span className="text-2xl">Play</span>
          </button>
        </div>
      </div>

      {/* Grid igual a foto UPNEXT.png */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-t border-white/10">
        {queue?.slice(0, 2).map((prog: any, i: number) => (
          <div key={i} className="flex gap-6 group cursor-pointer">
            <div className="w-28 h-28 flex-shrink-0 overflow-hidden rounded-sm bg-gray-900 shadow-lg">
              <img src={prog.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex gap-2 text-[11px] font-black uppercase tracking-widest mb-1">
                <span className="text-[#ff6600]">UP NEXT:</span>
                <span className="text-gray-400">{prog.startTime}</span>
              </div>
              <h3 className="text-xl font-black uppercase dark:text-white group-hover:text-[#ff6600] transition-colors">{prog.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1 italic">{prog.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}