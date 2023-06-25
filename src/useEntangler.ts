import { useEffect, useState } from 'react';
import type { Quantized, Quantum, SubscribableQuantum } from './Quantum';

export const useEntangler = <T>(quantum: Quantum<T>): Quantized<T> => {
  const [, setState] = useState<T>(() => quantum.value);

  useEffect(() => {
    const q = quantum as SubscribableQuantum<T>;

    q.subscribe(setState);

    return () => {
      q.unsubscribe(setState);
    };
  }, [quantum]);

  return quantum as Quantized<T>;
};
