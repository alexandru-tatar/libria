export type AuthState = {
  isAuthenticated: boolean;
  token?: string;
  profile?: Keycloak.KeycloakProfile;
  roles: string[];
  login: (redirectTo?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};
