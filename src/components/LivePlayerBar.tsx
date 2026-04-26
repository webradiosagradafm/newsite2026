import React, { useEffect, useState } from 'react'
import { Program } from '../types'
import { connectListener } from '../lib/listeners'

interface LivePlayerBarProps {
  isPlaying: boolean
  onTogglePlayback: () => void
  program: Program
  queue?: Program[]
}

// utils
const parseTimeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

const getChicagoMinutesNow = () => {
  const now = new Date()
  const chicago = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Chicago' })
  )
  return chicago.getHours() * 60 + chicago.getMinutes()
}

const isProgramLiveNow = (program: Program) => {
  if (!program?.startTime || !program?.endTime) return false

  const now = getChicagoMinutesNow()
  const start = parseTimeToMinutes(program.startTime)
  let end = parseTimeToMinutes(program.endTime)

  if (end <= start) end = 1440

  return now >= start && now < end
}

const formatTime = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

const LivePlayerBar: React.FC<LivePlayerBarProps> = ({
  isPlaying,
  onTogglePlayback,
  program,
  queue = []
}) => {
  const [isLive, setIsLive] = useState(false)
  const [showQueue, setShowQueue] = useState(false)

  useEffect(() => {
    connectListener()
  }, [])

  useEffect(() => {
    const update = () => setIsLive(isProgramLiveNow(program))
    update()
    const i = setInterval(update, 30000)
    return () => clearInterval(i)
  }, [program])

  return (
    <>
      {/* PLAYER BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-black text-white border-t border-white/10">

        <div className="h-[82px] px-4 flex items-center justify-between">

          {/* INFO */}
          <div className="flex items-center gap-3">

            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-400">
                {program.title}
              </div>

              <div className="flex items-center gap-2 text-xs">
                {isLive ? (
                  <>
                    <span className="w-2 h-2 bg-[#00d9c9] rounded-full animate-pulse" />
                    <span className="text-[#00d9c9] font-bold">LIVE</span>
                  </>
                ) : (
                  <span className="text-gray-500">OFF AIR</span>
                )}
              </div>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex items-center gap-4">

            <button
              onClick={() => setShowQueue(true)}
              className="text-sm text-gray-400 hover:text-white"
            >
              Schedule
            </button>

            <button
              onClick={onTogglePlayback}
              className="w-12 h-12 rounded-full bg-[#ff6600] flex items-center justify-center"
            >
              {isPlaying ? 'II' : '▶'}
            </button>
          </div>
        </div>

        {/* TIME */}
        <div className="px-4 pb-2 text-xs text-gray-400">
          {formatTime(program.startTime)} - {formatTime(program.endTime)}
          {isLive && (
            <span className="ml-2 text-[#ff6600] font-semibold">• LIVE</span>
          )}
        </div>
      </div>

      {/* QUEUE (SEM LISTENERS 🔥) */}
      {showQueue && (
        <div className="fixed right-0 top-0 w-80 h-full bg-black text-white z-[100] overflow-y-auto">

          <div className="p-4 border-b border-white/10 flex justify-between">
            <span className="text-sm uppercase tracking-widest text-gray-400">
              Schedule
            </span>

            <button onClick={() => setShowQueue(false)}>✕</button>
          </div>

          {queue.map((prog) => (
            <div key={prog.id} className="p-4 border-b border-white/10">

              <div className="font-semibold">{prog.title}</div>

              <div className="text-sm text-gray-500 mt-1">
                {formatTime(prog.startTime)} - {formatTime(prog.endTime)}
                {isProgramLiveNow(prog) && ' • LIVE'}
              </div>

            </div>
          ))}

        </div>
      )}
    </>
  )
}

export default LivePlayerBar
