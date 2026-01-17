import React from 'react';
import { Play, Pause, ChevronRight } from 'lucide-react';

interface HeroProps {
  onListenClick: () => void;
  isPlaying: boolean;
  currentProgram: any;
  queue: any[];
}

const Hero: React.FC<HeroProps> = ({ onListenClick, isPlaying, currentProgram, queue }) => {
  return (
    <section className="bg-white dark:bg-[#000000] pt-12 pb-6 border-b dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start gap-12 mb-16">
          
          {/* Foto Principal Daniel Brooks */}
          <div className="relative w-56 h-56 flex-shrink-0 mx-auto md:mx-0">
             <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#ff6600] shadow-2xl">
                <img src={currentProgram?.image} className="w-full h-full object-cover" alt="Host" />
             </div>
             <div className="absolute bottom-2 right-2 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center font-black border-4 border-white dark:border-black text-2xl">1</div>
          </div>

          <div className="flex-grow text-center md:text-left pt-4">
            <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
              {currentProgram?.startTime} - {currentProgram?.endTime}
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 dark:text-white uppercase leading-none group cursor-pointer">
              {currentProgram?.title} <ChevronRight className="inline text-[#ff6600] w-10 h-10" />
            </h1>
            <p className="text-xl text-gray-500 mb-8 font-medium">with {currentProgram?.host}</p>
            
            <button 
              onClick={onListenClick}
              className="bg-[#ff6600] text-white px-14 py-4 rounded-sm flex items-center space-x-4 hover:bg-[#e65c00] transition-all shadow-xl mx-auto md:mx-0 active:scale-95"
            >
              {isPlaying ? <Pause fill="currentColor" size={28} /> : <Play fill="currentColor" size={28} />}
              <span className="text-xl font-black uppercase tracking-tight">Listen Live</span>
            </button>
          </div>
        </div>

        {/* SEÇÃO UP NEXT RESTAURADA (Igual à imagem) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-t dark:border-white/10">
          {queue.slice(0, 2).map((prog, i) => (
            <div key={i} className="flex items-start space-x-6 group cursor-pointer">
              <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-gray-100">
                <img src={prog.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[11px] font-black text-[#ff6600] uppercase tracking-widest">Up Next</span>
                  <span className="text-[11px] text-gray-400 font-bold">{prog.startTime}</span>
                </div>
                <h3 className="text-xl font-black dark:text-white group-hover:text-[#ff6600] transition-colors uppercase leading-tight">
                  {prog.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{prog.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;