import React, { useMemo } from 'react'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Headphones,
  Music,
  Pause,
  Play,
  Radio,
  UserRound
} from 'lucide-react'
import { Program } from '../types'
import { SCHEDULES } from '../constants'

interface LiveMetadata {
  artist: string
  title: string
  playedAt?: Date
  isMusic?: boolean
}

interface ProgramDetailProps {
  program: Program
  onBack: () => void
  onViewSchedule: () => void
  onListenClick: () => void
  isPlaying: boolean
  liveMetadata?: LiveMetadata | null
  trackHistory?: LiveMetadata[]
}

const DEFAULT_COVER = '/logo.png'

const getProgramImage = (program?: Program) => {
  const p = program as any

  return (
    p?.image ||
    p?.cover ||
    p?.presenterImage ||
    p?.presenter?.image ||
    DEFAULT_COVER
  )
}

const formatToAmPm = (time?: string) => {
  if (!time) return ''

  const [hourRaw, minuteRaw] = time.split(':').map(Number)
  const hour = hourRaw === 0 ? 12 : hourRaw > 12 ? hourRaw - 12 : hourRaw
  const minute = String(minuteRaw || 0).padStart(2, '0')
  const period = hourRaw >= 12 ? 'PM' : 'AM'

  return `${hour}:${minute} ${period}`
}

const formatRangeToAmPm = (start?: string, end?: string) => {
  if (!start || !end) return '24/7'
  return `${formatToAmPm(start)} - ${formatToAmPm(end)}`
}

