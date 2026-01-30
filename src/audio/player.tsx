import { useRef, useState } from "react";

interface PlayerProps {
  streamUrl: string;
  onFirstPlay?: () => void;
}

export function Player({ streamUrl, onFirstPlay }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!playing) {
      try {
        audio.src = streamUrl;
        await audio.play();
        setPlaying(true);

        // 🔥 gatilho profissional
        if (!hasPlayed) {
          setHasPlayed(true);
          onFirstPlay?.();
        }
      } catch (err) {
        console.error("Audio play error:", err);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="player">
      <audio ref={audioRef} preload="none" />
      <button onClick={togglePlay}>
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
}
