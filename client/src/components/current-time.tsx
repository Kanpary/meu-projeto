import { useState, useEffect } from "react";

export default function CurrentTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if current time is in profitable hours
  const isInProfitableHours = (time: Date) => {
    const hour = time.getHours();
    const minute = time.getMinutes();
    const currentMinutes = hour * 60 + minute;
    
    const profitableSlots = [
      { start: 6 * 60, end: 8 * 60 + 30 }, // 06:00 - 08:30
      { start: 10 * 60 + 15, end: 12 * 60 + 45 }, // 10:15 - 12:45
      { start: 14 * 60 + 30, end: 16 * 60 }, // 14:30 - 16:00
      { start: 18 * 60 + 45, end: 20 * 60 + 30 }, // 18:45 - 20:30
      { start: 21 * 60 + 15, end: 23 * 60 + 45 }, // 21:15 - 23:45
    ];

    return profitableSlots.some(slot => 
      currentMinutes >= slot.start && currentMinutes <= slot.end
    );
  };

  const isProfitable = isInProfitableHours(currentTime);

  return (
    <div className="casino-bg rounded-2xl p-6 text-center">
      <h4 className="text-fortune-gold font-bold mb-4">Horário Atual</h4>
      
      <div className="mb-4">
        <div className="text-4xl font-bold text-fortune-green-light mb-2">
          {formatTime(currentTime)}
        </div>
        <div className="text-gray-400 text-sm">
          {formatDate(currentTime)}
        </div>
      </div>

      <div className={`p-3 rounded-xl border ${
        isProfitable 
          ? 'bg-green-900 bg-opacity-30 border-green-500 border-opacity-50' 
          : 'bg-gray-900 bg-opacity-30 border-gray-500 border-opacity-50'
      }`}>
        <div className="flex items-center justify-center">
          <div className="text-2xl mr-2">
            {isProfitable ? '🟢' : '🔴'}
          </div>
          <div>
            <p className={`font-semibold ${
              isProfitable ? 'text-green-400' : 'text-gray-400'
            }`}>
              {isProfitable ? 'Horário Pagante' : 'Fora do Horário Pagante'}
            </p>
            <p className="text-xs text-gray-500">
              {isProfitable ? 'Momento ideal para jogar' : 'Aguarde o próximo período'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}