const getChicagoDayAndTotalMinutes = () => {
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

const isProgramLive = (program: Program) => {
  const { total } = getChicagoDayAndTotalMinutes()

  const [sH, sM] = program.startTime.split(':').map(Number)
  const [eH, eM] = program.endTime.split(':').map(Number)

  const start = sH * 60 + sM
  let end = eH * 60 + eM

  if (end === 0 || end <= start) {
    end = 24 * 60
  }

  return total >= start && total < end
}

const getNextProgram = (program: Program) => {
  const { day } = getChicagoDayAndTotalMinutes()
  const schedule = SCHEDULES[day] || SCHEDULES[1]

  const currentIndex = schedule.findIndex((p) => p.id === program.id)

  if (currentIndex === -1) return null

  if (currentIndex < schedule.length - 1) {
    return schedule[currentIndex + 1]
  }

  const tomorrow = SCHEDULES[(day + 1) % 7] || schedule
  return tomorrow[0] || null
}

const getTrackTime = (track: LiveMetadata) => {
  if (!track.playedAt) return 'Just played'

  return new Date(track.playedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTrackImage = (artist: string, title: string) => {
  return `https://picsum.photos/seed/${encodeURIComponent(
    `${artist}-${title}`
  )}/160/160`
}

const ProgramDetail: React.FC<ProgramDetailProps> = ({
  program,
  onBack,
  onViewSchedule,
  onListenClick,
  isPlaying,
  liveMetadata,
  trackHistory = []
}) => {
  const programImage = getProgramImage(program)
  const isLive = isProgramLive(program)
  const nextProgram = getNextProgram(program)

  const tracks = useMemo(() => {
    const unique = new Map<string, LiveMetadata>()

    if (liveMetadata?.artist && liveMetadata?.title) {
      unique.set(`${liveMetadata.artist}-${liveMetadata.title}`, liveMetadata)
    }

    trackHistory.forEach((track) => {
      if (!track.artist || !track.title) return
      unique.set(`${track.artist}-${track.title}`, track)
    })

    return Array.from(unique.values()).slice(0, 12)
  }, [liveMetadata, trackHistory])

  return (
    <div className="min-h-[100dvh] bg-white dark:bg-[#0f0f0f] text-gray-950 dark:text-white">
      <section className="relative overflow-hidden border-b border-black/10 dark:border-white/10">
        <div className="absolute inset-0">
          <img
            src={programImage}
            alt={program.title}
            className="w-full h-full object-cover opacity-20 blur-2xl scale-110"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_COVER
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white to-white dark:from-black/50 dark:via-[#0f0f0f] dark:to-[#0f0f0f]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-8 pb-12 md:pb-16">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-500 transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-12 items-center">
            <div className="relative">
              <div className="aspect-square rounded-[2rem] overflow-hidden bg-gray-200 dark:bg-[#1a1a1a] shadow-2xl">
                <img
                  src={programImage}
                  alt={program.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_COVER
                  }}
                />
              </div>

              <div className="absolute -bottom-5 left-6 bg-black text-white dark:bg-white dark:text-black px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                <Radio className="w-5 h-5 text-orange-500" />
                <span className="text-xs font-black uppercase tracking-widest">
                  {isLive ? 'Live Now' : 'On Demand'}
                </span>
              </div>
            </div>

            <div className="pt-6 lg:pt-0">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                  {isLive ? 'Live' : 'Program'}
                </span>

                <span className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-semibold">
                  <Clock className="w-4 h-4" />
                  {formatRangeToAmPm(program.startTime, program.endTime)}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-5">
                {program.title}
              </h1>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed mb-6">
                {program.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <UserRound className="w-5 h-5 text-orange-500" />
                  <span className="font-bold">{program.host || 'Praise FM'}</span>
                </div>

                {liveMetadata?.artist && (
                  <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Headphones className="w-5 h-5 text-orange-500" />
                    <span className="font-bold">{liveMetadata.artist}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onListenClick}
                  className="inline-flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black text-lg transition active:scale-95 shadow-xl shadow-orange-500/20"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" fill="currentColor" />}
                  {isPlaying ? 'Pause' : 'Listen Live'}
                </button>

                <button
                  onClick={onViewSchedule}
                  className="inline-flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 dark:bg-[#1b1b1b] dark:hover:bg-[#252525] px-8 py-4 rounded-2xl font-black text-lg transition"
                >
                  <Calendar className="w-5 h-5 text-orange-500" />
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-8">
            <div className="bg-gray-100 dark:bg-[#171717] rounded-[2rem] p-6 md:p-8 border border-black/5 dark:border-white/5">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-500 mb-2">
                    Praise FM
                  </p>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                    About this show
                  </h2>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {program.description}
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-[#171717] rounded-[2rem] overflow-hidden border border-black/5 dark:border-white/5">
              <div className="p-6 md:p-8 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-500 mb-2">
                    Recently
                  </p>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                    Music Played
                  </h2>
                </div>

                <Music className="w-8 h-8 text-orange-500" />
              </div>

              {tracks.length > 0 ? (
                <div className="divide-y divide-black/5 dark:divide-white/10">
                  {tracks.map((track, index) => {
                    const isCurrent =
                      liveMetadata?.artist === track.artist &&
                      liveMetadata?.title === track.title

                    return (
                      <div
                        key={`${track.artist}-${track.title}-${index}`}
                        className={`flex items-center gap-4 p-4 md:p-5 transition ${
                          isCurrent
                            ? 'bg-orange-500/10'
                            : 'hover:bg-white/70 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden bg-gray-300 dark:bg-[#222] flex-shrink-0">
                          <img
                            src={getTrackImage(track.artist, track.title)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {isCurrent && (
                              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                                Now Playing
                              </span>
                            )}
                          </div>

                          <h3 className="font-black text-base md:text-lg truncate">
                            {track.title}
                          </h3>

                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {track.artist}
                          </p>
                        </div>

                        <div className="hidden sm:block text-right text-xs font-bold text-gray-400 uppercase tracking-widest">
                          {getTrackTime(track)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="p-10 md:p-14 text-center">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-[#222] mx-auto mb-5 flex items-center justify-center">
                    <Music className="w-7 h-7 text-orange-500" />
                  </div>

                  <h3 className="text-xl font-black mb-2">
                    No tracks yet
                  </h3>

                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Keep listening — tracks played on Praise FM will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-gray-100 dark:bg-[#171717] rounded-[2rem] p-6 border border-black/5 dark:border-white/5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-500 mb-4">
                Host
              </p>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-300 dark:bg-[#222]">
                  <img
                    src={programImage}
                    alt={program.host || program.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-black leading-tight">
                    {program.host || 'Praise FM'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Presenter
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-[#171717] rounded-[2rem] p-6 border border-black/5 dark:border-white/5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-500 mb-4">
                Coming Up
              </p>

              {nextProgram ? (
                <div>
                  <h3 className="text-2xl font-black tracking-tight mb-2">
                    {nextProgram.title}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {nextProgram.host}
                  </p>

                  <div className="inline-flex items-center gap-2 bg-white dark:bg-[#222] px-4 py-2 rounded-full text-sm font-black">
                    <Clock className="w-4 h-4 text-orange-500" />
                    {formatToAmPm(nextProgram.startTime)}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">End of schedule</p>
              )}
            </div>

            <div className="bg-orange-500 rounded-[2rem] p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.25em] opacity-80 mb-4">
                Live Radio
              </p>

              <h3 className="text-2xl font-black tracking-tight mb-3">
                Praise FM USA
              </h3>

              <p className="text-white/85 text-sm leading-relaxed mb-5">
                Worship, gospel, Christian hits and inspiring moments streaming 24/7 worldwide.
              </p>

              <button
                onClick={onListenClick}
                className="w-full bg-white text-black hover:bg-black hover:text-white transition rounded-2xl px-5 py-4 font-black inline-flex items-center justify-center gap-2"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" fill="currentColor" />}
                {isPlaying ? 'Pause' : 'Listen Now'}
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

export default ProgramDetail
