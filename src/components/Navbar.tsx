import { Link } from 'react-router-dom';

interface NavbarProps {
  activeTab: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Navbar({ activeTab }: NavbarProps) {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="Praise FM USA"
            className="h-7 w-auto"
          />
          <span className="text-sm font-normal tracking-tight">
            Praise FM USA
          </span>
        </div>

        {/* NAV */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-normal">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/music" className="hover:underline">Music</Link>
          <Link to="/schedule" className="hover:underline">Schedule</Link>
          <Link to="/events" className="hover:underline">Events</Link>
          <Link to="/devotional" className="hover:underline">Devotional</Link>
          <Link to="/my-sounds" className="hover:underline">My Sounds</Link>
        </nav>

        {/* AUTH */}
        <div>
          <Link to="/login" className="text-sm font-normal hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </header>
  );
}
