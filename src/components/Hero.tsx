import React from 'react'

interface HeroProps {
  onListenClick: () => void
  isPlaying: boolean
  liveMetadata?: {
    artist: string
    title: string
  } | null
  onNavigateToProgram?: (program: any) => void
}

const Hero: React.FC<HeroProps> = ({
  onListenClick,
  isPlaying,
  liveMetadata
}) => {
  return (
    <section className="max-w-6xl mx-auto px-4 mt-8">

      <div className="bg-gradient-to-r from-black to-gray-900 text-white p-8 rounded-2xl">

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Praise FM
        </h1>

        <p className="mb-6">
          Global Christian Radio — Streaming 24/7
        </p>

        {liveMetadata && (
          <div className="mb-6">
            <p className="text-sm opacity-70">Now Playing</p>
            <p className="font-semibold">
              {liveMetadata.artist} — {liveMetadata.title}
            </p>
          </div>
        )}

        {/* 🔥 BOTÃO ORIGINAL COM ANEL */}
        <div className="flex items-center gap-6 mt-6">

          <button
            onClick={onListenClick}
            className="relative w-20 h-20 flex items-center justify-center rounded-full bg-yellow-500 text-black shadow-lg"
          >
            {/* ANEL BASE (sempre visível) */}
            <span className="absolute inset-0 rounded-full border-4 border-yellow-300 opacity-40"></span>

            {/* ANEL GIRANDO (quando toca) */}
            {isPlaying && (
              <span className="absolute inset-0 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin"></span>
            )}

            {/* ÍCONE */}
            <span className="z-10 text-xl font-bold">
              {isPlaying ? '⏸' : '▶'}
            </span>
          </button>

          <div>
            <p className="text-sm opacity-70">Live Radio</p>
            <p className="font-semibold">
              {isPlaying ? 'Now Playing' : 'Click to Listen'}
            </p>
          </div>

        </div>

      </div>

    </section>
  )
}

export default Hero