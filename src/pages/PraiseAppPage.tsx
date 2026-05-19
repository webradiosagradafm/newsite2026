import React, { useEffect, useMemo, useState } from 'react'
import {
  Calendar,
  ChevronRight,
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
    now.toLocaleString('en-US', { timeZone: 'America/Chicago' })
  )

  return {
    day: chicagoDate.getDay(),
    totalMinutes: chicagoDate.getHours() * 60 + chicagoDate.getMinutes()
  }
}

const format12h = (time24: string) => {
  const [h, m] = time24.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const displayH = h % 12 || 12
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`
}

const isProgramLive = (program: Program, totalMinutes: number) => {
  const [sH, sM] = program.startTime.split(':').map(Number)
  const [eH, eM] = program.endTime.split(':').map(Number)

  const start = sH * 60 + sM
  let end = eH * 60 + eM

  if (end === 0 || end <= start) end = 24 * 60

  return totalMinutes >= start && totalMinutes < end
}

export default function PraiseAppPage() {
  const navigate = useNavigate()
  const [time, setTime] = useState(getChicagoTime())
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setTime(getChicagoTime()), 30000)
    return () => clearInterval(timer)
  }, [])

  const schedule = useMemo(() => {
    return SCHEDULES[time.day] || SCHEDULES[1]
  }, [time.day])

  const currentProgram = useMemo(() => {
    return schedule.find((program) =>
      isProgramLive(program, time.totalMinutes)
    )
  }, [schedule, time.totalMinutes])

  const liveProgram = currentProgram || schedule[0]

  const continueListening = schedule.slice(0, 4)

  return (
    <div className="min-h-screen bg-white text-black pb-32 overflow-x-hidden">
      <header className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-black tracking-tight">
            <span className="bg-orange-500 text-white px-2 py-1 mr-1">P</span>
            <span className="bg-orange-500 text-white px-2 py-1 mr-1">F</span>
            <span className="bg-orange-500 text-white px-2 py-1">M</span>
          </div>

          <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            R
          </button>
        </div>
      </header>

      <section className="pt-4">
        <div className="flex gap-5 overflow-x-auto px-6 pb-6 no-scrollbar">
          {schedule.map((program) => {
            const live = currentProgram?.id === program.id

            return (
              <button
                key={program.id}
                onClick={() => setSelectedProgram(program)}
                className="shrink-0 w-32 text-center"
              >
                <div
                  className={`relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 shadow-lg ${
                    live ? 'border-orange-500' : 'border-gray-100'
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

                  {live && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-3xl font-black">
                        1
                      </div>
                    </div>
                  )}
                </div>

                <p className="mt-3 text-xs font-bold truncate">
                  {program.title}
                </p>

                <p className="text-[10px] text-gray-500">
                  {format12h(program.startTime)}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      <section className="px-6 text-center mt-2">
        <div className="inline-block bg-black text-white text-xs font-black px-4 py-1 mb-3">
          LIVE
        </div>

        <h1 className="text-3xl font-black tracking-tight">
          Praise FM United States
        </h1>

        <p className="text-lg text-gray-600 mt-2">
          {liveProgram.title}
          {liveProgram.host !== 'Praise FM'
            ? ` with ${liveProgram.host}`
            : ''}
        </p>

        <button
          onClick={() => navigate('/schedule')}
          className="mt-7 border-2 border-black px-8 py-4 text-lg font-bold inline-flex items-center gap-2 hover:bg-black hover:text-white transition"
        >
          Stations & schedules
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      <section className="px-6 mt-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-3xl font-black">Continue Listening</h2>
          <button className="text-sm font-bold">Manage list</button>
        </div>

        <div className="space-y-5">
          {continueListening.map((program) => (
            <button
              key={`continue-${program.id}`}
              onClick={() => setSelectedProgram(program)}
              className="w-full flex items-center gap-4 text-left"
            >
              <div className="w-24 h-24 shrink-0 overflow-hidden bg-gray-100">
                <img
                  src={program.image || DEFAULT_COVER}
                  alt={program.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_COVER
                  }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-black text-xl leading-tight truncate">
                  {program.title}
                </h3>

                <p className="text-gray-600 truncate">
                  {program.host}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1 bg-gray-300 flex-1">
                    <div className="h-full bg-orange-500 w-1/2" />
                  </div>
                  <span className="text-xs text-gray-500">
                    {format12h(program.startTime)}
                  </span>
                </div>
              </div>

              <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedProgram && (
        <div className="fixed inset-0 z-[90] bg-black/60 flex items-end md:items-center justify-center">
          <div className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl p-6">
            <div className="flex gap-4 items-center">
              <img
                src={selectedProgram.image || DEFAULT_COVER}
                alt={selectedProgram.title}
                className="w-24 h-24 rounded-2xl object-cover"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_COVER
                }}
              />

              <div>
                <h3 className="text-2xl font-black">
                  {selectedProgram.title}
                </h3>
                <p className="text-gray-600">
                  with {selectedProgram.host}
                </p>
                <p className="text-sm text-orange-500 font-bold mt-1">
                  {format12h(selectedProgram.startTime)} -{' '}
                  {format12h(selectedProgram.endTime)}
                </p>
              </div>
            </div>

            <p className="mt-5 text-gray-700">
              {selectedProgram.description}
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setIsPlaying(true)
                  setSelectedProgram(null)
                }}
                className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-white" />
                Listen
              </button>

              <button
                onClick={() => navigate('/schedule')}
                className="flex-1 border border-black py-3 rounded-xl font-bold"
              >
                Schedule
              </button>
            </div>

            <button
              onClick={() => setSelectedProgram(null)}
              className="mt-4 w-full text-gray-500 font-bold py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-16 left-0 right-0 bg-black text-white px-5 py-3 flex items-center justify-between z-50">
        <div className="min-w-0">
          <p className="text-sm font-bold truncate">
            On Air: {liveProgram.title}
          </p>
          <p className="text-xs text-white/60 truncate">
            {liveProgram.host}
          </p>
        </div>

        <button
          onClick={() => setIsPlaying((v) => !v)}
          className="w-12 h-12 rounded-full border-4 border-orange-500 flex items-center justify-center"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-white" />
          ) : (
            <Play className="w-5 h-5 fill-white ml-0.5" />
          )}
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex items-center justify-around">
          <button
            onClick={() => navigate('/app')}
            className="flex flex-col items-center text-orange-500"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-bold">Home</span>
          </button>

          <button
            onClick={() => navigate('/music')}
            className="flex flex-col items-center text-gray-500"
          >
            <Music className="w-6 h-6" />
            <span className="text-xs font-bold">Music</span>
          </button>

          <button
            onClick={() => navigate('/schedule')}
            className="flex flex-col items-center text-gray-500"
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-bold">Schedule</span>
          </button>

          <button
            onClick={() => alert('My Sounds coming soon')}
            className="flex flex-col items-center text-gray-500"
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-bold">My Sounds</span>
          </button>

          <button
            onClick={() => alert('Search coming soon')}
            className="flex flex-col items-center text-gray-500"
          >
            <Search className="w-6 h-6" />
            <span className="text-xs font-bold">Search</span>
          </button>
        </div>
      </nav>
    </div>
  )
}