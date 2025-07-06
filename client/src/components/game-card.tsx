import { cn } from "@/lib/utils";
import type { Game } from "@shared/schema";

interface GameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
}

export default function GameCard({ game, onSelect }: GameCardProps) {
  const getBadgeColorClass = (color: string) => {
    switch (color) {
      case 'fortune-green':
        return 'bg-fortune-green bg-opacity-20 text-fortune-green-light';
      case 'amber':
        return 'bg-amber-500 bg-opacity-20 text-amber-400';
      case 'blue':
        return 'bg-blue-500 bg-opacity-20 text-blue-400';
      case 'red':
        return 'bg-red-500 bg-opacity-20 text-red-400';
      case 'purple':
        return 'bg-purple-500 bg-opacity-20 text-purple-400';
      case 'orange':
        return 'bg-orange-500 bg-opacity-20 text-orange-400';
      case 'green':
        return 'bg-green-500 bg-opacity-20 text-green-400';
      case 'pink':
        return 'bg-pink-500 bg-opacity-20 text-pink-400';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  };

  return (
    <div
      className={cn(
        "gradient-casino rounded-2xl p-6 border border-fortune-gold border-opacity-20",
        "hover:border-fortune-gold hover:border-opacity-50 transition-all duration-300",
        "cursor-pointer group hover:animate-glow"
      )}
      onClick={() => onSelect(game)}
    >
      <div className="text-center">
        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {game.emoji}
        </div>
        <h3 className="text-xl font-bold text-fortune-gold mb-2">
          {game.displayName}
        </h3>
        <p className="text-gray-400 text-sm mb-2">{game.description}</p>
        <p className="text-fortune-green-light text-xs font-semibold mb-3">
          {game.provider}
        </p>
        <div className="space-y-2">
          <div className={cn(
            "px-3 py-1 rounded-full text-xs",
            getBadgeColorClass(game.badgeColor)
          )}>
            {game.badgeText}
          </div>
          <div className="bg-fortune-green bg-opacity-20 px-3 py-1 rounded-full text-xs border border-fortune-green border-opacity-30">
            <span className="text-fortune-green-light font-bold">
              {game.assertivenessLevel}% Assertivo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
