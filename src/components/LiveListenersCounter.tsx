import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface LiveListenersCounterProps {
  variant?: 'compact' | 'full' | 'minimal';
  className?: string;
}

const LiveListenersCounter: React.FC<LiveListenersCounterProps> = ({ 
  variant = 'compact',
  className = '' 
}) => {
  const [liveListeners, setLiveListeners] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLiveListeners();
    const interval = setInterval(fetchLiveListeners, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveListeners = async () => {
    try {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('listeners')
        .select('user_id, created_at')
        .gte('created_at', twoMinutesAgo);

      if (error) {
        console.error('Erro ao buscar ouvintes:', error);
        return;
      }

      const uniqueListeners = new Set(data?.map(l => l.user_id) || []);
      setLiveListeners(uniqueListeners.size);
      setIsLoading(false);
    } catch (err) {
      console.error('Erro ao conectar com Supabase:', err);
      setIsLoading(false);
    }
  };

  // Ícone SVG de usuários
  const UsersIcon = () => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );

  // Ícone SVG de rádio
  const RadioIcon = () => (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
    </svg>
  );

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-500 dark:text-gray-400">...</span>
      </div>
    );
  }

  // Variante MINIMAL - só o número e ícone
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-2 h-2 bg-[#00d9c9] rounded-full animate-pulse"></div>
        <div className="text-white">
          <UsersIcon />
        </div>
        <span className="text-sm font-bold text-white">
          {liveListeners}
        </span>
      </div>
    );
  }

  // Variante COMPACT - badge pequeno
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/10 rounded-full ${className}`}>
        <div className="w-2 h-2 bg-[#00d9c9] rounded-full animate-pulse"></div>
        <div className="text-gray-700 dark:text-gray-300">
          <UsersIcon />
        </div>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {liveListeners}
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          listening
        </span>
      </div>
    );
  }

  // Variante FULL - card maior com mais info
  return (
    <div className={`bg-white dark:bg-[#1a1a1a] rounded-xl p-4 border border-gray-200 dark:border-white/10 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#00d9c9]/20 rounded-lg flex items-center justify-center text-[#00d9c9]">
            <RadioIcon />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Live Now
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-[#00d9c9] rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-[#00d9c9] uppercase">LIVE</span>
        </div>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          {liveListeners}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {liveListeners === 1 ? 'listener' : 'listeners'}
        </span>
      </div>
    </div>
  );
};

export default LiveListenersCounter;
