import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './authContext';
import type { AuthState } from './types';
import { keycloak } from './keycloak';

const REFRESH_INTERVAL_MS = 25_000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | undefined>();
  const [profile, setProfile] = useState<Keycloak.KeycloakProfile | undefined>();
  const [roles, setRoles] = useState<string[]>([]);

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
          const realmRoles = keycloak.realmAccess?.roles ?? [];
          const clientRoles = keycloak.resourceAccess?.['nest-client']?.roles ?? [];
          const allRoles = [...realmRoles, ...clientRoles];
          setRoles(allRoles);

          interval = window.setInterval(async () => {
            const ok = await keycloak.updateToken(30).catch(() => false);
            if (ok && keycloak.token) setToken(keycloak.token);
          }, REFRESH_INTERVAL_MS);
        }
      } catch (err) {
        console.error('AuthProvider.bootstrap error', err);
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
    () => {
      const isAdmin = roles.includes('admin');
      return {
        isAuthenticated,
        token,
        profile,
        roles,
        isAdmin,
        loading,
        login: (redirectTo) => {
          const fullRedirect = redirectTo ? `${window.location.origin}${redirectTo}` : window.location.href;
          return keycloak
            .login({ redirectUri: fullRedirect })
            .catch((err) => console.error('AuthProvider.login error', err));
        },
        logout: () =>
          keycloak.logout({
            redirectUri: window.location.origin,
          }),
      };
    },
    [isAuthenticated, token, profile, roles, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
