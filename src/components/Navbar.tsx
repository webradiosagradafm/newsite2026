import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, User } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, theme, onToggleTheme }) => {
  return (
    <nav className="sticky top-0 z-[1001] bg-white dark:bg-[#000] border-b dark:border-white/10 px-4 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        {/* LOGO PRAISE FM USA RESTAURADO NO HEADER */}
        <Link to="/" className="flex flex-col leading-none group">
          <span className="text-2xl font-black dark:text-white tracking-tighter group-hover:text-[#ff6600] transition-colors">
            PRAISE
          </span>
          <span className="text-[10px] font-black bg-[#ff6600] text-white px-1 self-start mt-0.5 uppercase">
            FM USA
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {['HOME', 'MUSIC', 'SCHEDULE', 'DEVOTIONAL'].map((item) => (
            <Link
              key={item}
              to={item === 'HOME' ? '/' : `/${item.toLowerCase()}`}
              className={`text-[13px] font-black tracking-widest ${
                activeTab === item.toLowerCase() || (activeTab === 'home' && item === 'HOME')
                  ? 'text-[#ff6600] border-b-2 border-[#ff6600]'
                  : 'text-gray-500 hover:text-black dark:hover:text-white'
              } pb-1 transition-all`}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={onToggleTheme} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <Link to="/login" className="flex items-center space-x-2 text-[12px] font-black uppercase tracking-widest dark:text-white hover:text-[#ff6600]">
          <User size={18} />
          <span className="hidden sm:inline">Sign In</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;