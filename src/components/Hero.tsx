import React from 'react';
import { Play, Pause, ChevronRight } from 'lucide-react';

export default function Hero({ onListenClick, isPlaying, currentProgram, queue }) {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-12">
      {/* SEÇÃO PRINCIPAL - FOTO INICIO.png */}
      <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
        <div className="relative w-64 h-64 flex-shrink-0">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-praise-orange">
            <img src={currentProgram?.image} className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-4 right-4 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center font-black border-4 border-white dark:border-black text-xl">1</div>
        </div>
        
        <div className="text-center md:text-left flex-grow">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="bg-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest">Live</span>
            <span className="text-gray-400 font-bold text-sm">{currentProgram?.startTime} - {currentProgram?.endTime}</span>
          </div>
          <h1 className="text-5xl md:text-7xl bbc-title mb-4 flex items-center justify-center md:justify-start group cursor-pointer">
            {currentProgram?.title} <ChevronRight className="text-praise-orange w-12 h-12 transition-transform group-hover:translate-x-2" />
          </h1>
          <p className="text-xl text-gray-500 mb-8 italic">with {currentProgram?.host}</p>
          <button onClick={onListenClick} className="bg-praise-orange text-white px-12 py-4 bbc-title flex items-center gap-4 mx-auto md:mx-0 hover:brightness-110 transition-all">
            {isPlaying ? <Pause fill="white" size={32} /> : <Play fill="white" size={32} />} Play
          </button>
        </div>
      </div>

      {/* SEÇÃO UP NEXT - FOTO UPNEXT.png */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-t border-white/10">
        {queue?.slice(0, 2).map((prog, i) => (
          <div key={i} className="flex gap-6 items-start group cursor-pointer">
            <img src={prog.image} className="w-24 h-24 object-cover rounded shadow-lg" />
            <div>
              <div className="flex gap-2 text-[11px] bbc-title mb-1">
                <span className="text-praise-orange">UP NEXT:</span>
                <span className="text-gray-400">{prog.startTime} - {prog.endTime}</span>
              </div>
              <h3 className="text-xl font-black uppercase dark:text-white group-hover:underline">{prog.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1 italic">{prog.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}