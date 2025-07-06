import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Play, Signal as SignalIcon } from "lucide-react";
import Timer from "@/components/timer";
import SignalHistory from "@/components/signal-history";
import Statistics from "@/components/statistics";
import CurrentTime from "@/components/current-time";
import { useSignalGenerator } from "@/hooks/use-signal-generator";
import { apiRequest } from "@/lib/queryClient";
import type { Game, Signal } from "@shared/schema";

interface SignalGeneratorProps {
  game: Game;
  onBack: () => void;
}

export default function SignalGenerator({ game, onBack }: SignalGeneratorProps) {
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);
  const queryClient = useQueryClient();

  const { data: recentSignals } = useQuery<Signal[]>({
    queryKey: ["/api/signals/recent", { limit: 5 }],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const generateSignalMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/signals/generate/${game.id}`);
      return response.json();
    },
    onSuccess: (newSignal) => {
      setCurrentSignal(newSignal);
      queryClient.invalidateQueries({ queryKey: ["/api/signals/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/signals/stats"] });
    },
  });

  const { signalStrength, strengthColor, strengthBars } = useSignalGenerator(currentSignal);

  const handleGenerateSignal = () => {
    generateSignalMutation.mutate();
  };

  const feedbackMutation = useMutation({
    mutationFn: async ({ signalId, feedback }: { signalId: number, feedback: string }) => {
      const response = await apiRequest("POST", `/api/signals/${signalId}/feedback`, { feedback });
      return response.json();
    },
    onSuccess: (updatedSignal) => {
      setCurrentSignal(updatedSignal.signal);
      queryClient.invalidateQueries({ queryKey: ["/api/signals/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/signals/stats"] });
    },
  });

  const handleApplySignal = () => {
    if (currentSignal) {
      console.log("Aplicando sinal nas casas de apostas:", currentSignal);
    }
  };

  const handleFeedback = (feedback: 'FUNCIONOU' | 'NAO_FUNCIONOU') => {
    if (currentSignal) {
      feedbackMutation.mutate({ signalId: currentSignal.id, feedback });
    }
  };

  const getStrategyTip = (signal: Signal, game: Game) => {
    const strategies = {
      'PG Soft': [
        'Mantenha apostas baixas nos primeiros giros e aumente gradualmente conforme o padrão se confirma',
        'Observe os símbolos especiais - eles indicam proximidade dos bônus',
        'Use auto-spin para manter consistência no ritmo de jogo',
        'Multiplique a aposta por 2x quando a força do sinal for MUITO FORTE'
      ],
      'Fat Panda': [
        'Aguarde pelo menos 3 giros de confirmação antes de aumentar aposta',
        'Monitore os pandas dourados - são indicadores de entrada em ciclo pagante',
        'Prefira apostas médias e constantes neste provedor',
        'Ative turbo apenas em sinais de força FORTE ou superior'
      ],
      'Pragmatic Play': [
        'Foque em apostas consistentes - este provedor premia constância',
        'Observe padrões de 5-7 giros para confirmar tendências',
        'Use modo normal para sinais MÉDIOS e turbo para FORTE+',
        'Mantenha disciplina - não altere estratégia no meio do ciclo'
      ]
    };
    
    const providerStrategies = strategies[game.provider as keyof typeof strategies] || strategies['PG Soft'];
    const strategyIndex = Math.floor(signal.assertiveness / 25);
    return providerStrategies[Math.min(strategyIndex, providerStrategies.length - 1)];
  };

  const getPatternAnalysis = (signal: Signal, game: Game) => {
    const patterns = {
      'FRACO': 'Padrão inicial detectado - aguarde confirmação em próximos giros',
      'MÉDIO': 'Padrão crescente identificado - momento de entrada moderada',
      'FORTE': 'Padrão consistente confirmado - alta probabilidade de acerto',
      'MUITO FORTE': 'Padrão máximo detectado - momento ideal para entrada'
    };
    
    const timeInfo = new Date().getHours() >= 18 ? 'Prime time ativo' : 'Horário de análise';
    return `${patterns[signal.strength as keyof typeof patterns]}. ${timeInfo} - Algoritmo ${game.provider} otimizado.`;
  };

  const getOptimalTiming = (signal: Signal) => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    if (hour >= 18 && hour <= 23) {
      return `Horário nobre ativo! Momento perfeito para jogar entre ${signal.profitableTimeStart} e ${signal.profitableTimeEnd}`;
    } else if (hour >= 12 && hour <= 17) {
      return `Período da tarde - Aguarde aproximar do horário ${signal.profitableTimeStart} para melhor resultado`;
    } else {
      return `Fora do horário nobre - Considere aguardar período entre ${signal.profitableTimeStart} e ${signal.profitableTimeEnd}`;
    }
  };

  return (
    <div className="gradient-casino rounded-3xl p-4 md:p-8 border border-fortune-gold border-opacity-30">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Signal Display */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-fortune-gold hover:bg-fortune-gold hover:bg-opacity-10"
            >
              <ArrowLeft className="mr-2" size={20} />
              Voltar
            </Button>
            <div className="text-center">
              <h3 className="text-xl md:text-3xl font-bold text-fortune-gold mb-2">Gerador de Sinais</h3>
              <p className="text-gray-400 text-sm md:text-base">
                Jogo Selecionado: <span className="text-fortune-green-light font-semibold">{game.displayName}</span>
              </p>
            </div>
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>

          {/* Current Signal */}
          <div className="casino-bg rounded-2xl p-8 mb-6 text-center">
            <div className="signal-strength mb-6">
              <div className="flex justify-center items-center mb-4">
                <div className="w-24 h-24 gradient-fortune rounded-full flex items-center justify-center animate-pulse-slow">
                  <SignalIcon className="text-casino-dark text-2xl" size={32} />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-fortune-gold mb-2">Força do Sinal</h4>
              <div className="flex justify-center space-x-2 mb-4">
                {strengthBars.map((isActive, index) => (
                  <div
                    key={index}
                    className={`w-3 h-8 rounded-full ${
                      isActive ? 'bg-fortune-green' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-xl font-semibold ${strengthColor}`}>
                {signalStrength}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="casino-bg-gray rounded-xl p-4">
                <h5 className="text-fortune-gold font-semibold mb-2">Recomendação</h5>
                <p className="text-xl md:text-2xl font-bold text-fortune-green-light">
                  {currentSignal?.recommendation || 'AGUARDAR'}
                </p>
              </div>
              <div className="casino-bg-gray rounded-xl p-4">
                <h5 className="text-fortune-gold font-semibold mb-2">Confiança</h5>
                <p className="text-xl md:text-2xl font-bold text-fortune-green-light">
                  {currentSignal?.confidence || 0}%
                </p>
              </div>
              <div className="casino-bg-gray rounded-xl p-4">
                <h5 className="text-fortune-gold font-semibold mb-2">Assertividade</h5>
                <p className="text-xl md:text-2xl font-bold text-fortune-green-light">
                  {currentSignal?.assertiveness || 0}%
                </p>
              </div>
            </div>

            {/* Advanced Signal Information */}
            {currentSignal && (
              <div className="mt-6 space-y-4">
                {/* Spin Instructions */}
                <div className="casino-bg-gray rounded-xl p-4">
                  <h5 className="text-fortune-gold font-semibold mb-4">Instruções de Giros (Modo Automático)</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-900 bg-opacity-30 rounded-lg p-3 border border-blue-500 border-opacity-30">
                      <h6 className="text-blue-400 font-medium mb-2">Modo Normal</h6>
                      <p className="text-xl md:text-2xl font-bold text-white">{currentSignal.normalSpins} giros</p>
                      <p className="text-sm text-gray-300 mt-1">Modo automático ativado</p>
                    </div>
                    <div className="bg-red-900 bg-opacity-30 rounded-lg p-3 border border-red-500 border-opacity-30">
                      <h6 className="text-red-400 font-medium mb-2">Modo Turbo</h6>
                      <p className="text-xl md:text-2xl font-bold text-white">{currentSignal.turboSpins} giros</p>
                      <p className="text-sm text-gray-300 mt-1">Modo automático ativado</p>
                    </div>
                  </div>
                </div>

                {/* Profitable Time Slots */}
                <div className="casino-bg-gray rounded-xl p-4">
                  <h5 className="text-fortune-gold font-semibold mb-3">Horários Pagantes</h5>
                  <div className="bg-green-900 bg-opacity-30 rounded-lg p-3 border border-green-500 border-opacity-30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-400 font-medium">Melhor Período</p>
                        <p className="text-2xl font-bold text-white">
                          {currentSignal.profitableTimeStart} - {currentSignal.profitableTimeEnd}
                        </p>
                      </div>
                      <div className="text-4xl">⏰</div>
                    </div>
                  </div>
                </div>

                {/* Real-time Strategy Tips */}
                <div className="casino-bg-gray rounded-xl p-4">
                  <h5 className="text-fortune-gold font-semibold mb-3">Dicas e Estratégias em Tempo Real</h5>
                  <div className="space-y-3">
                    <div className="bg-cyan-900 bg-opacity-30 rounded-lg p-3 border border-cyan-500 border-opacity-30">
                      <h6 className="text-cyan-400 font-medium mb-2">💡 Estratégia Recomendada</h6>
                      <p className="text-white text-sm">
                        {getStrategyTip(currentSignal, game)}
                      </p>
                    </div>
                    <div className="bg-yellow-900 bg-opacity-30 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                      <h6 className="text-yellow-400 font-medium mb-2">🎯 Padrão Detectado</h6>
                      <p className="text-white text-sm">
                        {getPatternAnalysis(currentSignal, game)}
                      </p>
                    </div>
                    <div className="bg-green-900 bg-opacity-30 rounded-lg p-3 border border-green-500 border-opacity-30">
                      <h6 className="text-green-400 font-medium mb-2">⚡ Momento Ideal</h6>
                      <p className="text-white text-sm">
                        {getOptimalTiming(currentSignal)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Algorithm Information */}
                <div className="casino-bg-gray rounded-xl p-4">
                  <h5 className="text-fortune-gold font-semibold mb-3">Algoritmo Utilizado</h5>
                  <div className="bg-blue-900 bg-opacity-30 rounded-lg p-3 border border-blue-500 border-opacity-30">
                    <p className="text-blue-400 text-sm font-mono">{currentSignal.algorithm}</p>
                    <p className="text-gray-400 text-xs mt-1">Assertividade: {currentSignal.assertiveness}%</p>
                  </div>
                </div>

                {/* User Feedback Section */}
                <div className="casino-bg-gray rounded-xl p-4">
                  <h5 className="text-fortune-gold font-semibold mb-3">O sinal funcionou para você?</h5>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleFeedback('FUNCIONOU')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                      disabled={!!currentSignal.userFeedback}
                    >
                      ✅ Funcionou
                    </Button>
                    <Button
                      onClick={() => handleFeedback('NAO_FUNCIONOU')}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                      disabled={!!currentSignal.userFeedback}
                    >
                      ❌ Não Funcionou
                    </Button>
                  </div>
                  {currentSignal.userFeedback && (
                    <div className="mt-3 text-center">
                      <p className="text-gray-400 text-sm">
                        Feedback registrado: {currentSignal.userFeedback === 'FUNCIONOU' ? '✅ Funcionou' : '❌ Não Funcionou'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center">
            <Button
              onClick={handleGenerateSignal}
              disabled={generateSignalMutation.isPending}
              className="w-full max-w-md bg-gradient-to-r from-fortune-gold to-fortune-gold-dark hover:from-fortune-gold-dark hover:to-fortune-gold text-casino-dark font-bold py-6 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className={`mr-2 ${generateSignalMutation.isPending ? 'animate-spin' : ''}`} size={20} />
              {generateSignalMutation.isPending ? 'Gerando Sinal Assertivo...' : 'Gerar Novo Sinal Assertivo'}
            </Button>
          </div>
        </div>

        {/* Timer and Stats */}
        <div className="space-y-6">
          <CurrentTime />
          <Timer />
          <SignalHistory signals={recentSignals} />
          <Statistics gameId={game.id} />
        </div>
      </div>
    </div>
  );
}
