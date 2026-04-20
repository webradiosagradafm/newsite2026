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
  Settings,
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

  // 🔥 CORRIGIDO (sem avatarUrl)
  const { user, signOut } = useAuth()

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'music', label: 'Music', icon: Music, path: '/music' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, path: '/schedule' },
    { id: 'events', label: 'Events', icon: Ticket, path: '/events' },
    { id: 'devotional', label: 'Devotional', icon: Radio, path: '/devotional' },
  ]

  // 🔥 pega avatar do Supabase metadata
  const avatarUrl = user?.user_metadata?.avatar_url

  return (
    <header className="bg-white dark:bg-[#0b0b0b] text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center h-full space-x-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center h-full"
          >
            <img
              src="https://res.cloudinary.com/dtecypmsh/image/upload/v1769820657/logo_hochsa.webp"
              alt="Praise FM USA"
              className={`h-7 w-auto object-contain ${
                theme === 'dark' ? 'brightness-0 invert' : ''
              }`}
            />
          </button>

          {/* MENU DESKTOP */}
          <nav className="hidden md:flex items-center space-x-8 h-full">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 text-[15px] font-medium h-full border-b-2 px-1 uppercase tracking-tighter ${
                    isActive
                      ? 'text-black dark:text-white border-[#ff6600]'
                      : 'text-gray-500 border-transparent hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </button>
              )
            })}

            <button
              onClick={() => navigate('/my-sounds')}
              className={`flex items-center space-x-2 text-[15px] font-medium h-full border-b-2 px-1 uppercase tracking-tighter ${
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

        {/* DIREITA */}
        <div className="flex items-center">

          {/* THEME */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 mr-8 md:mr-12"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-[#ff6600]" />
            )}
          </button>

          {/* USER */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex items-center space-x-4">

                {/* PROFILE */}
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-3 group"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-white/10 flex items-center justify-center border group-hover:border-[#ff6600]">

                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4 text-gray-500" />
                    )}

                  </div>

                  <span className="text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-black dark:group-hover:text-white">
                    Profile
                  </span>
                </button>

                {/* SIGN OUT */}
                <button
                  onClick={async () => {
                    await signOut()
                    navigate('/login')
                  }}
                  className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="hidden md:block text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-300"
              >
                Sign In
              </button>
            )}

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white dark:bg-black z-40 p-6">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path)
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center space-x-4 p-4 text-lg"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}

            {user && (
              <button
                onClick={async () => {
                  await signOut()
                  navigate('/login')
                }}
                className="flex items-center space-x-4 p-4 text-red-500"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar