import React, { useState } from 'react'
import {
  Home,
  Music,
  Radio,
  Menu,
  Calendar,
  Sun,
  Moon,
  X,
  Ticket,
  Megaphone,
  Headphones
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface NavbarProps {
  activeTab: string
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  theme,
  onToggleTheme
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'programs', label: 'Programs', icon: Headphones, path: '/programs' },
    { id: 'music', label: 'Music', icon: Music, path: '/music' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, path: '/schedule' },
    { id: 'events', label: 'Events', icon: Ticket, path: '/events' },
    { id: 'devotional', label: 'Devotional', icon: Radio, path: '/devotional' },
    { id: 'advertise', label: 'Advertise', icon: Megaphone, path: '/advertise' }
  ]

  return (
    <header className="bg-white dark:bg-[#0b0b0b] text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center h-full space-x-8">
          <div
            className="flex items-center cursor-pointer h-full"
            onClick={() => navigate('/')}
          >
            <img
              src="https://res.cloudinary.com/dtecypmsh/image/upload/v1769820657/logo_hochsa.webp"
              alt="Praise FM USA Logo"
              className={`h-7 w-auto object-contain transition-all ${
                theme === 'dark' ? 'brightness-0 invert' : ''
              }`}
            />
          </div>

          <nav className="hidden md:flex items-center space-x-6 h-full">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 text-[14px] font-medium transition-all h-full border-b-2 px-1 uppercase tracking-tighter ${
                    isActive
                      ? 'text-black dark:text-white border-[#ff6600]'
                      : 'text-gray-500 border-transparent hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-black dark:text-white'
                        : 'text-gray-400'
                    }`}
                    strokeWidth={1.5}
                  />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400 mr-8 md:mr-12"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-praise-accent" />
            )}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 md:hidden text-gray-800 dark:text-white"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white dark:bg-black z-40 md:hidden p-6 overflow-y-auto">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path)
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-4 p-4 rounded-xl text-lg font-medium text-gray-600 dark:text-gray-400 uppercase tracking-tighter"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar