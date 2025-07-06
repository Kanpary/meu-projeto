import { useCountdown } from "@/hooks/use-countdown";

export default function Timer() {
  const { minutes, seconds, progress } = useCountdown(150); // 2.5 minutes

  return (
    <div className="casino-bg rounded-2xl p-6 text-center">
      <h4 className="text-fortune-gold font-bold mb-4">Próximo Sinal em</h4>
      <div className="text-4xl font-bold text-fortune-green-light mb-2">
        <span>{minutes.toString().padStart(2, '0')}</span>:
        <span>{seconds.toString().padStart(2, '0')}</span>
      </div>
      <div className="w-full bg-gray-600 rounded-full h-2 mb-4">
        <div 
          className="gradient-fortune h-2 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-gray-400 text-sm">Aguarde para melhor precisão</p>
    </div>
  );
}
