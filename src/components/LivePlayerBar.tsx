import React, { useState, useEffect, useRef } from 'react'
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
import { supabase } from '../lib/supabase'

const FALLBACK_IMAGE = '/logo.png'

interface LivePlayerBarProps {
  isPlaying: boolean
  onTogglePlayback: () => void
  program: Program
  liveMetadata?: { artist: string; title: string; artwork?: string } | null
  queue?: Program[]
  audioRef: React.RefObject<HTMLAudioElement | null>
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

  // ✅ MEDIA SESSION SEGURO (CORRIGIDO)
  useEffect(() => {
    if (!('mediaSession' in navigator)) return

    try {
      const artworkSrc =
        liveMetadata?.artwork ||
        program?.image ||
        FALLBACK_IMAGE

      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: liveMetadata?.title || program?.title || '',
        artist: liveMetadata?.artist || program?.host || '',
        artwork: [
          {
            src: artworkSrc,
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      })

      navigator.mediaSession.setActionHandler('play', onTogglePlayback)
      navigator.mediaSession.setActionHandler('pause', onTogglePlayback)
    } catch (err) {
      console.log('MediaMetadata safe error:', err)
    }
  }, [liveMetadata, program, onTogglePlayback])

  // ✅ VOLUME
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX />
    if (volume < 0.5) return <Volume1 />
    return <Volume2 />
  }

  if (!program) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t z-50">

      <div className="flex items-center justify-between px-6 py-4">

        {/* INFO */}
        <div className="flex items-center gap-3 w-[30%]">

          <img
            src={program?.image || FALLBACK_IMAGE}
            className="w-12 h-12 rounded object-cover"
            alt=""
          />

          <div className="min-w-0">
            <p className="font-semibold truncate">
              {program?.title || 'Live Radio'}
            </p>
            <p className="text-sm opacity-60 truncate">
              {program?.host || ''}
            </p>
          </div>
        </div>

        {/* CONTROLES */}
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

          <button onClick={toggleMute}>
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

        </div>

      </div>

    </div>
  )
}

export default LivePlayerBar