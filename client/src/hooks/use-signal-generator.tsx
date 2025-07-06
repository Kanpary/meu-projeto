import { useMemo } from "react";
import type { Signal } from "@shared/schema";

export function useSignalGenerator(signal: Signal | null) {
  const signalData = useMemo(() => {
    if (!signal) {
      return {
        signalStrength: 'AGUARDANDO',
        strengthColor: 'text-gray-400',
        strengthBars: [false, false, false, false, false],
      };
    }

    const strengthColors = {
      'FRACO': 'text-red-400',
      'MÉDIO': 'text-yellow-400',
      'FORTE': 'text-fortune-green-light',
      'MUITO FORTE': 'text-fortune-gold',
    };

    const strengthLevels = {
      'FRACO': 1,
      'MÉDIO': 2,
      'FORTE': 3,
      'MUITO FORTE': 4,
    };

    const level = strengthLevels[signal.strength as keyof typeof strengthLevels] || 0;
    const bars = Array(5).fill(false).map((_, index) => index < level);

    return {
      signalStrength: signal.strength,
      strengthColor: strengthColors[signal.strength as keyof typeof strengthColors] || 'text-gray-400',
      strengthBars: bars,
    };
  }, [signal]);

  return signalData;
}
