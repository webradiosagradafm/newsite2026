import React, { useState, useEffect } from 'react';
import {
  Home,
  Music,
  Radio,
  Menu,
  Calendar,
  Sun,
  Moon,
  X,
  User as UserIcon,
  Library,
  Settings,
  Ticket,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface NavbarProps {
  activeTab: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, theme, onToggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.avatar_url) setAvatarUrl(data.avatar_url);
        });
    }
  }, [user]);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'music', label: 'Music', icon: Music, path: '/music' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, path: '/schedule' },
    { id: 'events', label: 'Events', icon: Ticket, path: '/events' },
    { id: 'devotional', label: 'Devotional', icon: Radio, path: '/devotional' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-100 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center space-x-10 h-full">
          <button onClick={() => navigate('/')} className="flex items-center h-full">
            <img
              src="https://res.cloudinary.com/dtecypmsh/image/upload/v1766869698/SVGUSA_lduiui.webp"
              alt="Praise FM USA"
              className={`h-6 w-auto ${theme === 'dark' ? 'invert' : ''}`}
            />
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center space-x-6 h-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 text-sm font-normal h-full border-b-2 transition-colors ${
                    isActive
                      ? 'text-black dark:text-white border-[#ff6600]'
                      : 'text-gray-500 border-transparent hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => navigate('/my-sounds')}
              className={`flex items-center space-x-2 text-sm font-normal h-full border-b-2 transition-colors ${
                activeTab === 'my-sounds'
                  ? 'text-black dark:text-white border-[#ff6600]'
                  : 'text-gray-500 border-transparent hover:text-black dark:hover:text-white'
              }`}
            >
              <Library className="w-4 h-4" strokeWidth={1.5} />
              <span>My Sounds</span>
            </button>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Auth */}
          {user ? (
            <button
              onClick={() => navigate('/profile')}
              className="hidden md:flex items-center space-x-2"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <span className="text-sm text-gray-500 hover:text-black dark:hover:text-white">
                Profile
              </span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="hidden md:block text-sm font-normal text-gray-500 hover:text-black dark:hover:text-white"
            >
              Sign In
            </button>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-black border-t border-gray-100 dark:border-white/10">
          <nav className="flex flex-col">
            {[...navItems, { id: 'my-sounds', label: 'My Sounds', icon: Library, path: '/my-sounds' }].map(
              (item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-6 py-4 text-base font-normal text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              )
            )}

            {user && (
              <button
                onClick={() => {
                  navigate('/profile');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 px-6 py-4 text-base font-normal text-[#ff6600] border-t border-gray-100 dark:border-white/10"
              >
                <Settings className="w-4 h-4" />
                <span>Account</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
