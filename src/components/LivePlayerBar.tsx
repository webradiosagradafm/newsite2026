import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

type LiveMetadata = {
  artist: string
  title: string
} | null

type Program = {
  title: string
  host?: string
}

interface Props {
  isPlaying: boolean
  onTogglePlayback: () => void
  program: Program
  liveMetadata: LiveMetadata
  audioRef: React.RefObject<HTMLAudioElement | null>
}

const TUNEIN_DEFAULT = 2

const LivePlayerBar: React.FC<Props> = ({
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

  // 🔥 FETCH LISTENERS
  useEffect(() => {
    const fetchListeners = async () => {
      try {
        const { data } = await supabase.from('listeners_now').select('id')
        setSiteListeners(data?.length || 0)
      } catch (err) {
        console.error('listeners error:', err)
      }
    }

    fetchListeners()
    const interval = setInterval(fetchListeners, 10000)

    return () => clearInterval(interval)
  }, [])

  // 🔊 volume control
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = volume
    audioRef.current.muted = muted
  }, [volume, muted, audioRef])

  const totalListeners = siteListeners + tuneInListeners

  const subtitle = useMemo(() => {
    if (liveMetadata?.artist && liveMetadata?.title) {
      return `${liveMetadata.artist} — ${liveMetadata.title}`
    }
    return 'PRAISE FM — LIVE'
  }, [liveMetadata])

  const toggleMute = () => {
    setMuted((m) => !m)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-white/10">

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LEFT INFO */}
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 truncate">
            {subtitle}
          </span>
          <span className="text-sm text-white font-medium truncate">
            {program?.title}
            {program?.host ? ` with ${program.host}` : ''}
          </span>
        </div>

        {/* CENTER PLAY */}
        <div className="flex items-center justify-center flex-1">
          <button
            onClick={onTogglePlayback}
            className="w-16 h-16 rounded-full bg-[#ff6600] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition"
          >
            {isPlaying ? (
              <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
                <rect x="6" y="5" width="4" height="14" />
                <rect x="14" y="5" width="4" height="14" />
              </svg>
            ) : (
              <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* LISTENERS */}
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">
              {siteListeners} site + {tuneInListeners} tunein
            </span>
            <span className="text-white text-sm font-semibold">
              {totalListeners} listening
            </span>
          </div>

          {/* VOLUME */}
          <button onClick={toggleMute} className="text-gray-300 hover:text-white">
            {muted || volume === 0 ? (
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12l4.5 4.5-1.5 1.5L15 13.5 10.5 18H6v-6H2v-2h4V4h4.5L15 8.5 19.5 4l1.5 1.5z" />
              </svg>
            ) : (
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 9v6h4l5 5V4l-5 5H5z" />
              </svg>
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 accent-[#ff6600]"
          />
        </div>
      </div>
    </div>
  )
}

export default LivePlayerBar