import React, { useEffect, useState } from 'react'

export default function WeatherBar() {
  // Exemplo de dados (você pode integrar com uma API de clima real depois se quiser)
  const [weather, setWeather] = useState({
    temp: '72°F',
    condition: 'Partly Cloudy',
    location: 'Chicago, IL'
  })

  return (
    <div className="py-6 border-b border-gray-300 dark:border-white/10">
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent dark:from-orange-500/20 dark:via-amber-500/10 dark:to-transparent p-4 md:p-5 rounded-2xl flex items-center justify-between border border-orange-500/20 shadow-sm">
        
        {/* Localização e Condição */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-orange-500/15 dark:bg-orange-500/20 flex items-center justify-center text-orange-500 flex-shrink-0">
            {/* Ícone SVG Moderno (Sol entre nuvens) */}
            <svg 
              className="w-6 h-6 animate-pulse" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M3 15a4 4 0 004 4h10a4 4 0 001.5-7.7A5 5 0 008.5 7.3 4.5 4.5 0 003 15z" 
              />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-orange-500">
                Weather Live
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {weather.location}
              </span>
            </div>
            <h3 className="text-sm md:text-base font-bold text-gray-950 dark:text-white mt-0.5">
              {weather.condition}
            </h3>
          </div>
        </div>

        {/* Temperatura */}
        <div className="text-right">
          <span className="text-2xl md:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
            {weather.temp}
          </span>
          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
            RealTime
          </p>
        </div>

      </div>
    </div>
  )
}