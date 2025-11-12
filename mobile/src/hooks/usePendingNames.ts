import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { namesApi } from '../services/api';
import { useNameStore } from '../store/useNameStore';

export function usePendingNames() {
  const queryClient = useQueryClient();
  const pendingNames = useNameStore((state) => state.pendingNames);
  const setPendingNames = useNameStore((state) => state.setPendingNames);
  const consumePendingName = useNameStore((state) => state.consumePendingName);
  const superMatchesRemaining = useNameStore((state) => state.superMatchesRemaining);

  const { isLoading, isError, refetch } = useQuery({
    queryKey: ['pendingNames'],
    queryFn: namesApi.fetchPending,
    onSuccess: (payload) => {
      setPendingNames(payload.names, payload.superMatchesRemaining);
    }
  });

  const voteMutation = useMutation({
    mutationFn: ({
      nameId,
      vote
    }: {
      nameId: string;
      vote: 'like' | 'dislike' | 'supermatch';
    }) => namesApi.vote(nameId, vote),
    onSuccess: ({ remaining }) => {
      setPendingNames(useNameStore.getState().pendingNames, remaining);
      queryClient.invalidateQueries({ queryKey: ['roundSummary'] });
      queryClient.invalidateQueries({ queryKey: ['matchedNames'] });
    }
  });

  const currentName = pendingNames[0];

  return {
    currentName,
    isLoading,
    isError,
    refetch,
    superMatchesRemaining,
    next: consumePendingName,
    vote: voteMutation.mutateAsync,
    voteStatus: voteMutation.status
  };
}
