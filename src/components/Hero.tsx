import React from 'react';
import { Play, Pause, ChevronRight } from 'lucide-react';

export default function Hero({ onListenClick, isPlaying, currentProgram, queue }: any) {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
        <div className="relative w-56 h-56 flex-shrink-0">
          <img src={currentProgram?.image} className="w-full h-full rounded-full object-cover border-4 border-praise-accent" />
          <div className="absolute bottom-2 right-2 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 border-white">1</div>
        </div>
        <div className="text-center md:text-left">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{currentProgram?.startTime} - {currentProgram?.endTime}</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter my-2 flex items-center justify-center md:justify-start">
            {currentProgram?.title} <ChevronRight className="text-praise-accent w-12 h-12" />
          </h1>
          <p className="text-xl text-gray-500 mb-6 italic font-medium">with {currentProgram?.host}</p>
          <button onClick={onListenClick} className="bg-praise-accent text-white px-10 py-4 font-black uppercase tracking-tight flex items-center gap-3 mx-auto md:mx-0 hover:scale-105 transition-transform">
            {isPlaying ? <Pause fill="white" /> : <Play fill="white" />} Listen Live
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-gray-100 dark:border-white/10">
        {queue?.slice(0, 2).map((item: any, i: number) => (
          <div key={i} className="flex gap-4 group cursor-pointer">
            <img src={item.image} className="w-24 h-24 object-cover rounded shadow-lg group-hover:scale-105 transition-transform" />
            <div>
              <p className="text-[10px] font-black text-praise-accent uppercase italic">Up Next • {item.startTime}</p>
              <h3 className="text-xl font-black uppercase dark:text-white group-hover:underline">{item.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}