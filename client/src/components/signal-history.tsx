import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Signal } from "@shared/schema";

interface SignalHistoryProps {
  signals?: Signal[];
}

export default function SignalHistory({ signals = [] }: SignalHistoryProps) {
  return (
    <div className="casino-bg rounded-2xl p-6">
      <h4 className="text-fortune-gold font-bold mb-4">Últimos Sinais</h4>
      <div className="space-y-3">
        {signals.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Nenhum sinal ainda</p>
        ) : (
          signals.map((signal) => (
            <div
              key={signal.id}
              className="flex items-center justify-between p-3 casino-bg-gray rounded-xl"
            >
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    signal.result === 'WIN'
                      ? 'bg-fortune-green'
                      : signal.result === 'LOSS'
                      ? 'bg-red-500'
                      : 'bg-gray-400'
                  }`}
                />
                <span className="text-sm">
                  {format(new Date(signal.createdAt), 'HH:mm', { locale: ptBR })}
                </span>
              </div>
              <span
                className={`text-sm font-semibold ${
                  signal.result === 'WIN'
                    ? 'text-fortune-green-light'
                    : signal.result === 'LOSS'
                    ? 'text-red-400'
                    : 'text-gray-400'
                }`}
              >
                {signal.result || 'PENDENTE'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
