import React from 'react';

export default function Footer() {
  const LOGO_URL = "https://res.cloudinary.com/dtecypmsh/image/upload/v1766869698/SVGUSA_lduiui.webp";

  return (
    <footer className="bg-[#f2f2f2] dark:bg-[#121212] py-12 mt-10 border-t dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* LOGO NO FOOTER */}
          <div className="h-10">
            <img 
              src={LOGO_URL} 
              alt="Praise FM USA" 
              className="h-full w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
            />
          </div>

          {/* LINKS ESTILO BBC */}
          <div className="flex flex-wrap justify-center gap-6 text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-[#ff6600]">About Us</a>
            <a href="#" className="hover:text-[#ff6600]">Contact</a>
            <a href="#" className="hover:text-[#ff6600]">Privacy Policy</a>
            <a href="#" className="hover:text-[#ff6600]">Cookies</a>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-white/5 text-center">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
            Copyright © 2026 Praise FM USA. Produced by Praise Audio for the World.
          </p>
        </div>
      </div>
    </footer>
  );
}