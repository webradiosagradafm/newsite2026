import React from 'react';

export default function RecentlyPlayed({ tracks }) {
  // Dados de exemplo baseados na sua foto
  const mockTracks = [
    { id: 1, title: "Ain't I Good For You", artist: "Yazmin Lacey", cover: "https://i.scdn.co/image/ab67616d0000b273767f70c57c66d9c6c68e7f1e" },
    { id: 2, title: "Zimbabwe", artist: "Ife Ogunjobi", cover: "" },
    { id: 3, title: "Idea 5 (Call My Name)", artist: "Kokoroko", cover: "https://i.scdn.co/image/ab67616d0000b2733970b5d8a6a68f6a9e8e2b6a" }
  ];

  const list = tracks?.length > 0 ? tracks : mockTracks;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-4xl bbc-title mb-8 dark:text-white">Recent Tracks</h2>
      <div className="w-full">
        <div className="grid grid-cols-12 gap-4 border-b border-white/10 pb-4 text-[10px] bbc-title text-gray-400">
          <div className="col-span-1">#</div>
          <div className="col-span-7">Track</div>
          <div className="col-span-4">Artist</div>
        </div>
        {list.map((track, i) => (
          <div key={i} className="grid grid-cols-12 gap-4 items-center py-4 border-b border-white/5 hover:bg-white/5 transition-colors">
            <div className="col-span-1 text-sm text-gray-500">{i + 1}.</div>
            <div className="col-span-7 flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded flex-shrink-0 overflow-hidden">
                {track.cover && <img src={track.cover} className="w-full h-full object-cover" />}
              </div>
              <span className="font-bold text-sm dark:text-white">{track.title}</span>
            </div>
            <div className="col-span-4 text-sm text-gray-500">{track.artist}</div>
          </div>
        ))}
      </div>
    </section>
  );
}