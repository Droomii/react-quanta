import { useEffect, useState } from 'react';
import {Quantum, SubscribableQuantum} from './Quantum';

export const useCollider = <T>(collider: () => T, deps: Quantum[]) => {
  const [state, setState] = useState<T>(collider());

  useEffect(() => {
    const setter = () => setState(collider());
    deps.forEach((v) => (v as SubscribableQuantum<T>).subscribe(setter));

    return () => {
      deps.forEach((v) => (v as SubscribableQuantum<T>).unsubscribe(setter));
    };
  }, []);

  return state;
};
