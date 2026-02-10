import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Volume1, List, X, RotateCcw, RotateCw } from 'lucide-react';
import { Program } from '../types';
import { supabase } from '../lib/supabase'; // Ajuste o caminho conforme sua configuração

interface LivePlayerBarProps {
  isPlaying: boolean;
  onTogglePlayback: () => void;
  program: Program;
  liveMetadata?: { artist: string; title: string; artwork?: string } | null;
  queue?: Program[];
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

// Função para gerar/pegar ID único do ouvinte
const getListenerId = (): string => {
  let listenerId = localStorage.getItem('listener_id');
  if (!listenerId) {
    listenerId = crypto.randomUUID();
    localStorage.setItem('listener_id', listenerId);
  }
  return listenerId;
};

const LivePlayerBar: React.FC<LivePlayerBarProps> = ({ 
  isPlaying, 
  onTogglePlayback, 
  program, 
  liveMetadata, 
  queue = [], 
  audioRef 
}) => {
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

  // Estados para rastreamento
  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Registrar quando começar a ouvir
  const trackListeningStart = async () => {
    const listenerId = getListenerId();
    const sessionId = crypto.randomUUID();
    sessionIdRef.current = sessionId;
    startTimeRef.current = Date.now();

    try {
      const { error } = await supabase
        .from('listeners')
        .insert({
          user_id: listenerId,
          session_id: sessionId,
          audio_id: program.id || program.title, // use program.id se existir
          duration_seconds: 0,
          completed: false
        });

      if (error) {
        console.error('Erro ao registrar ouvinte:', error);
      } else {
        console.log('✅ Ouvinte registrado com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao conectar com Supabase:', err);
    }
  };

  // Atualizar duração periodicamente
  const updateDuration = async () => {
    if (!sessionIdRef.current) return;

    const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

    try {
      await supabase
        .from('listeners')
        .update({ duration_seconds: durationSeconds })
        .eq('session_id', sessionIdRef.current);
    } catch (err) {
      console.error('Erro ao atualizar duração:', err);
    }
  };

  // Marcar como completado (opcional - para streams ao vivo, você pode definir um critério)
  const markAsCompleted = async () => {
    if (!sessionIdRef.current) return;

    try {
      const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      await supabase
        .from('listeners')
        .update({ 
          completed: true,
          duration_seconds: durationSeconds
        })
        .eq('session_id', sessionIdRef.current);

      console.log('✅ Sessão marcada como completa');
    } catch (err) {
      console.error('Erro ao marcar como completado:', err);
    }
  };

  // Effect para rastrear quando começar/parar de tocar
  useEffect(() => {
    if (isPlaying && !sessionIdRef.current) {
      // Começou a ouvir
      trackListeningStart();

      // Atualizar duração a cada 10 segundos
      durationIntervalRef.current = setInterval(updateDuration, 10000);
    } else if (!isPlaying && sessionIdRef.current) {
      // Parou de ouvir
      updateDuration(); // Última atualização
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      // Opcional: marcar como completo se ouviu mais de X minutos
      const listenedMinutes = (Date.now() - startTimeRef.current) / 60000;
      if (listenedMinutes >= 5) { // Critério: 5 minutos ou mais
        markAsCompleted();
      }

      // Reset da sessão
      sessionIdRef.current = null;
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Cleanup ao desmontar componente
  useEffect(() => {
    return () => {
      if (sessionIdRef.current) {
        updateDuration();
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

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

  // ... resto do código JSX permanece igual
  return (
    <>
      {/* Todo o JSX existente permanece exatamente igual */}
      {/* ... */}
    </>
  );
};

export default LivePlayerBar;
