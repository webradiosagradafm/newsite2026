import React, { useEffect, useState } from 'react'
import { Program } from '../types'

interface LivePlayerBarProps {
  isPlaying: boolean
  onTogglePlayback: () => void
  program: Program
}

const parseTimeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

const isProgramLiveNow = (program: Program) => {
  if (!program?.startTime || !program?.endTime) return false

  const now = new Date()
  const chicago = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Chicago' })
  )

  const nowMinutes = chicago.getHours() * 60 + chicago.getMinutes()

  const start = parseTimeToMinutes(program.startTime)
  let end = parseTimeToMinutes(program.endTime)

  if (end === 0 || end <= start) end = 24 * 60

  return nowMinutes >= start && nowMinutes < end
}

const formatTimeToAmPm = (time: string): string => {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

const LivePlayerBar: React.FC<LivePlayerBarProps> = ({
  isPlaying,
  onTogglePlayback,
  program
}) => {
  const [isLiveNow, setIsLiveNow] = useState(false)

  // 🔥 sincroniza LIVE com schedule
  useEffect(() => {
    const updateLive = () => {
      setIsLiveNow(isProgramLiveNow(program))
    }

    updateLive()
    const interval = setInterval(updateLive, 30000)

    return () => clearInterval(interval)
  }, [program])

  return (
    <>
      {/* PLAYER BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-black text-white border-t border-white/10">

        {/* PROGRESS BAR (visual original mantido) */}
        <div className="h-1 bg-white/10">
          <div className="h-full bg-[#ff6600]" style={{ width: '100%' }} />
        </div>

        <div className="h-[82px] px-4 flex items-center justify-between">

          {/* INFO */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              {program.title}
            </span>

            <div className="flex items-center gap-2 text-sm">
              {isLiveNow ? (
                <>
                  <span className="w-2 h-2 bg-[#00d9c9] rounded-full animate-pulse" />
                  <span className="text-[#00d9c9] font-bold text-xs">LIVE</span>
                </>
              ) : (
                <span className="text-gray-500 text-xs">OFF AIR</span>
              )}
            </div>
          </div>

          {/* CONTROLES */}
          <button
            onClick={onTogglePlayback}
            className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center"
          >
            {isPlaying ? 'II' : '▶'}
          </button>
        </div>

        {/* HORÁRIO + LIVE CONTROLADO */}
        <div className="px-4 pb-2 text-xs text-gray-400 flex items-center gap-2">
          <span>
            {formatTimeToAmPm(program.startTime)} - {formatTimeToAmPm(program.endTime)}
          </span>

          {isLiveNow && (
            <span className="flex items-center gap-1 text-[#ff6600]">
              <span className="w-2 h-2 bg-[#ff6600] rounded-full animate-pulse" />
              LIVE
            </span>
          )}
        </div>
      </div>
    </>
  )
}

export default LivePlayerBar
