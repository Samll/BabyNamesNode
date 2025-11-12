import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { getAccessToken } from '../services/api';
import { onTokensCleared } from '../services/authEvents';

interface AuthContextValue {
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  setAuthenticated: (value: boolean) => void;
  refreshAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const refreshAuthStatus = useCallback(async () => {
    try {
      const token = await getAccessToken();
      setIsAuthenticated(Boolean(token));
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsBootstrapping(false);
    }
  }, []);

  useEffect(() => {
    refreshAuthStatus();
  }, [refreshAuthStatus]);

  useEffect(() => {
    const handleAppStateChange = (status: AppStateStatus) => {
      if (status === 'active') {
        refreshAuthStatus().catch(() => {
          setIsAuthenticated(false);
        });
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [refreshAuthStatus]);

  useEffect(() => {
    const unsubscribe = onTokensCleared(() => {
      setIsAuthenticated(false);
    });

    return unsubscribe;
  }, []);

  const setAuthenticated = useCallback((value: boolean) => {
    setIsAuthenticated(value);
    if (value) {
      setIsBootstrapping(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isBootstrapping,
      setAuthenticated,
      refreshAuthStatus
    }),
    [isAuthenticated, isBootstrapping, refreshAuthStatus, setAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
}
