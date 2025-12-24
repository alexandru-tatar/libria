export type AuthState = {
    isAuthenticated: boolean;
    token?: string;
    profile?: Keycloak.KeycloakProfile;
    roles: string[];
    login: (
        username: string,
        password: string,
        redirectTo?: string,
    ) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
    isAdmin: boolean;
};
