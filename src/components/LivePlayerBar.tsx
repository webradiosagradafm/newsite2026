import React, { useEffect, useState, useRef } from 'react'
import { Program } from '../types'
import { supabase } from '../lib/supabase'
import { connectListener } from '../lib/listeners'

interface LivePlayerBarProps {
  isPlaying: boolean
  onTogglePlayback: () => void
  program: Program
  queue?: Program[]
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

// 🔥 NOVO: controle de LIVE real
const isProgramLiveNow = (program: Program) => {
  if (!program?.startTime || !program?.endTime) return false

  const nowMinutes = getChicagoMinutesNow()
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
  program,
  queue = []
}) => {
  const [isLiveNow, setIsLiveNow] = useState(false)

  // 🔥 sincroniza LIVE com schedule
  useEffect(() => {
    const update = () => setIsLiveNow(isProgramLiveNow(program))
    update()
    const interval = setInterval(update, 30000)
    return () => clearInterval(interval)
  }, [program])

  useEffect(() => {
    connectListener()
  }, [])

  return (
    <>
      {/* PLAYER BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-black text-white border-t border-white/10">

        <div className="h-[82px] px-4 flex items-center justify-between">

          {/* INFO */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              {program.title}
            </span>

            {/* 🔥 LIVE CONTROLADO */}
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

          {/* PLAY BUTTON */}
          <button
            onClick={onTogglePlayback}
            className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center"
          >
            {isPlaying ? 'II' : '▶'}
          </button>
        </div>

        {/* HORÁRIO */}
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

      {/* 🔥 QUEUE (SEM CONTADORES) */}
      {queue.length > 0 && (
        <div className="fixed right-0 top-0 w-80 h-full bg-black text-white z-[100] overflow-y-auto">

          <div className="p-4 border-b border-white/10">
            <h3 className="text-sm uppercase tracking-widest text-gray-400">
              Schedule
            </h3>
          </div>

          {queue.map((prog) => (
            <div key={prog.id} className="p-4 border-b border-white/10">

              <div className="font-semibold">{prog.title}</div>

              {/* 🔥 LIVE CORRIGIDO */}
              <div className="text-sm text-gray-500 mt-1">
                {formatTimeToAmPm(prog.startTime)} - {formatTimeToAmPm(prog.endTime)}
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
