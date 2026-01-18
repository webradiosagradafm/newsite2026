import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Volume1, List, X, RotateCcw, RotateCw } from 'lucide-react';
import { Program } from '../types';

interface LivePlayerBarProps {
  isPlaying: boolean;
  onTogglePlayback: () => void;
  program: Program;
  liveMetadata?: { artist: string; title: string; artwork?: string } | null;
  queue?: Program[];
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const LivePlayerBar: React.FC<LivePlayerBarProps> = ({ isPlaying, onTogglePlayback, program, liveMetadata, queue = [], audioRef }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('praise-volume');
    return saved ? parseFloat(saved) : 0.8;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [isHoveringVolume, setIsHoveringVolume] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

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

  // Para streams ao vivo, os botões de skip não funcionam, mas mantemos a UI
  const skip30Forward = () => {
    // Não aplicável para stream ao vivo, mas mantém a UI consistente
    console.log('Skip forward 30s - not available for live streams');
  };

  const skip30Backward = () => {
    // Não aplicável para stream ao vivo, mas mantém a UI consistente
    console.log('Skip backward 30s - not available for live streams');
  };

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="w-5 h-5" />;
    if (volume < 0.5) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  };

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isExpanded]);

  return (
    <>
      {/* FULL SCREEN EXPANDED QUEUE/SCHEDULE */}
      <div 
        className={`fixed inset-0 z-[100] bg-white dark:bg-[#121212] transition-transform duration-300 flex flex-col ${isExpanded ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Clean Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-semibold uppercase tracking-tight text-black dark:text-white">Schedule</h2>
          <button 
            onClick={() => setIsExpanded(false)} 
            className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-7 h-7 text-black dark:text-white" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-grow overflow-y-auto">
          {/* Current Playing in List */}
          <div className="flex items-center p-6 border-b border-gray-100 dark:border-white/5 space-x-6 bg-gray-50/50 dark:bg-white/5">
            <div className="w-[84px] h-[84px] flex-shrink-0 shadow-sm">
               <img src={program.image} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex flex-col min-w-0 flex-grow">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-semibold text-[#ff6600] uppercase tracking-widest">Live Now</span>
              </div>
              <span className="font-semibold text-2xl text-black dark:text-white leading-none uppercase tracking-tight mb-1 truncate">
                {program.title}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm leading-tight uppercase tracking-tight mb-2 truncate">
                {program.host}
              </span>
              <span className="text-gray-400 dark:text-gray-500 text-[11px] font-medium uppercase tracking-widest">{program.startTime} - {program.endTime}</span>
            </div>
          </div>
          
          {/* Upcoming items */}
          {queue && queue.map((prog) => (
            <div key={prog.id} className="flex items-center p-6 border-b border-gray-100 dark:border-white/5 space-x-6 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
              <div className="w-[84px] h-[84px] flex-shrink-0 shadow-sm">
                <img src={prog.image} className="w-full h-full object-cover grayscale opacity-80" alt="" />
              </div>
              <div className="flex flex-col min-w-0 flex-grow">
                <span className="font-semibold text-2xl text-black dark:text-white leading-none uppercase tracking-tight mb-1 truncate">
                  {prog.title}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm leading-tight uppercase tracking-tight mb-2 truncate">
                  {prog.host}
                </span>
                <span className="text-gray-400 dark:text-gray-500 text-[11px] font-medium uppercase tracking-widest">{prog.startTime} - {prog.endTime}</span>
              </div>
            </div>
          ))}
          
          <div className="p-10 text-center">
            <p className="text-[10px] font-medium text-gray-300 dark:text-gray-600 uppercase tracking-widest">End of upcoming</p>
          </div>
        </div>
      </div>

      {/* MOBILE MINI-PLAYER (Bottom Sticky Bar) */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-white/10 md:hidden flex flex-col transition-transform ${isExpanded ? 'translate-y-full' : 'translate-y-0'}`}
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center justify-between px-5 py-3 h-[72px]">
          <div className="flex items-center flex-grow min-w-0 pr-4">
            <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 mr-3 border-2 border-gray-100 dark:border-white/10">
              <img src={program.image} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-2">
                 <div className="w-1.5 h-1.5 bg-[#ff6600] rounded-full animate-pulse"></div>
                 <span className="text-[12px] font-semibold text-black dark:text-white leading-tight uppercase tracking-tight">Praise FM USA</span>
              </div>
              <span className="text-[13px] text-gray-500 dark:text-gray-400 truncate leading-tight font-normal uppercase tracking-tight">
                {program.title}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
              className="p-2 text-gray-400 dark:text-gray-500"
            >
              <List className="w-6 h-6" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onTogglePlayback(); }}
              className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-black dark:border-white flex items-center justify-center bg-white dark:bg-[#121212] shadow-sm"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black dark:text-white fill-current" />
              ) : (
                <Play className="w-5 h-5 text-black dark:text-white fill-current ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP PLAYER BAR - ESTILO BBC SOUNDS */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-white/10 hidden md:flex flex-col transition-colors duration-300">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-100 dark:bg-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-[#ff6600] transition-all duration-1000" style={{ width: isPlaying ? '100%' : '0%' }}></div>
        </div>

        <div className="flex items-center justify-between px-8 py-4">
          {/* LEFT: Song/Program Info */}
          <div className="flex items-center space-x-4 w-[30%] min-w-0">
            <div className="w-14 h-14 rounded-sm overflow-hidden flex-shrink-0 border border-gray-200 dark:border-white/10 shadow-sm">
              <img src={program.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-white uppercase tracking-tight leading-tight truncate text-[15px]">
                {program.title}
              </h4>
              <p className="text-[11px] font-normal text-gray-500 dark:text-gray-400 truncate tracking-tight mt-0.5">
                {program.host}
              </p>
            </div>
          </div>

          {/* CENTER: Controls */}
          <div className="flex items-center justify-center space-x-6">
            {/* Skip -30s */}
            <button 
              onClick={skip30Backward}
              className="relative w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors group"
              title="Skip backward 30 seconds"
            >
              <RotateCcw className="w-5 h-5" strokeWidth={2} />
              <span className="absolute text-[9px] font-bold mt-[2px]">30</span>
            </button>

            {/* Play/Pause */}
            <button 
              onClick={onTogglePlayback}
              className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center hover:scale-105 transition-all active:scale-95 shadow-md"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {/* Skip +30s */}
            <button 
              onClick={skip30Forward}
              className="relative w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors group"
              title="Skip forward 30 seconds"
            >
              <RotateCw className="w-5 h-5" strokeWidth={2} />
              <span className="absolute text-[9px] font-bold mt-[2px]">30</span>
            </button>
          </div>

          {/* RIGHT: Volume, Speed, Menu, LIVE */}
          <div className="flex items-center justify-end space-x-4 w-[30%]">
            {/* Volume Control */}
            <div 
              className="flex items-center space-x-2 relative"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button 
                onClick={toggleMute} 
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                title="Mute/Unmute"
              >
                <VolumeIcon />
              </button>
              
              {/* Volume Slider */}
              <div className={`flex items-center transition-all duration-200 overflow-hidden ${showVolumeSlider ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-gray-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                  style={{
                    background: `linear-gradient(to right, ${isMuted ? '#e5e7eb' : '#000'} 0%, ${isMuted ? '#e5e7eb' : '#000'} ${(isMuted ? 0 : volume) * 100}%, #e5e7eb ${(isMuted ? 0 : volume) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-400 w-6 text-right">
                  {Math.round((isMuted ? 0 : volume) * 10)}
                </span>
              </div>
              
              {/* Mute button when slider hidden */}
              {!showVolumeSlider && (
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-6 text-center">
                  Mute
                </span>
              )}
            </div>

            {/* Playback Speed */}
            <button 
              onClick={cyclePlaybackRate}
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white border border-gray-300 dark:border-white/20 rounded hover:border-black dark:hover:border-white transition-all"
              title="Playback speed"
            >
              {playbackRate}×
            </button>

            {/* Queue/Schedule */}
            <button 
              onClick={() => setIsExpanded(true)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
              title="Open Schedule"
            >
              <List className="w-6 h-6" strokeWidth={2} />
            </button>

            {/* LIVE Indicator */}
            <div className="flex items-center space-x-1.5 px-2">
              <div className="w-2 h-2 bg-[#00d9c9] rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-[#00d9c9] uppercase tracking-wider">LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LivePlayerBar;