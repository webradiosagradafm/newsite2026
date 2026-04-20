import React, { useEffect, useMemo, useState } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { connectListener } from '../lib/listeners'

type LiveMetadata = {
  artist: string
  title: string
} | null

interface Program {
  title: string
  host: string
  image: string
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
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [country, setCountry] = useState<string | null>(null)

  // conectar listener
  useEffect(() => {
    connectListener()
  }, [])

  // buscar listeners
  useEffect(() => {
    const fetchListeners = async () => {
      const { data } = await supabase.from('listeners_now').select('id')
      setSiteListeners(data?.length || 0)
    }

    fetchListeners()
    const interval = setInterval(fetchListeners, 10000)
    return () => clearInterval(interval)
  }, [])

  // país (global vibe)
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => setCountry(data.country_name))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = volume
    audioRef.current.muted = muted
  }, [volume, muted])

  const total = siteListeners + TUNEIN_DEFAULT

  const subtitle = useMemo(() => {
    if (liveMetadata?.artist && liveMetadata?.title) {
      return `${liveMetadata.artist} — ${liveMetadata.title}`
    }
    return 'PRAISE FM — LIVE STREAM'
  }, [liveMetadata])

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-[78px] bg-black border-t border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">

        {/* LEFT */}
        <div className="flex items-center gap-4 min-w-0">

          {/* FOTO (VOLTOU 🔥) */}
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#ff6600]">
            <img
              src={program?.image}
              alt={program?.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* PLAY */}
          <button
            onClick={onTogglePlayback}
            className="w-12 h-12 rounded-full bg-[#ff6600] flex items-center justify-center"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          {/* INFO */}
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 truncate">
              {subtitle}
            </p>
            <p className="text-sm text-white font-semibold truncate">
              {program?.title}
            </p>
            <p className="text-xs text-gray-400 truncate">
              with {program?.host}
            </p>
          </div>
        </div>

        {/* CENTER (GLOBAL 🔥) */}
        <div className="hidden md:flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest text-gray-400">
              {siteListeners} site + {TUNEIN_DEFAULT} TuneIn
            </span>
          </div>

          <span className="text-xs text-white font-semibold">
            {total} listening now {country && `• ${country}`}
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <button onClick={() => setMuted(!muted)}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 accent-[#ff6600]"
          />
        </div>

      </div>
    </div>
  )
}

export default LivePlayerBar
