import React, { useState } from 'react'

export default function WeatherBar() {
  const [weather] = useState({
    temp: '72°F',
    condition: 'Partly Cloudy',
    location: 'Chicago, IL'
  })

  return (
    <div className="py-6 border-b border-gray-300 dark:border-white/10">
      <div className="bg-gray-100 dark:bg-[#1A1A1A] hover:bg-gray-200 dark:hover:bg-[#252525] p-4 transition-colors rounded-2xl flex items-center justify-between">
        
        {/* Localização e Condição */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#121212] shadow-sm flex items-center justify-center text-orange-500 flex-shrink-0">
            {/* Ícone SVG Moderno */}
            <svg 
              className="w-6 h-6" 
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
            <p className="text-[11px] font-black text-orange-500 uppercase tracking-wide mb-0.5">
              {weather.location}
            </p>
            <h3 className="text-sm font-bold leading-tight">
              {weather.condition}
            </h3>
          </div>
        </div>

        {/* Temperatura */}
        <div className="text-right">
          <span className="text-lg md:text-xl font-black text-gray-950 dark:text-white">
            {weather.temp}
          </span>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Chicago
          </p>
        </div>

      </div>
    </div>
  )
}