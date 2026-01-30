"use client";

import { Menu, X, Moon, Sun } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  activeTab: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function Navbar({
  activeTab,
  theme,
  onToggleTheme,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "playlist", label: "Playlist" },
    { id: "live", label: "Ao Vivo" },
    { id: "news", label: "Notícias" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img
            src="/logopraisefm.webp"
            alt="Praise FM"
            className="h-8 w-auto dark:invert"
          />
        </div>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`text-sm font-medium transition-colors
                ${
                  activeTab === item.id
                    ? "text-black dark:text-white"
                    : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* AÇÕES */}
        <div className="flex items-center gap-2">

          {/* DARK / LIGHT */}
          <button
            onClick={onToggleTheme}
            aria-label="Alternar tema"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-praise-accent" />
            )}
          </button>

          {/* MENU MOBILE */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            )}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-white/10">
          <nav className="flex flex-col py-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 text-left text-sm transition-colors
                  ${
                    activeTab === item.id
                      ? "text-black dark:text-white bg-gray-100 dark:bg-white/10"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
