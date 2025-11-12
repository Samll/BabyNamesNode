import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, clearTokens } from '../services/api';
import { useNameStore } from '../store/useNameStore';
import { useAuthContext } from '../context/AuthContext';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  displayName: string;
  partnerCode?: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const resetStore = useNameStore((state) => state.reset);
  const { setAuthenticated, refreshAuthStatus } = useAuthContext();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: () => {
      setAuthenticated(true);
      void refreshAuthStatus();
      queryClient.invalidateQueries({ predicate: () => true });
    }
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: () => {
      setAuthenticated(true);
      void refreshAuthStatus();
      queryClient.invalidateQueries({ predicate: () => true });
    }
  });

  const logout = async () => {
    await clearTokens();
    resetStore();
    queryClient.clear();
    setAuthenticated(false);
  };

  return {
    login: loginMutation.mutateAsync,
    loginStatus: loginMutation.status,
    register: registerMutation.mutateAsync,
    registerStatus: registerMutation.status,
    logout
  };
}
