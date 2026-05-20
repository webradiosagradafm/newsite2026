import React from 'react'
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Music2,
  Pause,
  Play,
  Radio
} from 'lucide-react'

import { Program } from '../types'

interface LiveMetadata {
  artist: string
  title: string
  playedAt?: Date
  isMusic?: boolean
}

interface ProgramMiniPageProps {
  program: Program
  queue: Program[]
  liveMetadata: LiveMetadata | null
  trackHistory: LiveMetadata[]
  isPlaying: boolean
  onBack: () => void
  onViewSchedule: () => void
  onListenClick: () => void
}

const DEFAULT_COVER = '/logo.png'

const formatToAmPm = (time?: string) => {
  if (!time) return ''

  const [hourRaw, minuteRaw] = time.split(':').map(Number)

  const hour =
    hourRaw === 0
      ? 12
      : hourRaw > 12
      ? hourRaw - 12
      : hourRaw

  const minute = String(minuteRaw || 0).padStart(2, '0')

  const period = hourRaw >= 12 ? 'PM' : 'AM'

  return `${hour}:${minute} ${period}`
}

const formatRangeToAmPm = (start?: string, end?: string) => {
  if (!start || !end) return '24/7'
  return `${formatToAmPm(start)} - ${formatToAmPm(end)}`
}

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

const getHostName = (program?: Program) => {
  const p = program as any

  return (
    p?.host ||
    p?.presenter ||
    p?.presenterName ||
    p?.dj ||
    'Praise FM'
  )
}

const ProgramMiniPage: React.FC<ProgramMiniPageProps> = ({
  program,
  queue,
  liveMetadata,
  trackHistory,
  isPlaying,
  onBack,
  onViewSchedule,
  onListenClick
}) => {
  const image = getProgramImage(program)

  const host = getHostName(program)

  return (
    <section className="bg-white dark:bg-[#121212] text-gray-950 dark:text-white min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-500 transition mb-8"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-12 items-start">
          <div className="rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-[#1A1A1A] shadow-xl">
            <img
              src={image}
              alt={program.title}
              className="w-full aspect-square object-cover"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_COVER
              }}
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
                Program
              </span>

              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Clock size={15} />

                {formatRangeToAmPm(
                  program.startTime,
                  program.endTime
                )}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none mb-4">
              {program.title}
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-2">
              with <strong>{host}</strong>
            </p>

            <p className="text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed mb-8">
              {(program as any).description ||
                'Worship, Christian hits, inspiring moments and uplifting music streaming live on Praise FM.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={onListenClick}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black inline-flex items-center justify-center gap-3 transition active:scale-95"
              >
                {isPlaying ? (
                  <Pause size={22} />
                ) : (
                  <Play size={22} fill="currentColor" />
                )}

                {isPlaying ? 'Pause Live' : 'Listen Live'}
              </button>

              <button
                onClick={onViewSchedule}
                className="bg-gray-100 dark:bg-[#1A1A1A] hover:bg-gray-200 dark:hover:bg-[#242424] px-8 py-4 rounded-2xl font-black inline-flex items-center justify-center gap-3 transition"
              >
                <CalendarDays size={22} />
                View Full Schedule
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div className="rounded-3xl bg-gray-100 dark:bg-[#1A1A1A] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Music2 className="text-orange-500" size={20} />

                  <h2 className="font-black text-lg">
                    Now Playing
                  </h2>
                </div>

                {liveMetadata ? (
                  <div>
                    <p className="text-xl font-black">
                      {liveMetadata.title}
                    </p>

                    <p className="text-gray-500 dark:text-gray-400">
                      {liveMetadata.artist}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    Live stream metadata will appear here.
                  </p>
                )}
              </div>

              <div className="rounded-3xl bg-gray-100 dark:bg-[#1A1A1A] p-5">
                <h2 className="font-black text-lg mb-4">
                  Coming Up Next
                </h2>

                <div className="space-y-3">
                  {queue.slice(0, 3).map((item) => (
                    <div
                      key={item.id || item.title}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={getProgramImage(item)}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_COVER
                        }}
                      />

                      <div className="min-w-0">
                        <p className="font-bold truncate">
                          {item.title}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatRangeToAmPm(
                            item.startTime,
                            item.endTime
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* LATEST EPISODES */}

            <div className="mt-5 rounded-3xl bg-gray-100 dark:bg-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-5">
                <Radio className="text-orange-500" size={20} />

                <h2 className="font-black text-lg">
                  Latest Episodes
                </h2>
              </div>

              <div className="space-y-4">
                <div className="bg-white dark:bg-[#242424] rounded-2xl p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={image}
                      alt="Episode"
                      className="w-full md:w-28 h-28 object-cover rounded-2xl"
                    />

                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-orange-500 font-black mb-2">
                        20 May 2026 • 60 mins
                      </p>

                      <h3 className="text-xl font-black mb-2">
                        Praise FM Classics
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        The best Christian classics from 2015 to 2022.
                      </p>

                      <audio controls className="w-full">
                        <source
                          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                          type="audio/mpeg"
                        />
                      </audio>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#242424] rounded-2xl p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={image}
                      alt="Episode"
                      className="w-full md:w-28 h-28 object-cover rounded-2xl"
                    />

                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-orange-500 font-black mb-2">
                        19 May 2026 • 60 mins
                      </p>

                      <h3 className="text-xl font-black mb-2">
                        Praise FM Classics
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Timeless worship classics and unforgettable songs.
                      </p>

                      <audio controls className="w-full">
                        <source
                          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
                          type="audio/mpeg"
                        />
                      </audio>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RECENTLY PLAYED */}

            <div className="mt-5 rounded-3xl bg-gray-100 dark:bg-[#1A1A1A] p-5">
              <h2 className="font-black text-lg mb-4">
                Recently Played
              </h2>

              {trackHistory.length > 0 ? (
                <div className="divide-y divide-gray-300 dark:divide-white/10">
                  {trackHistory.slice(0, 4).map((track, index) => (
                    <div
                      key={`${track.artist}-${track.title}-${index}`}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-bold truncate">
                          {track.title}
                        </p>

                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {track.artist}
                        </p>
                      </div>

                      <span className="text-xs text-gray-400">
                        #{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Recent songs will appear after the live metadata updates.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProgramMiniPage
