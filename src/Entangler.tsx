// Created by kdw0601 on 2023-06-01
import React, {memo, useEffect, useState} from 'react';
import {Quantum, SubscribableQuantum} from './Quantum';
import {arraysEqual} from "./array";

interface Props<T> {
  watch: Quantum<T> | Quantum<T>[];
  children: () => JSX.Element;
}

const entanglerComponent = <T,>({ watch, children }: Props<T>) => {
  const [, setRenderFlag] = useState({});

  useEffect(() => {
    const watchlist = Array.isArray(watch) ? watch : [watch];
    const rerender = () => {
      setRenderFlag({});
    }

    watchlist.forEach((q) => {
      (q as SubscribableQuantum<T>).subscribe(rerender);
    });

    return () => {
      watchlist.forEach((q) => {
        (q as SubscribableQuantum<T>).unsubscribe(rerender);
      });
    };
  }, [watch]);

  return <>{children()}</>;
};

export const Entangler = memo(entanglerComponent, (before, after) => {
  const beforeWatchlist = (Array.isArray(before.watch) ? before.watch : [before.watch]);
  const afterWatchlist = (Array.isArray(after.watch) ? after.watch : [after.watch]);
  return arraysEqual(beforeWatchlist, afterWatchlist);
});