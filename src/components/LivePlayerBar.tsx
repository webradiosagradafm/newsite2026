import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, ListMusic, X } from 'lucide-react';
import { SCHEDULES } from '../constants';

interface PlayerProps {
  isVisible: boolean; // Controla se o miniplayer aparece na tela
  isPlaying: boolean; // Controla se o áudio está tocando
  setIsPlaying: (playing: boolean) => void;
  onClose: () => void;
}

const getChicagoDate = () => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }));
};

export default function LivePlayerBar({ isVisible, isPlaying, setIsPlaying, onClose }: PlayerProps) {
  const [showQueue, setShowQueue] = useState(false);
  const [now, setNow] = useState(getChicagoDate());

  useEffect(() => {
    const timer = setInterval(() => setNow(getChicagoDate()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentProgram = useMemo(() => {
    const dayIndex = now.getDay();
    const todaySchedule = SCHEDULES[dayIndex] || SCHEDULES[1];
    const nowMin = now.getHours() * 60 + now.getMinutes();

    return todaySchedule.find(prog => {
      const [sH, sM] = prog.startTime.split(':').map(Number);
      const [eH, eM] = prog.endTime.split(':').map(Number);
      const start = sH * 60 + sM;
      let end = eH * 60 + eM;
      if (end === 0 || end <= start) end = 1440;
      return nowMin >= start && nowMin < end;
    }) || todaySchedule[0];
  }, [now]);

  // Se o play lá de cima não foi clicado, ele não aparece nem no PC nem no Mobile
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] animate-in slide-in-from-bottom-full">
      
      {/* QUEUE (Agenda) */}
      {showQueue && (
        <div className="absolute bottom-[90px] right-6 w-[350px] bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10 rounded-xl shadow-2xl">
          <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
            <h3 className="font-black text-[11px] uppercase tracking-widest">Schedule</h3>
            <button onClick={() => setShowQueue(false)}><X size={16} /></button>
          </div>
          <div className="p-4">
             <div className="flex items-center space-x-4">
                <img src={currentProgram.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                <div>
                   <p className="text-[12px] font-black uppercase leading-tight">{currentProgram.title}</p>
                   <p className="text-[10px] text-[#ff6600] font-bold">ON AIR NOW</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* BARRA DO MINI PLAYER */}
      <div className="h-[80px] md:h-[85px] bg-white dark:bg-[#0c0c0c] border-t border-gray-100 dark:border-white/5 flex items-center px-4 md:px-6 relative shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        
        {/* Progresso Laranja BBC */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-100 dark:bg-white/10">
          <div className="h-full bg-[#ff6600] w-[45%]" />
        </div>

        {/* LADO ESQUERDO: Daniel Brooks Foto */}
        <div className="flex items-center space-x-3 md:space-x-4 w-1/3 min-w-0">
          <div className="relative flex-shrink-0">
            <img 
              src={currentProgram.image} 
              className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-transparent" 
              alt={currentProgram.host}
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0c0c0c]">
              <span className="text-[10px] font-black text-white leading-none">1</span>
            </div>
          </div>
          <div className="min-w-0">
            <h4 className="text-[13px] md:text-[15px] font-black uppercase tracking-tighter text-black dark:text-white truncate leading-tight">
              {currentProgram.title}
            </h4>
            <p className="text-[11px] md:text-[12px] text-gray-500 font-bold truncate">
              {currentProgram.host}
            </p>
          </div>
        </div>

        {/* CENTRO: Play/Pause centralizado */}
        <div className="flex-1 flex items-center justify-center space-x-6 md:space-x-12">
          <button className="text-gray-400 hover:text-black dark:hover:text-white transition-colors relative">
            <SkipBack size={24} md:size={28} strokeWidth={1.5} />
            <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold mt-1">20</span>
          </button>

          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-black dark:border-white flex items-center justify-center hover:scale-105 transition-all text-black dark:text-white"
          >
            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
          </button>

          <button className="text-gray-400 hover:text-black dark:hover:text-white transition-colors relative">
            <SkipForward size={24} md:size={28} strokeWidth={1.5} />
            <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold mt-1">20</span>
          </button>
        </div>

        {/* DIREITA: Volume e Lista */}
        <div className="w-1/3 flex items-center justify-end space-x-4 md:space-x-6">
          <button 
            onClick={() => setShowQueue(!showQueue)}
            className={`p-2 rounded-full transition-all ${showQueue ? 'bg-[#ff6600] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
          >
            <ListMusic size={22} md:size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}