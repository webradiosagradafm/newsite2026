import React, { useState, useEffect } from 'react'
import { Program } from '../types'

interface Props {
  isPlaying: boolean
  onTogglePlayback: () => void
  program: Program
  queue?: Program[]
  audioRef: React.RefObject<HTMLAudioElement>
}

const VolumeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 10h4l5-4v12l-5-4H4z"/>
    <path d="M16 9a4 4 0 0 1 0 6"/>
    <path d="M18.5 6.5a7.5 7.5 0 0 1 0 11"/>
  </svg>
)

const LiveMiniPlayer: React.FC<Props> = ({
  isPlaying,
  onTogglePlayback,
  program,
  queue = [],
  audioRef
}) => {
  const [openMobile, setOpenMobile] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [showSlider, setShowSlider] = useState(false)
  const [dark, setDark] = useState(false)

  // detectar dark mode
  useEffect(() => {
    const check = () =>
      setDark(document.documentElement.classList.contains('dark'))
    check()

    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true })
    return () => obs.disconnect()
  }, [])

  // volume real
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // ❗ NÃO RENDERIZA SE NÃO TIVER PLAY
  if (!isPlaying) return null

  return (
    <>
      {/* 📱 FULL PLAYER MOBILE */}
      {openMobile && (
        <div className={`fixed inset-0 z-[100] ${dark ? 'bg-black text-white' : 'bg-white text-black'}`}>

          <div className="flex justify-between items-center p-4 border-b">
            <span className="font-semibold">Now Playing</span>
            <button onClick={() => setOpenMobile(false)}>✕</button>
          </div>

          <div className="p-4">

            <img
              src={program.image}
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
            />

            <h2 className="text-center font-bold text-lg">{program.title}</h2>

            {/* 🔊 VOLUME SVG */}
            <div className="mt-6 flex items-center gap-3">
              <VolumeIcon />
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

            {/* 👤 PRESENTERS */}
            <div className="mt-8">
              {queue.slice(0, 5).map((prog) => (
                <div key={prog.id} className="flex items-center gap-3 mb-4">
                  <img src={prog.image} className="w-12 h-12 rounded object-cover"/>
                  <div>
                    <div className="font-semibold text-sm">{prog.title}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* 🎧 MINIPLAYER */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[80] border-t ${
          dark ? 'bg-[#0b0b0b] text-white border-white/10' : 'bg-white text-black border-gray-200'
        }`}
        onClick={() => setOpenMobile(true)} // 📱 abre no mobile
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-[70px]">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <img src={program.image} className="w-10 h-10 rounded-full"/>
            <div>
              <div className="text-xs uppercase opacity-60">{program.title}</div>
              <div className="text-sm font-semibold">LIVE ON PRAISE FM</div>
            </div>
          </div>

          {/* CENTER */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onTogglePlayback()
            }}
            className="w-12 h-12 rounded-full bg-[#ff6600] text-white flex items-center justify-center"
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>

          {/* RIGHT */}
          <div
            className="flex items-center gap-3"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setShowSlider(true)}
            onMouseLeave={() => setShowSlider(false)}
          >
            <VolumeIcon />

            {/* 🔥 SLIDER DESLIZA */}
            <div className={`transition-all duration-300 overflow-hidden ${
              showSlider ? 'w-24 opacity-100' : 'w-0 opacity-0'
            }`}>
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

        </div>
      </div>
    </>
  )
}

export default LiveMiniPlayer
