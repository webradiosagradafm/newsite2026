import Player from "./components/Player";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-white/10">
        <h1 className="text-lg font-semibold">Praise FM USA</h1>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center text-white/60">
        Loading radio experience…
      </main>

      {/* Player */}
      <Player />
    </div>
  );
}
