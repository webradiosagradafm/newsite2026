import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, ChevronRight, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Programação Segunda a Sábado
const WEEKDAY_SCHEDULE = [
  {
    id: 1,
    title: "Midnight Grace",
    host: "Daniel Brooks",
    startTime: "00:00",
    endTime: "06:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Daniel_Brooks_iukwmr.webp"
  },
  {
    id: 2,
    title: "Praise FM Worship",
    host: "Praise FM USA",
    startTime: "06:00",
    endTime: "07:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Praise_FM_Worship_lqymcl.webp"
  },
  {
    id: 3,
    title: "Morning Show",
    host: "Stancy Campbell",
    startTime: "07:00",
    endTime: "12:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Stancy_Campbell_xkwprb.webp"
  },
  {
    id: 4,
    title: "Praise FM Worship",
    host: "Praise FM USA",
    startTime: "12:00",
    endTime: "13:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Praise_FM_Worship_lqymcl.webp"
  },
  {
    id: 5,
    title: "Midday Grace",
    host: "Michael Ray",
    startTime: "13:00",
    endTime: "16:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Michael_Ray_kz8rea.webp"
  },
  {
    id: 6,
    title: "Praise FM Non Stop",
    host: "Praise FM USA",
    startTime: "16:00",
    endTime: "17:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Non_Stop_ntwfkt.webp"
  },
  {
    id: 7,
    title: "Future Artists",
    host: "Sarah Jordan",
    startTime: "17:00",
    endTime: "18:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Sarah_Jordan_zgvxuu.webp"
  },
  {
    id: 8,
    title: "Praise FM Carpool",
    host: "Rachael Harris",
    startTime: "18:00",
    endTime: "20:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Rachael_Harris_gywdjb.webp"
  },
  {
    id: 9,
    title: "Praise FM POP",
    host: "Praise FM USA",
    startTime: "20:00",
    endTime: "21:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/POP_Hits_qct3ml.webp"
  },
  {
    id: 10,
    title: "Praise FM Classics",
    host: "Scott Turner",
    startTime: "21:00",
    endTime: "22:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Scott_Turner_qxn3o8.webp"
  },
  {
    id: 11,
    title: "Praise FM Worship",
    host: "Praise FM USA",
    startTime: "22:00",
    endTime: "00:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Praise_FM_Worship_lqymcl.webp"
  }
];

// Programação Domingo
const SUNDAY_SCHEDULE = [
  {
    id: 1,
    title: "Midnight Grace",
    host: "Daniel Brooks",
    startTime: "00:00",
    endTime: "06:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Daniel_Brooks_iukwmr.webp"
  },
  {
    id: 2,
    title: "Praise FM Worship",
    host: "Praise FM USA",
    startTime: "06:00",
    endTime: "07:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Praise_FM_Worship_lqymcl.webp"
  },
  {
    id: 3,
    title: "Sunday Morning With Christ",
    host: "Matt Riley",
    startTime: "07:00",
    endTime: "12:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Matt_Riley_Sunday_Morning_jdvkyz.webp"
  },
  {
    id: 4,
    title: "Praise FM Worship",
    host: "Praise FM USA",
    startTime: "12:00",
    endTime: "13:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Praise_FM_Worship_lqymcl.webp"
  },
  {
    id: 5,
    title: "Midday Grace",
    host: "Michael Ray",
    startTime: "13:00",
    endTime: "16:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Michael_Ray_kz8rea.webp"
  },
  {
    id: 6,
    title: "Praise FM Non Stop",
    host: "Praise FM USA",
    startTime: "16:00",
    endTime: "17:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Non_Stop_ntwfkt.webp"
  },
  {
    id: 7,
    title: "Future Artists",
    host: "Sarah Jordan",
    startTime: "17:00",
    endTime: "18:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Sarah_Jordan_zgvxuu.webp"
  },
  {
    id: 8,
    title: "Praise FM Worship",
    host: "Praise FM USA",
    startTime: "18:00",
    endTime: "20:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Praise_FM_Worship_lqymcl.webp"
  },
  {
    id: 9,
    title: "Praise FM POP",
    host: "Praise FM USA",
    startTime: "20:00",
    endTime: "21:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/POP_Hits_qct3ml.webp"
  },
  {
    id: 10,
    title: "Praise FM Classics",
    host: "Scott Turner",
    startTime: "21:00",
    endTime: "22:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Scott_Turner_qxn3o8.webp"
  },
  {
    id: 11,
    title: "Living The Message",
    host: "Praise FM USA",
    startTime: "22:00",
    endTime: "22:30",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Praise_FM_Worship_lqymcl.webp"
  },
  {
    id: 12,
    title: "Praise FM Worship",
    host: "Praise FM USA",
    startTime: "22:30",
    endTime: "00:00",
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1737232837/Praise_FM_Worship_lqymcl.webp"
  }
];

const getChicagoTime = () => {
  const now = new Date();
  const chicagoDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  return {
    hours: chicagoDate.getHours(),
    minutes: chicagoDate.getMinutes(),
    day: chicagoDate.getDay(),
    totalMinutes: chicagoDate.getHours() * 60 + chicagoDate.getMinutes()
  };
};

