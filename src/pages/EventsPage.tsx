import React, { useState, useEffect } from 'react';
// 1. Importação correta da biblioteca oficial
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MapPin, Calendar, Ticket, Loader2, Search, ArrowRight, Music, Star, ExternalLink, Info, Bell, BellRing, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// 2. Inicialização (Certifique-se de que a variável de ambiente existe no seu .env.local)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export default function EventsPage() {
  const [artistName, setArtistName] = useState("");
  const [searching, setSearching] = useState(false);
  const [bio, setBio] = useState("");

  const handleSearchArtist = async () => {
    if (!artistName) return;

    setSearching(true);
    try { 
      // 3. Configuração do modelo (Gemini 1.5 Flash é o ideal para o Vite)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // 4. Chamada correta da geração de conteúdo
      const prompt = `Escreva uma biografia curta e profissional para o artista musical: ${artistName}`;
      const result = await model.generateContent(prompt);
      
      // 5. Extração do texto da resposta
      const response = await result.response;
      const text = response.text();
      
      setBio(text);
    } catch (error) {
      console.error("Erro ao buscar biografia:", error);
      setBio("Não foi possível carregar a biografia no momento.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Buscar Biografia de Artista</h1>
      <div className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          placeholder="Nome do artista..."
          className="p-2 border rounded bg-white text-black"
        />
        <button 
          onClick={handleSearchArtist}
          disabled={searching}
          className="bg-blue-600 text-white p-2 rounded flex items-center"
        >
          {searching ? <Loader2 className="animate-spin mr-2" /> : <Search className="mr-2" />}
          Buscar
        </button>
      </div>

      {bio && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="font-bold mb-2">Biografia:</h2>
          <p>{bio}</p>
        </div>
      )}
    </div>
  );
}