import React, { useState, useEffect } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  List,
  X,
  RotateCcw,
  RotateCw,
} from 'lucide-react'
import { Program } from '../types'

interface LivePlayerBarProps {
  isPlaying: boolean
  onTogglePlayback: () => void
  program: Program
  liveMetadata?: { artist: string; title: string } | null
  queue?: Program[]
  audioRef: React.RefObject<HTMLAudioElement | null>
}

// 🔥 PROGRESSO REAL
const useProgramProgress = (program: Program) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      try {
        const now = new Date()
        const minutes = now.getHours() * 60 + now.getMinutes()

        const [sh, sm] = program.startTime.split(':').map(Number)
        const [eh, em] = program.endTime.split(':').map(Number)

        let start = sh * 60 + sm
        let end = eh * 60 + em

        if (end <= start) end += 1440 // overnight

        const current = minutes - start
        const total = end - start

        setProgress(Math.max(0, Math.min(100, (current / total) * 100)))
      } catch {
        setProgress(0)
      }
    }

    update()
    const i = setInterval(update, 10000)
    return () => clearInterval(i)
  }, [program])

  return progress
}

const LivePlayerBar: React.FC<LivePlayerBarProps> = ({
  isPlaying,
  onTogglePlayback,
  program,
  liveMetadata,
  queue = [],
  audioRef,
}) => {
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)

  const progress = useProgramProgress(program)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX />
    if (volume < 0.5) return <Volume1 />
    return <Volume2 />
  }

  if (!program) return null

  return (
    <>
      {/* 🔥 SCHEDULE DRAWER */}
      {showSchedule && (
        <div className="fixed top-0 right-0 w-full md:w-96 h-full bg-white dark:bg-black z-50 shadow-xl">
          <div className="flex justify-between p-4 border-b">
            <h2 className="font-bold">Schedule</h2>
            <button onClick={() => setShowSchedule(false)}>
              <X />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <strong>{program.title}</strong>
              <p>{program.host}</p>
              <span className="text-green-500 text-sm">LIVE</span>
            </div>

            {queue.map((p) => (
              <div key={p.id}>
                <strong>{p.title}</strong>
                <p>{p.host}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 PLAYER */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t z-40">

        {/* PROGRESS BAR */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-orange-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between px-6 py-4">

          {/* INFO */}
          <div className="flex items-center gap-3 w-[30%]">
            <img
              src={program?.image || '/logo.png'}
              className="w-12 h-12 rounded object-cover"
              alt=""
            />

            <div className="min-w-0">
              <p className="font-semibold truncate">
                {liveMetadata?.title || program.title}
              </p>
              <p className="text-sm opacity-60 truncate">
                {liveMetadata?.artist || program.host}
              </p>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex items-center gap-6">

            <button>
              <RotateCcw />
            </button>

            <button
              onClick={onTogglePlayback}
              className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center"
            >
              {isPlaying ? <Pause /> : <Play />}
            </button>

            <button>
              <RotateCw />
            </button>

          </div>

          {/* VOLUME */}
          <div className="flex items-center gap-3 w-[30%] justify-end">

            <button onClick={() => setIsMuted(!isMuted)}>
              <VolumeIcon />
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />

            <button onClick={() => setShowSchedule(true)}>
              <List />
            </button>

          </div>

        </div>
      </div>
    </>
  )
}

export default LivePlayerBar