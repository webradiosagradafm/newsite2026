import React, { useState, useEffect } from 'react';
import { Users, Radio } from 'lucide-react';
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
    
    // Atualizar a cada 15 segundos
    const interval = setInterval(fetchLiveListeners, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveListeners = async () => {
    try {
      // Considera "ao vivo" quem teve atividade nos últimos 2 minutos
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('listeners')
        .select('user_id, created_at')
        .gte('created_at', twoMinutesAgo);

      if (error) {
        console.error('Erro ao buscar ouvintes:', error);
        return;
      }

      // Contar ouvintes únicos
      const uniqueListeners = new Set(data?.map(l => l.user_id) || []);
      setLiveListeners(uniqueListeners.size);
      setIsLoading(false);
    } catch (err) {
      console.error('Erro ao conectar com Supabase:', err);
      setIsLoading(false);
    }
  };

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
        <span className="text-sm font-bold text-gray-900 dark:text-white">
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
        <Users className="w-4 h-4 text-gray-700 dark:text-gray-300" />
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
          <div className="w-10 h-10 bg-[#00d9c9]/20 rounded-lg flex items-center justify-center">
            <Radio className="w-5 h-5 text-[#00d9c9]" />
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
