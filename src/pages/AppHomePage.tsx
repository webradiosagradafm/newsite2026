import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

const AppHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  const stations = [
    { name: 'Worship', host: 'Praise FM', img: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882822/Praise_FM_Worship_ypenw8.png' },
    { name: 'Midday Grace', host: 'Michael Ray', img: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882821/Michael_Ray_u4bkfd.png', live: true },
    { name: 'Non Stop', host: 'Praise FM', img: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882822/Praise_FM_Non_Stop_ipfman.png' },
    { name: 'Morning Show', host: 'Sarah Jordan', img: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882821/Sarah_Jordan_uecxmi.png' }
  ];

  const handleTogglePlay = () => {
    const audio = document.querySelector('audio');
    if (audio) {
      if (isPlaying) { audio.pause(); } else { audio.play(); }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-x-hidden font-sans">
      
      {/* HEADER COM NOVO LOGO SVG */}
      <header className="flex justify-between items-center p-6 pt-14">
        <img 
          src="https://res.cloudinary.com/dtecypmsh/image/upload/v1766869698/SVGUSA_lduiui.webp" 
          alt="Praise FM USA" 
          className="h-10 w-auto drop-shadow-[0_2px_4px_rgba(255,102,0,0.5)]"
        />
        <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center font-bold border border-white/20 shadow-lg">R</div>
      </header>

      {/* CARROSSEL EM ARCO - ÍCONES ESTILO SVG */}
      <section className="mt-4 mb-4 relative">
        <Swiper
          modules={[EffectCoverflow]}
          effect={'coverflow'}
          centeredSlides={true}
          slidesPerView={2}
          initialSlide={1}
          coverflowEffect={{
            rotate: 0,
            stretch: 10,
            depth: 150,
            modifier: 2,
            slideShadows: false,
          }}
          className="h-80"
        >
          {stations.map((s, i) => (
            <SwiperSlide key={i} className="flex flex-col items-center">
              {({ isActive }: { isActive: boolean }) => (
                <div 
                  onClick={s.live && isActive ? handleTogglePlay : undefined}
                  className={`relative transition-all duration-700 ${isActive ? 'scale-110 -translate-y-4' : 'scale-75 opacity-30 grayscale'}`}
                >
                  {/* Moldura de vidro do ícone */}
                  <div className={`relative p-1 rounded-full bg-gradient-to-tr from-white/20 to-transparent shadow-2xl`}>
                    <div className={`rounded-full overflow-hidden border-[4px] ${isActive && s.live ? 'border-[#ff6600]' : 'border-white/10'}`}
                         style={{ width: isActive ? '170px' : '130px', height: isActive ? '170px' : '130px' }}>
                      <img src={s.img} className="object-cover w-full h-full" alt={s.name} />
                    </div>
                    
                    {/* Badge LIVE estilo BBC */}
                    {s.live && isActive && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-4 py-1 rounded shadow-xl">
                        {isPlaying ? 'ON AIR' : 'LIVE'}
                      </div>
                    )}
                  </div>

                  {/* Legenda Ativa */}
                  {isActive && (
                    <div className="text-center mt-8 animate-[fadeIn_0.5s_ease-out]">
                      <h2 className="text-2xl font-black tracking-tighter italic uppercase">{s.name}</h2>
                      <p className="text-[#ff6600] text-[10px] font-black tracking-[0.2em] uppercase">{s.host}</p>
                    </div>
                  )}
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* BOTÃO PRINCIPAL */}
      <div className="px-8 mb-10">
        <button 
          onClick={() => navigate('/schedule')}
          className="w-full py-4 bg-[#111] border border-white/10 rounded-2xl flex justify-between items-center px-6 group active:scale-95 transition-all"
        >
          <span className="font-bold text-gray-200">Stations & schedules</span>
          <span className="text-[#ff6600] text-3xl font-light">›</span>
        </button>
      </div>

      {/* RECENTLY PLAYED ESTILO CARD */}
      <div className="px-8 pb-32">
        <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Recently Played</h3>
        <div className="bg-gradient-to-r from-[#111] to-black border border-white/5 rounded-3xl p-5 flex items-center gap-5">
          <div className="w-16 h-16 bg-[#222] rounded-2xl flex items-center justify-center shadow-inner">
            <span className="text-3xl">🎵</span>
          </div>
          <div className="flex-grow">
            <p className="text-sm font-black text-white">Morning Worship</p>
            <p className="text-[10px] text-praise-accent font-bold uppercase">Praise FM USA</p>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center group-active:bg-white transition-all">
            <div className="ml-1 w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent"></div>
          </div>
        </div>
      </div>

      {/* NAV BAR INFERIOR (FIXA) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 flex justify-around pt-4 pb-10 z-50">
        <TabItem icon="🏠" label="Home" active onClick={() => navigate('/')} />
        <TabItem icon="♫" label="Music" onClick={() => navigate('/music')} />
        <TabItem icon="📅" label="Schedule" onClick={() => navigate('/schedule')} />
        <TabItem icon="👤" label="My Sounds" onClick={() => navigate('/my-sounds')} />
      </nav>
    </div>
  );
};

const TabItem = ({ icon, label, active = false, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center ${active ? 'text-[#ff6600]' : 'text-gray-500'}`}>
    <span className="text-2xl mb-1">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);

export default AppHomePage;