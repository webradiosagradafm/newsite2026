import React, { useState, useEffect, useRef } from 'react'
import { Program } from '../types'
import { supabase } from '../lib/supabase'
import { connectListener } from '../lib/listeners'

interface LivePlayerBarProps {
  isPlaying: boolean
  onTogglePlayback: () => void
  program: Program
  liveMetadata?: { artist: string; title: string; artwork?: string } | null
  queue?: Program[]
  audioRef: React.RefObject<HTMLAudioElement | null>
}

const TUNEIN_DEFAULT = 2
const ACTIVE_WINDOW_MS = 45000

const LivePulseAnimation = () => {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes live-pulse {
        0%, 100% { opacity: .65; transform: translate(-50%, -50%) scale(.9); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.25); }
      }
      .animate-live-pulse {
        animation: live-pulse 1.8s infinite;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null
}

const formatTimeToAmPm = (timeString: string): string => {
  try {
    if (timeString.includes('AM') || timeString.includes('PM')) return timeString

    const [hours, minutes] = timeString.split(':')
    let hour = parseInt(hours, 10)
    const period = hour >= 12 ? 'PM' : 'AM'
    hour = hour % 12
    hour = hour ? hour : 12

    return `${hour}:${minutes || '00'} ${period}`
  } catch {
    return timeString
  }
}

const IconPlay = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <polygon points="8,5 19,12 8,19" />
  </svg>
)

const IconPause = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <rect x="7" y="5" width="3.5" height="14" rx="0.5" />
    <rect x="13.5" y="5" width="3.5" height="14" rx="0.5" />
  </svg>
)

const IconVolumeHigh = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M4 10h4l5-4v12l-5-4H4z" />
    <path d="M16 9a4 4 0 0 1 0 6" />
    <path d="M18.5 6.5a7.5 7.5 0 0 1 0 11" />
  </svg>
)

const IconVolumeMid = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M4 10h4l5-4v12l-5-4H4z" />
    <path d="M16 9a4 4 0 0 1 0 6" />
  </svg>
)

const IconVolumeMute = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M4 10h4l5-4v12l-5-4H4z" />
    <line x1="17" y1="9" x2="22" y2="14" />
    <line x1="22" y1="9" x2="17" y2="14" />
  </svg>
)

const IconList = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <rect x="5" y="6" width="14" height="2" rx="1" />
    <rect x="5" y="11" width="14" height="2" rx="1" />
    <rect x="5" y="16" width="14" height="2" rx="1" />
  </svg>
)

const IconClose = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
)

const IconBack30 = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M11 8H7V4" />
    <path d="M7 4a8 8 0 1 0 5 14" />
    <text x="12" y="15.5" fontSize="6.5" textAnchor="middle" fill="currentColor" stroke="none">30</text>
  </svg>
)

const IconForward30 = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M13 8h4V4" />
    <path d="M17 4a8 8 0 1 1-5 14" />
    <text x="12" y="15.5" fontSize="6.5" textAnchor="middle" fill="currentColor" stroke="none">30</text>
  </svg>
)

