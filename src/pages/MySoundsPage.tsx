import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Music, Heart, Trash2, Play, Radio } from 'lucide-react';

const MySoundsPage: React.FC = () => {
  const { favorites, toggleFavorite, loading } = useAuth();

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-[#ff6600] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b-2 border-black dark:border-white pb-6">
        <div>
          <div className="flex items-center space-x-3 text-[#ff6600] mb-2 font-medium uppercase tracking-widest text-[10px]">
            <Heart className="w-4 h-4 fill-current" />
            <span>Personal Library</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-medium text-gray-900 dark:text-white tracking-tighter uppercase leading-none">My Sounds</h1>
        </div>
        <p className="text-gray-400 dark:text-gray-500 font-normal uppercase tracking-widest text-xs mt-4 md:mt-0">
          {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-32 bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10">
          <Music className="w-20 h-20 text-gray-300 dark:text-white/20 mx-auto mb-6" />
          <h3 className="text-2xl font-medium text-gray-400 dark:text-gray-600 uppercase tracking-tight">Your library is empty</h3>
          <p className="text-gray-500 dark:text-gray-400 font-normal uppercase tracking-widest text-xs mt-2 max-w-sm mx-auto">
            Heart your favorite tracks and devotionals to save them here for quick access.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favorites.map((fav) => (
            <div key={fav.id} className="group relative bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-white/5 transition-all duration-300 hover:shadow-2xl">
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={fav.image} 
                  alt={fav.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="w-16 h-16 bg-[#ff6600] rounded-full flex items-center justify-center text-white shadow-2xl transform scale-75 group-hover:scale-100 transition-all">
                    <Play className="w-8 h-8 fill-current" />
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-black text-[#ff6600] text-[9px] font-medium uppercase px-2 py-1 rounded-md flex items-center space-x-1 shadow-lg">
                    {fav.item_type === 'devotional' ? <Radio className="w-3 h-3" /> : <Music className="w-3 h-3" />}
                    <span>{fav.item_type}</span>
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white tracking-tight uppercase leading-tight mb-1 group-hover:text-[#ff6600] transition-colors line-clamp-2">
                  {fav.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-normal uppercase tracking-widest text-[9px] mb-4">
                  {fav.subtitle}
                </p>
                <button 
                  onClick={() => toggleFavorite({ id: fav.item_id })}
                  className="flex items-center space-x-2 text-[10px] font-medium text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors pt-4 border-t border-gray-100 dark:border-white/10 w-full"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove from library</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySoundsPage;