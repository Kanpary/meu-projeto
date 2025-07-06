import { useQuery } from "@tanstack/react-query";

interface StatisticsProps {
  gameId?: number;
}

interface SignalStats {
  totalSignals: number;
  winRate: number;
  wins: number;
  losses: number;
}

export default function Statistics({ gameId }: StatisticsProps) {
  const { data: stats } = useQuery<SignalStats>({
    queryKey: ["/api/signals/stats", { gameId }],
    refetchInterval: 30000,
  });

  return (
    <div className="casino-bg rounded-2xl p-6">
      <h4 className="text-fortune-gold font-bold mb-4">Estatísticas</h4>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Taxa de Acerto</span>
          <span className="text-fortune-green-light font-semibold">
            {stats?.winRate || 0}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Sinais Hoje</span>
          <span className="text-fortune-gold font-semibold">
            {stats?.totalSignals || 0}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Wins/Losses</span>
          <span className="text-fortune-green-light font-semibold">
            {stats?.wins || 0}/{stats?.losses || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
