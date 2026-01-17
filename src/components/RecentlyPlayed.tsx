
import React, { useState, useEffect } from 'react';
import { Music } from 'lucide-react';

interface Track {
  artist: string;
  title: string;
  artwork?: string;
  playedAt?: Date;
  isMusic?: boolean;
}

interface RecentlyPlayedProps {
  tracks: Track[];
}

const RecentlyPlayed: React.FC<RecentlyPlayedProps> = ({ tracks }) => {
  const [artworks, setArtworks] = useState<Record<string, string>>({});
  
  const displayedTracks = tracks
    .filter(track => track.isMusic !== false)
    .slice(0, 4);

  useEffect(() => {
    const fetchArtworks = async () => {
      const newArtworks = { ...artworks };
      let changed = false;

      for (const track of displayedTracks) {
        const key = `${track.artist}-${track.title}`;
        if (!newArtworks[key] && !track.artwork) {
          try {
            const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(track.artist + ' ' + track.title)}&media=music&limit=1`;
            const itunesResponse = await fetch(itunesUrl);
            
            let foundImage = '';
            
            // Verifica se a resposta é válida e possui conteúdo
            if (itunesResponse.ok && itunesResponse.status !== 204) {
              const text = await itunesResponse.text();
              if (text && text.trim().length > 0) {
                try {
                  const itunesData = JSON.parse(text);
                  if (itunesData.results && itunesData.results.length > 0) {
                    foundImage = itunesData.results[0].artworkUrl100;
                  }
                } catch (parseErr) {
                  console.debug("iTunes JSON parse error, using fallback");
                }
              }
            }

            // Se não encontrou imagem na API, usa o fallback do Picsum
            if (!foundImage) {
              foundImage = `https://picsum.photos/seed/${encodeURIComponent(key)}/100/100`;
            }

            newArtworks[key] = foundImage;
            changed = true;
          } catch (error) {
            // Silencia o erro para o usuário e usa fallback
            newArtworks[key] = `https://picsum.photos/seed/${encodeURIComponent(key)}/100/100`;
            changed = true;
          }
        }
      }
      if (changed) setArtworks(newArtworks);
    };

    if (displayedTracks.length > 0) fetchArtworks();
  }, [tracks]);

  return (
    <section className="bg-white dark:bg-[#000] py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-regular text-gray-900 dark:text-white mb-6 tracking-tight">Recent Tracks</h2>
        
        <div className="w-full">
          {/* Header minimalista */}
          <div className="grid grid-cols-12 gap-4 pb-2 border-b border-gray-200 dark:border-white/10 text-sm font-regular text-gray-900 dark:text-gray-100 mb-1">
            <div className="col-span-8 md:col-span-6">Track</div>
            <div className="col-span-4 md:col-span-6">Artist</div>
          </div>

          <div className="flex flex-col">
            {displayedTracks.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm border-b border-gray-100 dark:border-white/5">
                No recent tracks found.
              </div>
            ) : (
              displayedTracks.map((track, idx) => {
                const key = `${track.artist}-${track.title}`;
                const artworkUrl = artworks[key] || track.artwork || `https://picsum.photos/seed/${encodeURIComponent(key)}/100/100`;
                
                return (
                  <div key={idx} className="grid grid-cols-12 gap-4 py-4 border-b border-gray-100 dark:border-white/5 items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    {/* Track Column */}
                    <div className="col-span-8 md:col-span-6 flex items-center space-x-4">
                      <span className="text-[13px] text-gray-500 w-5 font-normal">{idx + 1}.</span>
                      <div className="w-10 h-10 md:w-11 md:h-11 bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                        <img 
                          src={artworkUrl} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(key)}/100/100`;
                          }}
                        />
                      </div>
                      <span className="text-sm md:text-[15px] font-normal text-gray-900 dark:text-gray-100 truncate pr-4">
                        {track.title}
                      </span>
                    </div>

                    {/* Artist Column */}
                    <div className="col-span-4 md:col-span-6">
                      <span className="text-sm md:text-[15px] text-gray-500 dark:text-gray-400 truncate block font-normal">
                        {track.artist}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentlyPlayed;
