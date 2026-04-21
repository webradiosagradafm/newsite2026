import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { connectListener } from '../lib/listeners'

interface Props {
  isPlaying: boolean
  onTogglePlayback: () => void
  program: any
  liveMetadata?: any
  audioRef: React.RefObject<HTMLAudioElement | null>
}

const TUNEIN_DEFAULT = 2

// 🔥 TIME HELPERS (CHICAGO)
const getChicagoMinutesNow = () => {
  const now = new Date()
  const chicago = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Chicago' })
  )
  return chicago.getHours() * 60 + chicago.getMinutes()
}

const parseTimeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

const LivePlayerBar: React.FC<Props> = ({
  isPlaying,
  onTogglePlayback,
  program,
  liveMetadata,
}) => {
  const [siteListeners, setSiteListeners] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showSchedule, setShowSchedule] = useState(false)

  const total = siteListeners + TUNEIN_DEFAULT

  // 🔥 listeners
  useEffect(() => {
    connectListener()

    const fetch = async () => {
      const { data } = await supabase.from('listeners_now').select('id')
      setSiteListeners(data?.length || 0)
    }

    fetch()
    const i = setInterval(fetch, 10000)
    return () => clearInterval(i)
  }, [])

  // 🔥 progress
  useEffect(() => {
    const update = () => {
      if (!program?.startTime || !program?.endTime) {
        setProgress(0)
        return
      }

      const now = getChicagoMinutesNow()
      const start = parseTimeToMinutes(program.startTime)
      let end = parseTimeToMinutes(program.endTime)

      if (end <= start) end = 24 * 60

      const percent = ((now - start) / (end - start)) * 100
      setProgress(Math.max(0, Math.min(percent, 100)))
    }

    update()
    const i = setInterval(update, 30000)
    return () => clearInterval(i)
  }, [program])

  const topLine =
    liveMetadata?.artist && liveMetadata?.title
      ? `${liveMetadata.artist} — ${liveMetadata.title}`
      : 'PRAISE FM — LIVE'

  return (
    <>
      {/* OVERLAY */}
      {showSchedule && (
        <div
          className="fixed inset-0 bg-black/90 z-[90]"
          onClick={() => setShowSchedule(false)}
        />
      )}

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full md:w-96 z-[100] bg-black text-white transition-transform duration-300 ${
          showSchedule ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="font-semibold">Schedule</span>

          {/* ❗ X BRANCO FIXO */}
          <button
            onClick={() => setShowSchedule(false)}
            className="text-white hover:opacity-70"
          >
            <svg width="22" height="22" stroke="white" strokeWidth="2">
              <line x1="5" y1="5" x2="17" y2="17" />
              <line x1="17" y1="5" x2="5" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      {/* PLAYER */}
      {isPlaying && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-[#121212] border-t border-white/10">

          {/* 🔥 PROGRESS BAR */}
          <div className="w-full h-1 bg-white/10">
            <div
              className="h-full bg-[#ff6600] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between px-6 py-4">

            {/* LEFT */}
            <div className="flex items-center gap-3 w-[35%] min-w-0">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#ff6600]">
                <img src={program.image} className="w-full h-full object-cover" />
              </div>

              <div className="truncate">
                <div className="text-[10px] uppercase text-gray-400 truncate">
                  {topLine}
                </div>
                <div className="text-white font-semibold truncate">
                  {program.title}
                </div>
                <div className="text-gray-400 text-xs truncate">
                  with {program.host}
                </div>
              </div>
            </div>

            {/* CENTER */}
            <div className="flex items-center gap-6 justify-center w-[30%]">

              <button className="text-gray-400">
                <svg width="28" height="28" stroke="currentColor" strokeWidth="2">
                  <text x="12" y="18" fontSize="10" fill="currentColor">30</text>
                </svg>
              </button>

              <button
                onClick={onTogglePlayback}
                className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center text-white"
              >
                {isPlaying ? (
                  <svg width="18" height="18" fill="white">
                    <rect x="3" y="3" width="4" height="12" />
                    <rect x="11" y="3" width="4" height="12" />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="white">
                    <polygon points="3,2 16,9 3,16" />
                  </svg>
                )}
              </button>

              <button className="text-gray-400">
                <svg width="28" height="28" stroke="currentColor" strokeWidth="2">
                  <text x="12" y="18" fontSize="10" fill="currentColor">30</text>
                </svg>
              </button>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4 justify-end w-[35%]">

              <div className="text-right hidden md:block">
                <div className="text-[10px] text-gray-400 uppercase">
                  {siteListeners} site + {TUNEIN_DEFAULT} tunein
                </div>
                <div className="text-white text-sm font-semibold">
                  {total} listening
                </div>
              </div>

              <button
                onClick={() => setShowSchedule(true)}
                className="text-gray-300"
              >
                <svg width="22" height="22" fill="currentColor">
                  <rect x="4" y="5" width="14" height="2" />
                  <rect x="4" y="10" width="14" height="2" />
                  <rect x="4" y="15" width="14" height="2" />
                </svg>
              </button>

              <div className="flex items-center gap-1 text-[#00d9c9]">
                <div className="w-2 h-2 bg-[#00d9c9] rounded-full animate-pulse" />
                <span className="text-xs font-bold">LIVE</span>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LivePlayerBar
