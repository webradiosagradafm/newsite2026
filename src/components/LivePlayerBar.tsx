import React, { useEffect, useState } from 'react'
import { Program } from '../types'
import { connectListener } from '../lib/listeners'

interface Props {
  isPlaying: boolean
  onTogglePlayback: () => void
  program: Program
}

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

const isLiveNow = (program: Program) => {
  if (!program?.startTime || !program?.endTime) return false

  const now = getChicagoMinutesNow()
  const start = parseTimeToMinutes(program.startTime)
  let end = parseTimeToMinutes(program.endTime)

  if (end <= start) end = 1440

  return now >= start && now < end
}

const LivePlayerBar: React.FC<Props> = ({
  isPlaying,
  onTogglePlayback,
  program
}) => {
  const [live, setLive] = useState(false)

  useEffect(() => {
    connectListener()
  }, [])

  useEffect(() => {
    const update = () => setLive(isLiveNow(program))
    update()
    const i = setInterval(update, 30000)
    return () => clearInterval(i)
  }, [program])

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-[72px]">

        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-0">

          <img
            src={program.image}
            alt={program.title}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="min-w-0">
            <div className="text-xs text-gray-500 uppercase truncate">
              {program.title}
            </div>

            <div className="text-sm font-semibold text-black truncate">
              LIVE ON PRAISE FM USA
            </div>
          </div>
        </div>

        {/* CENTER */}
        <button
          onClick={onTogglePlayback}
          className="w-12 h-12 rounded-full bg-[#ff6600] flex items-center justify-center text-white text-lg"
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          <button className="text-sm text-gray-500 hover:text-black">
            Schedule
          </button>

          {live && (
            <div className="flex items-center gap-1 text-green-500 text-xs font-semibold">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              LIVE
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default LivePlayerBar
