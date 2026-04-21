import React, { useEffect, useState } from 'react'
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
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
      }
      .animate-live-pulse {
        animation: live-pulse 1.8s infinite;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
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

const getChicagoMinutesNow = () => {
  const now = new Date()
  const chicago = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }))
  return chicago.getHours() * 60 + chicago.getMinutes()
}

const parseTimeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
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
  const [progressPercent, setProgressPercent] = useState(0)

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
          const topCountry = Object.entries(grouped).sort((a, b) => b[1] - a[1])[0]?.[0] || null
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
    const updateProgress = () => {
      if (!program?.startTime || !program?.endTime) {
        setProgressPercent(0)
        return
      }

      const nowMinutes = getChicagoMinutesNow()
      const start = parseTimeToMinutes(program.startTime)
      let end = parseTimeToMinutes(program.endTime)

      if (end === 0 || end <= start) end = 24 * 60

      const duration = end - start
      const elapsed = nowMinutes - start

      if (duration <= 0) {
        setProgressPercent(0)
        return
      }

      const percent = Math.min(Math.max((elapsed / duration) * 100, 0), 100)
      setProgressPercent(percent)
    }

    updateProgress()
    const interval = setInterval(updateProgress, 30000)
    return () => clearInterval(interval)
  }, [program])

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

      {showSchedule && (
        <div
          className="fixed inset-0 bg-black/70 z-[99] md:hidden"
          onClick={() => setShowSchedule(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 bottom-0 w-full md:w-96 z-[100] bg-black text-white transition-transform duration-300 ${
          showSchedule ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="font-semibold">Schedule</span>
          <button
            onClick={() => setShowSchedule(false)}
            className="text-white hover:opacity-70"
            aria-label="Close schedule"
          >
            <IconClose className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#ff6600] shrink-0">
                <img src={program.image} className="w-full h-full object-cover" alt={program.title} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-gray-400 truncate">
                  {topLine}
                </div>
                <div className="text-xl font-semibold truncate">{program.title}</div>
                <div className="text-gray-400 truncate">with {program.host}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {formatTimeToAmPm(program.startTime)} - {formatTimeToAmPm(program.endTime)} • LIVE
                </div>
              </div>
            </div>

            <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ff6600] transition-all duration-500 rounded-r-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-4 text-center">
              <div className="text-[10px] uppercase tracking-widest text-gray-400">
                {siteListeners} site + {tuneInListeners} TuneIn
              </div>
              <div className="text-lg font-semibold">
                {totalListeners} listening now {country ? `• ${country}` : ''}
              </div>
            </div>
          </div>

          {queue.slice(0, 4).map((prog) => (
            <div key={prog.id} className="p-4 border-b border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded overflow-hidden shrink-0">
                  <img src={prog.image} className="w-full h-full object-cover" alt={prog.title} />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{prog.title}</div>
                  <div className="text-sm text-gray-400 truncate">{prog.host}</div>
                  <div className="text-xs text-gray-500">
                    {formatTimeToAmPm(prog.startTime)} - {formatTimeToAmPm(prog.endTime)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isPlaying && (
        <>
          {/* MOBILE BAR */}
          <div className="fixed bottom-0 left-0 right-0 z-[60] md:hidden bg-black text-white border-t border-white/10">
            <div className="h-1 bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#ff6600] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="h-[76px] px-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#ff6600] shrink-0">
                  <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                </div>

                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 truncate">
                    {topLine}
                  </div>
                  <div className="text-base font-semibold truncate">{program.title}</div>
                  <div className="text-sm text-gray-400 truncate">with {program.host}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={onTogglePlayback}
                  className="w-11 h-11 rounded-full border-2 border-white flex items-center justify-center"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <IconPause className="w-4 h-4" /> : <IconPlay className="w-4 h-4 ml-0.5" />}
                </button>

                <button
                  onClick={() => setShowSchedule(true)}
                  className="text-gray-300"
                  aria-label="Open schedule"
                >
                  <IconList className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1 text-[#00d9c9]">
                  <div className="w-2 h-2 rounded-full bg-[#00d9c9] animate-pulse" />
                  <span className="text-xs font-bold">LIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP BAR */}
          <div className="fixed bottom-0 left-0 right-0 z-[60] hidden md:block border-t border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#0b0b0b]/95 backdrop-blur-md text-black dark:text-white">
            <div className="h-1 bg-black/10 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#ff6600] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="h-[88px] px-6 xl:px-8 flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0 w-[34%]">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#ff6600] shrink-0">
                  <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                </div>

                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 truncate">
                    {topLine}
                  </div>
                  <div className="text-[15px] font-semibold truncate">{program.title}</div>
                  <div className="text-[11px] text-gray-600 dark:text-gray-400 truncate">
                    with {program.host}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-5 w-[28%]">
                <button
                  onClick={skip30Backward}
                  className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white"
                  aria-label="Back 30"
                >
                  <IconBack30 className="w-9 h-9" />
                </button>

                <button
                  onClick={onTogglePlayback}
                  className="w-12 h-12 rounded-full border-2 border-black dark:border-white flex items-center justify-center bg-white dark:bg-transparent"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <IconPause className="w-5 h-5" /> : <IconPlay className="w-5 h-5 ml-0.5" />}
                </button>

                <button
                  onClick={skip30Forward}
                  className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white"
                  aria-label="Forward 30"
                >
                  <IconForward30 className="w-9 h-9" />
                </button>
              </div>

              <div className="flex items-center justify-end gap-4 w-[38%]">
                <div className="flex flex-col items-end mr-1">
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    {siteListeners} site + {tuneInListeners} TuneIn
                  </div>
                  <div className="text-xs font-semibold">
                    {totalListeners} listening now {country ? `• ${country}` : ''}
                  </div>
                </div>

                <div
                  className="flex items-center gap-2"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <button
                    onClick={toggleMute}
                    className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                    aria-label="Volume"
                  >
                    <VolumeIcon />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-200 ${
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
                      className="w-full h-1 accent-[#ff6600]"
                    />
                  </div>
                </div>

                <button
                  onClick={cyclePlaybackRate}
                  className="px-3 py-1.5 text-xs font-semibold border border-black/15 dark:border-white/20 rounded"
                >
                  {playbackRate}×
                </button>

                <button
                  onClick={() => setShowSchedule(true)}
                  className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                  aria-label="Open schedule"
                >
                  <IconList className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-1 text-[#00d9c9]">
                  <div className="w-2 h-2 rounded-full bg-[#00d9c9] animate-pulse" />
                  <span className="text-xs font-bold">LIVE</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default LivePlayerBar
