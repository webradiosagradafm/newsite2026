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
  const [showSchedule, setShowSchedule] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('praise-volume');
    return saved ? parseFloat(saved) : 0.8;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

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
      {/* SCHEDULE DRAWER - Só LIVE + próximos 4 */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-full md:w-96 z-[100] bg-white dark:bg-[#121212] transition-transform duration-300 flex flex-col shadow-2xl ${showSchedule ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-lg font-semibold text-black dark:text-white">Schedule</h2>
          <button 
            onClick={() => setShowSchedule(false)} 
            className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-black dark:text-white" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto pb-20 md:pb-0">
          {/* Programa LIVE */}
          <div className="p-4 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-start space-x-3">
              <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                <img src={program.image} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex flex-col min-w-0 flex-grow">
                <span className="font-bold text-base text-black dark:text-white leading-tight mb-1">
                  {program.title}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {program.host}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                  {program.startTime} - {program.endTime}
                </span>
              </div>
            </div>
          </div>
          
          {/* Próximos 4 programas */}
          {queue && queue.slice(0, 4).map((prog) => (
            <div key={prog.id} className="p-4 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-start space-x-3">
                <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                  <img src={prog.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex flex-col min-w-0 flex-grow">
                  <span className="font-bold text-base text-black dark:text-white leading-tight mb-1">
                    {prog.title}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {prog.host}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {prog.startTime} - {prog.endTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay quando drawer aberto */}
      {showSchedule && (
        <div 
          className="fixed inset-0 bg-black/50 z-[99]"
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
              className="flex items-center justify-between px-5 py-3 h-[72px]"
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
                  {program.title} with {program.host}
                </span>
              </div>
              
              <button 
                onClick={(e) => { 
                  e.stopPropagation();
                  onTogglePlayback(); 
                }}
                className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-black dark:border-white flex items-center justify-center bg-white dark:bg-[#121212]"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-black dark:text-white fill-current" />
                ) : (
                  <Play className="w-5 h-5 text-black dark:text-white fill-current ml-0.5" />
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-white/10">
                <span className="text-sm font-semibold text-black dark:text-white">Now Playing</span>
                <button 
                  onClick={() => {
                    setIsExpanded(false);
                    setShowSchedule(false);
                  }}
                  className="p-1"
                >
                  <X className="w-6 h-6 text-black dark:text-white" />
                </button>
              </div>

              <div className="flex items-center space-x-4 px-5 py-6 border-b border-gray-100 dark:border-white/5">
                <div className="w-20 h-20 flex-shrink-0">
                  <img src={program.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex flex-col min-w-0 flex-grow">
                  <span className="font-bold text-lg text-black dark:text-white leading-tight mb-1 truncate">
                    {program.title}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">
                    with {program.host}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {program.startTime} - {program.endTime}
                  </span>
                </div>
              </div>

              <div className="px-5 py-4">
                <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full relative">
                  <div className="absolute top-0 left-0 h-full bg-[#ff6600] rounded-full transition-all" style={{ width: isPlaying ? '60%' : '0%' }}></div>
                  <div className="absolute top-1/2 -translate-y-1/2 bg-[#ff6600] w-3 h-3 rounded-full" style={{ left: isPlaying ? '60%' : '0%' }}></div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-8 px-5 py-6">
                <button 
                  onClick={skip30Backward}
                  className="relative w-12 h-12 flex items-center justify-center text-gray-700 dark:text-gray-300"
                >
                  <RotateCcw className="w-6 h-6" strokeWidth={2} />
                  <span className="absolute text-[10px] font-bold mt-[3px]">30</span>
                </button>

                <button 
                  onClick={onTogglePlayback}
                  className="w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center shadow-lg"
                >
                  {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-0.5" />}
                </button>

                <button 
                  onClick={skip30Forward}
                  className="relative w-12 h-12 flex items-center justify-center text-gray-700 dark:text-gray-300"
                >
                  <RotateCw className="w-6 h-6" strokeWidth={2} />
                  <span className="absolute text-[10px] font-bold mt-[3px]">30</span>
                </button>
              </div>

              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center space-x-3 flex-grow">
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

                <div className="flex items-center space-x-4 ml-6">
                  <button 
                    onClick={cyclePlaybackRate}
                    className="px-3 py-1.5 text-sm font-semibold text-black dark:text-white border border-gray-300 dark:border-white/30 rounded"
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
          <div className="w-full h-1 bg-gray-100 dark:bg-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-[#ff6600] transition-all duration-1000" style={{ width: isPlaying ? '100%' : '0%' }}></div>
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