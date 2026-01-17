import React from 'react';
import { Home, Music, Mic2, UserCircle2 } from 'lucide-react';

export default function Navbar({ activeTab }) {
  const LOGO_URL = "https://res.cloudinary.com/dtecypmsh/image/upload/v1766869698/SVGUSA_lduiui.webp";

  return (
    <nav className="bg-white dark:bg-[#000] border-b border-gray-100 dark:border-white/10 sticky top-0 z-[2000]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO OFICIAL - Proporcional à altura do Nav */}
        <div className="flex items-center h-full py-3">
          <img 
            src={LOGO_URL} 
            alt="Praise FM USA" 
            className="h-full w-auto object-contain"
          />
        </div>

        {/* MENU - Baseado na foto Header menu.png */}
        <div className="hidden md:flex items-center gap-8">
          <button className={`flex items-center gap-2 font-bold text-sm uppercase tracking-tighter ${activeTab === 'home' ? 'text-[#ff6600]' : 'text-gray-500 hover:text-white'}`}>
            <Home size={18} /> Home
          </button>
          <button className="flex items-center gap-2 font-bold text-sm uppercase tracking-tighter text-gray-500 hover:text-white">
            <Music size={18} /> Music
          </button>
          <button className="flex items-center gap-2 font-bold text-sm uppercase tracking-tighter text-gray-500 hover:text-white">
            <Mic2 size={18} /> Podcasts
          </button>
          <button className="flex items-center gap-2 font-bold text-sm uppercase tracking-tighter text-gray-500 hover:text-white border-l border-white/10 pl-8">
            <UserCircle2 size={18} /> My Sounds
          </button>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="md:hidden text-white font-black text-xs bg-[#ff6600] px-3 py-1 uppercase">
          Menu
        </div>
      </div>
    </nav>
  );
}