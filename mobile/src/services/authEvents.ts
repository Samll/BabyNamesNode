export type TokensClearedListener = () => void;

const listeners = new Set<TokensClearedListener>();

export function onTokensCleared(listener: TokensClearedListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function emitTokensCleared() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (error) {
      // Swallow listener errors to avoid interrupting other subscribers
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.warn('Auth listener error', error);
      }
    }
  });
}
