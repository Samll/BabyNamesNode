import { useQuery } from '@tanstack/react-query';
import { roundsApi } from '../services/api';
import { useNameStore } from '../store/useNameStore';

export function useCurrentRound() {
  const addRoundResult = useNameStore((state) => state.addRoundResult);
  return useQuery({
    queryKey: ['roundSummary'],
    queryFn: roundsApi.fetchSummary,
    onSuccess: (result) => {
      addRoundResult(result);
    }
  });
}

export function useRoundHistory() {
  const setRounds = useNameStore((state) => state.setRecentRounds);
  return useQuery({
    queryKey: ['roundHistory'],
    queryFn: roundsApi.fetchHistory,
    onSuccess: (rounds) => setRounds(rounds)
  });
}
