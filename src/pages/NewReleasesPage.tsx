import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Zap, Flame, Calendar, Plus, Heart, Share2, Loader2, RefreshCw, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Release {
  id: string;
  artist: string;
  title: string;
  image: string;
  previewUrl: string;
  isHot?: boolean;
  addedDate?: string; // Data em que foi adicionado
}

// Pool completo de releases (rotacionamos entre estas a cada 5 dias)
const ALL_RELEASES: Release[] = [
  // Set 1 (atual)
  {
    id: 'nr1',
    artist: 'Elevation Worship',
    title: 'Sure Been Good',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/91/4e/d0/914ed03a-c07a-493a-8f9f-50d4f6c49303/190296763445.jpg/800x800bb.jpg',
    previewUrl: '',
    isHot: true
  },
  {
    id: 'nr2',
    artist: 'Brandon Lake',
    title: 'That\'s Who I Praise',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4a/01/9f/4a019f50-377e-2e6a-77e8-e5672b109e62/190296791554.jpg/800x800bb.jpg',
    previewUrl: '',
    isHot: true
  },
  {
    id: 'nr3',
    artist: 'Cody Carnes',
    title: 'The Greatness',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/4a/51/93/4a519302-3f6e-5e0c-99f5-14f7756f7e44/23UMGIM70014.rgb.jpg/800x800bb.jpg',
    previewUrl: ''
  },
  {
    id: 'nr4',
    artist: 'Maverick City Music',
    title: 'In The Room',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/66/38/6a/66386a68-4a57-017e-9764-706f97987002/190296570623.jpg/800x800bb.jpg',
    previewUrl: ''
  },
  {
    id: 'nr5',
    artist: 'Tasha Cobbs Leonard',
    title: 'Do It Anyway',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/66/8b/6e/668b6e27-5d51-331c-6d9b-8e54e488e0f9/23UMGIM50810.rgb.jpg/800x800bb.jpg',
    previewUrl: ''
  },
  {
    id: 'nr6',
    artist: 'Chris Tomlin',
    title: 'Holy Forever',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/31/58/01/31580138-080c-0435-01e4-6a84c688849b/22UMGIM73983.rgb.jpg/800x800bb.jpg',
    previewUrl: ''
  },
  
  // Set 2 (próxima rotação)
  {
    id: 'nr7',
    artist: 'Hillsong Worship',
    title: 'The Name Of Jesus',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c8/4e/1f/c84e1f5a-2d3c-8e3e-9c5d-8f3e3b0e9c2a/886449602223.jpg/800x800bb.jpg',
    previewUrl: '',
    isHot: true
  },
  {
    id: 'nr8',
    artist: 'Bethel Music',
    title: 'Goodness Of God',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/7a/8c/9b/7a8c9b1e-4f3d-2a5e-8d6c-9b7e6f4a5c3d/886449602223.jpg/800x800bb.jpg',
    previewUrl: '',
    isHot: true
  },
  {
    id: 'nr9',
    artist: 'Phil Wickham',
    title: 'Living Hope',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3d/2e/1f/3d2e1f4a-5c6d-7e8f-9a0b-1c2d3e4f5a6b/886449602223.jpg/800x800bb.jpg',
    previewUrl: ''
  },
  {
    id: 'nr10',
    artist: 'Kari Jobe',
    title: 'The Blessing',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/4b/3c/2d/4b3c2d1e-6f7a-8b9c-0d1e-2f3a4b5c6d7e/886449602223.jpg/800x800bb.jpg',
    previewUrl: ''
  },
  {
    id: 'nr11',
    artist: 'Passion',
    title: 'Way Maker',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5c/4d/3e/5c4d3e2f-7a8b-9c0d-1e2f-3a4b5c6d7e8f/886449602223.jpg/800x800bb.jpg',
    previewUrl: ''
  },
  {
    id: 'nr12',
    artist: 'Jesus Culture',
    title: 'Alive In You',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/6d/5e/4f/6d5e4f3a-8b9c-0d1e-2f3a-4b5c6d7e8f9a/886449602223.jpg/800x800bb.jpg',
    previewUrl: ''
  }
];

const ROTATION_DAYS = 5; // Atualizar a cada 5 dias
const ITEMS_PER_ROTATION = 6; // Mostrar 6 itens por vez

// Função para calcular qual set de releases mostrar baseado na data
const getCurrentReleaseSet = (): Release[] => {
  const stored = localStorage.getItem('releases_last_update');
  const now = new Date();
  
  if (stored) {
    const lastUpdate = new Date(stored);
    const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Se passou mais de 5 dias, atualizar
    if (daysSinceUpdate >= ROTATION_DAYS) {
      localStorage.setItem('releases_last_update', now.toISOString());
    }
  } else {
    // Primeira vez, salvar data atual
    localStorage.setItem('releases_last_update', now.toISOString());
  }
  
  // Calcular qual "ciclo" estamos baseado na data inicial
  const lastUpdate = new Date(localStorage.getItem('releases_last_update') || now);
  const cycleNumber = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24 * ROTATION_DAYS));
  
  // Rotacionar através dos releases
  const startIndex = (cycleNumber * ITEMS_PER_ROTATION) % ALL_RELEASES.length;
  const releases = [];
  
  for (let i = 0; i < ITEMS_PER_ROTATION; i++) {
    const index = (startIndex + i) % ALL_RELEASES.length;
    releases.push({
      ...ALL_RELEASES[index],
      addedDate: lastUpdate.toISOString()
    });
  }
  
  return releases;
};

