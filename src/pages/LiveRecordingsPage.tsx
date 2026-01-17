
import React, { useState, useRef, useEffect } from 'react';
import { Radio, Play, Music, Mic2, MapPin, Calendar, ArrowRight, Video, Pause, Loader2, X } from 'lucide-react';

interface LiveSession {
  id: string;
  artist: string;
  location: string;
  date: string;
  image: string;
  songs: string[];
  description: string;
}

const LIVE_SESSIONS: LiveSession[] = [
  {
    id: 'ls1',
    artist: 'Brandon Lake',
    location: 'Studio A - Chicago, IL',
    date: 'Oct 15, 2025',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1767583738/BRANDON_LAKE_nf7pyj.jpg',
    songs: ['Gratitude', 'Praise', 'Trust In God'],
    description: 'An acoustic afternoon captured in our main studio. Brandon strips down his biggest hits for an intimate worship experience.'
  },
  {
    id: 'ls2',
    artist: 'Elevation Worship',
    location: 'Worship Night Live - Miami',
    date: 'Sep 28, 2025',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1767998578/ELEVATION_WORSHIP_olxxoe.webp',
    songs: ['More Than Able', 'LION', 'What I See'],
    description: 'Captured during the sold-out Miami leg of their tour. The energy and spontaneous moments are unlike anything recorded in a studio.'
  },
  {
    id: 'ls3',
    artist: 'Maverick City Music',
    location: 'The Warehouse Sessions',
    date: 'Aug 12, 2025',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1767998578/MAVERICK_CITY_MUSIC_bboqfi.webp',
    songs: ['Jireh', 'Promises', 'Man Of Your Word'],
    description: 'A raw, unedited session featuring the full choir. We turned an old industrial warehouse into a sanctuary for one night.'
  },
  {
    id: 'ls4',
    artist: 'Lauren Daigle',
    location: 'Orchestra Hall - Nashville',
    date: 'July 05, 2025',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1767998578/LAUREN_DAIGLE_xe9ops.webp',
    songs: ['You Say', 'Rescue', 'Hold On To Me'],
    description: 'Lauren joins a 60-piece orchestra for a cinematic reimagining of her most beloved tracks. Epic and moving.'
  }
];

