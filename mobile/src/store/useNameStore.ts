import { create } from 'zustand';
import { BabyName, RoundResult } from '../types';

type NameStore = {
  pendingNames: BabyName[];
  superMatchesRemaining: number;
  recentRounds: RoundResult[];
  setPendingNames: (names: BabyName[], superMatchesRemaining: number) => void;
  consumePendingName: () => BabyName | undefined;
  setRecentRounds: (rounds: RoundResult[]) => void;
  addRoundResult: (result: RoundResult) => void;
  reset: () => void;
};

const initialState: Pick<NameStore, 'pendingNames' | 'superMatchesRemaining' | 'recentRounds'> = {
  pendingNames: [],
  superMatchesRemaining: 0,
  recentRounds: []
};

export const useNameStore = create<NameStore>((set, get) => ({
  ...initialState,
  setPendingNames: (names, superMatchesRemaining) =>
    set({ pendingNames: [...names], superMatchesRemaining }),
  consumePendingName: () => {
    const [current, ...rest] = get().pendingNames;
    set({ pendingNames: rest });
    return current;
  },
  setRecentRounds: (rounds) => set({ recentRounds: [...rounds] }),
  addRoundResult: (result) => set({ recentRounds: [result, ...get().recentRounds] }),
  reset: () => set(initialState)
}));
