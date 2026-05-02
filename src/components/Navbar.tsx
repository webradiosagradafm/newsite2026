import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Home,
  Music,
  Calendar,
  Mic,
  Radio,
  Moon,
  Sun,
} from 'lucide-react'

interface NavbarProps {
  activeTab: string
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  theme,
  onToggleTheme,
}) => {
  const navigate = useNavigate()

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={18} />, path: '/' },
    { id: 'music', label: 'Music', icon: <Music size={18} />, path: '/music' },
    { id: 'schedule', label: 'Schedule', icon: <Calendar size={18} />, path: '/schedule' },
    { id: 'events', label: 'Events', icon: <Radio size={18} />, path: '/events' },
    { id: 'devotional', label: 'Devotional', icon: <Mic size={18} />, path: '/devotional' },
  ]

  return (
    <header className="w-full border-b bg-white dark:bg-black sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <div
          onClick={() => navigate('/')}
          className="text-xl font-bold cursor-pointer"
        >
          PRAISE FM <span className="text-orange-500">USA</span>
        </div>

        {/* MENU */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-1 text-sm font-medium transition ${
                activeTab === item.id
                  ? 'text-orange-500'
                  : 'text-gray-600 dark:text-gray-300 hover:text-orange-500'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* THEME TOGGLE */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

      </div>
    </header>
  )
}

export default Navbar