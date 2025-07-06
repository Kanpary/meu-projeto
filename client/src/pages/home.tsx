import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bolt, Circle } from "lucide-react";
import GameCard from "@/components/game-card";
import SignalGenerator from "@/components/signal-generator";
import type { Game } from "@shared/schema";

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen casino-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fortune-gold mx-auto mb-4"></div>
          <p className="text-fortune-gold text-lg">Carregando jogos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen casino-bg text-white">
      {/* Header */}
      <header className="gradient-casino border-b border-fortune-gold border-opacity-20">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="gradient-fortune p-2 md:p-3 rounded-full">
                <Bolt className="text-casino-dark" size={20} />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-fortune-gold to-fortune-green-light bg-clip-text text-transparent">
                  KanparySinais
                </h1>
                <p className="text-gray-400 text-xs md:text-sm">Geradores de Sinais Totalmente Assertivos</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-fortune-green bg-opacity-20 px-4 py-2 rounded-full border border-fortune-green border-opacity-30">
                <span className="text-fortune-green-light text-sm font-medium">
                  <Circle className="inline text-xs mr-2" size={8} />
                  Sistema Ativo
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!selectedGame ? (
          /* Game Selection Grid */
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl font-bold text-fortune-gold mb-4">Escolha seu Jogo</h2>
              <p className="text-gray-400 text-base md:text-lg">Selecione um dos jogos abaixo para gerar sinais assertivos</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {games?.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onSelect={setSelectedGame}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Signal Generator Interface */
          <SignalGenerator
            game={selectedGame}
            onBack={() => setSelectedGame(null)}
          />
        )}


      </main>

      {/* Footer */}
      <footer className="casino-bg-gray border-t border-fortune-gold border-opacity-20 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="gradient-fortune p-2 rounded-full mr-3">
                <Bolt className="text-casino-dark" size={16} />
              </div>
              <span className="text-fortune-gold font-bold text-xl">KanparySinais</span>
            </div>
            <p className="text-gray-400 mb-4">Sistema Avançado de Geradores de Sinais Assertivos</p>
            
            {/* Developer Credits */}
            <div className="mb-6 p-4 bg-gradient-to-r from-fortune-gold from-opacity-10 to-fortune-green to-opacity-10 rounded-xl border border-fortune-gold border-opacity-20">
              <p className="text-fortune-gold font-semibold mb-2">Desenvolvido por Kanpary</p>
              <a 
                href="https://t.me//Kanpary" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-fortune-green-light hover:text-fortune-green transition-colors"
              >
                <span className="mr-2">📱</span>
                Contato via Telegram
              </a>
            </div>
            
            <p className="text-gray-500 text-sm mt-4">© 2025 - KanparySinais. Desenvolvido por Kanpary. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
