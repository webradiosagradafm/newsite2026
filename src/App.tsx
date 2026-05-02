
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { STREAM_URL, WEEKLY_SCHEDULE, DAYS } from './constants.ts';
import { Show, DayOfWeek, HistoryItem } from './types.ts';
import ChatWidget from './components/ChatWidget.tsx';

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const prevVolumeRef = useRef(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showProgress, setShowProgress] = useState(0);
  const [recentlyPlayed, setRecentlyPlayed] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [nowPlaying, setNowPlaying] = useState<HistoryItem | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Schedule state
  const [expandedShowId, setExpandedShowId] = useState<string | null>(null);
  const daySelectorRef = useRef<HTMLDivElement>(null);

  // Preview Modal state
  const [previewItem, setPreviewItem] = useState<HistoryItem | null>(null);
  const [previewProgress, setPreviewProgress] = useState(0);
  const snippetAudioRef = useRef<HTMLAudioElement | null>(null);
  const previewIntervalRef = useRef<number | null>(null);

  // Contact Form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const fetchRecentlyPlayed = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch('https://itunes.apple.com/search?term=christian+worship+praise+2025&limit=20&media=music&entity=song&sort=recent');
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const items: HistoryItem[] = data.results.map((item: any, index: number) => ({
          id: `${item.trackId}-${index}`, 
          title: item.trackName,
          artist: item.artistName,
          timestamp: index === 0 ? 'NOW' : `${new Date(Date.now() - index * 300000).getHours()}:${new Date(Date.now() - index * 300000).getMinutes().toString().padStart(2, '0')}`,
          imageUrl: item.artworkUrl100.replace('100x100', '600x600'),
          previewUrl: item.previewUrl,
          album: item.collectionName,
          year: item.releaseDate ? new Date(item.releaseDate).getFullYear().toString() : 'N/A',
          genre: item.primaryGenreName,
          appleMusicUrl: item.trackViewUrl
        }));
        setRecentlyPlayed(items);
        setNowPlaying(items[0]);
      }
    } catch (error) {
      console.error("Error fetching song metadata:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentlyPlayed();
    const interval = setInterval(fetchRecentlyPlayed, 120000);
    return () => clearInterval(interval);
  }, [fetchRecentlyPlayed]);

  const formatTo12h = (time24: string) => {
    if (!time24) return "";
    const [hoursStr, minutes] = time24.split(':');
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const getChicagoNow = useCallback(() => {
    const chicagoTimeStr = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });
    return new Date(chicagoTimeStr);
  }, []);

  const getChicagoDay = useCallback((): DayOfWeek => {
    const now = getChicagoNow();
    const dayIndex = now.getDay();
    return DAYS[dayIndex === 0 ? 6 : dayIndex - 1];
  }, [getChicagoNow]);

  const getCurrentShow = useCallback((): Show => {
    const now = getChicagoNow();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
    
    const chicagoDay = getChicagoDay();
    const todayShows = WEEKLY_SCHEDULE[chicagoDay];
    
    const currentShow = todayShows.find(show => {
      if (show.endTime === '00:00') {
        return currentTimeStr >= show.startTime;
      }
      return currentTimeStr >= show.startTime && currentTimeStr < show.endTime;
    }) || todayShows[0];

    return { ...currentShow, isLive: true };
  }, [getChicagoNow, getChicagoDay]);

  const [currentShow, setCurrentShow] = useState<Show>(getCurrentShow());
  const [activeDay, setActiveDay] = useState<DayOfWeek>(getChicagoDay());

  const calculateProgress = useCallback(() => {
    const now = getChicagoNow();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [startH, startM] = currentShow.startTime.split(':').map(Number);
    let [endH, endM] = currentShow.endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;
    if (endMinutes === 0) endMinutes = 24 * 60;
    if (endMinutes <= startMinutes) endMinutes += 24 * 60;
    const totalDuration = endMinutes - startMinutes;
    const elapsed = currentMinutes - startMinutes;
    const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
    setShowProgress(progress);
  }, [currentShow, getChicagoNow]);

  useEffect(() => {
    const timer = setInterval(() => {
      const show = getCurrentShow();
      setCurrentShow(show);
      calculateProgress();
    }, 1000);
    return () => clearInterval(timer);
  }, [getCurrentShow, calculateProgress]);

  useEffect(() => {
    if (daySelectorRef.current) {
      const activeBtn = daySelectorRef.current.querySelector('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeDay]);

  const closePreview = useCallback(() => {
    if (snippetAudioRef.current) {
      try {
        snippetAudioRef.current.pause();
      } catch (e) {}
      snippetAudioRef.current = null;
    }
    if (previewIntervalRef.current) {
      clearInterval(previewIntervalRef.current);
      previewIntervalRef.current = null;
    }
    setPreviewItem(null);
    setPreviewProgress(0);
  }, []);

  const togglePlayback = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        closePreview();
        await fetchRecentlyPlayed();
        audioRef.current.src = STREAM_URL;
        audioRef.current.load();
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (e) {
          console.error("Playback failed", e);
        }
      }
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setTimeout(() => setSentSuccess(false), 5000);
    }, 1500);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) audioRef.current.volume = newVol;
    if (snippetAudioRef.current) snippetAudioRef.current.volume = newVol;
  };

  const openPreview = async (item: HistoryItem) => {
    if (!item.previewUrl) return;
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    closePreview();
    setPreviewItem(item);
    const previewAudioInstance = new Audio(item.previewUrl);
    previewAudioInstance.volume = volume;
    snippetAudioRef.current = previewAudioInstance;
    try {
      await previewAudioInstance.play();
      previewIntervalRef.current = window.setInterval(() => {
        if (previewAudioInstance.duration) {
          setPreviewProgress((previewAudioInstance.currentTime / previewAudioInstance.duration) * 100);
        }
      }, 100);
      previewAudioInstance.onended = () => closePreview();
    } catch (e) {
      console.error("Preview failed", e);
      closePreview();
    }
  };

  const radius = 152;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (showProgress / 100) * circumference;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-32 w-full overflow-x-hidden">
      <audio ref={audioRef} preload="none">
        <source src={STREAM_URL} type="audio/mpeg" />
      </audio>

      {/* HEADER */}
      <nav className="bg-white sticky top-0 z-[100] h-14 md:h-16 w-full border-b border-gray-100">
        <div className="container mx-auto px-4 h-full flex items-center justify-between max-w-6xl">
          <div className="flex items-center">
            <a href="#" className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-black text-[#BF0A30] leading-none tracking-tighter uppercase">
                Praise FM <span className="text-[#BF0A30] opacity-80">USA</span>
              </h1>
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-10 text-[11px] font-black uppercase tracking-[0.2em]">
            <a href="#" className="text-[#BF0A30] hover:opacity-80 transition-opacity">Home</a>
            <a href="#history" className="text-gray-400 hover:text-[#BF0A30] transition-colors">History</a>
            <a href="#schedule" className="text-gray-400 hover:text-[#BF0A30] transition-colors">Schedule</a>
            <a href="#contact" className="text-gray-400 hover:text-[#BF0A30] transition-colors">Contact</a>
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center space-x-1 py-2 px-3 text-[#BF0A30] font-bold text-sm focus:outline-none"
            aria-label="Toggle Menu"
          >
            <span>Menu</span>
            <svg className={`w-4 h-4 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* DROPDOWN MENU */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 animate-fade-in shadow-xl absolute top-full left-0 w-full z-[101]">
            <div className="flex flex-col">
              <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-4 px-6 py-5 border-b border-gray-50 hover:bg-gray-50">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                <span className="text-sm font-bold text-gray-700">Home</span>
              </a>
              <a href="#history" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-4 px-6 py-5 border-b border-gray-50 hover:bg-gray-50">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-sm font-bold text-gray-700">Recent Tracks</span>
              </a>
              <a href="#schedule" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-4 px-6 py-5 border-b border-gray-50 hover:bg-gray-50">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-sm font-bold text-gray-700">Schedule</span>
              </a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-4 px-6 py-5 hover:bg-gray-50">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className="text-sm font-bold text-gray-700">Contact</span>
              </a>
            </div>
          </div>
        )}
      </nav>

      <main className="container mx-auto px-4 md:px-6 py-6 md:py-12 max-w-6xl space-y-20 md:space-y-32">
        {/* HERO - RING DESIGN */}
        <section id="home" className="animate-fade-in scroll-mt-24">
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 relative overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200/50">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-50/40 to-transparent pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
              <div className="relative flex-shrink-0 w-full md:w-auto flex justify-center">
                <div className="absolute inset-0 bg-red-700/5 blur-[80px] rounded-full scale-125"></div>
                <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
                   <svg className="absolute w-full h-full transform -rotate-90 scale-[1.04]" viewBox="0 0 340 340">
                    <circle cx="170" cy="170" r={radius} stroke="#FEE2E2" strokeWidth="4" fill="transparent" opacity="0.6" />
                   </svg>
                   <svg className="absolute w-full h-full transform -rotate-90 scale-[1.04]" viewBox="0 0 340 340">
                    <circle 
                      cx="170" 
                      cy="170" 
                      r={radius} 
                      stroke="#BF0A30" 
                      strokeWidth="10" 
                      fill="transparent" 
                      strokeDasharray={circumference} 
                      style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-[6px] md:border-[8px] border-white shadow-xl relative z-10 bg-white">
                    <img 
                        key={currentShow.imageUrl} 
                        alt="Current Program" 
                        className="w-full h-full object-cover rounded-full animate-fade-in" 
                        src={currentShow.imageUrl} 
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4 md:space-y-6 w-full">
                <div className="inline-flex items-center space-x-2.5 bg-red-50 text-[#BF0A30] px-4 py-2 rounded-full border border-red-100 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#BF0A30]"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isPlaying ? 'On Air' : 'Live Stream'}</span>
                </div>
                <div className="space-y-1">
                  <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter leading-[1.1]">
                    {isPlaying && nowPlaying ? nowPlaying.title : currentShow.title}
                  </h2>
                  {isPlaying && nowPlaying && (
                    <p className="text-lg md:text-2xl font-bold text-gray-400 tracking-tight">
                      {nowPlaying.artist}
                    </p>
                  )}
                </div>
                <p className="text-gray-500 max-w-xl mx-auto md:mx-0 leading-relaxed text-sm md:text-base font-medium opacity-80">
                  {isPlaying && nowPlaying ? `Playing "${nowPlaying.title}" by ${nowPlaying.artist}.` : currentShow.description}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full">
                  <button onClick={togglePlayback} className="w-full sm:w-auto inline-flex items-center justify-center space-x-4 bg-gray-900 hover:bg-[#BF0A30] text-white px-10 py-5 rounded-[2rem] font-black shadow-lg transition-all transform active:scale-95">
                    {isPlaying ? (
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
                    ) : (
                      <svg className="h-6 w-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                    )}
                    <span className="text-base uppercase tracking-[0.1em]">{isPlaying ? 'Stop' : 'Listen Now'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RECENT TRACKS */}
        <section id="history" className="scroll-mt-28 animate-fade-in max-w-5xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Recent Tracks</h2>
          </div>
          
          <div className="w-full border-t border-gray-100">
            <div className="flex py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">
              <div className="w-8">#</div>
              <div className="flex-1">Track</div>
              <div className="flex-1 pl-4 md:pl-8">Artist</div>
            </div>

            {isLoadingHistory && recentlyPlayed.length === 0 ? (
              <div className="py-12 text-center animate-pulse text-gray-300 font-bold uppercase tracking-widest text-[10px]">Updating playlist...</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentlyPlayed.slice(0, 4).map((item, idx) => (
                  <div key={item.id} onClick={() => openPreview(item)} className="group flex items-center py-5 cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div className="w-8 text-sm font-bold text-gray-300 group-hover:text-gray-900">
                      {idx + 1}.
                    </div>
                    <div className="flex-1 flex items-center min-w-0">
                      <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-gray-100 rounded mr-4 overflow-hidden shadow-sm">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="flex space-x-1 items-end h-5">
                              <div className="w-0.5 bg-white animate-bounce h-4 rounded-full"></div>
                              <div className="w-0.5 bg-white animate-bounce h-2 rounded-full delay-75"></div>
                              <div className="w-0.5 bg-white animate-bounce h-3 rounded-full delay-150"></div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 pr-4">
                        {idx === 0 && (
                          <span className="text-[9px] font-black text-[#BF0A30] uppercase tracking-widest mb-1 block">Now Playing</span>
                        )}
                        <h4 className="text-sm md:text-lg font-black text-gray-900 leading-tight truncate group-hover:text-[#BF0A30] transition-colors">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                    <div className="flex-1 pl-4 md:pl-8 text-sm md:text-base font-bold text-gray-400 group-hover:text-gray-900 transition-colors truncate">
                      {item.artist}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-8 text-right">
               <button onClick={fetchRecentlyPlayed} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-gray-900 transition-colors border-b border-gray-100 hover:border-gray-900 pb-1">
                 Refresh Updates
               </button>
            </div>
          </div>
        </section>

        {/* SCHEDULE SECTION */}
        <section id="schedule" className="scroll-mt-28 animate-fade-in">
          <div className="mb-14 px-4">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Weekly Schedule</h2>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Curated programming for your soul</p>
          </div>
          <div className="space-y-10 px-4">
            <div ref={daySelectorRef} className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {DAYS.map(day => (
                <button 
                  key={day} 
                  data-active={activeDay === day}
                  onClick={() => setActiveDay(day)} 
                  className={`flex-shrink-0 px-8 py-4 rounded-full font-black text-[10px] transition-all whitespace-nowrap tracking-widest border-2 ${activeDay === day ? 'bg-[#BF0A30] text-white border-[#BF0A30] shadow-xl' : 'bg-white text-gray-400 border-gray-100'}`}
                >
                  {day.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {WEEKLY_SCHEDULE[activeDay].map(show => {
                const isShowLive = show.id === currentShow.id && activeDay === getChicagoDay();
                return (
                  <div key={show.id} className={`bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition-all group ${isShowLive ? 'border-[#BF0A30]/30 shadow-md ring-1 ring-[#BF0A30]/10' : 'border-gray-100'}`}>
                    <button onClick={() => setExpandedShowId(expandedShowId === show.id ? null : show.id)} className="w-full p-6 md:p-8 flex items-center gap-8 text-left relative">
                      <div className="w-24 flex-shrink-0">
                        <div className="text-xl font-black text-gray-900">{formatTo12h(show.startTime)}</div>
                        <div className="text-[10px] font-black uppercase text-gray-300 tracking-widest">{formatTo12h(show.endTime)}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className={`text-lg font-black transition-colors ${isShowLive ? 'text-[#BF0A30]' : 'group-hover:text-[#BF0A30]'}`}>{show.title}</h4>
                          {isShowLive && (
                            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 bg-[#BF0A30]/5 rounded border border-[#BF0A30]/10">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#BF0A30]"></span>
                              </span>
                              <span className="text-[9px] font-black uppercase tracking-widest text-[#BF0A30] animate-pulse">Live</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-bold text-gray-400">{show.presenter}</p>
                      </div>
                      <svg className={`w-6 h-6 text-gray-200 transition-transform ${expandedShowId === show.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {expandedShowId === show.id && (
                      <div className="p-8 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row gap-8 animate-fade-in">
                        <img src={show.imageUrl} alt={show.title} className="w-32 h-32 rounded-xl object-cover shadow-md" />
                        <p className="text-gray-600 font-medium text-lg leading-relaxed italic">"{show.description}"</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="scroll-mt-28 animate-fade-in">
          <div className="bg-gray-900 rounded-[3rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#BF0A30]/10 blur-[150px] rounded-full -mr-64 -mt-64"></div>
             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-8">
                   <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Get in Touch</h2>
                   <p className="text-gray-400 text-lg md:text-xl font-medium max-w-lg">Share your prayer requests or join our community mission.</p>
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                      <div>
                         <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Email</p>
                         <p className="text-xl font-bold">fmpraiseradio@gmail.com</p>
                      </div>
                   </div>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10">
                   <form onSubmit={handleContactSubmit} className="space-y-6">
                      <input required placeholder="Name" value={contactName} onChange={e => setContactName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#BF0A30]" />
                      <input required type="email" placeholder="Email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#BF0A30]" />
                      <textarea required placeholder="Message" rows={4} value={contactMessage} onChange={e => setContactMessage(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#BF0A30] resize-none" />
                      <button type="submit" disabled={isSending} className="w-full bg-[#BF0A30] py-5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50">
                        {isSending ? 'Sending...' : 'Send Message'}
                      </button>
                      {sentSuccess && <p className="text-center text-green-400 font-bold uppercase text-[10px] tracking-widest">Message sent successfully!</p>}
                   </form>
                </div>
             </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white py-20 text-center border-t border-gray-50">
        <h2 className="text-2xl font-black tracking-tighter mb-4 text-[#BF0A30] uppercase">Praise FM USA</h2>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10">Heavenly Inspiration</p>
        <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.5em]">&copy; 2025 Praise FM USA. All Rights Reserved.</p>
      </footer>

      {/* PREVIEW MODAL */}
      {previewItem && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" onClick={closePreview}></div>
          <div className="relative w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-2xl animate-fade-in text-center overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
               <div className="h-full bg-[#BF0A30] transition-all" style={{ width: `${previewProgress}%` }}></div>
             </div>
             <div className="relative w-48 h-48 mx-auto mb-8">
               <svg className="absolute inset-0 w-full h-full -rotate-90 scale-110" viewBox="0 0 100 100">
                 <circle cx="50" cy="50" r="45" fill="none" stroke="#FEE2E2" strokeWidth="2" opacity="0.5" />
                 <circle cx="50" cy="50" r="45" fill="none" stroke="#BF0A30" strokeWidth="4" strokeDasharray="282.7" strokeDashoffset={282.7 - (previewProgress / 100) * 282.7} strokeLinecap="round" />
               </svg>
               <img src={previewItem.imageUrl} className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl" alt="Art" />
             </div>
             <h3 className="text-2xl font-black text-gray-900 leading-tight mb-1">{previewItem.title}</h3>
             <p className="text-lg font-bold text-gray-400 mb-8">{previewItem.artist}</p>
             <button onClick={closePreview} className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Close Preview</button>
          </div>
        </div>
      )}

      {/* STICKY PLAYER BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-3xl border-t border-gray-100 shadow-[0_-20px_60px_rgba(0,0,0,0.1)] z-40 h-24 md:h-28 flex items-center">
        <div className="container mx-auto h-full max-w-6xl flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center space-x-4 min-w-0">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden shadow-md border-2 border-white bg-white flex-shrink-0">
              <img src={currentShow.imageUrl} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <span className="text-[8px] font-black text-[#BF0A30] uppercase tracking-widest block mb-1">{isPlaying ? 'On Air' : 'Ready'}</span>
              <h3 className="font-black text-gray-900 truncate text-xs md:text-xl tracking-tighter">
                {isPlaying && nowPlaying ? nowPlaying.title : "Live Stream"}
              </h3>
            </div>
          </div>
          <button onClick={togglePlayback} className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-90 ${isPlaying ? 'bg-[#BF0A30] text-white' : 'bg-gray-900 text-white'}`}>
            {isPlaying ? (
              <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
            ) : (
              <svg className="h-7 w-7 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
            )}
          </button>
          <div className="hidden md:flex items-center space-x-4 w-32">
             <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="w-full accent-[#BF0A30] h-1.5 cursor-pointer bg-gray-100 rounded-full" />
          </div>
        </div>
      </div>
      
      <ChatWidget />
    </div>
  );
};

export default App;
