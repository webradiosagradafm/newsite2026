
import React, { useState, useEffect, useRef } from 'react';
import { SCHEDULES } from '../constants';
import { Program } from '../types';
import { Play } from 'lucide-react';

const getChicagoTime = () => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Chicago',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(now);
  const h = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
  const m = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
  return { h, m, total: h * 60 + m, day: now.toLocaleDateString('en-US', { timeZone: 'America/Chicago', weekday: 'short' }) };
};

const format12h = (time24: string) => {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
};

interface ScheduleLoopProps {
  onNavigateToProgram?: (program: Program) => void;
}

const ScheduleLoop: React.FC<ScheduleLoopProps> = ({ onNavigateToProgram }) => {
  const [chicagoTime, setChicagoTime] = useState(getChicagoTime());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setChicagoTime(getChicagoTime()), 30000);
    return () => clearInterval(timer);
  }, []);

  const dayIndex = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })).getDay();
  const schedule = SCHEDULES[dayIndex] || SCHEDULES[1];
  
  const isCurrent = (start: string, end: string) => {
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    
    const startTime = sH * 60 + sM;
    const endTime = eH === 0 ? 24 * 60 : eH * 60 + eM;
    
    return chicagoTime.total >= startTime && chicagoTime.total < endTime;
  };

  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('.is-active');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [dayIndex]);

  return (
    <div className="bg-white dark:bg-[#111] text-gray-900 dark:text-white py-3 overflow-hidden border-b border-gray-100 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        <div 
          ref={scrollRef}
          className="flex space-x-12 overflow-x-auto no-scrollbar scroll-smooth py-1 items-center flex-grow"
        >
          {schedule.map((prog) => {
            const active = isCurrent(prog.startTime, prog.endTime);
            return (
              <div 
                key={prog.id} 
                onClick={() => onNavigateToProgram?.(prog)}
                className={`flex-shrink-0 transition-all duration-300 cursor-pointer group relative flex items-center space-x-4 ${active ? 'opacity-100 is-active' : 'opacity-40 hover:opacity-100'}`}
              >
                <span className={`text-[11px] font-medium tracking-tighter w-20 transition-colors ${active ? 'text-white bg-[#ff6600] px-1 text-center' : 'text-gray-400 dark:text-gray-500'}`}>
                  {format12h(prog.startTime)}
                </span>
                <div className="flex flex-col min-w-[140px]">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium whitespace-nowrap uppercase tracking-tight transition-colors ${active ? 'text-[#ff6600] underline underline-offset-4 decoration-[#ff6600]' : 'text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white'}`}>
                      {prog.title}
                    </span>
                    {active && <Play className="w-2.5 h-2.5 fill-current text-[#ff6600]" />}
                  </div>
                  <span className="text-[9px] uppercase font-normal text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors">
                    {prog.host}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScheduleLoop;