const format12h = (time24: string) => {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${m.toString().padStart(2, '0')}${period}`;
};

const AppHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(getChicagoTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getChicagoTime());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const todaySchedule = useMemo(() => {
    return currentTime.day === 0 ? SUNDAY_SCHEDULE : WEEKDAY_SCHEDULE;
  }, [currentTime.day]);

  const currentProgram = useMemo(() => {
    return todaySchedule.find((prog) => {
      const [sH, sM] = prog.startTime.split(':').map(Number);
      const [eH, eM] = prog.endTime.split(':').map(Number);
      const start = sH * 60 + sM;
      let end = eH * 60 + eM;
      if (end === 0 || end <= start) end = 24 * 60;
      return currentTime.totalMinutes >= start && currentTime.totalMinutes < end;
    });
  }, [todaySchedule, currentTime]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pb-24">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-white/10 py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#ff6600] text-white font-bold flex items-center justify-center text-sm rounded">P</div>
            <div className="w-8 h-8 bg-[#ff6600] text-white font-bold flex items-center justify-center text-sm rounded">F</div>
            <div className="w-8 h-8 bg-[#ff6600] text-white font-bold flex items-center justify-center text-sm rounded">M</div>
          </div>
          <button 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm"
          >
            R
          </button>
        </div>
      </header>

      {/* Live Program Carousel */}
      <section className="py-6">
        <div className="flex space-x-4 overflow-x-auto no-scrollbar px-4 pb-4">
          {todaySchedule.map((program) => {
            const isLive = currentProgram?.id === program.id;
            return (
              <div key={program.id} className="flex-shrink-0 relative">
                <div className={`w-40 h-40 rounded-full overflow-hidden border-4 ${isLive ? 'border-[#ff6600]' : 'border-white dark:border-black'} shadow-lg relative ${isLive ? 'animate-pulse' : ''}`}>
                  <img 
                    src={program.image} 
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center border-2 border-white dark:border-black">
                    <span className="text-white dark:text-black text-lg font-bold">1</span>
                  </div>
                </div>
                {isLive && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-4 py-1 text-xs font-bold uppercase whitespace-nowrap">
                    LIVE
                  </div>
                )}
                <div className="text-center mt-3 max-w-[160px]">
                  <p className="text-xs font-semibold truncate">{program.title}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{format12h(program.startTime)} - {format12h(program.endTime)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Current Program Info */}
      <section className="px-6 py-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-1">Praise FM United States</h1>
          {currentProgram && (
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {currentProgram.title} {currentProgram.host !== "Praise FM USA" && `with ${currentProgram.host}`}
            </p>
          )}
          <button 
            onClick={() => navigate('/schedule')}
            className="border-2 border-black dark:border-white text-black dark:text-white px-8 py-2 font-semibold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center mx-auto space-x-2 rounded-sm"
          >
            <span>Stations & schedules</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Recently Played */}
      <section className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recently Played</h2>
          <button className="text-sm text-gray-600 dark:text-gray-400">View all</button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
            <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-200 dark:bg-white/10">
              <div className="w-full h-full flex items-center justify-center">
                <Volume2 className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="flex-grow min-w-0">
              <h3 className="font-bold text-base truncate">Morning Worship Mix</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">Contemporary Christian Music</p>
              <div className="mt-2 flex items-center space-x-2">
                <div className="flex-grow h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ff6600]" style={{ width: '45%' }}></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">2h ago</span>
              </div>
            </div>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-black dark:bg-white flex items-center justify-center flex-shrink-0"
            >
              <Play className="w-5 h-5 text-white dark:text-black fill-current ml-0.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Mini Player */}
      {isPlaying && (
        <div className="fixed bottom-16 left-0 right-0 bg-black dark:bg-white text-white dark:text-black px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3 flex-grow min-w-0">
            <div className="w-2 h-2 bg-[#ff6600] rounded-full animate-pulse"></div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">
                {currentProgram?.title || 'Praise FM USA'}
              </p>
              <p className="text-xs opacity-70 truncate">
                {currentProgram?.host !== "Praise FM USA" ? `with ${currentProgram?.host}` : 'Live Streaming'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsPlaying(false)}
            className="w-10 h-10 rounded-full border-2 border-white dark:border-black flex items-center justify-center flex-shrink-0"
          >
            <Pause className="w-4 h-4 fill-current" />
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-white/10 px-4 py-2 shadow-lg">
        <div className="flex items-center justify-around">
          <button 
            onClick={() => navigate('/app')}
            className="flex flex-col items-center py-2 text-[#ff6600]"
          >
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span className="text-xs font-semibold">Home</span>
          </button>
          
          <button 
            onClick={() => navigate('/music')}
            className="flex flex-col items-center py-2 text-gray-500 dark:text-gray-400"
          >
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            <span className="text-xs font-semibold">Music</span>
          </button>
          
          <button 
            onClick={() => navigate('/schedule')}
            className="flex flex-col items-center py-2 text-gray-500 dark:text-gray-400"
          >
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 10H7v2h10v-2zm2-7h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
            </svg>
            <span className="text-xs font-semibold">Schedule</span>
          </button>
          
          <button 
            onClick={() => navigate('/my-sounds')}
            className="flex flex-col items-center py-2 text-gray-500 dark:text-gray-400"
          >
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span className="text-xs font-semibold">My Sounds</span>
          </button>
          
          <button className="flex flex-col items-center py-2 text-gray-500 dark:text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <span className="text-xs font-semibold">Search</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AppHomePage;