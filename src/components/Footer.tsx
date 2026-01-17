
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-black text-white border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center mb-6 cursor-pointer" onClick={() => navigate('/')}>
              <img 
                src="https://res.cloudinary.com/dtecypmsh/image/upload/v1766869698/SVGUSA_lduiui.webp" 
                alt="Praise FM USA Logo" 
                className="h-10 w-auto object-contain"
                style={{ filter: 'invert(1) hue-rotate(180deg)' }}
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-sm font-normal">
              Your home for the world's best worship music, exclusive devotional content, and the next generation of faith-filled artists. Curated daily for your spirit.
            </p>
          </div>
          <div>
            <h4 className="font-medium uppercase text-[11px] tracking-widest mb-6 text-white/50">Music</h4>
            <ul className="space-y-4 text-sm font-normal text-gray-400">
              <li>
                <button 
                  onClick={() => navigate('/music')} 
                  className="hover:text-[#ff6600] transition-colors text-left"
                >
                  Praise FM Playlist
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/new-releases')} 
                  className="hover:text-[#ff6600] transition-colors text-left"
                >
                  New Releases
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/artists')} 
                  className="hover:text-[#ff6600] transition-colors text-left"
                >
                  Featured Artists
                </button>
              </li>
            </ul>
          </div>
          <div>
             <h4 className="font-medium uppercase text-[11px] tracking-widest mb-6 text-white/50">Radio</h4>
            <ul className="space-y-4 text-sm font-normal text-gray-400">
              <li><button onClick={() => navigate('/schedule')} className="hover:text-[#ff6600] transition-colors text-left">Full Schedule</button></li>
              <li><button onClick={() => navigate('/presenters')} className="hover:text-[#ff6600] transition-colors text-left">Our Presenters</button></li>
              <li><button onClick={() => navigate('/devotional')} className="hover:text-[#ff6600] transition-colors text-left">Daily Devotional</button></li>
            </ul>
          </div>
          <div>
             <h4 className="font-medium uppercase text-[11px] tracking-widest mb-6 text-white/50">Support</h4>
            <ul className="space-y-4 text-sm font-normal text-gray-400">
              <li><button onClick={() => navigate('/help')} className="hover:text-[#ff6600] transition-colors text-left">Help Center</button></li>
              <li><button onClick={() => navigate('/feedback')} className="hover:text-[#ff6600] transition-colors text-left">Feedback & Support</button></li>
              <li><a href="mailto:fmpraiseradio@gmail.com" className="hover:text-[#ff6600] transition-colors">Direct Contact</a></li>
            </ul>
          </div>
          <div>
             <h4 className="font-medium uppercase text-[11px] tracking-widest mb-6 text-white/50">Follow Us</h4>
            <ul className="space-y-4 text-sm font-normal text-gray-400">
              <li>
                <a 
                  href="https://www.instagram.com/fmpraise.usa/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#ff6600] transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-normal text-gray-500 uppercase tracking-widest">
          <p>© 2026 PRAISE FM USA. INSPIRED BY EXCELLENCE.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
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
