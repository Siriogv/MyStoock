"use client";
import { useEffect } from "react";

export const useEffectOnce = (effect: () => void, deps: any[] = []) => {
  useEffect(() => {
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
