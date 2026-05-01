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
  User as UserIcon,
  Library,
  Ticket,
  LogOut
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface NavbarProps {
  activeTab: string
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, theme, onToggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'music', label: 'Music', icon: Music, path: '/music' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, path: '/schedule' },
    { id: 'events', label: 'Events', icon: Ticket, path: '/events' },
    { id: 'devotional', label: 'Devotional', icon: Radio, path: '/devotional' },
  ]

  const avatarUrl = user?.user_metadata?.avatar_url

  return (
    <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center space-x-10">
          <button onClick={() => navigate('/')}>
            <img
              src="https://res.cloudinary.com/dtecypmsh/image/upload/v1769820657/logo_hochsa.webp"
              alt="Praise FM USA"
              className={`h-7 ${
                theme === 'dark' ? 'brightness-0 invert' : ''
              }`}
            />
          </button>

          {/* MENU DESKTOP */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 text-sm font-medium uppercase tracking-tight border-b-2 pb-1 transition-all ${
                    isActive
                      ? 'text-[#ff6600] border-[#ff6600]'
                      : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              )
            })}

            <button
              onClick={() => navigate('/my-sounds')}
              className={`flex items-center gap-2 text-sm font-medium uppercase tracking-tight border-b-2 pb-1 ${
                activeTab === 'my-sounds'
                  ? 'text-[#ff6600] border-[#ff6600]'
                  : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-black dark:hover:text-white'
              }`}
            >
              <Library className="w-4 h-4" />
              My Sounds
            </button>
          </nav>
        </div>

        {/* DIREITA */}
        <div className="flex items-center gap-6">

          {/* 🌙 THEME */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:scale-110 transition"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-gray-700" />
            ) : (
              <Sun className="w-4 h-4 text-[#ff6600]" />
            )}
          </button>

          {/* USER */}
          {user ? (
            <div className="hidden md:flex items-center gap-4">

              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-white/10 border group-hover:border-[#ff6600]">
                  {avatarUrl ? (
                    <img src={avatarUrl} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-4 h-4 m-auto text-gray-500" />
                  )}
                </div>
              </button>

              <button
                onClick={async () => {
                  await signOut()
                  navigate('/login')
                }}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
              </button>

            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="hidden md:block text-xs uppercase text-gray-500"
            >
              Sign In
            </button>
          )}

          {/* MOBILE */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white dark:bg-black p-6 z-40">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path)
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center gap-4 text-lg"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar