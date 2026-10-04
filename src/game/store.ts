import { useSyncExternalStore } from "react";
import type { SectionId } from "@/data/portfolio";

type State = { open: SectionId | null; locked: boolean; hitTick: number; shots: number };
let state: State = { open: null, locked: false, hitTick: 0, shots: 0 };
const subs = new Set<() => void>();

export const game = {
  get: () => state,
  set: (p: Partial<State>) => {
    state = { ...state, ...p };
    subs.forEach((f) => f());
  },
  subscribe: (f: () => void) => {
    subs.add(f);
    return () => subs.delete(f);
  },
};

export function useGame<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(game.subscribe, () => sel(state), () => sel(state));
}
