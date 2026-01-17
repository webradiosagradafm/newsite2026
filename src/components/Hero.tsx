import React from 'react';
import { Play, Pause, ChevronRight } from 'lucide-react';

interface HeroProps {
  onListenClick: () => void;
  isPlaying: boolean;
  currentProgram: any;
}

const Hero: React.FC<HeroProps> = ({ onListenClick, isPlaying, currentProgram }) => {
  return (
    <section className="bg-white dark:bg-[#000000] py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Círculo com imagem dinâmica (Daniel Brooks) */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
             <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#ff6600]">
                <img src={currentProgram?.image} className="w-full h-full object-cover" alt="Program" />
             </div>
             <div className="absolute bottom-4 right-4 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center font-black border-4 border-white dark:border-black text-2xl">1</div>
          </div>

          <div className="flex-grow text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 dark:text-white uppercase leading-none">
              {currentProgram?.title}
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-[#ff6600] mb-4">with {currentProgram?.host}</h2>
            <p className="text-lg text-gray-500 mb-8 max-w-2xl">{currentProgram?.description}</p>
            
            <button 
              onClick={onListenClick}
              className="bg-[#ff6600] text-white px-12 py-4 rounded-sm flex items-center space-x-4 hover:bg-[#e65c00] transition-all shadow-xl mx-auto md:mx-0"
            >
              {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} />}
              <span className="text-xl font-black uppercase tracking-tight">Listen Live</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;