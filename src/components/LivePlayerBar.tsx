import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { connectListener } from '../lib/listeners'

type LiveMetadata = {
  artist: string
  title: string
  playedAt?: Date
  isMusic?: boolean
} | null

type Program = {
  title: string
  host?: string
}

interface LivePlayerBarProps {
  isPlaying: boolean
  onTogglePlayback: () => void
  program: Program
  liveMetadata: LiveMetadata
  queue?: Program[]
  audioRef: React.RefObject<HTMLAudioElement | null>
}

const TUNEIN_DEFAULT = 2

const LivePlayerBar: React.FC<LivePlayerBarProps> = ({
  isPlaying,
  onTogglePlayback,
  program,
  liveMetadata,
  audioRef,
}) => {
  const [siteListeners, setSiteListeners] = useState(0)
  const [tuneInListeners] = useState(TUNEIN_DEFAULT)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    connectListener()
  }, [])

  useEffect(() => {
    const fetchListeners = async () => {
      try {
        const { data, error } = await supabase.from('listeners_now').select('id')
        if (error) throw error
        setSiteListeners(data?.length || 0)
      } catch (err) {
        console.error('Listeners fetch error:', err)
      }
    }

    fetchListeners()
    const interval = setInterval(fetchListeners, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = volume
    audioRef.current.muted = muted
  }, [audioRef, volume, muted])

  const totalListeners = siteListeners + tuneInListeners

  const subtitle = useMemo(() => {
    if (liveMetadata?.artist && liveMetadata?.title) {
      return `${liveMetadata.artist} — ${liveMetadata.title}`
    }
    return 'PRAISE FM — LIVE STREAM'
  }, [liveMetadata])

  const handleVolumeChange = (value: number) => {
    setVolume(value)
    if (value > 0 && muted) setMuted(false)
    if (value === 0) setMuted(true)
  }

  const toggleMute = () => {
    setMuted((prev) => !prev)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-[72px] border-t border-white/5 bg-[#0b0b0b]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-4">
          <button
            onClick={onTogglePlayback}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff6600] text-white transition hover:scale-105 active:scale-95"
            aria-label={isPlaying ? 'Pause stream' : 'Play stream'}
          >
            {isPlaying ? (
              <Pause className="h-7 w-7 fill-current" />
            ) : (
              <Play className="ml-0.5 h-7 w-7 fill-current" />
            )}
          </button>

          <div className="min-w-0">
            <div className="truncate text-[10px] uppercase tracking-[0.3em] text-gray-400">
              {subtitle}
            </div>
            <div className="truncate text-sm font-medium text-white">
              {program?.title || 'Live'}
              {program?.host ? ` with ${program.host}` : ''}
            </div>
          </div>
        </div>

        <div className="hidden flex-col items-center justify-center md:flex">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest text-gray-400">
              {siteListeners} site + {tuneInListeners} tunein
            </span>
          </div>
          <div className="text-xs font-semibold text-white">
            {totalListeners} listening now
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="text-gray-300 transition hover:text-white"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted || volume === 0 ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-24 accent-[#2f80ff]"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  )
}

export default LivePlayerBar
