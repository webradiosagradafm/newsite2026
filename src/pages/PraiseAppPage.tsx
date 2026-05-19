import React, { useEffect, useMemo, useState } from 'react'
import {
  Home,
  Search,
  CalendarDays,
  Music2,
  User,
  Play,
  ChevronRight,
  Radio
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { SCHEDULES } from '../constants'
import { Program } from '../types'

const DEFAULT_COVER = '/logo.png'

const getChicagoTime = () => {
  const now = new Date()

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  const parts = formatter.formatToParts(now)

  const weekday = parts.find((p) => p.type === 'weekday')?.value || 'Mon'
  const hour = Number(parts.find((p) => p.type === 'hour')?.value || 0)
  const minute = Number(parts.find((p) => p.type === 'minute')?.value || 0)

  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6
  }

  return {
    day: dayMap[weekday] ?? 1,
    total: hour * 60 + minute
  }
}

const format12h = (time?: string) => {
  if (!time) return ''

  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12

  return `${hour}:${String(m || 0).padStart(2, '0')} ${period}`
}

const getProgramProgress = (program?: Program) => {
  if (!program) return 0

  const { total } = getChicagoTime()

  const [sH, sM] = program.startTime.split(':').map(Number)
  const [eH, eM] = program.endTime.split(':').map(Number)

  const start = sH * 60 + sM
  let end = eH * 60 + eM

  if (end === 0 || end <= start) end = 24 * 60

  if (total <= start) return 0
  if (total >= end) return 100

  return Math.round(((total - start) / (end - start)) * 100)
}

export default function PraiseAppPage() {
  const navigate = useNavigate()
  const [clock, setClock] = useState(getChicagoTime())

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(getChicagoTime())
    }, 30000)

    return () => clearInterval(timer)
  }, [])

  const todaySchedule = useMemo(() => {
    return SCHEDULES[clock.day] || SCHEDULES[1]
  }, [clock.day])

  const currentProgram = useMemo(() => {
    return todaySchedule.find((program) => {
      const [sH, sM] = program.startTime.split(':').map(Number)
      const [eH, eM] = program.endTime.split(':').map(Number)

      const start = sH * 60 + sM
      let end = eH * 60 + eM

      if (end === 0 || end <= start) end = 24 * 60

      return clock.total >= start && clock.total < end
    })
  }, [todaySchedule, clock.total])

  const currentIndex = todaySchedule.findIndex(
    (program) => program.id === currentProgram?.id
  )

  const queue = useMemo(() => {
    if (currentIndex === -1) return todaySchedule.slice(0, 4)

    return Array.from({ length: 4 }, (_, index) => {
      const nextIndex = (currentIndex + index + 1) % todaySchedule.length
      return todaySchedule[nextIndex]
    })
  }, [currentIndex, todaySchedule])

  const progress = getProgramProgress(currentProgram)

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white pb-28">
      <header className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Praise FM"
            className="w-11 h-11 rounded-xl object-contain"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-orange-500 font-bold">
              Praise FM
            </p>
            <h1 className="text-xl font-black leading-none">
              United States
            </h1>
          </div>
        </div>

        <button
          onClick={() => navigate('/schedule')}
          className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center"
        >
          <Radio className="w-5 h-5" />
        </button>
      </header>

      <main>
        <section className="px-5 pt-2">
          <h2 className="text-3xl font-black tracking-tight mb-5">
            Listen Live
          </h2>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6">
            {todaySchedule.map((program) => {
              const isLive = program.id === currentProgram?.id

              return (
                <button
                  key={program.id}
                  onClick={() => navigate('/schedule')}
                  className="flex-shrink-0 w-32 text-center"
                >
                  <div
                    className={`relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 shadow-lg ${
                      isLive
                        ? 'border-orange-500'
                        : 'border-gray-200 dark:border-white/10'
                    }`}
                  >
                    <img
                      src={program.image || DEFAULT_COVER}
                      alt={program.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_COVER
                      }}
                    />

                    {isLive && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="mt-3 text-xs font-bold truncate">
                    {program.title}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {format12h(program.startTime)}
                  </p>
                </button>
              )
            })}
          </div>
        </section>

        <section className="px-5">
          <div className="rounded-[2rem] bg-gray-100 dark:bg-[#151515] p-5 shadow-sm">
            <div className="flex gap-5 items-center">
              <div className="relative w-28 h-28 rounded-3xl overflow-hidden flex-shrink-0 shadow-lg">
                <img
                  src={currentProgram?.image || DEFAULT_COVER}
                  alt={currentProgram?.title || 'Praise FM'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_COVER
                  }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-orange-500 font-black uppercase tracking-widest mb-1">
                  On Air Now
                </p>

                <h3 className="text-2xl font-black leading-tight truncate">
                  {currentProgram?.title || 'Praise FM Live'}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                  {currentProgram?.host
                    ? `with ${currentProgram.host}`
                    : 'Streaming 24/7'}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {format12h(currentProgram?.startTime)} -{' '}
                  {format12h(currentProgram?.endTime)}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <div className="h-2 bg-gray-300 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => navigate('/schedule')}
              className="mt-5 w-full bg-black text-white dark:bg-white dark:text-black rounded-2xl py-3 font-black flex items-center justify-center gap-2"
            >
              Stations & schedules
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        <section className="px-5 mt-8">
          <h2 className="text-2xl font-black mb-4">
            Coming Up
          </h2>

          <div className="space-y-3">
            {queue.map((program) => (
              <button
                key={program.id}
                onClick={() => navigate('/schedule')}
                className="w-full flex items-center gap-4 bg-gray-50 dark:bg-[#111] hover:bg-gray-100 dark:hover:bg-[#1b1b1b] rounded-2xl p-3 text-left transition"
              >
                <img
                  src={program.image || DEFAULT_COVER}
                  alt={program.title}
                  className="w-14 h-14 rounded-xl object-cover"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_COVER
                  }}
                />

                <div className="min-w-0 flex-1">
                  <p className="font-bold truncate">{program.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {program.host}
                  </p>
                </div>

                <span className="text-xs font-black text-orange-500">
                  {format12h(program.startTime)}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="px-5 mt-8">
          <h2 className="text-2xl font-black mb-4">
            Continue Listening
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {todaySchedule.slice(0, 4).map((program) => (
              <button
                key={`continue-${program.id}`}
                onClick={() => navigate('/schedule')}
                className="text-left rounded-3xl overflow-hidden bg-gray-100 dark:bg-[#151515]"
              >
                <img
                  src={program.image || DEFAULT_COVER}
                  alt={program.title}
                  className="w-full aspect-square object-cover"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_COVER
                  }}
                />

                <div className="p-3">
                  <p className="text-sm font-black truncate">
                    {program.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {program.host}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 z-50">
        <div className="grid grid-cols-5 py-2">
          <button className="flex flex-col items-center gap-1 text-orange-500">
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold">Home</span>
          </button>

          <button
            onClick={() => navigate('/music')}
            className="flex flex-col items-center gap-1 text-gray-500"
          >
            <Music2 className="w-5 h-5" />
            <span className="text-[10px] font-bold">Music</span>
          </button>

          <button
            onClick={() => navigate('/schedule')}
            className="flex flex-col items-center gap-1 text-gray-500"
          >
            <CalendarDays className="w-5 h-5" />
            <span className="text-[10px] font-bold">Schedule</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-gray-500">
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-bold">Search</span>
          </button>

          <button
            onClick={() => navigate('/presenters')}
            className="flex flex-col items-center gap-1 text-gray-500"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold">My Sounds</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
