import React, { useState, useEffect } from 'react'
import { Program } from '../types'

interface Props {
  isPlaying: boolean
  onTogglePlayback: () => void
  program: Program
  queue?: Program[]
  audioRef: React.RefObject<HTMLAudioElement>
}

const formatTime = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

const LiveMiniPlayer: React.FC<Props> = ({
  isPlaying,
  onTogglePlayback,
  program,
  queue = [],
  audioRef
}) => {
  const [open, setOpen] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [showSlider, setShowSlider] = useState(false)
  const [dark, setDark] = useState(false)

  // 🔥 DETECTA DARK MODE DO SITE
  useEffect(() => {
    const checkDark = () => {
      const isDark = document.documentElement.classList.contains('dark')
      setDark(isDark)
    }

    checkDark()

    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  // 🔊 volume real
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  return (
    <>
      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-[90]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* DRAWER */}
      <div
        className={`fixed right-0 top-0 h-full w-80 z-[100] transform transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        } ${dark ? 'bg-[#111]' : 'bg-white'}`}
      >
        <div className="p-4 border-b flex justify-between">
          <span className="font-semibold">Schedule</span>
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* 🔥 COM IMAGEM DO PRESENTER */}
        {queue.slice(0, 5).map((prog) => (
          <div key={prog.id} className="p-4 border-b flex gap-3">
            <img
              src={prog.image}
              className="w-12 h-12 rounded object-cover"
            />

            <div>
              <div className="font-semibold text-sm">{prog.title}</div>
              <div className="text-xs text-gray-500">
                {formatTime(prog.startTime)} - {formatTime(prog.endTime)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MINIPLAYER */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[80] border-t transition-colors ${
          dark
            ? 'bg-[#0b0b0b] text-white border-white/10'
            : 'bg-white text-black border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-[70px]">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <img
              src={program.image}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <div className="text-xs uppercase opacity-60">
                {program.title}
              </div>
              <div className="text-sm font-semibold">
                LIVE ON PRAISE FM
              </div>
            </div>
          </div>

          {/* CENTER */}
          <button
            onClick={onTogglePlayback}
            className="w-12 h-12 rounded-full bg-[#ff6600] text-white flex items-center justify-center"
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* 🔊 VOLUME BBC STYLE */}
            <div
              className="flex items-center gap-2"
              onMouseEnter={() => setShowSlider(true)}
              onMouseLeave={() => setShowSlider(false)}
            >
              🔊

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  showSlider ? 'w-24 opacity-100' : 'w-0 opacity-0'
                }`}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-[#ff6600]"
                />
              </div>
            </div>

            {/* LIVE */}
            <div className="flex items-center gap-1 text-green-500 text-xs">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              LIVE
            </div>

            {/* MENU */}
            <button onClick={() => setOpen(true)}>
              ☰
            </button>

          </div>
        </div>
      </div>
    </>
  )
}

export default LiveMiniPlayer
