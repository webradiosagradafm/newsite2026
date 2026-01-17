
import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Volume1, List, X } from 'lucide-react';
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
    }
  }, [volume, isMuted, audioRef]);

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
        className={`fixed inset-0 z-[100] bg-white transition-transform duration-300 flex flex-col ${isExpanded ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Clean Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-medium uppercase tracking-tighter text-black">Schedule</h2>
          <button 
            onClick={() => setIsExpanded(false)} 
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-7 h-7 text-black" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-grow overflow-y-auto">
          {/* Current Playing in List */}
          <div className="flex items-center p-6 border-b border-gray-100 space-x-6 bg-gray-50/50">
            <div className="w-[84px] h-[84px] flex-shrink-0 shadow-sm">
               <img src={program.image} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex flex-col min-w-0 flex-grow">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-medium text-[#ff6600] uppercase tracking-widest">Live Now</span>
              </div>
              <span className="font-medium text-2xl text-black leading-none uppercase tracking-tighter mb-1 truncate">
                {program.title}
              </span>
              <span className="text-gray-500 text-sm leading-tight uppercase tracking-tight mb-2 truncate">
                {program.host}
              </span>
              <span className="text-gray-400 text-[11px] font-medium uppercase tracking-widest">{program.startTime} - {program.endTime}</span>
            </div>
          </div>
          
          {/* Upcoming items */}
          {queue && queue.map((prog) => (
            <div key={prog.id} className="flex items-center p-6 border-b border-gray-100 space-x-6 hover:bg-gray-50/50 transition-colors">
              <div className="w-[84px] h-[84px] flex-shrink-0 shadow-sm">
                <img src={prog.image} className="w-full h-full object-cover grayscale opacity-80" alt="" />
              </div>
              <div className="flex flex-col min-w-0 flex-grow">
                <span className="font-medium text-2xl text-black leading-none uppercase tracking-tighter mb-1 truncate">
                  {prog.title}
                </span>
                <span className="text-gray-500 text-sm leading-tight uppercase tracking-tight mb-2 truncate">
                  {prog.host}
                </span>
                <span className="text-gray-400 text-[11px] font-medium uppercase tracking-widest">{prog.startTime} - {prog.endTime}</span>
              </div>
            </div>
          ))}
          
          <div className="p-10 text-center">
            <p className="text-[10px] font-medium text-gray-300 uppercase tracking-widest">End of upcoming</p>
          </div>
        </div>
      </div>

      {/* MOBILE MINI-PLAYER (Bottom Sticky Bar) */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 md:hidden flex flex-col transition-transform ${isExpanded ? 'translate-y-full' : 'translate-y-0'}`}
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center justify-between px-5 py-3 h-[72px]">
          <div className="flex items-center flex-grow min-w-0 pr-4">
            <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 mr-3 border-2 border-gray-100">
              <img src={program.image} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-2">
                 <div className="w-1.5 h-1.5 bg-[#ff6600] rounded-full animate-pulse"></div>
                 <span className="text-[12px] font-medium text-black leading-tight uppercase tracking-tighter">Praise FM USA</span>
              </div>
              <span className="text-[13px] text-gray-500 truncate leading-tight font-medium uppercase tracking-tight">
                {program.title}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
              className="p-2 text-gray-400"
            >
              <List className="w-6 h-6" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onTogglePlayback(); }}
              className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-black flex items-center justify-center bg-white shadow-sm"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black fill-current" />
              ) : (
                <Play className="w-5 h-5 text-black fill-current ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP PLAYER BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-[#000] h-[84px] border-t border-gray-200 dark:border-white/10 hidden md:flex flex-col transition-colors duration-300">
        <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-[#ff6600] transition-all duration-1000" style={{ width: isPlaying ? '100%' : '0%' }}></div>
        </div>

        <div className="flex-grow flex items-center justify-between px-10">
          <div className="flex items-center space-x-5 w-[30%] min-w-0">
            <div className="w-14 h-14 rounded-none overflow-hidden flex-shrink-0 border border-gray-200 dark:border-white/10 shadow-sm">
              <img src={program.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-white uppercase tracking-tighter leading-tight truncate text-[16px]">
                {program.title}
              </h4>
              <p className="text-[10px] font-medium text-[#ff6600] truncate uppercase tracking-[0.2em] mt-0.5">
                Live with {program.host}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center flex-grow space-x-12">
            <div 
              className="flex items-center space-x-3 group"
              onMouseEnter={() => setIsHoveringVolume(true)}
              onMouseLeave={() => setIsHoveringVolume(false)}
            >
              <button onClick={toggleMute} className="text-gray-900 dark:text-white hover:text-[#ff6600] transition-colors p-1">
                <VolumeIcon />
              </button>
              <div className={`flex items-center transition-all duration-300 overflow-hidden ${isHoveringVolume ? 'w-32 opacity-100' : 'w-0 opacity-0'}`}>
                <input 
                  type="range" min="0" max="1" step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#ff6600]"
                />
              </div>
            </div>

            <button 
              onClick={onTogglePlayback}
              className="w-14 h-14 bg-black dark:bg-[#ff6600] text-white rounded-full flex items-center justify-center hover:bg-[#ff6600] dark:hover:bg-white dark:hover:text-black transition-all active:scale-95 shadow-lg"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </button>
          </div>

          <div className="flex items-center justify-end space-x-8 w-[30%]">
            <button 
              onClick={() => setIsExpanded(true)}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-[#ff6600] dark:hover:text-[#ff6600] transition-all transform hover:scale-110"
              title="Open Schedule"
            >
              <List className="w-7 h-7" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LivePlayerBar;
