import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './authContext';
import type { AuthState } from './types';
import { clearAccessToken, setAccessToken } from './tokenStore';

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in?: number;
};

const STORAGE_KEY = 'libria.auth';
const KEYCLOAK_BASE = import.meta.env.VITE_KEYCLOAK_URL;
const REALM = import.meta.env.VITE_KEYCLOAK_REALM;
const CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET;
const OPENID_SCOPE = 'openid profile email';

const TOKEN_URL = `${KEYCLOAK_BASE}/realms/${REALM}/protocol/openid-connect/token`;
const USERINFO_URL = `${KEYCLOAK_BASE}/realms/${REALM}/protocol/openid-connect/userinfo`;
const LOGOUT_URL = `${KEYCLOAK_BASE}/realms/${REALM}/protocol/openid-connect/logout`;

type StoredAuth = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  profile?: Keycloak.KeycloakProfile;
  roles: string[];
};

const decodeJwtPayload = (token?: string): any | null => {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, '=');
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const extractRoles = (token?: string): string[] => {
  const payload = decodeJwtPayload(token);
  if (!payload) return [];
  const realmRoles = payload.realm_access?.roles ?? [];
  const clientRoles = payload.resource_access?.[CLIENT_ID]?.roles ?? [];
  return Array.from(new Set([...(realmRoles || []), ...(clientRoles || [])]));
};

async function requestToken(body: URLSearchParams): Promise<TokenResponse> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(errText || 'Authentifizierung fehlgeschlagen');
  }

  return res.json() as Promise<TokenResponse>;
}

async function fetchUserProfile(accessToken: string): Promise<Keycloak.KeycloakProfile> {
  const res = await fetch(USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(errText || 'Profil konnte nicht geladen werden');
  }

  const data = await res.json();
  return {
    id: data.sub,
    username: data.preferred_username ?? data.username,
    email: data.email,
    firstName: data.given_name ?? data.name,
    lastName: data.family_name,
  };
}

function readStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

function persistAuth(value: StoredAuth | null) {
  if (!value) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | undefined>();
  const [refreshToken, setRefreshToken] = useState<string | undefined>();
  const [profile, setProfile] = useState<Keycloak.KeycloakProfile | undefined>();
  const [roles, setRoles] = useState<string[]>([]);
  const profileRef = useRef<Keycloak.KeycloakProfile | undefined>();
  const refreshSessionRef = useRef<(refreshTok?: string) => Promise<boolean>>(async () => false);
  const refreshTimeout = useRef<number>();

  const clearSession = useCallback(() => {
    if (refreshTimeout.current) window.clearTimeout(refreshTimeout.current);
    setToken(undefined);
    setRefreshToken(undefined);
    setAccessToken(undefined);
    clearAccessToken();
    setProfile(undefined);
    profileRef.current = undefined;
    setRoles([]);
    setIsAuthenticated(false);
    persistAuth(null);
  }, []);

  const scheduleRefresh = useCallback((expiresInSeconds: number, refreshTok: string) => {
    const ms = Math.max((expiresInSeconds - 30) * 1000, 5_000);
    if (refreshTimeout.current) window.clearTimeout(refreshTimeout.current);
    refreshTimeout.current = window.setTimeout(() => void refreshSessionRef.current(refreshTok), ms);
  }, []);

  const applySession = useCallback(
    (tokenResponse: TokenResponse, nextProfile?: Keycloak.KeycloakProfile, skipSchedule?: boolean) => {
      const accessToken = tokenResponse.access_token;
      const rolesFromToken = extractRoles(accessToken);

      setToken(accessToken);
      setRefreshToken(tokenResponse.refresh_token);
      setAccessToken(accessToken);
      setProfile(nextProfile);
      profileRef.current = nextProfile;
      setRoles(rolesFromToken);
      setIsAuthenticated(true);

      const expiresAt = Date.now() + (tokenResponse.expires_in ?? 0) * 1000;
      persistAuth({
        accessToken,
        refreshToken: tokenResponse.refresh_token,
        expiresAt,
        profile: nextProfile,
        roles: rolesFromToken,
      });

      if (!skipSchedule) scheduleRefresh(tokenResponse.expires_in, tokenResponse.refresh_token);
    },
    [scheduleRefresh],
  );

  const refreshSession = useCallback(
    async (refreshTok?: string) => {
      if (!refreshTok) {
        clearSession();
        return false;
      }

      try {
        const params = new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshTok,
          client_id: CLIENT_ID,
        });
        if (CLIENT_SECRET) params.append('client_secret', CLIENT_SECRET);

        const tokenResponse = await requestToken(params);
        const nextProfile =
          profileRef.current ??
          (tokenResponse.access_token ? await fetchUserProfile(tokenResponse.access_token) : undefined);
        applySession(tokenResponse, nextProfile);
        return true;
      } catch (err) {
        console.error('AuthProvider.refreshSession error', err);
        clearSession();
        return false;
      }
    },
    [applySession, clearSession],
  );

  useEffect(() => {
    refreshSessionRef.current = refreshSession;
  }, [refreshSession]);

  useEffect(() => {
    const bootstrap = async () => {
      const stored = readStoredAuth();
      if (stored?.refreshToken) {
        setAccessToken(stored.accessToken);
        setRoles(stored.roles ?? []);
        setProfile(stored.profile);
        profileRef.current = stored.profile;

        const remainingMs = stored.expiresAt - Date.now();
        if (stored.accessToken && remainingMs > 30_000) {
          setToken(stored.accessToken);
          setRefreshToken(stored.refreshToken);
          setIsAuthenticated(true);
          const expiresInSeconds = Math.floor(remainingMs / 1000);
          if (expiresInSeconds > 0) {
            if (refreshTimeout.current) window.clearTimeout(refreshTimeout.current);
            refreshTimeout.current = window.setTimeout(
              () => void refreshSession(stored.refreshToken),
              Math.max((expiresInSeconds - 30) * 1000, 5_000),
            );
          }
        } else {
          await refreshSession(stored.refreshToken);
        }
      }
      setLoading(false);
    };

    bootstrap();

    return () => {
      if (refreshTimeout.current) window.clearTimeout(refreshTimeout.current);
    };
  }, [refreshSession]);

  const login = useCallback(
    async (username: string, password: string, _redirectTo?: string) => {
      const params = new URLSearchParams({
        grant_type: 'password',
        client_id: CLIENT_ID,
        username,
        password,
        scope: OPENID_SCOPE,
      });
      if (CLIENT_SECRET) params.append('client_secret', CLIENT_SECRET);

      const tokenResponse = await requestToken(params);
      const userProfile = await fetchUserProfile(tokenResponse.access_token);
      applySession(tokenResponse, userProfile);
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
      });
      if (CLIENT_SECRET) params.append('client_secret', CLIENT_SECRET);
      if (refreshToken) params.append('refresh_token', refreshToken);

      await fetch(LOGOUT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });
    } catch (err) {
      console.error('AuthProvider.logout error', err);
    } finally {
      clearSession();
    }
  }, [clearSession, refreshToken]);

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
        login,
        logout,
      };
    },
    [isAuthenticated, token, profile, roles, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
