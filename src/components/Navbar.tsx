import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

interface NavbarProps {
  activeTab: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, theme, onToggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchAvatar = async () => {
        const { data } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", user.id)
          .single();
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
      };
      fetchAvatar();
    }
  }, [user]);

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "music", label: "Music", icon: Music, path: "/music" },
    { id: "schedule", label: "Schedule", icon: Calendar, path: "/schedule" },
    { id: "events", label: "Events", icon: Ticket, path: "/events" },
    { id: "devotional", label: "Devotional", icon: Radio, path: "/devotional" },
  ];

  return (
    <header className="bg-white dark:bg-[#0b0b0b] text-black dark:text-white fixed top-0 w-full z-50">
      {/* TOP BAR */}
      <div className="max-w-7xl mx-auto px-4 h-16 grid grid-cols-3 items-center">

        {/* MOBILE LEFT – MENU */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* LOGO */}
        <div className="flex justify-center md:justify-start">
          <img
            src="https://res.cloudinary.com/dtecypmsh/image/upload/v1766869698/SVGUSA_lduiui.webp"
            alt="Praise FM USA"
            className={`h-8 w-auto transition-all ${
              theme === "dark" ? "brightness-0 invert" : ""
            }`}
            onClick={() => navigate("/")}
          />
        </div>

        {/* RIGHT – THEME + PROFILE */}
        <div className="flex justify-end items-center space-x-4">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 text-gray-600" />
            ) : (
              <Sun className="w-4 h-4 text-praise-accent" />
            )}
          </button>

          {user ? (
            <button
              onClick={() => navigate("/profile")}
              className="hidden md:flex items-center space-x-2 group"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-gray-500" />
                )}
              </div>
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden md:block text-[11px] uppercase tracking-widest text-gray-600 dark:text-gray-300"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* DESKTOP NAV */}
      <nav className="hidden md:flex justify-center space-x-8 border-t border-gray-100 dark:border-white/5 h-12">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex items-center space-x-2 text-sm uppercase tracking-tight border-b-2 ${
                isActive
                  ? "border-[#ff6600] text-black dark:text-white"
                  : "border-transparent text-gray-500 hover:text-black dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => navigate("/my-sounds")}
          className={`flex items-center space-x-2 text-sm uppercase tracking-tight border-b-2 ${
            activeTab === "my-sounds"
              ? "border-[#ff6600]"
              : "border-transparent text-gray-500 hover:text-black dark:hover:text-white"
          }`}
        >
          <Library className="w-4 h-4" />
          <span>My Sounds</span>
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 bg-white dark:bg-black z-40 p-6 md:hidden">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setMenuOpen(false);
                }}
                className="flex items-center space-x-4 text-lg uppercase text-gray-600 dark:text-gray-400"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}

            <button
              onClick={() => {
                navigate("/my-sounds");
                setMenuOpen(false);
              }}
              className="flex items-center space-x-4 text-lg uppercase text-gray-600 dark:text-gray-400"
            >
              <Library className="w-5 h-5" />
              <span>My Sounds</span>
            </button>

            {user && (
              <button
                onClick={() => {
                  navigate("/profile");
                  setMenuOpen(false);
                }}
                className="flex items-center space-x-4 text-lg uppercase text-[#ff6600] pt-6 border-t border-gray-200 dark:border-white/10"
              >
                <Settings className="w-5 h-5" />
                <span>Account Settings</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
