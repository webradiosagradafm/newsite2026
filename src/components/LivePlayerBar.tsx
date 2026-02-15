import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Volume1, List, X, RotateCcw, RotateCw } from 'lucide-react';
import { Program } from '../types';
import { supabase } from '../lib/supabase';

// Add global CSS for the live pulse animation
const LivePulseAnimation = () => {
  useEffect(() => {
    // Inject animation CSS into the document
    const style = document.createElement('style');
    style.textContent = `
      @keyframes live-pulse {
        0%, 100% { 
          opacity: 0.7; 
          transform: translate(-50%, -50%) scale(0.9); 
        }
        50% { 
          opacity: 1; 
          transform: translate(-50%, -50%) scale(1.3); 
        }
      }
      .animate-live-pulse {
        animation: live-pulse 1.8s infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return null;
};

interface LivePlayerBarProps {
  isPlaying: boolean;
  onTogglePlayback: () => void;
  program: Program;
  liveMetadata?: { artist: string; title: string; artwork?: string } | null;
  queue?: Program[];
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

// Helper function to format time to AM/PM
const formatTimeToAmPm = (timeString: string): string => {
  try {
    // If it's already formatted (like "10:00 AM"), return as is
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }
    
    // Parse time string (assuming format like "14:30" or "2:30 PM")
    const [hours, minutes] = timeString.split(':');
    let hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hour = hour % 12;
    hour = hour ? hour : 12; // 0 should be 12
    
    return `${hour}:${minutes || '00'} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

// Função para gerar/pegar ID único do ouvinte
const getListenerId = (): string => {
  let listenerId = localStorage.getItem('listener_id');
  if (!listenerId) {
    listenerId = crypto.randomUUID();
    localStorage.setItem('listener_id', listenerId);
  }
  return listenerId;
};

// Função para obter informações do ouvinte
const getListenerInfo = async () => {
  const userAgent = navigator.userAgent;
  
  // Detectar device
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
  let device = 'Desktop';
  if (isMobile) device = 'Mobile';
  if (isTablet) device = 'Tablet';
  
  // Detectar browser
  let browser = 'Unknown';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  
  // Pegar referrer (de onde veio)
  const referrer = document.referrer || 'Direct';
  
  // Buscar IP e localização (usando API gratuita)
  let ipData = {
    ip: 'Unknown',
    country: 'Unknown',
    city: 'Unknown'
  };
  
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    ipData = {
      ip: data.ip || 'Unknown',
      country: data.country_name || 'Unknown',
      city: data.city || 'Unknown'
    };
  } catch (error) {
    console.log('Could not get location:', error);
  }
  
  return {
    device,
    browser,
    referrer,
    ...ipData
  };
};

const LivePlayerBar: React.FC<LivePlayerBarProps> = ({ isPlaying, onTogglePlayback, program, liveMetadata, queue = [], audioRef }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('praise-volume');
    return saved ? parseFloat(saved) : 0.8;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Estados para rastreamento
  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Registrar quando começar a ouvir
  const trackListeningStart = async () => {
    const listenerId = getListenerId();
    const sessionId = crypto.randomUUID();
    sessionIdRef.current = sessionId;
    startTimeRef.current = Date.now();

    // Obter informações do ouvinte
    const listenerInfo = await getListenerInfo();

    // DEBUG: Ver o que está no program
    console.log('🔍 DEBUG - Program ', {
      title: program.title,
      id: program.id,
      host: program.host,
      fullProgram: program
    });

    console.log('🌍 DEBUG - Listener info:', listenerInfo);

    try {
      const dataToInsert = {
        user_id: listenerId,
        session_id: sessionId,
        audio_id: program.title || program.host || `Program ${program.id}` || 'Unknown Program',
        duration_seconds: 0,
        completed: false,
        ip_address: listenerInfo.ip,
        country: listenerInfo.country,
        city: listenerInfo.city,
        device: listenerInfo.device,
        browser: listenerInfo.browser,
        referrer: listenerInfo.referrer
      };

      console.log('📤 Sending to Supabase:', dataToInsert);

      const { error } = await supabase
        .from('listeners')
        .insert(dataToInsert);

      if (error) {
        console.error('❌ Error registering listener:', error);
      } else {
        console.log('✅ Listener registered successfully!', dataToInsert);
      }
    } catch (err) {
      console.error('❌ Error connecting to Supabase:', err);
    }
  };

  // Atualizar duração periodicamente
  const updateDuration = async () => {
    if (!sessionIdRef.current) return;

    const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

    try {
      await supabase
        .from('listeners')
        .update({ duration_seconds: durationSeconds })
        .eq('session_id', sessionIdRef.current);
    } catch (err) {
      console.error('Error updating duration:', err);
    }
  };

  // Marcar como completado
  const markAsCompleted = async () => {
    if (!sessionIdRef.current) return;

    try {
      const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      await supabase
        .from('listeners')
        .update({ 
          completed: true,
          duration_seconds: durationSeconds
        })
        .eq('session_id', sessionIdRef.current);

      console.log('✅ Session marked as complete');
    } catch (err) {
      console.error('Error marking as completed:', err);
    }
  };

  // Effect para rastrear quando começar/parar de tocar
  useEffect(() => {
    if (isPlaying && !sessionIdRef.current) {
      // Começou a ouvir
      trackListeningStart();

      // Atualizar duração a cada 10 segundos
      durationIntervalRef.current = setInterval(updateDuration, 10000);
    } else if (!isPlaying && sessionIdRef.current) {
      // Parou de ouvir
      updateDuration();
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      // Marcar como completo se ouviu mais de 5 minutos
      const listenedMinutes = (Date.now() - startTimeRef.current) / 60000;
      if (listenedMinutes >= 5) {
        markAsCompleted();
      }

      // Reset da sessão
      sessionIdRef.current = null;
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Cleanup ao desmontar componente
  useEffect(() => {
    return () => {
      if (sessionIdRef.current) {
        updateDuration();
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if ('mediaSession' in navigator && (liveMetadata || program)) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: liveMetadata?.title || program.title,
        artist: liveMetadata?.artist || program.host,
        artwork: [
          { src: liveMetadata?.artwork || program.image, sizes: '512x512', type: 'image/png' }
        ]
      });
      navigator.mediaSession.setActionHandler('play', onTogglePlayback);
      navigator.mediaSession.setActionHandler('pause', onTogglePlayback);
    }
  }, [liveMetadata, program, onTogglePlayback]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate, audioRef]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) {
      setIsMuted(false);
      setPrevVolume(val);
    } else {
      setIsMuted(true);
    }
    localStorage.setItem('praise-volume', val.toString());
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume > 0.05 ? prevVolume : 0.8);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  };

  const skip30Forward = () => {
    console.log('Skip forward 30s - not available for live streams');
  };

  const skip30Backward = () => {
    console.log('Skip backward 30s - not available for live streams');
  };

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="w-5 h-5" />;
    if (volume < 0.5) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  };

  useEffect(() => {
    if (showSchedule || isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showSchedule, isExpanded]);

  return (
    <>
      {/* Inject animation CSS globally */}
      <LivePulseAnimation />

      {/* SCHEDULE DRAWER - LIVE + next 4 */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-full md:w-96 z-[100] bg-white dark:bg-[#121212] transition-transform duration-300 flex flex-col shadow-2xl ${showSchedule ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-lg font-semibold text-black dark:text-white">Schedule</h2>
          <button 
            onClick={() => setShowSchedule(false)} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-black dark:text-white" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto pb-20 md:pb-0">
          {/* LIVE Program */}
          <div className="p-3 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-start space-x-3">
              <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                <img src={program.image} className="w-full h-full object-cover" alt={program.title} />
              </div>
              <div className="flex flex-col min-w-0 flex-grow">
                <span className="font-bold text-base text-black dark:text-white leading-tight mb-1 truncate">
                  {program.title}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">
                  {program.host}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {formatTimeToAmPm(program.startTime)} - {formatTimeToAmPm(program.endTime)} • LIVE
                </span>
              </div>
            </div>
          </div>
          
          {/* Next 4 programs */}
          {queue && queue.slice(0, 4).map((prog, index) => (
            <div key={prog.id} className="p-3 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-start space-x-3">
                <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                  <img src={prog.image} className="w-full h-full object-cover" alt={prog.title} />
                </div>
                <div className="flex flex-col min-w-0 flex-grow">
                  <span className="font-bold text-base text-black dark:text-white leading-tight mb-1 truncate">
                    {prog.title}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">
                    {prog.host}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
                    {formatTimeToAmPm(prog.startTime)} - {formatTimeToAmPm(prog.endTime)}
                  </span>
                </div>
                <span className="text-xs font-medium text-[#00d9c9] mt-1">
                  {index + 2}°
                </span>
              </div>
            </div>
          ))}
          
          {/* Placeholder to ensure 5 programs */}
          {queue && queue.slice(0, 4).length < 4 && (
            <>
              {Array.from({ length: 4 - queue.slice(0, 4).length }).map((_, index) => (
                <div key={`placeholder-${index}`} className="p-3 border-b border-gray-100 dark:border-white/5">
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="flex flex-col min-w-0 flex-grow">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1 animate-pulse" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-1 animate-pulse" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
                    </div>
                    <span className="text-xs font-medium text-[#00d9c9] mt-1">
                      {queue.length + index + 2}°
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Overlay when drawer is open */}
      {showSchedule && (
        <div 
          className="fixed inset-0 bg-black/50 z-[99] md:hidden"
          onClick={() => setShowSchedule(false)}
        ></div>
      )}

      {/* MOBILE MINI-PLAYER */}
      {isPlaying && (
        <div 
          className={`fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-white/10 md:hidden transition-all duration-300 ${isExpanded ? 'h-auto' : 'h-[72px]'}`}
        >
          {!isExpanded ? (
            <div 
              className="flex items-center justify-between px-4 py-3 h-[72px]"
              onClick={() => {
                setIsExpanded(true);
                setShowSchedule(true);
              }}
            >
              <div className="flex flex-col min-w-0 flex-grow">
                <span className="text-base font-bold text-black dark:text-white leading-tight truncate">
                  {program.title}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 truncate leading-tight">
                  {program.host} • LIVE
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { 
                    e.stopPropagation();
                    onTogglePlayback(); 
                  }}
                  className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-black dark:border-white flex items-center justify-center bg-white dark:bg-[#121212]"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-black dark:text-white fill-current" />
                  ) : (
                    <Play className="w-4 h-4 text-black dark:text-white fill-current ml-0.5" />
                  )}
                </button>

                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setShowSchedule(true); 
                  }}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10">
                <span className="text-sm font-semibold text-black dark:text-white">Schedule</span>
                <button 
                  onClick={() => {
                    setIsExpanded(false);
                    setShowSchedule(false);
                  }}
                  className="p-2"
                >
                  <X className="w-5 h-5 text-black dark:text-white" />
                </button>
              </div>

              <div className="flex items-center space-x-3 px-4 py-4 border-b border-gray-100 dark:border-white/5">
                <div className="w-14 h-14 flex-shrink-0">
                  <img src={program.image} className="w-full h-full object-cover rounded" alt={program.title} />
                </div>
                <div className="flex flex-col min-w-0 flex-grow">
                  <span className="font-bold text-base text-black dark:text-white leading-tight mb-1 truncate">
                    {program.title}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">
                    with {program.host}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatTimeToAmPm(program.startTime)} - {formatTimeToAmPm(program.endTime)} • LIVE
                  </span>
                </div>
              </div>

              {/* REALISTIC LIVE INDICATOR - REPLACED STATIC BAR */}
              <div className="px-4 py-3">
                <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full relative overflow-hidden">
                  {/* Moving pulse dot for live streams */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#ff6600] shadow-[0_0_8px_rgba(255,102,0,0.8)] animate-live-pulse"
                    style={{ 
                      left: `${((Date.now() / 500) % 100)}%`,
                      transition: 'left 0.5s linear'
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center space-x-6 px-4 py-4">
                <button 
                  onClick={skip30Backward}
                  className="relative w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300"
                >
                  <RotateCcw className="w-5 h-5" strokeWidth={2} />
                  <span className="absolute text-[9px] font-bold mt-[2px]">30</span>
                </button>

                <button 
                  onClick={onTogglePlayback}
                  className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center shadow-lg"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <button 
                  onClick={skip30Forward}
                  className="relative w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300"
                >
                  <RotateCw className="w-5 h-5" strokeWidth={2} />
                  <span className="absolute text-[9px] font-bold mt-[2px]">30</span>
                </button>
              </div>

              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center space-x-2 flex-grow">
                  <button onClick={toggleMute} className="p-2">
                    <VolumeIcon />
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="flex-grow h-1 bg-gray-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                  />
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 w-6 text-right">
                    {Math.round((isMuted ? 0 : volume) * 10)}
                  </span>
                </div>

                <div className="flex items-center space-x-3 ml-4">
                  <button 
                    onClick={cyclePlaybackRate}
                    className="px-2.5 py-1 text-xs font-semibold text-black dark:text-white border border-gray-300 dark:border-white/30 rounded"
                  >
                    {playbackRate}×
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-[#00d9c9] rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-[#00d9c9] uppercase">LIVE</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DESKTOP PLAYER BAR */}
      {isPlaying && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-white/10 hidden md:flex flex-col transition-colors duration-300">
          {/* REALISTIC LIVE INDICATOR - REPLACED STATIC BAR */}
          <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 relative overflow-hidden">
            {/* Moving pulse dot for live streams */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#ff6600] shadow-[0_0_10px_rgba(255,102,0,0.9)] animate-live-pulse"
              style={{ 
                left: `${((Date.now() / 400) % 100)}%`,
                transition: 'left 0.4s linear'
              }}
            />
          </div>

          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center space-x-4 w-[30%] min-w-0">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200 dark:border-white/10 shadow-sm">
                <img src={program.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white tracking-tight leading-tight truncate text-[15px]">
                  {program.title}
                </h4>
                <p className="text-[11px] font-normal text-gray-500 dark:text-gray-400 truncate tracking-tight mt-0.5">
                  with {program.host}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-6">
              <button 
                onClick={skip30Backward}
                className="relative w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
              >
                <RotateCcw className="w-5 h-5" strokeWidth={2} />
                <span className="absolute text-[9px] font-bold mt-[2px]">30</span>
              </button>

              <button 
                onClick={onTogglePlayback}
                className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center hover:scale-105 transition-all active:scale-95 shadow-md"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button 
                onClick={skip30Forward}
                className="relative w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
              >
                <RotateCw className="w-5 h-5" strokeWidth={2} />
                <span className="absolute text-[9px] font-bold mt-[2px]">30</span>
              </button>

              {/* Listeners Counter Desktop - ao lado do botão play */}
              <div className="ml-2">
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 w-[30%]">
              <div 
                className="flex items-center space-x-2 relative"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <button onClick={toggleMute} className="p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  <VolumeIcon />
                </button>
                
                <div className={`flex items-center transition-all duration-200 overflow-hidden ${showVolumeSlider ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-gray-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                  />
                  <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-400 w-6 text-right">
                    {Math.round((isMuted ? 0 : volume) * 10)}
                  </span>
                </div>
              </div>

              <button 
                onClick={cyclePlaybackRate}
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white border border-gray-300 dark:border-white/20 rounded hover:border-black dark:hover:border-white transition-all"
              >
                {playbackRate}×
              </button>

              <button 
                onClick={() => setShowSchedule(true)}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
              >
                <List className="w-6 h-6" strokeWidth={2} />
              </button>

              <div className="flex items-center space-x-1.5 px-2">
                <div className="w-2 h-2 bg-[#00d9c9] rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-[#00d9c9] uppercase tracking-wider">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LivePlayerBar;