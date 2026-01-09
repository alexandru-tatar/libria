import { useCallback, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { api } from '../api/axios';

type DeleteState = {
  loading: boolean;
  error?: string;
  success: boolean;
};

const buildDeleteErrorMessage = (err: unknown): string => {
  if (isAxiosError(err)) {
    const status = err.response?.status;
    const payload = err.response?.data;
    const details = payload ? JSON.stringify(payload) : err.message;
    return `HTTP ${status ?? '?'}: ${details}`;
  }
  if (err instanceof Error) return err.message;
  return 'Unbekannter Fehler beim Löschen';
};

export const useBookDelete = () => {
  const [state, setState] = useState<DeleteState>({
    loading: false,
    error: undefined,
    success: false,
  });

  const requestRef = useRef(0);

  const deleteBook = useCallback((id: number): Promise<unknown | undefined> => {
    const requestId = ++requestRef.current;

    setState({ loading: true, error: undefined, success: false });

    return api
      .delete(`/${id}`)
      .then(({ data }) => {
        if (requestId !== requestRef.current) return undefined;
        setState({ loading: false, error: undefined, success: true });
        return data as unknown;
      })
      .catch((err: unknown) => {
        if (requestId !== requestRef.current) return undefined;
        setState({ loading: false, error: buildDeleteErrorMessage(err), success: false });
        return undefined; // wichtig: Promise bleibt resolved (wie vorher)
      });
  }, []);

  return { deleteBook, ...state };
};
