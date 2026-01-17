
import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MapPin, Calendar, Ticket, Loader2, Search, ArrowRight, Music, Star, ExternalLink, Info, Bell, BellRing, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// Suporte para rodar localmente com Vite (VITE_GEMINI_API_KEY) ou em produção (process.env.API_KEY)
const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

const FEATURED_ARTISTS = [
  { name: 'Brandon Lake', genre: 'Worship', image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1767583738/BRANDON_LAKE_nf7pyj.jpg' },
  { name: 'Elevation Worship', genre: 'Modern Worship', image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1767998578/ELEVATION_WORSHIP_olxxoe.webp' },
  { name: 'Forrest Frank', genre: 'Indie Pop', image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1767583738/FORREST_FRANK_yyn2kz.jpg' },
  { name: 'Lauren Daigle', genre: 'Pop', image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1767998578/LAUREN_DAIGLE_xe9ops.webp' }
];

interface Event {
  date: string;
  venue: string;
  city: string;
  link: string;
}

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searching, setSearching] = useState<string | null>(null);
  const [events, setEvents] = useState<Record<string, Event[]>>({});
  const [groundingLinks, setGroundingLinks] = useState<Record<string, any[]>>({});
  const [showAlertSystem, setShowAlertSystem] = useState(false);
  const [subscribedArtists, setSubscribedArtists] = useState<string[]>([]);
  const [isSavingAlerts, setIsSavingAlerts] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchAlerts = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('artist_alerts')
          .eq('id', user.id)
          .single();
        if (data?.artist_alerts) {
          setSubscribedArtists(data.artist_alerts);
        }
      };
      fetchAlerts();
    }
  }, [user]);

  const findEvents = async (artistName: string) => {
    if (!API_KEY) {
      console.error("Gemini API Key missing. Please check your .env file (VITE_GEMINI_API_KEY) or environment variables.");
      alert("Search feature is temporarily unavailable: API Configuration Missing.");
      return;
    }

    setSearching(artistName);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Find the next 3 upcoming tour dates for the artist ${artistName}. 
        Return ONLY a JSON array of objects with keys: "date" (e.g. Nov 15, 2025), "venue", "city", and "link" (ticket URL). 
        Focus on official tour dates for 2025/2026.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        },
      });

      const data = JSON.parse(response.text || "[]");
      setEvents(prev => ({ ...prev, [artistName]: data }));
      setGroundingLinks(prev => ({ 
        ...prev, 
        [artistName]: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
      }));
    } catch (err) {
      console.error("Error finding events:", err);
    } finally {
      setSearching(null);
    }
  };

  const toggleArtistAlert = (artistName: string) => {
    setSubscribedArtists(prev => 
      prev.includes(artistName) 
        ? prev.filter(a => a !== artistName) 
        : [...prev, artistName]
    );
  };

  const saveAlerts = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsSavingAlerts(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ artist_alerts: subscribedArtists })
        .eq('id', user.id);
      
      if (!error) {
        setShowAlertSystem(false);
      }
    } catch (err) {
      console.error("Error saving alerts:", err);
    } finally {
      setIsSavingAlerts(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#000] min-h-screen transition-colors duration-300 pb-20">
      {showAlertSystem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#111] w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl border border-gray-100 dark:border-white/10">
            <div className="p-8 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-[#ff6600] text-white">
              <div className="flex items-center space-x-4">
                <BellRing className="w-6 h-6 animate-bounce" />
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">Artist Alert System</h2>
                  <p className="text-[10px] uppercase tracking-widest font-bold opacity-80 mt-1">Never miss a tour date</p>
                </div>
              </div>
              <button onClick={() => setShowAlertSystem(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 flex-grow overflow-y-auto">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal uppercase tracking-tight mb-8 leading-relaxed">
                Select your favorite artists. We'll monitor official tour announcements and notify you as soon as tickets go on sale in your region.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FEATURED_ARTISTS.map(artist => {
                  const isSubscribed = subscribedArtists.includes(artist.name);
                  return (
                    <button 
                      key={artist.name}
                      onClick={() => toggleArtistAlert(artist.name)}
                      className={`flex items-center justify-between p-4 border-2 transition-all group ${
                        isSubscribed 
                          ? 'border-[#ff6600] bg-[#ff6600]/5' 
                          : 'border-gray-100 dark:border-white/5 hover:border-black dark:hover:border-white'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <img src={artist.image} className={`w-full h-full object-cover ${isSubscribed ? '' : 'grayscale'}`} alt="" />
                        </div>
                        <span className={`text-sm font-black uppercase tracking-tight ${isSubscribed ? 'text-[#ff6600]' : 'dark:text-white'}`}>
                          {artist.name}
                        </span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSubscribed ? 'bg-[#ff6600] border-[#ff6600]' : 'border-gray-200 dark:border-white/20'
                      }`}>
                        {isSubscribed && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-12 p-6 bg-gray-50 dark:bg-white/5 rounded-sm">
                <div className="flex items-start space-x-4">
                  <Info className="w-5 h-5 text-gray-400 mt-0.5" />
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
                    Alerts are sent via push notification and email. You can manage your notification frequency in your account settings.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 dark:bg-black/50 border-t border-gray-100 dark:border-white/10">
              <button 
                onClick={saveAlerts}
                disabled={isSavingAlerts}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#ff6600] dark:hover:bg-[#ff6600] hover:text-white transition-all shadow-xl flex items-center justify-center space-x-3"
              >
                {isSavingAlerts ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirm Alert Preferences</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-black text-white py-20 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center space-x-3 text-[#ff6600] mb-6">
            <Ticket className="w-5 h-5" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em]">Live & Upcoming</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-medium uppercase tracking-tighter leading-none mb-8">Music<br />Events</h1>
          <p className="text-xl text-gray-400 max-w-2xl font-normal uppercase tracking-tight leading-tight">
            The ultimate guide to live worship across the USA. Powered by AI search to bring you the latest tour dates directly from the source.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12">
          {FEATURED_ARTISTS.map((artist) => (
            <div key={artist.name} className="group bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row overflow-hidden transition-all hover:shadow-2xl">
              <div className="w-full md:w-1/3 aspect-square relative">
                <img src={artist.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={artist.name} />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              
              <div className="p-8 md:p-12 flex-grow flex flex-col justify-center">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[#ff6600] text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block">{artist.genre}</span>
                    <h2 className="text-4xl md:text-5xl font-medium uppercase tracking-tighter dark:text-white group-hover:text-[#ff6600] transition-colors">{artist.name}</h2>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => findEvents(artist.name)}
                      disabled={searching === artist.name}
                      className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#ff6600] dark:hover:bg-[#ff6600] hover:text-white transition-all flex items-center space-x-2"
                    >
                      {searching === artist.name ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      <span>{events[artist.name] ? 'Refresh Dates' : 'Find Tickets'}</span>
                    </button>
                    {subscribedArtists.includes(artist.name) && (
                      <div className="p-3 bg-[#ff6600] text-white rounded-none" title="Alerts active for this artist">
                        <Bell className="w-4 h-4 fill-current" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  {!events[artist.name] && !searching && (
                    <p className="text-gray-400 text-sm uppercase tracking-widest italic">Click "Find Tickets" to search real-time tour dates.</p>
                  )}

                  {searching === artist.name && (
                    <div className="flex items-center space-x-4 py-4 animate-pulse">
                      <div className="w-2 h-2 bg-[#ff6600] rounded-full"></div>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Searching Google for latest {artist.name} tour data...</p>
                    </div>
                  )}

                  {events[artist.name] && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
                      {events[artist.name].map((event, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-black border border-gray-100 dark:border-white/5 group/row hover:border-[#ff6600] transition-colors">
                          <div className="flex items-center space-x-6">
                            <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-white/5 p-2 min-w-[60px]">
                              <Calendar className="w-4 h-4 text-[#ff6600] mb-1" />
                              <span className="text-[10px] font-black">{event.date.split(' ')[0]}</span>
                            </div>
                            <div>
                              <p className="text-lg font-medium dark:text-white leading-none">{event.venue}</p>
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" /> {event.city}
                              </p>
                            </div>
                          </div>
                          <a 
                            href={event.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-4 sm:mt-0 flex items-center space-x-2 text-[#ff6600] text-[10px] font-black uppercase tracking-widest hover:underline"
                          >
                            <span>Buy Tickets</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {groundingLinks[artist.name] && events[artist.name] && (
                   <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest flex items-center">
                        <Info className="w-3 h-3 mr-2" /> Verified sources found via Google Search
                      </p>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-[#ff6600] text-black shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-3xl font-medium uppercase tracking-tighter leading-none mb-4">Never miss a beat</h3>
              <p className="text-black/70 text-sm font-normal uppercase tracking-tight">
                Our AI-driven event tracker searches the web daily for the most accurate tour information. Dates are subject to change by the organizers.
              </p>
            </div>
            <button 
              onClick={() => setShowAlertSystem(true)}
              className="bg-black text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all flex items-center space-x-3"
            >
              <Bell className="w-4 h-4" />
              <span>Artist Alert System</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
