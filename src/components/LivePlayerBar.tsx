import React, { useState } from 'react'
import { Program } from '../types'

interface Props {
  isPlaying: boolean
  onTogglePlayback: () => void
  program: Program
  queue?: Program[]
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
  queue = []
}) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* OVERLAY ESCURECIDO 🔥 */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-[90] transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* DRAWER LATERAL 🔥 */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white z-[100] transform transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <span className="font-semibold">Schedule</span>
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* 🔥 SÓ PRÓXIMOS (LIMITADO) */}
        {queue.slice(0, 5).map((prog) => (
          <div key={prog.id} className="p-4 border-b">
            <div className="font-semibold text-sm">{prog.title}</div>
            <div className="text-xs text-gray-500">
              {formatTime(prog.startTime)} - {formatTime(prog.endTime)}
            </div>
          </div>
        ))}
      </div>

      {/* MINIPLAYER 🔥 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-[80]">

        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-[70px]">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <img
              src={program.image}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <div className="text-xs text-gray-500 uppercase">
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

            {/* LIVE */}
            <div className="flex items-center gap-1 text-green-500 text-xs">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              LIVE
            </div>

            {/* HAMBURGER 🔥 */}
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
