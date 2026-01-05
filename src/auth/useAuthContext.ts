import { useContext } from 'react';
import { AuthContext } from './authContext';
import type { AuthState } from './types';

// Export the hook that consumes the centralized AuthContext.
export function useAuthContext() {
    const ctx = useContext(AuthContext as React.Context<AuthState | undefined>);
    if (!ctx)
        throw new Error(
            'useAuthContext muss innerhalb des AuthProviders verwendet werden',
        );
    return ctx as AuthState;
}
