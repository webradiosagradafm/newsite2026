import { useRef, useState } from "react";
import LivePlayerBar from "./components/LivePlayerBar";
import { Program } from "./types";

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const liveProgram: Program = {
    id: "live",
    title: "Praise FM Live",
    host: "Praise FM USA",
    image: "/logopraisefm.webp",
    startTime: "Live",
    endTime: "Now"
  };

  const togglePlayback = async () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      await audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* AUDIO ELEMENT (FICA INVISÍVEL) */}
      <audio
        ref={audioRef}
        src="https://SEU_STREAM_AQUI"
        preload="none"
      />

      {/* CONTEÚDO */}
      <main className="pt-20 pb-32 text-center text-white/60">
        Praise FM USA – Live Christian Radio
      </main>

      {/* PLAYER BAR */}
      <LivePlayerBar
        isPlaying={isPlaying}
        onTogglePlayback={togglePlayback}
        program={liveProgram}
        audioRef={audioRef}
      />
    </div>
  );
}
