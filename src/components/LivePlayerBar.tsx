// LivePlayerBar.tsx
interface LivePlayerBarProps {
  isVisible: boolean; // Adicione ao seu Interface
  isPlaying: boolean;
  onTogglePlayback: () => void;
  program: any;
  // ... outras props
}

export default function LivePlayerBar({ isVisible, isPlaying, onTogglePlayback, program, queue, liveMetadata, audioRef }: LivePlayerBarProps) {
  
  // SE NÃO FOR ATIVO, O MINI PLAYER NÃO APARECE NA TELA
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] animate-in slide-in-from-bottom-full duration-500">
      {/* Todo o design da barra aqui (o código que te enviei antes) */}
      {/* Note que o Daniel Brooks virá automaticamente da prop 'program' */}
      {/* pois o App.tsx já calcula o programa atual de Chicago! */}
    </div>
  );
}