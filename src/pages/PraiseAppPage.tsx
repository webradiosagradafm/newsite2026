import React, { useEffect, useMemo, useState } from 'react'
import {
  Calendar,
  Heart,
  Home,
  Music,
  Pause,
  Play,
  Search,
  User
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SCHEDULES } from '../constants'
import { Program } from '../types'

const DEFAULT_COVER = '/logo.png'

const getChicagoTime = () => {
  const now = new Date()

  const chicagoDate = new Date(
    now.toLocaleString('en-US', {
      timeZone: 'America/Chicago'
    })
  )

  return {
    day: chicagoDate.getDay(),
    totalMinutes:
      chicagoDate.getHours() * 60 +
      chicagoDate.getMinutes()
  }
}

const format12h = (time24: string) => {
  const [h, m] = time24.split(':').map(Number)

  const period = h >= 12 ? 'PM' : 'AM'
  const displayH = h % 12 || 12

  return `${displayH}:${String(m).padStart(2, '0')} ${period}`
}

const isProgramLive = (
  program: Program,
  totalMinutes: number
) => {
  const [sH, sM] = program.startTime
    .split(':')
    .map(Number)

  const [eH, eM] = program.endTime
    .split(':')
    .map(Number)

  const start = sH * 60 + sM

  let end = eH * 60 + eM

  if (end === 0 || end <= start)
    end = 24 * 60

  return (
    totalMinutes >= start &&
    totalMinutes < end
  )
}

export default function PraiseAppPage() {
  const navigate = useNavigate()

  const [time, setTime] = useState(
    getChicagoTime()
  )

  const [isPlaying, setIsPlaying] =
    useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getChicagoTime())
    }, 30000)

    return () => clearInterval(timer)
  }, [])

  const schedule = useMemo(() => {
    return (
      SCHEDULES[time.day] ||
      SCHEDULES[1]
    )
  }, [time.day])

  const currentProgram = useMemo(() => {
    return schedule.find((program) =>
      isProgramLive(
        program,
        time.totalMinutes
      )
    )
  }, [schedule, time.totalMinutes])

  const continueListening =
    schedule.slice(0, 4)

  const positions = [
    { x: 25, y: 115, scale: 0.72 },
    { x: 110, y: 55, scale: 0.85 },
    { x: 220, y: 12, scale: 1 },
    { x: 350, y: 12, scale: 1 },
    { x: 470, y: 55, scale: 0.85 },
    { x: 555, y: 115, scale: 0.72 }
  ]

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden pb-36">
      {/* HEADER */}

      <header className="px-5 pt-8 pb-3">
        <div className="flex items-center justify-between">
          <div className="text-[34px] font-black tracking-tight">
            <span className="bg-orange-500 text-white px-2 mr-1">
              P
            </span>

            <span className="bg-orange-500 text-white px-2 mr-1">
              F
            </span>

            <span className="bg-orange-500 text-white px-2">
              M
            </span>
          </div>

          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            R
          </div>
        </div>
      </header>

      {/* ARCO BBC */}

      <section className="relative h-[320px] overflow-hidden">
        {/* arco */}

        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[760px] h-[380px] rounded-b-full border-b-[2px] border-gray-200" />

        {/* itens */}

        <div className="relative w-full h-full">
          {schedule
            .slice(0, 6)
            .map((program, index) => {
              const live =
                currentProgram?.id ===
                program.id

              const pos =
                positions[index]

              return (
                <button
                  key={program.id}
                  className="absolute transition-all duration-500"
                  style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    transform: `scale(${pos.scale})`
                  }}
                >
                  <div
                    className={`relative w-32 h-32 rounded-full overflow-hidden border-[5px] shadow-xl ${
                      live
                        ? 'border-orange-500'
                        : 'border-white'
                    }`}
                  >
                    <img
                      src={
                        program.image ||
                        DEFAULT_COVER
                      }
                      alt={program.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          DEFAULT_COVER
                      }}
                    />

                    {live && (
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-3xl font-black">
                          1
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-center">
                    <p className="text-xs font-black truncate w-32">
                      {program.title}
                    </p>

                    <p className="text-[10px] text-gray-500">
                      {format12h(
                        program.startTime
                      )}
                    </p>
                  </div>
                </button>
              )
            })}
        </div>
      </section>

      {/* TITULO */}

      <section className="px-6 text-center -mt-5">
        <div className="inline-block bg-black text-white text-xs font-black px-4 py-1 mb-3">
          LIVE
        </div>

        <h1 className="text-[34px] font-black tracking-tight leading-none">
          Praise FM
          <br />
          United States
        </h1>

        {currentProgram && (
          <p className="text-gray-600 mt-4 text-lg">
            {currentProgram.title}

            {currentProgram.host !==
              'Praise FM' &&
              ` with ${currentProgram.host}`}
          </p>
        )}
      </section>

      {/* CONTINUE LISTENING */}

      <section className="px-5 mt-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-3xl font-black">
            Continue Listening
          </h2>

          <button className="text-sm font-bold">
            Edit
          </button>
        </div>

        <div className="space-y-5">
          {continueListening.map(
            (program) => (
              <button
                key={program.id}
                className="flex items-center gap-4 w-full text-left"
              >
                <div className="w-24 h-24 overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={
                      program.image ||
                      DEFAULT_COVER
                    }
                    alt={program.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        DEFAULT_COVER
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-black truncate">
                    {program.title}
                  </h3>

                  <p className="text-gray-500 truncate">
                    {program.host}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-1 bg-gray-200">
                      <div className="w-1/2 h-full bg-orange-500" />
                    </div>

                    <span className="text-xs text-gray-500">
                      {format12h(
                        program.startTime
                      )}
                    </span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </button>
            )
          )}
        </div>
      </section>

      {/* PLAYER */}

      <div className="fixed bottom-16 left-0 right-0 bg-black text-white px-5 py-3 flex items-center justify-between z-50">
        <div className="min-w-0">
          <p className="text-sm font-bold truncate">
            {currentProgram?.title ||
              'Praise FM'}
          </p>

          <p className="text-xs text-white/60 truncate">
            {currentProgram?.host}
          </p>
        </div>

        <button
          onClick={() =>
            setIsPlaying((v) => !v)
          }
          className="w-12 h-12 rounded-full border-4 border-orange-500 flex items-center justify-center"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-white" />
          ) : (
            <Play className="w-5 h-5 fill-white ml-0.5" />
          )}
        </button>
      </div>

      {/* MENU */}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex items-center justify-around">
          <button
            onClick={() =>
              navigate('/app')
            }
            className="flex flex-col items-center text-orange-500"
          >
            <Home className="w-6 h-6" />

            <span className="text-xs font-bold">
              Home
            </span>
          </button>

          <button
            onClick={() =>
              navigate('/music')
            }
            className="flex flex-col items-center text-gray-500"
          >
            <Music className="w-6 h-6" />

            <span className="text-xs font-bold">
              Music
            </span>
          </button>

          <button
            onClick={() =>
              navigate('/schedule')
            }
            className="flex flex-col items-center text-gray-500"
          >
            <Calendar className="w-6 h-6" />

            <span className="text-xs font-bold">
              Schedule
            </span>
          </button>

          <button className="flex flex-col items-center text-gray-500">
            <Heart className="w-6 h-6" />

            <span className="text-xs font-bold">
              My Sounds
            </span>
          </button>

          <button className="flex flex-col items-center text-gray-500">
            <Search className="w-6 h-6" />

            <span className="text-xs font-bold">
              Search
            </span>
          </button>
        </div>
      </nav>
    </div>
  )
}