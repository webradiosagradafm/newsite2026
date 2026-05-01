import React, { useState, useEffect, useMemo } from 'react'
import { Play, Pause, ChevronRight, Zap, ArrowRight } from 'lucide-react'
import { SCHEDULES } from '../constants'
import { Program } from '../types'
import { useNavigate } from 'react-router-dom'

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
  const parts = time24.split(':')
  const h = parseInt(parts[0] || '0', 10)
  const m = parseInt(parts[1] || '0', 10)
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
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000)
    return () => clearInterval(interval)
  }, [])

  const chicago = useMemo(() => getChicagoInfo(), [tick])

  const { currentProgram } = useMemo(() => {
    const schedule = SCHEDULES[chicago.day] || SCHEDULES[1]

    const currentIndex = schedule.findIndex((p) => {
      const start = parseTime(p.startTime)
      const end = parseTime(p.endTime)

      const startMin = start.h * 60 + start.m
      let endMin = end.h * 60 + end.m

      if (endMin === 0 || endMin <= startMin) endMin = 1440

      return chicago.totalMinutes >= startMin && chicago.totalMinutes < endMin
    })

    return {
      currentProgram: schedule[currentIndex] || schedule[0],
    }
  }, [chicago])

  if (!currentProgram) return null

  return (
    <section className="bg-white dark:bg-black py-10">
      <div className="max-w-6xl mx-auto px-4 text-center md:text-left">

        {/* 🔥 IDENTIDADE */}
        <p className="text-sm uppercase tracking-widest text-[#ff6600] font-semibold mb-2">
          🎧 Live Gospel Radio 24/7
        </p>

        <div className="flex flex-col md:flex-row items-center gap-10">

          {/* IMAGEM */}
          <div
            className="cursor-pointer"
            role="button"
            aria-label={`Open program ${currentProgram.title}`}
            onClick={() => onNavigateToProgram(currentProgram)}
          >
            <img
              src={currentProgram.image}
              alt={currentProgram.title}
              className="w-40 h-40 rounded-full object-cover"
            />
          </div>

          {/* TEXTO */}
          <div className="flex-1">

            <p className="text-sm text-gray-500 mb-1">
              {format12h(currentProgram.startTime)} - {format12h(currentProgram.endTime)}
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {currentProgram.title}
              <span className="block text-base font-normal text-gray-500">
                with {currentProgram.host}
              </span>
            </h2>

            <p className="text-gray-500 mb-6">
              {currentProgram.description}
            </p>

            {/* 🔥 BOTÃO */}
            <button
              onClick={onListenClick}
              aria-label={isPlaying ? "Pause live radio" : "Listen live to Praise FM"}
              className="bg-[#ff6600] text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 mx-auto md:mx-0 hover:bg-[#e65c00]"
            >
              {isPlaying ? <Pause /> : <Play />}
              <span className="font-bold text-lg">
                {isPlaying ? 'Pause Live Radio' : 'Listen Live Now'}
              </span>
            </button>

            {/* 🎶 NOW PLAYING */}
            {liveMetadata && (
              <p className="mt-4 text-sm text-gray-500">
                🎶 Now Playing: <strong>{liveMetadata.artist} – {liveMetadata.title}</strong>
              </p>
            )}

            {/* 🌍 PROVA SOCIAL */}
            <p className="mt-3 text-sm text-gray-400">
              🌍 Heard worldwide • USA • Brazil • Europe
            </p>

          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero