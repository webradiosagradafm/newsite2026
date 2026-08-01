import React, { useEffect, useState } from 'react'

interface ForecastItem {
  day: string
  temp: string
  condition: string
}

export default function WeatherBar() {
  const [forecast, setForecast] = useState<ForecastItem[]>([
    { day: 'Today', temp: '--°F', condition: 'Loading...' },
    { day: 'Tomorrow', temp: '--°F', condition: 'Loading...' },
    { day: 'Sun', temp: '--°F', condition: 'Loading...' }
  ])

  useEffect(() => {
    // Exemplo usando uma API pública gratuita (ex: Open-Meteo para Chicago, IL)
    // Coordenadas de Chicago: Latitude 41.8781, Longitude -87.6298
    fetch('https://api.open-meteo.com/v1/forecast?latitude=41.8781&longitude=-87.6298&daily=temperature_2m_max,weathercode&temperature_unit=fahrenheit&timezone=America%2FChicago')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.daily) {
          const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          const todayIndex = new Date().getDay()

          const updatedForecast = [
            {
              day: 'Today',
              temp: `${Math.round(data.daily.temperature_2m_max[0])}°F`,
              condition: getWeatherCondition(data.daily.weathercode[0])
            },
            {
              day: 'Tomorrow',
              temp: `${Math.round(data.daily.temperature_2m_max[1])}°F`,
              condition: getWeatherCondition(data.daily.weathercode[1])
            },
            {
              day: daysOfWeek[(todayIndex + 2) % 7],
              temp: `${Math.round(data.daily.temperature_2m_max[2])}°F`,
              condition: getWeatherCondition(data.daily.weathercode[2])
            }
          ]
          setForecast(updatedForecast)
        }
      })
      .catch(() => {
        // Fallback caso falhe a requisição
        setForecast([
          { day: 'Today', temp: '72°F', condition: 'Sunny' },
          { day: 'Tomorrow', temp: '68°F', condition: 'Cloudy' },
          { day: 'Sun', temp: '75°F', condition: 'Clear' }
        ])
      })
  }, [])

  // Função auxiliar simples para traduzir o código do clima
  const getWeatherCondition = (code: number) => {
    if (code === 0) return 'Sunny'
    if (code <= 3) return 'Partly Cloudy'
    if (code <= 48) return 'Foggy'
    if (code <= 67) return 'Rainy'
    return 'Clear'
  }

  return (
    <div className="py-6 border-b border-gray-300 dark:border-white/10">
      <div className="bg-gray-100 dark:bg-[#1A1A1A] p-4 transition-colors rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#121212] shadow-sm flex items-center justify-center text-orange-500 flex-shrink-0">
              <svg 
                className="w-5 h-5" 
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
              <p className="text-[11px] font-black text-orange-500 uppercase tracking-wide">
                Chicago, IL
              </p>
              <h3 className="text-sm font-bold leading-tight">
                Weather Outlook
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          {forecast.map((item, index) => (
            <div 
              key={index} 
              className="bg-white/60 dark:bg-[#121212]/60 px-3 py-2 rounded-xl text-center flex flex-col items-center justify-center min-w-[85px]"
            >
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                {item.day}
              </span>
              <span className="text-sm font-black text-gray-950 dark:text-white my-0.5">
                {item.temp}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-full">
                {item.condition}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}