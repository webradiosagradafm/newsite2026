
import React from 'react';
import { Users, ArrowRight } from 'lucide-react';
import { Program } from '../types';
import { SCHEDULES } from '../constants';

interface PresentersPageProps {
  onNavigateToProgram: (program: Program) => void;
}

const PRESENTERS_DATA = [
  {
    name: 'Stancy Campbell',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882823/Stancy_Campbell_oair1x.png',
    bio: 'The energetic voice behind the Morning Show. Stancy brings hope and high energy to your start of the day with a perfect mix of chart-toppers and heartfelt talk.',
    programTitle: 'Morning Show'
  },
  {
    name: 'Michael Ray',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882821/Michael_Ray_u4bkfd.png',
    bio: 'Michael Ray is your midday companion, curating soul-stirring worship for your work hours. His Midday Grace segment is a favorite for those seeking peace during a busy day.',
    programTitle: 'Midday Grace'
  },
  {
    name: 'Sarah Jordan',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882821/Sarah_Jordan_uecxmi.png',
    bio: 'A champion for the new generation, Sarah hosts Future Artists, where she discovers and promotes independent faith-filled talent from all over the world.',
    programTitle: 'Future Artists'
  },
  {
    name: 'Daniel Brooks',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882820/Daniel_Brooks_bcammc.png',
    bio: 'The voice of the night. Daniel leads Midnight Grace, providing a tranquil atmosphere for reflection, prayer, and peaceful sleep through chosen worship melodies.',
    programTitle: 'Midnight Grace'
  },
  {
    name: 'Rachel Harris',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882822/Rachel_Harris_kxjpa1.png',
    bio: 'Rachel makes your commute feel shorter. With Carpool, she mixes the biggest hits with listener stories, making sure you get home with a smile on your face.',
    programTitle: 'Carpool'
  },
  {
    name: 'Scott Turner',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882823/Scott_Turner_hxkuxd.png',
    bio: 'A historian of worship music. Scott hosts Classics, taking us back to the heritage hymns and hits that built the foundation of contemporary faith music.',
    programTitle: 'Classics'
  }
];

const PresentersPage: React.FC<PresentersPageProps> = ({ onNavigateToProgram }) => {
  
  const findProgram = (title: string) => {
    // Procura em todos os dias do schedule o programa com esse título
    for (let day = 0; day <= 6; day++) {
      const prog = (SCHEDULES[day] || []).find(p => p.title === title);
      if (prog) return prog;
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-[#000] min-h-screen transition-colors duration-300">
      {/* Header Estilo BBC */}
      <div className="bg-black text-white py-20 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center space-x-3 text-[#ff6600] mb-6">
            <Users className="w-5 h-5 fill-current" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em]">The Voices of Praise FM USA</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-medium uppercase tracking-tighter leading-none mb-8">Our<br />Presenters</h1>
          <p className="text-xl text-gray-400 max-w-2xl font-normal uppercase tracking-tight leading-tight">
            Meet the team dedicated to bringing you closer to the heart of worship every single day, through every season of your life.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRESENTERS_DATA.map((presenter, idx) => {
            const program = findProgram(presenter.programTitle);
            
            return (
              <div key={idx} className="flex flex-col group bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img 
                    src={presenter.image} 
                    alt={presenter.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[#ff6600] text-[10px] font-regular uppercase tracking-[0.3em] mb-2 block">{presenter.programTitle}</span>
                    <h2 className="text-3xl font-medium text-white uppercase tracking-tighter">{presenter.name}</h2>
                  </div>
                </div>
                
                <div className="p-8 flex-grow flex flex-col">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-relaxed mb-8">
                    {presenter.bio}
                  </p>
                  
                  <div className="mt-auto">
                    {program && (
                      <button 
                        onClick={() => onNavigateToProgram(program)}
                        className="w-full bg-[#ff6600] text-white py-4 px-6 text-[10px] font-regular uppercase tracking-[0.2em] flex items-center justify-center space-x-2 hover:bg-black transition-colors"
                      >
                        <span>View Program</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action Final */}
        <div className="mt-24 bg-gray-50 dark:bg-[#111] p-12 md:p-20 flex flex-col items-center text-center border border-gray-100 dark:border-white/5">
           <h4 className="text-4xl font-medium uppercase tracking-tighter dark:text-white mb-6">Want to see the full list?</h4>
           <p className="text-gray-500 max-w-xl font-normal uppercase tracking-tight text-sm mb-10">
             Explore our full broadcasting schedule and discover all the shows that make Praise FM USA your primary home for faith and music.
           </p>
           <button 
              onClick={() => window.location.hash = '#/schedule'}
              className="bg-black dark:bg-white text-white dark:text-black px-12 py-5 text-[10px] font-regular uppercase tracking-[0.3em] hover:bg-[#ff6600] dark:hover:bg-[#ff6600] hover:text-white transition-all shadow-xl active:scale-95"
            >
              Full Schedule
           </button>
        </div>
      </div>
    </div>
  );
};

export default PresentersPage;
