import { useEffect, useState } from "react";

interface WeatherData {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
}

const weatherIcons: Record<number, string> = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌦️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  71: "❄️",
  73: "❄️",
  75: "❄️",
  80: "🌦️",
  81: "🌧️",
  82: "⛈️",
  95: "⛈️",
};

export default function WeatherBar() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    async function loadWeather() {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=41.8781&longitude=-87.6298&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FChicago"
        );

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadWeather();
  }, []);

  if (!weather) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="rounded-2xl bg-slate-900 p-6 text-center text-white">
          Loading weather...
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-lg">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-white text-xl font-bold">
              📍 Chicago Weather
            </h2>

            <p className="text-slate-400">
              United States
            </p>
          </div>

          <div className="text-right">
            <div className="text-5xl">
              {weatherIcons[weather.current.weather_code] ?? "☀️"}
            </div>

            <div className="text-white text-3xl font-bold">
              {Math.round(weather.current.temperature_2m)}°
            </div>
          </div>

        </div>

        <div className="grid grid-cols-7 gap-3">

          {weather.daily.time.map((day, index) => {

            const weekday = new Date(day).toLocaleDateString("en-US", {
              weekday: "short",
            });

            return (
              <div
                key={day}
                className="rounded-xl bg-slate-800 p-3 text-center"
              >
                <div className="text-slate-300 text-sm">
                  {weekday}
                </div>

                <div className="text-3xl my-2">
                  {weatherIcons[weather.daily.weather_code[index]] ?? "☀️"}
                </div>

                <div className="text-white font-semibold">
                  {Math.round(weather.daily.temperature_2m_max[index])}°
                </div>

                <div className="text-slate-400 text-sm">
                  {Math.round(weather.daily.temperature_2m_min[index])}°
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}