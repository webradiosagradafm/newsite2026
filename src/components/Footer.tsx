import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative isolate overflow-hidden border-t border-white/15 bg-[#111c30]/80 text-white backdrop-blur-2xl py-12">
      {/* Soft atmospheric reflections; the page's animated Glow stays visible behind the footer. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-cyan-300/10 via-transparent to-violet-400/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 left-[8%] -z-10 h-64 w-80 rounded-full bg-cyan-300/10 blur-[90px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 right-[5%] -z-10 h-72 w-96 rounded-full bg-violet-400/10 blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <button type="button" className="flex items-center mb-6 text-left" onClick={() => navigate('/')} aria-label="Praise FM USA home">
              <img
                src="https://res.cloudinary.com/dtecypmsh/image/upload/v1769820657/logo_hochsa.webp"
                alt="Praise FM USA Logo"
                className="h-10 w-auto object-contain"
                style={{ filter: 'invert(1) hue-rotate(180deg)' }}
              />
            </button>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm font-normal">
              Your home for the world's best worship music, exclusive devotional content, and the next generation of faith-filled artists. Curated daily for your spirit.
            </p>
          </div>
          <div>
            <h4 className="font-semibold uppercase text-[11px] tracking-widest mb-6 text-white/75">Music</h4>
            <ul className="space-y-4 text-sm font-normal text-slate-300">
              <li><button onClick={() => navigate('/music')} className="hover:text-[#ff6600] transition-colors text-left">Praise FM Playlist</button></li>
              <li><button onClick={() => navigate('/new-releases')} className="hover:text-[#ff6600] transition-colors text-left">New Releases</button></li>
              <li><button onClick={() => navigate('/artists')} className="hover:text-[#ff6600] transition-colors text-left">Featured Artists</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold uppercase text-[11px] tracking-widest mb-6 text-white/75">Radio</h4>
            <ul className="space-y-4 text-sm font-normal text-slate-300">
              <li><button onClick={() => navigate('/schedule')} className="hover:text-[#ff6600] transition-colors text-left">Full Schedule</button></li>
              <li><button onClick={() => navigate('/presenters')} className="hover:text-[#ff6600] transition-colors text-left">Our Presenters</button></li>
              <li><button onClick={() => navigate('/devotional')} className="hover:text-[#ff6600] transition-colors text-left">Daily Devotional</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold uppercase text-[11px] tracking-widest mb-6 text-white/75">Support</h4>
            <ul className="space-y-4 text-sm font-normal text-slate-300">
              <li><button onClick={() => navigate('/help')} className="hover:text-[#ff6600] transition-colors text-left">Help Center</button></li>
              <li><button onClick={() => navigate('/feedback')} className="hover:text-[#ff6600] transition-colors text-left">Feedback &amp; Support</button></li>
              <li><a href="mailto:fmpraiseradio@gmail.com" className="hover:text-[#ff6600] transition-colors">Direct Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold uppercase text-[11px] tracking-widest mb-6 text-white/75">Follow Us</h4>
            <ul className="space-y-4 text-sm font-normal text-slate-300">
              <li><a href="https://www.instagram.com/fmpraise.usa/" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff6600] transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/15 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-normal text-slate-400 uppercase tracking-widest">
          <p>© 2026 PRAISE FM USA. INSPIRED BY EXCELLENCE.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            <button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Terms of Use</button>
            <button onClick={() => navigate('/cookies')} className="hover:text-white transition-colors">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
