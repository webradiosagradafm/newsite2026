import React, { useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { connectListener } from '../lib/listeners'

const STREAM_URL = 'https://stream.zeno.fm/hvwifp8ezc6tv'

const TUNEIN_DEFAULT = 2 // 🔥 AJUSTA AQUI CONFORME TUNEIN

const LivePlayerBar: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)

  const [siteListeners, setSiteListeners] = useState(0)
  const [tuneInListeners, setTuneInListeners] = useState(TUNEIN_DEFAULT)

  // 🎧 conecta listener
  useEffect(() => {
    connectListener()
  }, [])

  // 🎧 buscar listeners
  useEffect(() => {
    const fetchListeners = async () => {
      try {
        const { data } = await supabase
          .from('listeners_now')
          .select('*')

        setSiteListeners(data?.length || 0)
      } catch (err) {
        console.error('Listeners error:', err)
      }
    }

    fetchListeners()

    const interval = setInterval(fetchListeners, 10000)

    return () => clearInterval(interval)
  }, [])

  const totalListeners = siteListeners + tuneInListeners

  // ▶️ play / pause
  const togglePlay = () => {
    if (!audioRef.current) return

    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.src = STREAM_URL
      audioRef.current.play().catch(() => {})
      setPlaying(true)
    }
  }

  // 🔊 volume
  const handleVolume = (v: number) => {
    if (!audioRef.current) return
    audioRef.current.volume = v
    setVolume(v)
    setMuted(v === 0)
  }

  const toggleMute = () => {
    if (!audioRef.current) return

    if (muted) {
      audioRef.current.volume = volume || 1
      setMuted(false)
    } else {
      audioRef.current.volume = 0
      setMuted(true)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black text-white z-50 border-t border-white/10 px-4 py-3 flex items-center justify-between">

      {/* 🎵 PLAYER CONTROLS */}
      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 bg-[#ff6600] flex items-center justify-center rounded-full hover:scale-105 transition"
        >
          {playing ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current ml-1" />
          )}
        </button>

        <div className="text-xs uppercase tracking-widest text-gray-400">
          Praise FM — Live Stream
        </div>
      </div>

      {/* 📡 LISTENERS */}
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

        <div className="flex flex-col text-right leading-tight">
          <span className="text-[9px] uppercase tracking-widest text-gray-400">
            {siteListeners} site + {tuneInListeners} TuneIn
          </span>
          <span className="text-xs font-semibold">
            {totalListeners} listening now
          </span>
        </div>
      </div>

      {/* 🔊 VOLUME */}
      <div className="flex items-center space-x-3">
        <button onClick={toggleMute}>
          {muted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={muted ? 0 : volume}
          onChange={(e) => handleVolume(Number(e.target.value))}
          className="w-24"
        />
      </div>

      {/* 🎧 AUDIO */}
      <audio ref={audioRef} />
    </div>
  )
}

export default LivePlayerBar