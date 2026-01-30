import { useRef, useState } from "react";
import LivePlayerBar from "./components/LivePlayerBar";

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const program = {
    id: "live",
    title: "Praise FM Live",
    host: "Praise FM USA",
    image: "/logopraisefm.webp",
    startTime: "Live",
    endTime: "Now"
  };

  const togglePlayback = async () => {
    if (!audioRef.current) return;

    try {
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.error("Audio error:", err);
    }
  };

  return (
    <>
      {/* AUDIO ELEMENT (OBRIGATÓRIO) */}
      <audio
        ref={audioRef}
        src="https://SEU_STREAM_AQUI"
        preload="none"
      />

      {/* PLAYER BAR */}
      <LivePlayerBar
        isPlaying={isPlaying}
        onTogglePlayback={togglePlayback}
        program={program}
        audioRef={audioRef}
      />
    </>
  );
}
