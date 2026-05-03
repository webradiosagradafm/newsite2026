// LivePlayerBar.tsx - BBC Radio 1 Style
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Volume1, List, X, RotateCcw, RotateCw } from 'lucide-react';
import { Program } from '../types';
import { supabase } from '../lib/supabase';

interface LivePlayerBarProps {
  isPlaying: boolean;
  onTogglePlayback: () => void;
  program: Program;
  liveMetadata?: { artist: string; title: string; artwork?: string } | null;
  queue?: Program[];
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const formatTimeToAmPm = (timeString: string): string => {
  try {
    if (timeString.includes('AM') || timeString.includes('PM')) return timeString;
    const [hours, minutes] = timeString.split(':');
    let hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour}:${minutes || '00'} ${period}`;
  } catch { return timeString; }
};

const getListenerId = (): string => {
  let listenerId = localStorage.getItem('listener_id');
  if (!listenerId) {
    listenerId = crypto.randomUUID();
    localStorage.setItem('listener_id', listenerId);
  }
  return listenerId;
};

const LivePlayerBar: React.FC<LivePlayerBarProps> = ({ isPlaying, onTogglePlayback, program, liveMetadata, queue = [], audioRef }) => {
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
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted, audioRef]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) { setIsMuted(false); setPrevVolume(val); }
    else { setIsMuted(true); }
    localStorage.setItem('praise-volume', val.toString());
  };

  const toggleMute = () => {
    if (isMuted) { setIsMuted(false); setVolume(prevVolume > 0.05 ? prevVolume : 0.8); }
    else { setPrevVolume(volume); setIsMuted(true); }
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    setPlaybackRate(rates[(currentIndex + 1) % rates.length]);
  };

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="w-5 h-5" />;
    if (volume < 0.5) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  };

  useEffect(() => {
    if (showSchedule) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = 'unset'; }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showSchedule]);

  return (
    <>
      {/* SCHEDULE DRAWER */}
      <div className={`fixed top-0 right-0 bottom-0 w-full md:w-96 z-[100] bg-[#0A0A0A] transition-transform duration-300 flex flex-col shadow-2xl border-l border-gray-800 ${showSchedule ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <h2 className="text-lg font-black uppercase tracking-wider text-white">Schedule</h2>
          <button onClick={() => setShowSchedule(false)} className="p-2 hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto pb-20">
          {/* LIVE Program */}
          <div className="p-5 border-b border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-[#00FFD1] rounded-full animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-[#00FFD1]">On Air Now</span>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 flex-shrink-0 overflow-hidden">
                <img src={program.image} className="w-full h-full object-cover" alt={program.title} />
              </div>
              <div className="min-w-0 flex-grow">
                <span className="font-bold text-base text-white leading-tight truncate block">{program.title}</span>
                <span className="text-sm text-gray-400 truncate block">{program.host}</span>
              </div>
            </div>
          </div>

          {/* Next programs */}
          {queue.slice(0, 5).map((prog, index) => (
            <div key={prog.id} className="p-5 border-b border-gray-800">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 flex-shrink-0 overflow-hidden">
                  <img src={prog.image} className="w-full h-full object-cover" alt={prog.title} />
                </div>
                <div className="min-w-0 flex-grow">
                  <span className="font-bold text-base text-white leading-tight truncate block">{prog.title}</span>
                  <span className="text-sm text-gray-400 truncate block">{prog.host}</span>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {formatTimeToAmPm(prog.startTime)} - {formatTimeToAmPm(prog.endTime)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showSchedule && <div className="fixed inset-0 bg-black/70 z-[99] md:hidden" onClick={() => setShowSchedule(false)} />}

      {/* DESKTOP PLAYER BAR - BBC Style */}
      {isPlaying && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] bg-[#0A0A0A] border-t border-gray-800 hidden md:block">
          {/* Progress bar - Live pulse */}
          <div className="w-full h-[3px] bg-gray-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-[#00FFD1] animate-pulse"
              style={{ width: `${((Date.now() / 200) % 100)}%`, transition: 'width 0.3s linear' }} />
          </div>

          <div className="flex items-center justify-between px-6 py-4">
            {/* LEFT: Program info */}
            <div className="flex items-center space-x-4 w-[28%] min-w-0">
              <div className="w-12 h-12 flex-shrink-0 overflow-hidden">
                <img src={program.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white text-sm leading-tight truncate">{program.title}</h4>
                <p className="text-xs text-gray-500 truncate">{program.host}</p>
              </div>
            </div>

            {/* CENTER: Controls */}
            <div className="flex items-center justify-center space-x-8">
              <button className="relative w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <RotateCcw className="w-5 h-5" strokeWidth={2} />
                <span className="absolute text-[8px] font-bold mt-[2px]">30</span>
              </button>

              <button onClick={onTogglePlayback}
                className="w-14 h-14 bg-white hover:bg-[#00FFD1] text-black rounded-full flex items-center justify-center hover:scale-105 transition-all active:scale-95 shadow-lg">
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>

              <button className="relative w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <RotateCw className="w-5 h-5" strokeWidth={2} />
                <span className="absolute text-[8px] font-bold mt-[2px]">30</span>
              </button>
            </div>

            {/* RIGHT: Volume & controls */}
            <div className="flex items-center justify-end space-x-5 w-[28%]">
              {/* Volume */}
              <div className="flex items-center space-x-2" onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
                <button onClick={toggleMute} className="p-1.5 text-gray-400 hover:text-white transition-colors">
                  <VolumeIcon />
                </button>
                <div className={`flex items-center transition-all duration-200 overflow-hidden ${showVolumeSlider ? 'w-28 opacity-100' : 'w-0 opacity-0'}`}>
                  <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00FFD1]" />
                  <span className="ml-2 text-xs font-bold text-gray-400 w-8">{Math.round((isMuted ? 0 : volume) * 10)}</span>
                </div>
              </div>

              {/* Playback rate */}
              <button onClick={cyclePlaybackRate}
                className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 transition-all">
                {playbackRate}×
              </button>

              {/* Schedule */}
              <button onClick={() => setShowSchedule(true)} className="p-1.5 text-gray-400 hover:text-white transition-colors">
                <List className="w-5 h-5" strokeWidth={2} />
              </button>

              {/* LIVE indicator */}
              <div className="flex items-center space-x-2 px-2">
                <div className="w-2 h-2 bg-[#00FFD1] rounded-full animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-[#00FFD1]">Live</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE PLAYER BAR */}
      {isPlaying && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] bg-[#0A0A0A] border-t border-gray-800 md:hidden">
          <div className="w-full h-[3px] bg-gray-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-[#00FFD1] animate-pulse"
              style={{ width: `${((Date.now() / 200) % 100)}%` }} />
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3 min-w-0 flex-1" onClick={() => setShowSchedule(true)}>
              <div className="w-10 h-10 flex-shrink-0 overflow-hidden">
                <img src={program.image} className="w-full h-full object-cover" alt={program.title} />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-white text-sm leading-tight truncate block">{program.title}</span>
                <span className="text-xs text-gray-500 truncate block">{program.host} • LIVE</span>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-3">
              <button onClick={onTogglePlayback}
                className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center">
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <button onClick={() => setShowSchedule(true)} className="p-2 text-gray-400">
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LivePlayerBar;