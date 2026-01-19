type ProgramRingProps = {
  title: string
  image: string
  progress: number // 0 a 100
  isLive?: boolean
}

export function ProgramRing({
  title,
  image,
  progress,
  isLive
}: ProgramRingProps) {
  const radius = 46
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center min-w-[120px]">
      <div className="relative w-28 h-28">
        <svg className="absolute inset-0 rotate-[-90deg]">
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke="#2a2a2a"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke="#ff6600"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>

        <img
          src={image}
          alt={title}
          className="absolute inset-2 rounded-full object-cover"
        />

        {isLive && (
          <span className="absolute bottom-1 right-1 bg-black text-white text-xs px-2 py-0.5 rounded">
            LIVE
          </span>
        )}
      </div>

      <span className="mt-2 text-sm text-center text-white">
        {title}
      </span>
    </div>
  )
}