const LivePlayerBar: React.FC<LivePlayerBarProps> = ({
  isPlaying,
  onTogglePlayback,
  program,
  liveMetadata,
  queue = [],
  audioRef,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('praise-volume')
    return saved ? parseFloat(saved) : 0.8
  })
  const [isMuted, setIsMuted] = useState(false)
  const [prevVolume, setPrevVolume] = useState(0.8)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)

  const [siteListeners, setSiteListeners] = useState(0)
  const [tuneInListeners] = useState(TUNEIN_DEFAULT)
  const [country, setCountry] = useState<string | null>(null)

  const totalListeners = siteListeners + tuneInListeners

  useEffect(() => {
    connectListener()
  }, [])

  useEffect(() => {
    const fetchListeners = async () => {
      try {
        const staleIso = new Date(Date.now() - ACTIVE_WINDOW_MS).toISOString()

        await supabase.from('listeners_now').delete().lt('last_seen', staleIso)

        const { data, error } = await supabase
          .from('listeners_now')
          .select('id,country,last_seen')

        if (error) throw error

        const active = (data || []).filter((row) => {
          const lastSeen = new Date(row.last_seen).getTime()
          return Date.now() - lastSeen <= ACTIVE_WINDOW_MS
        })

        setSiteListeners(active.length)

        if (active.length > 0) {
          const grouped = active.reduce<Record<string, number>>((acc, row) => {
            const c = row.country || 'Unknown'
            acc[c] = (acc[c] || 0) + 1
            return acc
          }, {})

          const topCountry =
            Object.entries(grouped).sort((a, b) => b[1] - a[1])[0]?.[0] || null

          setCountry(topCountry)
        } else {
          setCountry(null)
        }
      } catch (err) {
        console.error('Listeners fetch error:', err)
      }
    }

    fetchListeners()
    const interval = setInterval(fetchListeners, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
      audioRef.current.muted = isMuted
      audioRef.current.playbackRate = playbackRate
    }
  }, [volume, isMuted, playbackRate, audioRef])

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setVolume(val)

    if (val > 0) {
      setIsMuted(false)
      setPrevVolume(val)
    } else {
      setIsMuted(true)
    }

    localStorage.setItem('praise-volume', val.toString())
  }

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false)
      setVolume(prevVolume > 0.05 ? prevVolume : 0.8)
    } else {
      setPrevVolume(volume)
      setIsMuted(true)
    }
  }

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2]
    const currentIndex = rates.indexOf(playbackRate)
    const nextIndex = (currentIndex + 1) % rates.length
    setPlaybackRate(rates[nextIndex])
  }

  const skip30Forward = () => {
    console.log('Skip forward 30s - not available for live streams')
  }

  const skip30Backward = () => {
    console.log('Skip backward 30s - not available for live streams')
  }

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <IconVolumeMute />
    if (volume < 0.5) return <IconVolumeMid />
    return <IconVolumeHigh />
  }

  useEffect(() => {
    if (showSchedule || isExpanded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showSchedule, isExpanded])

  const topLine =
    liveMetadata?.artist && liveMetadata?.title
      ? `${liveMetadata.artist} — ${liveMetadata.title}`
      : 'PRAISE FM — LIVE STREAM'

  return (
    <>
      <LivePulseAnimation />

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full md:w-96 z-[100] bg-white dark:bg-[#121212] transition-transform duration-300 flex flex-col shadow-2xl ${
          showSchedule ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-lg font-semibold text-black dark:text-white">Schedule</h2>
          <button
            onClick={() => setShowSchedule(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close schedule"
          >
            <IconClose />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto pb-20 md:pb-0">
          <div className="p-3 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-start space-x-3">
              <div className="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border-2 border-[#ff6600]">
                <img src={program.image} className="w-full h-full object-cover" alt={program.title} />
              </div>
              <div className="flex flex-col min-w-0 flex-grow">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 truncate">
                  {topLine}
                </span>
                <span className="font-bold text-base text-black dark:text-white leading-tight mb-1 truncate">
                  {program.title}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">
                  with {program.host}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {formatTimeToAmPm(program.startTime)} - {formatTimeToAmPm(program.endTime)} • LIVE
                </span>
              </div>
            </div>
          </div>

          {queue.slice(0, 4).map((prog, index) => (
            <div key={prog.id} className="p-3 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-start space-x-3">
                <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                  <img src={prog.image} className="w-full h-full object-cover" alt={prog.title} />
                </div>
                <div className="flex flex-col min-w-0 flex-grow">
                  <span className="font-bold text-base text-black dark:text-white leading-tight mb-1 truncate">
                    {prog.title}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">
                    {prog.host}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
                    {formatTimeToAmPm(prog.startTime)} - {formatTimeToAmPm(prog.endTime)}
                  </span>
                </div>
                <span className="text-xs font-medium text-[#00d9c9] mt-1">{index + 2}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showSchedule && (
        <div
          className="fixed inset-0 bg-black/50 z-[99] md:hidden"
          onClick={() => setShowSchedule(false)}
        />
      )}

      {/* MOBILE */}
      {isPlaying && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-white/10 md:hidden transition-all duration-300 ${
            isExpanded ? 'h-auto' : 'h-[82px]'
          }`}
        >
          {!isExpanded ? (
            <div
              className="flex items-center justify-between px-4 py-3 h-[82px]"
              onClick={() => {
                setIsExpanded(true)
                setShowSchedule(true)
              }}
            >
              <div className="flex items-center gap-3 min-w-0 flex-grow">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#ff6600] flex-shrink-0">
                  <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col min-w-0 flex-grow">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 truncate">
                    {topLine}
                  </span>
                  <span className="text-base font-bold text-black dark:text-white leading-tight truncate">
                    {program.title}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 truncate leading-tight">
                    with {program.host}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onTogglePlayback()
                  }}
                  className="flex-shrink-0 w-11 h-11 rounded-full bg-[#ff6600] flex items-center justify-center text-white shadow-md"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <IconPause className="w-4 h-4" /> : <IconPlay className="w-4 h-4 ml-0.5" />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowSchedule(true)
                  }}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                  aria-label="Open schedule"
                >
                  <IconList className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10">
                <span className="text-sm font-semibold text-black dark:text-white">Schedule</span>
                <button
                  onClick={() => {
                    setIsExpanded(false)
                    setShowSchedule(false)
                  }}
                  className="p-2"
                  aria-label="Close schedule"
                >
                  <IconClose />
                </button>
              </div>

              <div className="flex items-center space-x-3 px-4 py-4 border-b border-gray-100 dark:border-white/5">
                <div className="w-14 h-14 flex-shrink-0 rounded-full overflow-hidden border-2 border-[#ff6600]">
                  <img src={program.image} className="w-full h-full object-cover" alt={program.title} />
                </div>
                <div className="flex flex-col min-w-0 flex-grow">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 truncate">
                    {topLine}
                  </span>
                  <span className="font-bold text-base text-black dark:text-white leading-tight mb-1 truncate">
                    {program.title}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">
                    with {program.host}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatTimeToAmPm(program.startTime)} - {formatTimeToAmPm(program.endTime)} • LIVE
                  </span>
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#ff6600] shadow-[0_0_8px_rgba(255,102,0,0.8)] animate-live-pulse"
                    style={{
                      left: `${((Date.now() / 500) % 100)}%`,
                      transition: 'left 0.5s linear',
                    }}
                  />
                </div>
              </div>

              <div className="px-4 pb-2 text-center">
                <span className="text-[10px] uppercase tracking-widest text-gray-400">
                  {siteListeners} site + {tuneInListeners} TuneIn
                </span>
                <p className="text-sm font-semibold text-black dark:text-white">
                  {totalListeners} listening now {country ? `• ${country}` : ''}
                </p>
              </div>

              <div className="flex items-center justify-center space-x-6 px-4 py-4">
                <button
                  onClick={skip30Backward}
                  className="text-gray-700 dark:text-gray-300"
                  aria-label="Back 30"
                >
                  <IconBack30 className="w-9 h-9" />
                </button>

                <button
                  onClick={onTogglePlayback}
                  className="w-14 h-14 bg-[#ff6600] text-white rounded-full flex items-center justify-center shadow-lg"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <IconPause className="w-5 h-5" /> : <IconPlay className="w-5 h-5 ml-0.5" />}
                </button>

                <button
                  onClick={skip30Forward}
                  className="text-gray-700 dark:text-gray-300"
                  aria-label="Forward 30"
                >
                  <IconForward30 className="w-9 h-9" />
                </button>
              </div>

              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center space-x-2 flex-grow">
                  <button onClick={toggleMute} className="p-2" aria-label="Volume">
                    <VolumeIcon />
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="flex-grow h-1 bg-gray-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#ff6600]"
                  />
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 w-6 text-right">
                    {Math.round((isMuted ? 0 : volume) * 10)}
                  </span>
                </div>

                <div className="flex items-center space-x-3 ml-4">
                  <button
                    onClick={cyclePlaybackRate}
                    className="px-2.5 py-1 text-xs font-semibold text-black dark:text-white border border-gray-300 dark:border-white/30 rounded"
                  >
                    {playbackRate}×
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-[#00d9c9] rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-[#00d9c9] uppercase">LIVE</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DESKTOP */}
      {isPlaying && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-white/10 hidden md:flex flex-col transition-colors duration-300">
          <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 relative overflow-hidden">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#ff6600] shadow-[0_0_10px_rgba(255,102,0,0.9)] animate-live-pulse"
              style={{
                left: `${((Date.now() / 400) % 100)}%`,
                transition: 'left 0.4s linear',
              }}
            />
          </div>

          <div className="flex items-center justify-between px-6 xl:px-8 py-4">
            {/* LEFT - BBC STYLE */}
            <div className="flex items-center space-x-4 w-[34%] min-w-0">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#ff6600] shadow-sm">
                <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-gray-400 truncate">
                  {topLine}
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white tracking-tight leading-tight truncate text-[15px]">
                  {program.title}
                </h4>
                <p className="text-[11px] font-normal text-gray-500 dark:text-gray-400 truncate tracking-tight mt-0.5">
                  with {program.host}
                </p>
              </div>
            </div>

            {/* CENTER - BBC CONTROLS */}
            <div className="flex items-center justify-center space-x-5 w-[32%]">
              <button
                onClick={skip30Backward}
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Back 30"
              >
                <IconBack30 className="w-9 h-9" />
              </button>

              <button
                onClick={onTogglePlayback}
                className="w-12 h-12 border-2 border-black dark:border-white text-black dark:text-white rounded-full flex items-center justify-center hover:scale-105 transition-all active:scale-95 bg-white dark:bg-[#121212]"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <IconPause className="w-5 h-5" /> : <IconPlay className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                onClick={skip30Forward}
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Forward 30"
              >
                <IconForward30 className="w-9 h-9" />
              </button>
            </div>

            {/* RIGHT */}
            <div className="flex items-center justify-end space-x-4 w-[34%]">
              <div className="flex flex-col items-end mr-2">
                <span className="text-[10px] uppercase tracking-widest text-gray-400">
                  {siteListeners} site + {tuneInListeners} TuneIn
                </span>
                <span className="text-xs font-semibold text-black dark:text-white">
                  {totalListeners} listening now {country ? `• ${country}` : ''}
                </span>
              </div>

              <div
                className="flex items-center space-x-2 relative"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <button
                  onClick={toggleMute}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                  aria-label="Volume"
                >
                  <VolumeIcon />
                </button>

                <div
                  className={`flex items-center transition-all duration-200 overflow-hidden ${
                    showVolumeSlider ? 'w-24 opacity-100' : 'w-0 opacity-0'
                  }`}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-gray-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#ff6600]"
                  />
                  <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-400 w-6 text-right">
                    {Math.round((isMuted ? 0 : volume) * 10)}
                  </span>
                </div>
              </div>

              <button
                onClick={cyclePlaybackRate}
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white border border-gray-300 dark:border-white/20 rounded hover:border-black dark:hover:border-white transition-all"
              >
                {playbackRate}×
              </button>

              <button
                onClick={() => setShowSchedule(true)}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Open schedule"
              >
                <IconList className="w-6 h-6" />
              </button>

              <div className="flex items-center space-x-1.5 px-1">
                <div className="w-2 h-2 bg-[#00d9c9] rounded-full animate-pulse" />
                <span className="text-xs font-bold text-[#00d9c9] uppercase tracking-wider">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LivePlayerBar
