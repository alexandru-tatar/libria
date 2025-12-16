import { useAuthContext } from './useAuthContext';
import type { AuthState } from './types';

export const useAuth = (): AuthState => useAuthContext();
