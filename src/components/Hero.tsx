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

    const current = schedule[index] || schedule[0]

    const next = [
      schedule[index + 1],
      schedule[index + 2],
    ].filter(Boolean)

    return {
      currentProgram: current,
      nextPrograms: next,
    }
  }, [chicago])

  const size = 240
  const stroke = 6
  const radius = (size - stroke) / 2

  if (!currentProgram) return null

  return (
    <section className="bg-white dark:bg-black py-14">
      <div className="max-w-6xl mx-auto px-4">

        <p className="text-sm uppercase tracking-widest text-[#ff6600] font-semibold mb-6 text-center md:text-left">
          Live Gospel Radio 24/7
        </p>

        <div className="flex flex-col md:flex-row items-center gap-12">

          {/* CÍRCULO */}
          <div
            className="relative cursor-pointer"
            onClick={() => onNavigateToProgram(currentProgram)}
          >
            <img
              src={currentProgram.image || "/default.jpg"}
              alt={currentProgram.host}
              className="w-[240px] h-[240px] rounded-full object-cover"
            />
          </div>

          {/* TEXTO */}
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

            {/* BOTÃO */}
            <button
              onClick={onListenClick}
              className="bg-[#ff6600] text-white px-8 py-4 rounded-xl flex items-center gap-3 mx-auto md:mx-0"
            >
              {isPlaying ? 'Pause Live Radio' : 'Listen Live Now'}
            </button>

            {/* NOW PLAYING */}
            {liveMetadata && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Now Playing: <strong>{liveMetadata.artist} – {liveMetadata.title}</strong>
              </p>
            )}

          </div>
        </div>

        {/* 🔥 UP NEXT (VOLTOU) */}
        {nextPrograms.length > 0 && (
          <div className="mt-12 border-t border-gray-200 dark:border-white/10 pt-8">
            <h3 className="text-xl font-bold mb-6">Up Next</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {nextPrograms.map((prog) => (
                <div
                  key={prog.id}
                  onClick={() => onNavigateToProgram(prog)}
                  className="flex items-center gap-4 cursor-pointer group"
                >
                  <img
                    src={prog.image}
                    alt={prog.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div>
                    <p className="text-sm text-gray-500">
                      {format12h(prog.startTime)}
                    </p>

                    <h4 className="font-semibold group-hover:text-[#ff6600]">
                      {prog.title}
                    </h4>

                    <p className="text-sm text-gray-500">
                      {prog.host}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}

export default Hero