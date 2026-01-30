import { useRef, useState } from "react";
import LivePlayerBar from "./components/LivePlayerBar";

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const program: any = {
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
    <>
      <audio
        ref={audioRef}
        src="https://SEU_STREAM_AQUI"
      />

      <LivePlayerBar
        isPlaying={isPlaying}
        onTogglePlayback={togglePlayback}
        program={program}
        audioRef={audioRef}
      />
    </>
  );
}

