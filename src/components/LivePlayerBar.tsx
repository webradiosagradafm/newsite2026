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

const formatTimeToAmPm = (time: string) => {
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

  // 🔥 sincroniza com schedule
  useEffect(() => {
    const update = () => setIsLiveNow(isProgramLiveNow(program))
    update()

    const interval = setInterval(update, 30000)
    return () => clearInterval(interval)
  }, [program])

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4">

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <div className="text-xs text-gray-400 uppercase">
            {program.title}
          </div>

          {/* 🔥 STATUS */}
          <div className="flex items-center gap-2 text-sm">
            {isLiveNow ? (
              <>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 font-semibold">LIVE</span>
              </>
            ) : (
              <span className="text-gray-500">Off Air</span>
            )}
          </div>
        </div>

        {/* 🔥 BOTÃO PLAY */}
        <button
          onClick={onTogglePlayback}
          className="bg-[#ff6600] px-4 py-2 rounded font-semibold"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      {/* 🔥 SCHEDULE INFO */}
      <div className="mt-3 text-xs text-gray-400 flex items-center gap-2">
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
  )
}

export default LivePlayerBar
