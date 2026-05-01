import React, { useState, useEffect, useMemo } from 'react'
import { SCHEDULES } from '../constants'
import { Program } from '../types'

const getChicagoInfo = () => {
  const now = new Date()
  const chicagoString = now.toLocaleString('en-US', {
    timeZone: 'America/Chicago',
  })
  const chicagoDate = new Date(chicagoString)
  const h = chicagoDate.getHours()
  const m = chicagoDate.getMinutes()
  const day = chicagoDate.getDay()
  return { day, totalMinutes: h * 60 + m }
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

  const currentProgram = useMemo(() => {
    const schedule = SCHEDULES[chicago.day] || SCHEDULES[1]

    return (
      schedule.find((p) => {
        const start = parseTime(p.startTime)
        const end = parseTime(p.endTime)

        const startMin = start.h * 60 + start.m
        let endMin = end.h * 60 + end.m

        if (endMin === 0 || endMin <= startMin) endMin = 1440

        return chicago.totalMinutes >= startMin && chicago.totalMinutes < endMin
      }) || schedule[0]
    )
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
    <section className="bg-white dark:bg-black py-14">
      <div className="max-w-6xl mx-auto px-4">

        {/* HEADER */}
        <p className="text-sm uppercase tracking-widest text-[#ff6600] font-semibold mb-6 text-center md:text-left">
          Live Gospel Radio 24/7
        </p>

        <div className="flex flex-col md:flex-row items-center gap-12">

          {/* CIRCLE */}
          <div
            className="relative cursor-pointer"
            onClick={() => onNavigateToProgram(currentProgram)}
            role="button"
            aria-label={`Open program ${currentProgram.title}`}
          >
            <svg width={size} height={size} className="-rotate-90 absolute">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#e5e5e5"
                strokeWidth={stroke}
                fill="none"
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
              src={currentProgram.image || "/default.jpg"}
              alt={currentProgram.host || "Radio Host"}
              className="w-[240px] h-[240px] rounded-full object-cover"
            />
          </div>

          {/* TEXT */}
          <div className="flex-1 text-center md:text-left">

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {format12h(currentProgram.startTime)} - {format12h(currentProgram.endTime)}
            </p>

            <h2 className="text-4xl font-bold mb-2">
              {currentProgram.title}
              <span className="block text-lg font-normal text-gray-600 dark:text-gray-400">
                with {currentProgram.host}
              </span>
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {currentProgram.description}
            </p>

            {/* BUTTON */}
            <button
              onClick={onListenClick}
              aria-label={isPlaying ? "Pause live radio" : "Listen live to Praise FM"}
              className="bg-[#ff6600] text-white px-8 py-4 rounded-xl flex items-center gap-3 mx-auto md:mx-0 hover:bg-[#e65c00]"
            >
              {isPlaying ? (
                <svg width="20" height="20" fill="currentColor">
                  <rect x="3" y="2" width="5" height="16" />
                  <rect x="12" y="2" width="5" height="16" />
                </svg>
              ) : (
                <svg width="20" height="20" fill="currentColor">
                  <polygon points="3,2 18,10 3,18" />
                </svg>
              )}

              <span className="font-bold text-lg">
                {isPlaying ? 'Pause Live Radio' : 'Listen Live Now'}
              </span>
            </button>

            {/* NOW PLAYING */}
            {liveMetadata && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 justify-center md:justify-start">
                <svg width="16" height="16" fill="currentColor" className="text-purple-500">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>

                <span>
                  Now Playing: <strong>{liveMetadata.artist} – {liveMetadata.title}</strong>
                </span>
              </p>
            )}

            {/* GLOBAL */}
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 justify-center md:justify-start">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15 15 0 0 1 0 20" />
                <path d="M12 2a15 15 0 0 0 0 20" />
              </svg>

              Heard worldwide • USA • Brazil • Europe
            </p>

          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero