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

  // país
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((d) => setCountry(d.country_name))
      .catch(() => {})
  }, [])

  // volume
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

      <div className="max-w-7xl mx-auto h-full grid grid-cols-3 items-center px-4">

        {/* LEFT */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#ff6600]">
            <img
              src={program?.image}
              alt={program?.title}
              className="w-full h-full object-cover"
            />
          </div>

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

        {/* CENTER (PLAY 🔥) */}
        <div className="flex justify-center">
          <button
            onClick={onTogglePlayback}
            className="w-14 h-14 rounded-full bg-[#ff6600] flex items-center justify-center shadow-lg hover:scale-110 transition"
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} />}
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-end gap-4">

          {/* listeners */}
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-widest text-gray-400">
              {siteListeners} site + {TUNEIN_DEFAULT} TuneIn
            </span>

            <span className="text-xs text-white font-semibold">
              {total} listening now {country && `• ${country}`}
            </span>
          </div>

          {/* volume */}
          <div className="flex items-center gap-2">
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
    </div>
  )
}

export default LivePlayerBar
