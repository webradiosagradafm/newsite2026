```javascript
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Volume1, List, X, RotateCcw, RotateCw } from 'lucide-react';
import { Program } from '../types';
import { supabase } from '../lib/supabase';

interface LivePlayerBarProps {
  isPlaying: boolean;
  onTogglePlayback: () => void;
  program: Program;
  queue?: Program[];
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const LivePlayerBar: React.FC<LivePlayerBarProps> = ({ isPlaying, onTogglePlayback, program, queue = [], audioRef }) => {

  const [progress, setProgress] = useState(0);

  // 🔥 PROGRESS BAR (COM -2H + AM/PM)
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const now = new Date();

        const parseTime = (timeStr: string) => {
          const d = new Date();

          const isAMPM = timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm');

          let hours = 0;
          let minutes = 0;

          if (isAMPM) {
            const [time, modifier] = timeStr.split(' ');
            [hours, minutes] = time.split(':').map(Number);

            if (modifier.toLowerCase() === 'pm' && hours !== 12) hours += 12;
            if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0;
          } else {
            [hours, minutes] = timeStr.split(':').map(Number);
          }

          // ajuste -2h
          hours = hours - 2;

          d.setHours(hours, minutes || 0, 0, 0);
          return d;
        };

        const start = parseTime(program.startTime);
        const end = parseTime(program.endTime);

        const total = end.getTime() - start.getTime();
        const elapsed = now.getTime() - start.getTime();

        let percent = (elapsed / total) * 100;
        percent = Math.max(0, Math.min(100, percent));

        setProgress(percent);
      } catch (e) {
        console.log('Progress error:', e);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [program]);

  return (
    <>
      {isPlaying && (
        <>
          {/* MOBILE */}
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#121212] border-t md:hidden">
            
            {/* 🔥 BARRA NOVA */}
            <div className="px-4 py-2">
              <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ff6600] transition-all duration-1000"
                  style={{ width: progress + "%" }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm">{program.title}</span>

              <button onClick={onTogglePlayback}>
                {isPlaying ? <Pause /> : <Play />}
              </button>
            </div>
          </div>

          {/* DESKTOP */}
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#121212] border-t hidden md:flex flex-col">
            
            {/* 🔥 BARRA NOVA */}
            <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 overflow-hidden">
              <div
                className="h-full bg-[#ff6600] transition-all duration-1000"
                style={{ width: progress + "%" }}
              />
            </div>

            <div className="flex items-center justify-between px-6 py-4">
              <span>{program.title}</span>

              <button onClick={onTogglePlayback}>
                {isPlaying ? <Pause /> : <Play />}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LivePlayerBar;
```
