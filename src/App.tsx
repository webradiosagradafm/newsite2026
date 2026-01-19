import React, { useState, useRef, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import RecentlyPlayed from './components/RecentlyPlayed';
import ScheduleList from './components/ScheduleList';
import LoginPage from './pages/LoginPage';

// URL de streaming fornecida 
const STREAM_URL = 'https://stream.zeno.fm/hvwifp8ezc6tv';

const AppContent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  // Inicializa o áudio apenas uma vez
  useEffect(() => {
    audioRef.current = new Audio(STREAM_URL);
    audioRef.current.crossOrigin = "anonymous";
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#000] text-black dark:text-white">
      {/* Navbar com as propriedades exigidas  */}
      <Navbar 
        activeTab="home" 
        theme="dark" 
        onToggleTheme={() => {}} 
      />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <>
              {/* Hero com as propriedades exigidas  */}
              <Hero 
                onListenClick={togglePlayback} 
                isPlaying={isPlaying} 
                liveMetadata={null} 
                onNavigateToProgram={() => {}} 
              />
              <RecentlyPlayed tracks={[]} />
            </>
          } />
          
          <Route path="/schedule" element={
            <ScheduleList 
              onNavigateToProgram={() => {}} 
              onBack={() => navigate('/')} 
            />
          } />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
}