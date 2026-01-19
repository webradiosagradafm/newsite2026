import React from 'react';
import { useNavigate } from 'react-router-dom';

// Se o seu App.tsx providencia o áudio via Contexto ou Props, 
// aqui vamos simular a função de play para simplificar.
// Se você quiser usar o player global, precisaremos de um Contexto.

const AppHomePage: React.FC = () => {
  const navigate = useNavigate();

  // Função para dar Play (Usando a mesma lógica do seu App.tsx)
  const handlePlayLive = () => {
    // Busca o elemento de áudio que o App.tsx criou globalmente ou cria um novo
    let audio = document.querySelector('audio');
    if (audio) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    } else {
      // Caso o áudio ainda não exista
      const newAudio = new Audio('https://stream.zeno.fm/hvwifp8ezc6tv');
      newAudio.play();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-x-hidden">
      
      {/* 1. HEADER (Espaçamento para Mobile) */}
      <header className="flex justify-between items-center p-6 pt-12">
        <div className="flex gap-2">
          <span className="bg-[#ff6600] w-8 h-8 flex items-center justify-center rounded font-black text-sm">P</span>
          <span className="bg-[#ff6600] w-8 h-8 flex items-center justify-center rounded font-black text-sm">F</span>
          <span className="bg-[#ff6600] w-8 h-8 flex items-center justify-center rounded font-black text-sm">M</span>
        </div>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold border-2 border-white/20">R</div>
      </header>

      {/* 2. CARROSSEL EM ARCO (O segredo do visual BBC) */}
      <section className="relative mt-4 mb-8">
        <div className="flex items-center justify-center gap-2 px-4 h-64">
          
          {/* Estação Lateral Esquerda */}
          <div className="opacity-30 scale-75 transform -translate-x-4 grayscale transition-all duration-500">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20">
              <img src="https://res.cloudinary.com/dtecypmsh/image/upload/v1766882822/Praise_FM_Worship_ypenw8.png" className="object-cover w-full h-full" alt="Worship" />
            </div>
            <p className="text-[10px] text-center mt-2 font-medium">Worship</p>
          </div>

          {/* ITEM CENTRAL (LIVE - O que você quer que toque) */}
          <div 
            onClick={handlePlayLive}
            className="relative z-10 scale-125 transform -translate-y-4 transition-all duration-500 cursor-pointer group"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#ff6600] shadow-[0_10px_30px_rgba(255,102,0,0.3)] group-active:scale-95 transition-transform">
              <img src="https://res.cloudinary.com/dtecypmsh/image/upload/v1766882821/Michael_Ray_u4bkfd.png" className="object-cover w-full h-full" alt="Michael Ray" />
            </div>
            
            {/* Badge LIVE */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-3 py-0.5 rounded-sm tracking-tighter">
              LIVE
            </div>

            <div className="text-center mt-6">
              <h2 className="text-xl font-black tracking-tight">Midday Grace</h2>
              <p className="text-xs text-gray-400 font-medium">with Michael Ray</p>
            </div>
          </div>

          {/* Estação Lateral Direita */}
          <div className="opacity-30 scale-75 transform translate-x-4 grayscale transition-all duration-500">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20">
              <img src="https://res.cloudinary.com/dtecypmsh/image/upload/v1766882822/Praise_FM_Non_Stop_ipfman.png" className="object-cover w-full h-full" alt="Non Stop" />
            </div>
            <p className="text-[10px] text-center mt-2 font-medium">Non Stop</p>
          </div>

        </div>
      </section>

      {/* 3. TÍTULO PRINCIPAL E BOTÃO */}
      <div className="px-8 text-center mt-4">
        <h1 className="text-3xl font-black mb-6 leading-tight">Praise FM United States</h1>
        
        <button 
          onClick={() => navigate('/schedule')}
          className="w-full py-3.5 border border-white/30 rounded-lg flex justify-between items-center px-6 font-bold hover:bg-white/5 transition-colors"
        >
          Stations & schedules 
          <span className="text-[#ff6600] text-2xl leading-none">›</span>
        </button>
      </div>

      {/* 4. RECENTLY PLAYED (Simulado para o visual) */}
      <div className="mt-12 px-8">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-xl font-bold">Recently Played</h3>
          <span className="text-gray-400 text-sm">View all</span>
        </div>
        
        <div className="bg-[#1a1a1a] rounded-xl p-4 flex items-center gap-4">
          <div className="w-16 h-16 bg-[#333] rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
          </div>
          <div className="flex-grow">
            <p className="font-bold text-sm">Morning Worship</p>
            <p className="text-xs text-gray-500">Contemporary Christian</p>
            <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
               <div className="bg-[#ff6600] w-1/3 h-full"></div>
            </div>
          </div>
          <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center">
             <div className="ml-1 w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent"></div>
          </div>
        </div>
      </div>

      {/* 5. TAB BAR (Igual ao seu print) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0c0c0c] border-t border-white/10 flex justify-around p-3 pb-6">
        <div className="flex flex-col items-center text-[#ff6600]" onClick={() => navigate('/')}>
          <span className="text-xl">🏠</span>
          <span className="text-[10px] mt-1">Home</span>
        </div>
        <div className="flex flex-col items-center text-gray-500" onClick={() => navigate('/music')}>
          <span className="text-xl">♫</span>
          <span className="text-[10px] mt-1">Music</span>
        </div>
        <div className="flex flex-col items-center text-gray-500" onClick={() => navigate('/schedule')}>
          <span className="text-xl">📅</span>
          <span className="text-[10px] mt-1">Schedule</span>
        </div>
        <div className="flex flex-col items-center text-gray-500" onClick={() => navigate('/my-sounds')}>
          <span className="text-xl">👤</span>
          <span className="text-[10px] mt-1">My Sounds</span>
        </div>
        <div className="flex flex-col items-center text-gray-500">
          <span className="text-xl">🔍</span>
          <span className="text-[10px] mt-1">Search</span>
        </div>
      </nav>

    </div>
  );
};

export default AppHomePage;