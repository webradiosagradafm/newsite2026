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
    { day: 'Next', temp: '--°F', condition: 'Loading...' }
  ])

  // Sua chave da OpenWeatherMap
  const API_KEY = '46c6e2c5797e2e465e06600d29810afe'
  // Coordenadas de Chicago, IL
  const LAT = '41.8781'
  const LON = '-87.6298'

  useEffect(() => {
    // Usamos a API One Call ou Forecast da OpenWeatherMap (em Fahrenheit)
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=imperial&appid=${API_KEY}`

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.list) {
          // A API de forecast retorna blocos de 3 em 3 horas. 
          // Vamos filtrar um item por dia (ex: índice 0 para hoje, 8 para amanhã, 16 para depois)
          const todayData = data.list[0]
          const tomorrowData = data.list[8] || data.list[1]
          const nextDayData = data.list[16] || data.list[2]

          const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          const todayIndex = new Date().getDay()

          const formatDayName = (offset: number) => {
            return daysOfWeek[(todayIndex + offset) % 7]
          }

          setForecast([
            {
              day: 'Today',
              temp: `${Math.round(todayData.main.temp)}°F`,
              condition: todayData.weather[0].main
            },
            {
              day: 'Tomorrow',
              temp: `${Math.round(tomorrowData.main.temp)}°F`,
              condition: tomorrowData.weather[0].main
            },
            {
              day: formatDayName(2),
              temp: `${Math.round(nextDayData.main.temp)}°F`,
              condition: nextDayData.weather[0].main
            }
          ])
        }
      })
      .catch(() => {
        // Fallback caso ocorra algum erro na requisição
        setForecast([
          { day: 'Today', temp: '72°F', condition: 'Sunny' },
          { day: 'Tomorrow', temp: '68°F', condition: 'Cloudy' },
          { day: 'Sun', temp: '75°F', condition: 'Clear' }
        ])
      })
  }, [])

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