const LiveRecordingsPage: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentSongName, setCurrentSongName] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onended = () => {
      setIsPlaying(false);
      setCurrentSongName(null);
    };
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  const playTrack = async (artist: string, song: string) => {
    if (!audioRef.current) return;

    // Se já estiver tocando a mesma música, pausa
    if (currentSongName === song && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoadingAudio(true);
    setCurrentSongName(song);

    try {
      // Busca a preview de 30 segundos no iTunes Search API
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artist + ' ' + song)}&media=music&entity=song&limit=1`);
      const data = await response.json();

      if (data.results && data.results[0]?.previewUrl) {
        const url = data.results[0].previewUrl;
        audioRef.current.src = url;
        audioRef.current.play().catch(e => {
          console.error("Playback error", e);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      } else {
        alert("Sorry, no live preview available for this specific track.");
        setIsPlaying(false);
        setCurrentSongName(null);
      }
    } catch (error) {
      console.error("Error fetching audio preview:", error);
      setIsPlaying(false);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const closeOverlay = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setSelectedSession(null);
    setIsPlaying(false);
    setCurrentSongName(null);
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white transition-colors duration-500 font-sans">
      
      {/* Cinematic Header */}
      <div className="relative h-[80vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-30 grayscale scale-110 blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
        
        <div className="relative z-10 text-center max-w-4xl px-4">
          <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full mb-10 backdrop-blur-xl">
            <Mic2 className="w-4 h-4 text-[#ff6600]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Exclusive Broadcast Sessions</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-medium uppercase tracking-tighter leading-[0.85] mb-8">Live<br />Recordings</h1>
          <p className="text-xl md:text-2xl text-gray-400 font-normal uppercase tracking-tight max-w-2xl mx-auto leading-tight">
            Capturing the raw frequency of heaven. Unfiltered, unedited, and recorded live for <span className="text-white">Praise FM USA</span>.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {LIVE_SESSIONS.map((session) => (
            <div 
              key={session.id} 
              className="group cursor-pointer flex flex-col"
              onClick={() => setSelectedSession(session)}
            >
              <div className="relative aspect-video overflow-hidden mb-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-[#111]">
                <img 
                  src={session.image} 
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" 
                  alt={session.artist} 
                />
                <div className="absolute inset-0 border border-white/5 group-hover:border-[#ff6600]/30 transition-colors"></div>
                
                <div className="absolute top-8 left-8">
                  <div className="flex items-center space-x-2 bg-black/80 backdrop-blur-md px-3 py-1.5 border border-white/10">
                    <Calendar className="w-3 h-3 text-[#ff6600]" />
                    <span className="text-[9px] font-regular uppercase tracking-widest">{session.date}</span>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-90 group-hover:scale-100">
                  <div className="w-20 h-20 bg-[#ff6600] rounded-full flex items-center justify-center shadow-2xl">
                    <Play className="w-8 h-8 fill-current text-white ml-1" />
                  </div>
                </div>
              </div>

              <div className="px-2">
                <div className="flex items-center space-x-3 text-[#ff6600] mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{session.location}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-medium uppercase tracking-tighter mb-4 group-hover:text-[#ff6600] transition-colors">{session.artist}</h2>
                <p className="text-gray-500 text-sm font-normal uppercase tracking-tight leading-relaxed line-clamp-2 max-w-xl">
                  {session.description}
                </p>
                
                <div className="mt-8 flex items-center space-x-6">
                  <div className="flex -space-x-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] overflow-hidden bg-[#111] flex items-center justify-center">
                        <Music className="w-4 h-4 text-gray-500" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{session.songs.length} Tracks Recorded</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Banner */}
        <div className="mt-40 bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 p-12 md:p-24 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#ff6600]/5 blur-[120px] group-hover:bg-[#ff6600]/10 transition-colors"></div>
          <div className="max-w-3xl relative z-10">
            <Radio className="w-12 h-12 text-[#ff6600] mb-10" />
            <h3 className="text-4xl md:text-6xl font-medium uppercase tracking-tighter leading-tight mb-8">The Tabernacle<br />Broadcasts</h3>
            <p className="text-gray-400 text-xl font-normal leading-relaxed mb-12 uppercase tracking-tight">
              Every Sunday night at 10PM, we open the archives for a 2-hour journey through our finest live recordings. Experience the music as it was meant to be heard: live and in the presence.
            </p>
            <button 
              onClick={() => window.location.hash = '#/schedule'}
              className="flex items-center space-x-4 group/btn"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] border-b-2 border-[#ff6600] pb-1 group-hover/btn:text-[#ff6600] transition-colors">View Radio Schedule</span>
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Overlay */}
      {selectedSession && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-500 overflow-y-auto">
           <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-16 relative my-auto">
              <button 
                onClick={closeOverlay}
                className="absolute -top-12 right-0 lg:-top-16 lg:right-0 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-10 h-10" />
              </button>

              <div className="w-full lg:w-3/5">
                <div className="aspect-video bg-black relative shadow-2xl overflow-hidden group rounded-sm">
                   <img src={selectedSession.image} className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" alt={selectedSession.artist} />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div 
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => playTrack(selectedSession.artist, selectedSession.songs[0])}
                      >
                         {isLoadingAudio ? (
                           <Loader2 className="w-20 h-20 text-[#ff6600] animate-spin mb-6" />
                         ) : (isPlaying && selectedSession.songs.includes(currentSongName || "")) ? (
                           <Pause className="w-20 h-20 fill-current mb-6 text-[#ff6600]" />
                         ) : (
                           <Play className="w-20 h-20 fill-current mb-6 text-white hover:text-[#ff6600] transition-colors" />
                         )}
                         <span className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse text-white">
                           { (isPlaying && selectedSession.songs.includes(currentSongName || "")) ? `Playing: ${currentSongName}` : 'Preview Session' }
                         </span>
                      </div>
                   </div>
                </div>
                <div className="mt-10">
                  <h2 className="text-5xl font-medium uppercase tracking-tighter mb-4">{selectedSession.artist}</h2>
                  <p className="text-gray-400 text-lg font-normal leading-relaxed uppercase tracking-tight">{selectedSession.description}</p>
                </div>
              </div>

              <div className="w-full lg:w-2/5 flex flex-col">
                 <div className="flex items-center space-x-3 mb-10">
                    <Video className="w-5 h-5 text-[#ff6600]" />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em]">Recorded Tracks</h4>
                 </div>
                 <div className="space-y-4">
                    {selectedSession.songs.map((song, i) => {
                      const isCurrent = currentSongName === song;
                      return (
                        <div 
                          key={i} 
                          onClick={() => playTrack(selectedSession.artist, song)}
                          className={`flex items-center justify-between p-6 transition-all group/song cursor-pointer rounded-sm ${isCurrent ? 'bg-[#ff6600] text-black shadow-lg transform scale-[1.02]' : 'bg-white/5 hover:bg-white/10'}`}
                        >
                          <div className="flex items-center space-x-6">
                             <span className={`font-medium ${isCurrent ? 'text-black/40' : 'text-white/20'}`}>{String(i+1).padStart(2, '0')}</span>
                             <span className={`text-xl font-medium uppercase tracking-tight ${isCurrent ? 'text-black' : 'text-white'}`}>{song}</span>
                          </div>
                          {isCurrent && isPlaying ? (
                            <Pause className="w-5 h-5 fill-current" />
                          ) : (
                            <Play className={`w-5 h-5 fill-current transition-all ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover/song:opacity-100'}`} />
                          )}
                        </div>
                      );
                    })}
                 </div>
                 <div className="mt-auto pt-10">
                    <button className="w-full bg-[#ff6600] py-6 text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center space-x-4 hover:bg-white hover:text-black transition-all shadow-xl">
                       <span>Download Full Session</span>
                       <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LiveRecordingsPage;
