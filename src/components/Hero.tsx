import React, { useState, useEffect, useMemo } from 'react'
import { SCHEDULES } from '../constants'
import { Program } from '../types'

const getChicagoInfo = () => {
  const now = new Date()
  const chicagoString = now.toLocaleString('en-US', {
    timeZone: 'America/Chicago',
  })
  const chicagoDate = new Date(chicagoString)

  return {
    day: chicagoDate.getDay(),
    totalMinutes: chicagoDate.getHours() * 60 + chicagoDate.getMinutes(),
  }
}

const parseTime = (time24: string) => {
  const [h, m] = time24.split(':').map(Number)
  return { h, m }
}

const format12h = (time24: string) => {
  const { h, m } = parseTime(time24)
  const period = h >= 12 ? 'PM' : 'AM'
  const displayH = h % 12 || 12
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`
}

interface HeroProps {
  onListenClick: () => void
  isPlaying: boolean
  liveMetadata?: { artist: string; title: string } | null
  onNavigateToProgram: (program: Program) => void
}

const Hero: React.FC<HeroProps> = ({
  onListenClick,
  isPlaying,
  liveMetadata,
  onNavigateToProgram,
}) => {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000)
    return () => clearInterval(interval)
  }, [])

  const chicago = useMemo(() => getChicagoInfo(), [tick])

  const { currentProgram, nextPrograms } = useMemo(() => {
    const schedule = SCHEDULES[chicago.day] || SCHEDULES[1]

    const index = schedule.findIndex((p) => {
      const start = parseTime(p.startTime)
      const end = parseTime(p.endTime)

      const startMin = start.h * 60 + start.m
      let endMin = end.h * 60 + end.m

      if (endMin === 0 || endMin <= startMin) endMin = 1440

      return chicago.totalMinutes >= startMin && chicago.totalMinutes < endMin
    })

    const currentIndex = index !== -1 ? index : 0
    const current = schedule[currentIndex] || schedule[0]

    const next = [
      ...schedule.slice(currentIndex + 1),
      ...schedule.slice(0, currentIndex),
    ].slice(0, 2)

    return {
      currentProgram: current,
      nextPrograms: next,
    }
  }, [chicago])

  const progress = useMemo(() => {
    if (!currentProgram) return 0

    const start = parseTime(currentProgram.startTime)
    const end = parseTime(currentProgram.endTime)

    const startMin = start.h * 60 + start.m
    let endMin = end.h * 60 + end.m

    if (endMin === 0 || endMin <= startMin) endMin = 1440

    const elapsed = chicago.totalMinutes - startMin
    const duration = endMin - startMin

    return Math.min(Math.max(elapsed / duration, 0), 1)
  }, [currentProgram, chicago.totalMinutes])

  const size = 240
  const stroke = 6
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - progress * circumference

  if (!currentProgram) return null

  return (
    <section className="bg-white dark:bg-black text-black dark:text-white py-14">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-sm uppercase tracking-widest text-[#ff6600] font-semibold mb-6 text-center md:text-left">
          Live Gospel Radio 24/7
        </p>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <button
            type="button"
            onClick={() => onNavigateToProgram(currentProgram)}
            aria-label={`Open program ${currentProgram.title}`}
            className="relative w-[240px] h-[240px] shrink-0 rounded-full focus:outline-none focus:ring-4 focus:ring-[#ff6600]/30"
          >
            <svg
              width={size}
              height={size}
              className="absolute inset-0 -rotate-90"
              aria-hidden="true"
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={stroke}
                fill="none"
                className="text-gray-200 dark:text-white/10"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#ff6600"
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>

            <img
              src={currentProgram.image || '/default.jpg'}
              alt={currentProgram.host || currentProgram.title}
              className="w-[240px] h-[240px] rounded-full object-cover p-[10px]"
            />

            {isPlaying && (
              <span className="absolute bottom-3 right-3 w-12 h-12 bg-[#ff6600] rounded-full flex items-center justify-center shadow-lg">
                <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </span>
            )}
          </button>

          <div className="flex-1 text-center md:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {format12h(currentProgram.startTime)} - {format12h(currentProgram.endTime)}
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mb-2 leading-tight">
              {currentProgram.title}
              <span className="block text-lg font-normal text-gray-600 dark:text-gray-400 mt-1">
                with {currentProgram.host}
              </span>
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto md:mx-0">
              {currentProgram.description}
            </p>

            <button
              type="button"
              onClick={onListenClick}
              aria-label={isPlaying ? 'Pause live radio' : 'Listen live to Praise FM'}
              className="bg-[#ff6600] text-white px-8 py-4 rounded-xl flex items-center gap-3 mx-auto md:mx-0 hover:bg-[#e65c00] active:scale-95 transition-all shadow-lg"
            >
              {isPlaying ? (
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}

              <span className="font-bold text-lg">
                {isPlaying ? 'Pause Live Radio' : 'Listen Live Now'}
              </span>
            </button>

            {liveMetadata && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 justify-center md:justify-start">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="text-[#ff6600]" aria-hidden="true">
                  <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
                </svg>

                <span>
                  Now Playing:{' '}
                  <strong className="text-black dark:text-white">
                    {liveMetadata.artist} – {liveMetadata.title}
                  </strong>
                </span>
              </p>
            )}

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 justify-center md:justify-start">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15 15 0 0 1 0 20" />
                <path d="M12 2a15 15 0 0 0 0 20" />
              </svg>

              Heard worldwide • USA • Brazil • Europe
            </p>
          </div>
        </div>

        {nextPrograms.length > 0 && (
          <div className="mt-14 border-t border-gray-200 dark:border-white/10 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl font-bold">Up Next</h3>
              <span className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Coming soon
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {nextPrograms.map((prog) => (
                <button
                  key={`${prog.id}-${prog.startTime}`}
                  type="button"
                  onClick={() => onNavigateToProgram(prog)}
                  aria-label={`Open program ${prog.title}`}
                  className="group flex items-center gap-4 text-left bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 hover:border-[#ff6600]/60 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
                >
                  <img
                    src={prog.image || '/default.jpg'}
                    alt={prog.host || prog.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-widest text-[#ff6600] font-semibold mb-1">
                      Up Next
                    </p>

                    <h4 className="font-bold text-lg truncate group-hover:text-[#ff6600] transition-colors">
                      {prog.title}
                    </h4>

                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      with {prog.host}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {format12h(prog.startTime)} - {format12h(prog.endTime)}
                    </p>
                  </div>

                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-gray-400 group-hover:text-[#ff6600] group-hover:translate-x-1 transition-all"
                    aria-hidden="true"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Hero