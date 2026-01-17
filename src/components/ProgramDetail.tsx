
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Volume2, Clock, ArrowLeft, Calendar, Music, Activity, History as HistoryIcon, Loader2 } from 'lucide-react';
import { Program } from '../types';
import { SCHEDULES } from '../constants';
import { supabase } from '../lib/supabase';

interface PlayedTrack {
  artist: string;
  title: string;
  label: string;
  image: string;
  isLive?: boolean;
  timestamp: number;
}

interface DailyHistory {
  [date: string]: PlayedTrack[];
}

interface ProgramDetailProps {
  program: Program;
  onBack: () => void;
  onViewSchedule: () => void;
  onListenClick: () => void;
  isPlaying: boolean;
}

const METADATA_URL = 'https://api.zeno.fm/mounts/metadata/subscribe/hvwifp8ezc6tv';

const getChicagoTotalMinutes = () => {
  const now = new Date();
  const chicagoDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  return chicagoDate.getHours() * 60 + chicagoDate.getMinutes();
};

const getLocalDateString = () => {
  return new Date().toISOString().split('T')[0];
};

const format12h = (time24: string) => {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
};

const ProgramDetail: React.FC<ProgramDetailProps> = ({ program, onBack, onViewSchedule, onListenClick, isPlaying }) => {
  const [nowMinutes, setNowMinutes] = useState(getChicagoTotalMinutes());
  const [loadingHistory, setLoadingHistory] = useState(true);
  const eventSourceRef = useRef<EventSource | null>(null);
  
  const [historyGroups, setHistoryGroups] = useState<DailyHistory>(() => {
    const storageKey = `history_v2_${program.id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  // Fetch history from Supabase on mount
  useEffect(() => {
    const loadSavedHistory = async () => {
      setLoadingHistory(true);
      try {
        const { data, error } = await supabase
          .from('program_history')
          .select('*')
          .eq('program_id', program.id)
          .order('played_at', { ascending: false })
          .limit(100);

        if (data && data.length > 0) {
          const grouped: DailyHistory = {};
          data.forEach(item => {
            const date = item.played_at.split('T')[0];
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push({
              artist: item.artist,
              title: item.title,
              label: item.label || "PREVIOUSLY PLAYED",
              image: item.image_url,
              timestamp: new Date(item.played_at).getTime(),
              isLive: false
            });
          });
          setHistoryGroups(grouped);
          localStorage.setItem(`history_v2_${program.id}`, JSON.stringify(grouped));
        }
      } catch (err) {
        console.error("Failed to load history from DB", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadSavedHistory();
  }, [program.id]);

  useEffect(() => {
    const timer = setInterval(() => setNowMinutes(getChicagoTotalMinutes()), 30000);
    return () => clearInterval(timer);
  }, []);

  const { isCurrentlyLive, nextProgram } = useMemo(() => {
    const [sH, sM] = program.startTime.split(':').map(Number);
    const [eH, eM] = program.endTime.split(':').map(Number);
    const start = sH * 60 + sM;
    let end = eH * 60 + eM;
    if (end === 0 || end <= start) end = 24 * 60;
    
    const live = nowMinutes >= start && nowMinutes < end;

    const now = new Date();
    const chicagoDay = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' })).getDay();
    const daySchedule = SCHEDULES[chicagoDay] || SCHEDULES[1];
    const currentIndex = daySchedule.findIndex(p => p.id === program.id);
    const next = currentIndex !== -1 && currentIndex < daySchedule.length - 1 
      ? daySchedule[currentIndex + 1] 
      : (currentIndex === daySchedule.length - 1 ? (SCHEDULES[(chicagoDay + 1) % 7] || daySchedule)[0] : null);

    return { isCurrentlyLive: live, nextProgram: next };
  }, [program, nowMinutes]);

  useEffect(() => {
    if (!isCurrentlyLive) return;

    const connectMetadata = () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
      try {
        const es = new EventSource(METADATA_URL);
        eventSourceRef.current = es;
        
        es.onmessage = async (event) => {
          if (!event.data) return;
          try {
            const data = JSON.parse(event.data);
            const streamTitle = data.streamTitle || "";
            if (streamTitle.includes(' - ')) {
              const [artistPart, ...titleParts] = streamTitle.split(' - ');
              const artist = artistPart.trim();
              const title = titleParts.join(' - ').trim();
              if (!artist || !title) return;

              const blocked = ['praise fm', 'commercial', 'spot', 'promo', 'station id', 'sweeper'].some(k => 
                title.toLowerCase().includes(k) || artist.toLowerCase().includes(k)
              );
              if (blocked) return;

              const todayKey = getLocalDateString();
              const trackTimestamp = Date.now();
              const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(artist + title)}/200/200`;
              
              const newTrack: PlayedTrack = {
                artist, title, label: "LIVE ON PRAISE FM",
                image: imageUrl,
                isLive: true, timestamp: trackTimestamp
              };

              // Deduplication and local update
              setHistoryGroups(prev => {
                const currentDayTracks = prev[todayKey] || [];
                // Exact match check for last track to prevent duplicates
                if (currentDayTracks.length > 0 && currentDayTracks[0].title === newTrack.title && currentDayTracks[0].artist === newTrack.artist) return prev;
                
                const updatedDay = [newTrack, ...currentDayTracks.map(t => ({ ...t, isLive: false }))].slice(0, 50);
                const newState = { ...prev, [todayKey]: updatedDay };
                localStorage.setItem(`history_v2_${program.id}`, JSON.stringify(newState));
                
                // Async push to Supabase
                supabase.from('program_history').insert([{
                  program_id: program.id,
                  artist,
                  title,
                  image_url: imageUrl,
                  played_at: new Date(trackTimestamp).toISOString(),
                  label: "RECORDED LIVE"
                }]).then(({ error }) => {
                   if (error) console.error("History sync error:", error.message);
                });

                return newState;
              });
            }
          } catch (err) {
            console.error("Metadata parse error", err);
          }
        };
        es.onerror = () => {
          es.close();
          setTimeout(connectMetadata, 5000);
        };
      } catch (err) {
        console.error("Connection failed", err);
      }
    };

    connectMetadata();
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [isCurrentlyLive, program.id]);

  const sortedDateKeys = useMemo(() => Object.keys(historyGroups).sort((a, b) => b.localeCompare(a)), [historyGroups]);

  return (
    <div className="bg-[#121212] min-h-screen text-white font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white transition-colors group mb-6">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[11px] font-medium uppercase tracking-[0.2em]">Back to Home</span>
        </button>
        <h1 className="text-4xl md:text-6xl font-medium uppercase tracking-tighter text-white leading-tight mb-8">
          {program.title}
        </h1>
      </div>

      <div className="bg-[#1a1a1a] border-b border-white/5 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button className="py-4 text-[#ff6600] border-b-2 border-[#ff6600] font-medium text-[11px] uppercase tracking-widest">Home</button>
          </div>
          <button onClick={onViewSchedule} className="flex items-center text-[#ff6600] space-x-2 hover:underline font-medium text-[11px] py-4 uppercase tracking-widest">
             <Calendar className="w-4 h-4" />
             <span>View Schedule</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="relative aspect-video overflow-hidden mb-12 shadow-2xl group bg-[#000]">
              <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              {isCurrentlyLive && (
                <button onClick={onListenClick} className="absolute bottom-8 left-8 bg-[#ff6600] hover:bg-white text-black px-8 py-4 flex items-center space-x-4 transition-all">
                  <Volume2 className={`w-8 h-8 ${isPlaying ? 'animate-pulse' : ''}`} />
                  <span className="text-2xl font-medium uppercase tracking-tighter">{isPlaying ? 'On Air Now' : 'Listen live'}</span>
                </button>
              )}
            </div>

            <div className="mb-12">
              <h2 className="bbc-section-title text-3xl font-medium mb-6 tracking-tighter uppercase dark:text-white">About</h2>
              <p className="text-lg text-gray-300 font-normal tracking-tight leading-relaxed mb-8">{program.description}</p>
            </div>

            <div className="bg-white text-black p-0 mb-12 shadow-2xl border border-gray-100 max-w-lg">
              <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-2xl font-medium uppercase tracking-tighter">Music Played</h3>
                </div>
                {isCurrentlyLive && (
                  <div className="flex items-center space-x-2 text-[#ff6600]">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span className="text-[10px] font-medium uppercase tracking-widest">Live</span>
                  </div>
                )}
              </div>
              
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto no-scrollbar">
                {loadingHistory ? (
                  <div className="p-20 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#ff6600] mb-4" />
                    <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">Loading History...</p>
                  </div>
                ) : sortedDateKeys.length > 0 ? (
                  sortedDateKeys.map(date => (
                    <div key={date}>
                      <div className="bg-gray-50 px-6 py-2">
                        <span className="text-[9px] font-medium uppercase tracking-widest text-gray-400">
                          {date === getLocalDateString() ? 'Today' : date}
                        </span>
                      </div>
                      {historyGroups[date].map((track, i) => (
                        <div key={i} className={`flex items-center p-5 transition-colors ${track.isLive ? 'bg-orange-50' : 'hover:bg-gray-50'}`}>
                          <div className="w-14 h-14 flex-shrink-0 bg-gray-100 mr-5 relative">
                            <img src={track.image} className="w-full h-full object-cover" alt="" />
                            {track.isLive && <div className="absolute inset-0 border-2 border-[#ff6600]"></div>}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <h4 className="text-base font-medium uppercase tracking-tight leading-tight truncate">{track.artist}</h4>
                            <p className="text-gray-500 text-sm font-normal truncate">{track.title}</p>
                            <span className="text-[9px] font-medium uppercase tracking-widest text-gray-400 mt-1">
                              {new Date(track.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-gray-400">
                    <Music className="w-10 h-10 mx-auto mb-4 opacity-20" />
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em]">No history found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-12">
            <div className="bg-[#1a1a1a] p-8 border-l-4 border-[#ff6600]">
               <h3 className="text-[10px] font-medium uppercase text-gray-500 tracking-[0.2em] mb-4">Host</h3>
               <p className="text-white font-medium text-2xl uppercase tracking-tighter">{program.host}</p>
            </div>

            <div className="bg-[#1a1a1a] p-8">
               <h3 className="text-[10px] font-medium uppercase text-gray-500 tracking-[0.2em] mb-4">Coming Up</h3>
               {nextProgram ? (
                 <div className="flex flex-col">
                    <p className="text-white font-medium text-xl uppercase tracking-tight">{nextProgram.title}</p>
                    <p className="text-[#ff6600] font-medium text-sm uppercase tracking-widest mt-1">{format12h(nextProgram.startTime)}</p>
                 </div>
               ) : <p className="text-gray-600 uppercase text-xs">End of schedule</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
