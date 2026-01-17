import React, { useState, useEffect } from 'react';
// ... (outras importações permanecem iguais)

const SCHEDULE = [
  { 
    start: 0, end: 6, 
    title: "Midnight Grace", 
    host: "Daniel Brooks", 
    // Link direto da foto do Daniel Brooks conforme sua interface
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1705494451/daniel_brooks_host.jpg" 
  },
  { 
    start: 6, end: 7, 
    title: "Praise FM Worship", 
    host: "Morning Adoration", 
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1705494451/praise_worship.jpg" 
  },
  { 
    start: 7, end: 12, 
    title: "Morning Show", 
    host: "Stancy Cambpell", 
    image: "https://res.cloudinary.com/dtecypmsh/image/upload/v1705494451/morning_show.jpg" 
  },
  // ... adicione os outros conforme necessário
];

export default function LivePlayerBar() {
  // ... (estados de volume e isExpanded permanecem iguais)

  // Lógica para capturar o programa atual baseado no horário de Chicago
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const chicago = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Chicago"}));
      setCurrentTime(chicago);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = currentTime.getHours();
  const currentProgram = SCHEDULE.find(p => currentHour >= p.start && currentHour < p.end) || SCHEDULE[0];

  return (
    <>
      {/* ... (código da Queue PC) */}
      
      <div className="fixed bottom-0 left-0 right-0 h-[85px] bg-white dark:bg-[#0c0c0c] border-t border-white/5 z-[100]">
        <div className="max-w-[1400px] mx-auto px-4 h-full flex items-center justify-between">
          
          {/* LADO ESQUERDO: A Foto que estava faltando */}
          <div className="flex items-center space-x-3 w-1/4">
            <div className="relative">
              <img 
                src={currentProgram.image} 
                alt={currentProgram.host}
                className="w-14 h-14 rounded-full object-cover border-2 border-transparent hover:border-[#ff6600] shadow-xl"
                onError={(e) => {
                  // Fallback caso o link quebre
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200";
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-[10px] font-bold text-white">1</span>
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="text-[15px] font-extrabold text-black dark:text-white truncate tracking-tight uppercase">
                {currentProgram.title}
              </h4>
              <p className="text-[13px] text-gray-500 font-medium truncate">
                {currentProgram.host}
              </p>
            </div>
          </div>

          {/* ... (restante dos controles de Play e Volume) */}
        </div>
      </div>
    </>
  );
}