// Função para calcular dias até próxima atualização
const getDaysUntilNextUpdate = (): number => {
  const stored = localStorage.getItem('releases_last_update');
  if (!stored) return ROTATION_DAYS;
  
  const lastUpdate = new Date(stored);
  const now = new Date();
  const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
  
  return Math.max(0, ROTATION_DAYS - daysSinceUpdate);
};

// Função para verificar se um release é "novo" (adicionado nos últimos 2 dias)
const isNewRelease = (addedDate?: string): boolean => {
  if (!addedDate) return false;
  const added = new Date(addedDate);
  const now = new Date();
  const daysSinceAdded = Math.floor((now.getTime() - added.getTime()) / (1000 * 60 * 60 * 24));
  return daysSinceAdded <= 2;
};

const NewReleasesPage: React.FC = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [daysUntilUpdate, setDaysUntilUpdate] = useState<number>(0);
  const [showUpdateNotice, setShowUpdateNotice] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toggleFavorite, isFavorite, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Carregar releases do set atual
    const currentSet = getCurrentReleaseSet();
    setDaysUntilUpdate(getDaysUntilNextUpdate());
    
    // Verificar se acabou de atualizar (menos de 1 hora atrás)
    const stored = localStorage.getItem('releases_last_update');
    if (stored) {
      const lastUpdate = new Date(stored);
      const now = new Date();
      const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
      setShowUpdateNotice(hoursSinceUpdate < 1);
    }
    
    const fetchPreviews = async () => {
      const updated = await Promise.all(currentSet.map(async (item) => {
        try {
          const searchTerm = encodeURIComponent(`${item.artist} ${item.title}`);
          const res = await fetch(`https://itunes.apple.com/search?term=${searchTerm}&media=music&entity=song&limit=1`);
          
          if (res.ok) {
            const text = await res.text();
            if (text && text.trim().length > 0) {
              const json = JSON.parse(text);
              if (json.results && json.results.length > 0) {
                const track = json.results[0];
                return { 
                  ...item, 
                  previewUrl: track.previewUrl || item.previewUrl,
                  image: track.artworkUrl100 ? track.artworkUrl100.replace("100x100", "800x800") : item.image
                };
              }
            }
          }
        } catch (e) {
          console.debug("Silent fallback for:", item.title);
        }
        return item;
      }));
      setReleases(updated);
      setLoading(false);
    };
    fetchPreviews();

    // Atualizar contador a cada hora
    const interval = setInterval(() => {
      setDaysUntilUpdate(getDaysUntilNextUpdate());
    }, 1000 * 60 * 60); // A cada hora

    return () => clearInterval(interval);
  }, []);

  const togglePlay = (id: string, url: string) => {
    if (!url || !audioRef.current) return;
    if (activePreview === id) {
      audioRef.current.pause();
      setActivePreview(null);
    } else {
      audioRef.current.src = url;
      audioRef.current.play().catch(() => setActivePreview(null));
      setActivePreview(id);
    }
  };

  const handleFavorite = (e: React.MouseEvent, release: Release) => {
    e.stopPropagation();
    if (!user) return navigate('/login');
    toggleFavorite({
      id: release.id,
      title: release.title,
      host: release.artist,
      image: release.image,
      type: 'track'
    });
  };

  const forceUpdate = () => {
    // Forçar atualização manual
    localStorage.setItem('releases_last_update', new Date().toISOString());
    window.location.reload();
  };

  const mainHighlight = releases[0];

  // Obter data formatada para exibição
  const getFormattedDate = () => {
    const stored = localStorage.getItem('releases_last_update');
    if (!stored) return 'Feb 2026';
    const date = new Date(stored);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-[#000] min-h-screen transition-colors duration-300">
      <audio ref={audioRef} onEnded={() => setActivePreview(null)} />
      
      {/* Update Notice Banner */}
      {showUpdateNotice && (
        <div className="bg-[#ff6600] text-white py-3 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          <div className="relative z-10 flex items-center justify-center space-x-3">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              🎉 New releases just dropped! Check out the latest worship anthems
            </span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-black text-white relative overflow-hidden h-[70vh] flex items-center">
        <div className="absolute inset-0 opacity-40">
          {mainHighlight && (
            <img 
              src={mainHighlight.image} 
              className="w-full h-full object-cover grayscale" 
              alt=""
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253361-bee8718a300a?auto=format&fit=crop&q=80&w=1200';
              }}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="inline-flex items-center space-x-2 bg-[#ff6600] text-black px-4 py-1.5 mb-8">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Single of the Week</span>
          </div>
          <h1 className="text-7xl md:text-[10rem] font-medium uppercase tracking-tighter leading-[0.8] mb-8">The New<br />Wave</h1>
          {mainHighlight && (
            <div className="flex flex-col md:flex-row md:items-end gap-12">
              <div>
                <p className="text-[#ff6600] text-xl font-medium uppercase tracking-widest mb-2">{mainHighlight.artist}</p>
                <h2 className="text-4xl md:text-5xl font-medium uppercase tracking-tight">{mainHighlight.title}</h2>
              </div>
              <button 
                onClick={() => togglePlay(mainHighlight.id, mainHighlight.previewUrl)}
                className="bg-white text-black h-20 w-20 rounded-full flex items-center justify-center hover:bg-[#ff6600] hover:text-white transition-all transform hover:scale-105"
              >
                {activePreview === mainHighlight.id ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24">
        {/* Header with Update Info */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 border-b-2 border-black dark:border-white pb-8">
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <h3 className="text-4xl font-medium uppercase tracking-tighter dark:text-white">This Week</h3>
            <span className="text-gray-400 font-normal uppercase tracking-widest text-sm pt-2">{getFormattedDate()}</span>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Update Countdown */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-white/5 px-4 py-2 border border-gray-200 dark:border-white/10">
              <Clock className="w-4 h-4 text-[#ff6600]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">
                {daysUntilUpdate === 0 ? 'Updates Today!' : `Next update in ${daysUntilUpdate}d`}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest border border-transparent">Latest</button>
              <button 
                onClick={forceUpdate}
                className="bg-transparent text-gray-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:border-white/10 hover:border-[#ff6600] hover:text-[#ff6600] transition-colors flex items-center space-x-2"
                title="Force refresh releases"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-[#ff6600] animate-spin mb-4" />
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-gray-400">Scanning for new anthems...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            {releases.map((release) => (
              <div key={release.id} className="bg-white dark:bg-[#111] group relative">
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={release.image} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                    alt={release.title} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(release.artist + release.title)}/800/800`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"></div>
                  
                  {/* NEW Badge */}
                  {isNewRelease(release.addedDate) && (
                    <div className="absolute top-6 right-6 bg-green-500 text-white px-3 py-1.5 flex items-center space-x-2 shadow-lg animate-pulse">
                      <Zap className="w-3 h-3 fill-current" />
                      <span className="text-[9px] font-black uppercase tracking-widest">New</span>
                    </div>
                  )}
                  
                  {release.isHot && !isNewRelease(release.addedDate) && (
                    <div className="absolute top-6 left-6 bg-[#ff6600] text-white p-2 flex items-center space-x-2">
                      <Flame className="w-4 h-4 fill-current" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Hot</span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-black/80 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-4">
                      <button 
                        onClick={() => togglePlay(release.id, release.previewUrl)}
                        className="bg-[#ff6600] text-white p-4 rounded-full"
                      >
                        {activePreview === release.id ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                      </button>
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => handleFavorite(e, release)}
                          className={`p-3 rounded-full border ${isFavorite(release.id) ? 'bg-red-500 border-red-500 text-white' : 'border-white/20 text-white hover:bg-white hover:text-black'}`}
                        >
                          <Heart className={`w-4 h-4 ${isFavorite(release.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button className="p-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[#ff6600] text-[10px] font-black uppercase tracking-[0.2em] mb-1">{release.artist}</p>
                    <h4 className="text-white text-xl font-medium uppercase tracking-tight truncate">{release.title}</h4>
                  </div>
                </div>
                
                <div className="p-8 group-hover:bg-[#ff6600] transition-colors duration-500">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 group-hover:text-black/60">{release.artist}</p>
                  <h4 className="text-black dark:text-white text-2xl font-medium uppercase tracking-tighter truncate group-hover:text-black">{release.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-32 border-t border-gray-100 dark:border-white/10 pt-16 flex flex-col md:flex-row items-start gap-20">
           <div className="w-full md:w-1/3">
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff6600] mb-6">About Curated Releases</h4>
             <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-relaxed uppercase tracking-tight mb-4">
               Every week, our editorial team scours thousands of independent and major label submissions to bring you only what matters.
             </p>
             <div className="flex items-center space-x-2 text-[9px] font-medium uppercase tracking-widest text-gray-400">
               <RefreshCw className="w-3 h-3" />
               <span>Auto-updates every {ROTATION_DAYS} days</span>
             </div>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-grow">
              <div className="space-y-2">
                <p className="text-3xl font-medium uppercase tracking-tighter dark:text-white">12k+</p>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Songs Auditioned</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-medium uppercase tracking-tighter dark:text-white">{ROTATION_DAYS}d</p>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Update Cycle</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-medium uppercase tracking-tighter dark:text-white">100%</p>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Faith Focused</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-medium uppercase tracking-tighter dark:text-white">24/7</p>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Global Discovery</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NewReleasesPage;