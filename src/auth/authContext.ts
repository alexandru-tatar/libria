import { createContext } from 'react';
import type { AuthState } from './types';

// Centralized AuthContext so consumers can import it without circular require.
export const AuthContext = createContext<AuthState | undefined>(undefined);
