import React, { useEffect, useState } from 'react'
import { Program } from '../types'
import { supabase } from '../lib/supabase'
import { connectListener } from '../lib/listeners'

interface LivePlayerBarProps {
  isPlaying: boolean
  onTogglePlayback: () => void
  program: Program
  queue?: Program[]
}

const TUNEIN_DEFAULT = 2
const ACTIVE_WINDOW_MS = 45000

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

// 🔥 FUNÇÃO REAL (SEM STATE BUG)
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
  const [siteListeners, setSiteListeners] = useState(0)
  const [showQueue, setShowQueue] = useState(false)

  const tuneInListeners = TUNEIN_DEFAULT
  const totalListeners = siteListeners + tuneInListeners

  useEffect(() => {
    connectListener()
  }, [])

  // 🔥 LISTENERS REAIS
  useEffect(() => {
    const fetchListeners = async () => {
      try {
        const staleIso = new Date(Date.now() - ACTIVE_WINDOW_MS).toISOString()

        await supabase
          .from('listeners_now')
          .delete()
          .lt('last_seen', staleIso)

        const { data } = await supabase
          .from('listeners_now')
          .select('last_seen')

        const active = (data || []).filter((row) => {
          const last = new Date(row.last_seen).getTime()
          return Date.now() - last <= ACTIVE_WINDOW_MS
        })

        setSiteListeners(active.length)
      } catch (err) {
        console.error('listeners error', err)
      }
    }

    fetchListeners()
    const interval = setInterval(fetchListeners, 10000)
    return () => clearInterval(interval)
  }, [])

  const isLive = isProgramLiveNow(program)

  return (
    <>
      {/* PLAYER */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-black text-white border-t border-white/10">

        <div className="h-[82px] px-4 flex items-center justify-between">

          {/* INFO */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              {program.title}
            </span>

            <div className="flex items-center gap-2 text-sm">
              {isLive ? (
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowQueue(true)}
              className="text-xs text-gray-400 hover:text-white"
            >
              Schedule
            </button>

            <button
              onClick={onTogglePlayback}
              className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center"
            >
              {isPlaying ? 'II' : '▶'}
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-4 pb-2 text-xs text-gray-400 flex items-center justify-between">

          <span>
            {formatTimeToAmPm(program.startTime)} - {formatTimeToAmPm(program.endTime)}
          </span>

          <span className="text-right">
            {siteListeners} site + {tuneInListeners} TuneIn •{' '}
            <span className="text-white font-semibold">
              {totalListeners} listening
            </span>
          </span>
        </div>
      </div>

      {/* 🔥 QUEUE LIMPO + LIVE CORRETO */}
      {showQueue && (
        <div className="fixed right-0 top-0 w-80 h-full bg-black text-white z-[100] overflow-y-auto">

          <div className="p-4 border-b border-white/10 flex justify-between">
            <span className="text-sm uppercase tracking-widest text-gray-400">
              Schedule
            </span>
            <button onClick={() => setShowQueue(false)}>✕</button>
          </div>

          {queue.map((prog) => {
            const live = isProgramLiveNow(prog)

            return (
              <div key={prog.id} className="p-4 border-b border-white/10">
                <div className="font-semibold">{prog.title}</div>

                <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  {formatTimeToAmPm(prog.startTime)} - {formatTimeToAmPm(prog.endTime)}

                  {live && (
                    <span className="text-[#ff6600] text-xs font-bold">
                      • LIVE
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default LivePlayerBar
