import { useCallback, useState, useRef } from 'react';
import axios from 'axios';
import { api } from '../api/axios';

type DeleteState = {
  loading: boolean;
  error?: string;
  success: boolean;
};

export const useBookDelete = () => {
  const [state, setState] = useState<DeleteState>({ loading: false, error: undefined, success: false });
  const requestRef = useRef(0);

  const deleteBook = useCallback((id: number) => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;

    setState({ loading: true, error: undefined, success: false });

    return api.delete(`/${id}`).then(
      ({ data }) => {
        if (requestId !== requestRef.current) return;
        setState({ loading: false, error: undefined, success: true });
        return data;
      },
      (err) => {
        if (requestId !== requestRef.current) return;
        const message = axios.isAxiosError(err)
          ? `HTTP ${err.response?.status}: ${JSON.stringify(err.response?.data) || err.message}`
          : err instanceof Error
          ? err.message
          : 'Unbekannter Fehler beim Löschen';
        setState({ loading: false, error: message, success: false });
      }
    );
  }, []);

  return {
    deleteBook,
    ...state,
  };
};
