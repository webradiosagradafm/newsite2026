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

        <button
          onClick={onListenClick}
          className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold"
        >
          {isPlaying ? 'Pause' : 'Listen Live'}
        </button>

      </div>

    </section>
  )
}

export default Hero