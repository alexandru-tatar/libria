import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { keycloak } from './keycloak';

type AuthState = {
  isAuthenticated: boolean;
  token?: string;
  profile?: Keycloak.KeycloakProfile;
  login: (redirectTo?: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthState | undefined>(undefined);
const REFRESH_INTERVAL_MS = 25_000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | undefined>();
  const [profile, setProfile] = useState<Keycloak.KeycloakProfile | undefined>();

  useEffect(() => {
    let interval: number | undefined;

    const bootstrap = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          pkceMethod: 'S256',
          silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        });
        setIsAuthenticated(authenticated);
        if (authenticated) {
          setToken(keycloak.token);
          setProfile(await keycloak.loadUserProfile());
          interval = window.setInterval(async () => {
            const ok = await keycloak.updateToken(30).catch(() => false);
            if (ok && keycloak.token) setToken(keycloak.token);
          }, REFRESH_INTERVAL_MS);
        }
      } finally {
        setLoading(false);
      }
    };

    bootstrap();

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      isAuthenticated,
      token,
      profile,
      loading,
      login: (redirectTo) =>
        keycloak.login({
          redirectUri: redirectTo
            ? `${window.location.origin}${redirectTo}`
            : window.location.href,
        }),
      logout: () =>
        keycloak.logout({
          redirectUri: window.location.origin,
        }),
    }),
    [isAuthenticated, token, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
