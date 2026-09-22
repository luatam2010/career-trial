/**
 * Auth hook wrapping the Internet Identity provider.
 * The provider is mounted in main.tsx; this exposes a small, page-friendly API.
 */
import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  principal: string | null;
  login: () => void;
  logout: () => void;
}

export function useAuth(): AuthState {
  const {
    identity,
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
  } = useInternetIdentity();

  return {
    isAuthenticated,
    isLoading: isInitializing || isLoggingIn,
    principal: identity ? identity.getPrincipal().toString() : null,
    login: () => login(),
    logout: () => clear(),
  };
}
