import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";

interface Episode {
  id: string;
  title: string;
  presenter: string;
  description: string;
  duration: string;
  date: string;
  audioUrl: string;
  image: string;
}

export default function ProgramMiniPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const episodesRef = collection(
          db,
          "programs",
          "classic",
          "episodes"
        );

        const q = query(episodesRef, orderBy("date", "desc"));

        const snapshot = await getDocs(q);

        const episodeData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Episode[];

        setEpisodes(episodeData);
      } catch (error) {
        console.error("Erro ao buscar episódios:", error);
      }
    };

    fetchEpisodes();
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold text-white mb-6">
        Latest Episodes
      </h2>

      <div className="space-y-6">
        {episodes.map((episode) => (
          <div
            key={episode.id}
            className="bg-[#111] rounded-3xl p-6 flex flex-col md:flex-row gap-6"
          >
            <img
              src={episode.image}
              alt={episode.title}
              className="w-full md:w-52 h-52 object-cover rounded-2xl"
            />

            <div className="flex-1">
              <p className="text-orange-500 text-sm mb-2">
                {episode.date}
              </p>

              <h3 className="text-2xl font-bold text-white">
                {episode.title}
              </h3>

              <p className="text-gray-400 mt-2">
                with {episode.presenter}
              </p>

              <p className="text-gray-300 mt-4">
                {episode.description}
              </p>

              <p className="text-gray-500 mt-3">
                Duration: {episode.duration}
              </p>

              <audio
                controls
                className="w-full mt-6"
              >
                <source
                  src={episode.audioUrl}
                  type="audio/mpeg"
                />
              </audio>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}