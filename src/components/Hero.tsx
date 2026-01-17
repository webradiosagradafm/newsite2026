import React from 'react';
import { Play, Pause, ChevronRight } from 'lucide-react';

interface HeroProps {
  onListenClick: () => void;
  isPlaying: boolean;
  onNavigateToProgram: (program: any) => void;
}

const Hero: React.FC<HeroProps> = ({ onListenClick, isPlaying, onNavigateToProgram }) => {
  return (
    <section className="bg-white dark:bg-[#000000] py-16">
      <div className="max-w-7xl mx-auto px-4 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Imagem Central */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
             <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#ff6600]">
                <img src="https://res.cloudinary.com/dtecypmsh/image/upload/v1766882820/Daniel_Brooks_bcammc.png" className="w-full h-full object-cover" alt="On Air" />
             </div>
             <div className="absolute bottom-4 right-4 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center font-black border-4 border-white dark:border-black text-2xl">1</div>
          </div>

          <div className="flex-grow">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 dark:text-white uppercase">
              Midnight Grace <span className="text-[#ff6600]">Live</span>
            </h1>
            <p className="text-xl text-gray-500 mb-8 max-w-2xl">Peaceful music for the night hours with Daniel Brooks.</p>
            
            <button 
              onClick={onListenClick}
              className="bg-[#ff6600] text-white px-12 py-4 rounded-sm flex items-center space-x-4 hover:scale-105 transition-all shadow-xl mx-auto md:mx-0"
            >
              {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
              <span className="text-xl font-black uppercase tracking-tight">Listen Live</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;