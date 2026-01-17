import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, ListMusic, X } from 'lucide-react';
import { SCHEDULES } from '../constants';

const getChicagoDate = () => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }));
};

export default function LivePlayerBar() {
  // O estado 'isVisible' controla se a barra aparece. 
  // Ela começa oculta e você deve chamar setIsVisible(true) no seu botão de Play principal.
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [now, setNow] = useState(getChicagoDate());

  useEffect(() => {
    const timer = setInterval(() => setNow(getChicagoDate()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Encontra o programa atual baseado no SCHEDULES e hora de Chicago
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

  // Se não foi dado o play inicial, não renderiza nada
  if (!isVisible) {
    // Apenas para teste: Você pode colocar este onClick no seu botão de Play do Hero/Topo
    return (
      <button 
        onClick={() => { setIsVisible(true); setIsPlaying(true); }}
        className="fixed top-4 right-4 z-[1000] bg-[#ff6600] text-white p-3 rounded-full md:hidden"
      >
        <Play size={20} fill="currentColor" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] animate-in slide-in-from-bottom-full duration-500">
      
      {/* QUEUE / SCHEDULE (Design BBC) */}
      {showQueue && (
        <div className="hidden md:block absolute bottom-[90px] right-6 w-[350px] bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl">
          <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
            <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-black dark:text-white">Up Next</h3>
            <button onClick={() => setShowQueue(false)}><X size={16} /></button>
          </div>
          <div className="p-4 text-[11px] font-bold text-gray-500 uppercase text-center">
            Chicago Time: {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )}

      {/* PLAYER BAR */}
      <div className="h-[85px] bg-white dark:bg-[#0c0c0c] border-t border-gray-100 dark:border-white/5 flex items-center px-6 relative">
        
        {/* Barra de Progresso Laranja (BBC Style) */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gray-100 dark:bg-white/10">
          <div className="h-full bg-[#ff6600] w-[30%] transition-all duration-1000" />
        </div>

        {/* LADO ESQUERDO: INFO DO PROGRAMA (Aqui aparece a foto do Daniel Brooks via Cloudinary) */}
        <div className="flex items-center space-x-4 w-1/3 min-w-0">
          <div className="relative flex-shrink-0">
            <img 
              src={currentProgram.image} 
              className="w-14 h-14 rounded-full object-cover border-2 border-transparent shadow-md" 
              alt={currentProgram.host}
              onError={(e) => { e.currentTarget.src = 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882822/Praise_FM_Worship_ypenw8.png' }}
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0c0c0c]">
              <span className="text-[10px] font-black text-white">1</span>
            </div>
          </div>
          <div className="min-w-0">
            <h4 className="text-[14px] font-black uppercase tracking-tighter text-black dark:text-white truncate leading-none mb-1">
              {currentProgram.title}
            </h4>
            <p className="text-[12px] text-gray-500 font-bold truncate">
              {currentProgram.host}
            </p>
          </div>
        </div>

        {/* CENTRO: CONTROLES DE REPRODUÇÃO */}
        <div className="flex-1 flex items-center justify-center space-x-8 md:space-x-12">
          <button className="hidden lg:flex flex-col items-center text-gray-400 hover:text-black dark:hover:text-white opacity-50 hover:opacity-100 transition-all">
            <RotateCcw size={18} />
            <span className="text-[8px] font-black uppercase mt-1">Start</span>
          </button>

          <button className="relative text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <SkipBack size={26} strokeWidth={1.5} />
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold mt-1">20</span>
          </button>

          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full border-2 border-black dark:border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-black dark:text-white"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>

          <button className="relative text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <SkipForward size={26} strokeWidth={1.5} />
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold mt-1">20</span>
          </button>
        </div>

        {/* DIREITA: VOLUME E BOTÃO SCHEDULE */}
        <div className="w-1/3 flex items-center justify-end space-x-6">
          <div className="hidden md:flex items-center space-x-3 group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
              <path d="M11 5L6 9H2V15H6L11 19V5Z" />
              <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12" />
            </svg>
            <div className="w-20 h-1 bg-gray-200 dark:bg-white/10 rounded-full relative overflow-hidden">
               <div className="absolute h-full bg-[#ff6600] w-[70%]" />
            </div>
            <span className="text-[10px] font-black text-gray-400">1×</span>
          </div>

          <button 
            onClick={() => setShowQueue(!showQueue)}
            className={`p-2 rounded-full transition-all ${showQueue ? 'bg-[#ff6600] text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
          >
            <ListMusic size={24} />
          </button>
        </div>

      </div>
    </div>
  );
}