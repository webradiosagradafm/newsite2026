import React, { useState } from 'react'
import {
  Home,
  Music,
  Radio,
  Menu,
  Calendar,
  X,
  Ticket
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface NavbarProps {
  activeTab: string
  theme: 'light' | 'dark'
  onToggleTheme?: () => void // Mantido apenas para compatibilidade com App.tsx
  programColor?: string
  // Modo vidro: menu transparente com desfoque, para páginas com fundo ambiente
  glass?: boolean
}

const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  theme,
  programColor,
  glass = false
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'music', label: 'Music', icon: Music, path: '/music' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, path: '/schedule' },
    { id: 'events', label: 'Events', icon: Ticket, path: '/events' },
    { id: 'devotional', label: 'Devotional', icon: Radio, path: '/devotional' }
  ]

  // Fora do modo vidro mantém o comportamento antigo (cor sólida)
  const solidBgStyle: React.CSSProperties = glass
    ? {}
    : {
        backgroundColor:
          programColor && programColor !== 'transparent'
            ? programColor
            : theme === 'dark'
              ? '#0b0b0b'
              : '#ffffff'
      }

  // No modo vidro o texto é sempre branco; no modo sólido segue o tema
  const logoInvert = glass || theme === 'dark'

  const headerClass = glass
    ? 'sticky top-0 z-50 text-white bg-black/25 backdrop-blur-xl border-b border-white/10 transition-colors duration-1000'
    : 'text-black dark:text-white transition-colors duration-1000 border-b border-gray-200 dark:border-white/10'

  const tabClass = (isActive: boolean) => {
    const base =
      'flex items-center space-x-2 text-[14px] font-medium transition-all h-full border-b-2 px-1 uppercase tracking-tighter'
    if (glass) {
      return `${base} ${
        isActive
          ? 'text-white border-[#ff6600]'
          : 'text-white/70 border-transparent hover:text-white'
      }`
    }
    return `${base} ${
      isActive
        ? 'text-black dark:text-white border-[#ff6600]'
        : 'text-gray-500 border-transparent hover:text-black dark:hover:text-white'
    }`
  }

  const iconClass = (isActive: boolean) => {
    if (glass) return isActive ? 'text-white' : 'text-white/60'
    return isActive ? 'text-black dark:text-white' : 'text-gray-400'
  }

  return (
    <>
      <header className={headerClass} style={solidBgStyle}>
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
                  logoInvert ? 'brightness-0 invert' : ''
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
                    className={tabClass(isActive)}
                  >
                    <Icon
                      className={`w-4 h-4 ${iconClass(isActive)}`}
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 md:hidden ${
                glass ? 'text-white' : 'text-gray-800 dark:text-white'
              }`}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/*
        O menu mobile fica FORA do <header>: backdrop-filter num elemento pai
        faz o filho "fixed" posicionar em relação a ele, quebrando o overlay.
      */}
      {isMobileMenuOpen && (
        <div
          className={`fixed inset-0 top-16 z-40 md:hidden p-6 overflow-y-auto transition-colors duration-1000 ${
            glass ? 'bg-black/70 backdrop-blur-xl' : ''
          }`}
          style={solidBgStyle}
        >
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`flex items-center space-x-4 p-4 rounded-xl text-lg font-medium uppercase tracking-tighter transition-colors ${
                    glass
                      ? `${isActive ? 'text-white bg-white/10' : 'text-white/80'} hover:bg-white/10`
                      : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}

export default Navbar
