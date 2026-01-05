import { useState } from 'react';
import type { BuchDTO } from '../types/book';
import { api } from '../api/axios';
import { isAxiosError } from 'axios';

export function useBookCreate() {
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const createBook = async (payload: BuchDTO) => {
    setSubmitting(true);
    try {
      await api.post('/', payload);
      const title = payload.titel?.titel ?? payload.isbn ?? 'Buch';
      setSuccessMsg(`${title} erfolgreich angelegt.`);
      return true;
    } catch (err) {
      const msg = isAxiosError(err)
        ? `Fehler: ${err.response?.status ?? ''} ${JSON.stringify(err.response?.data) || err.message}`
        : 'Unbekannter Fehler beim Anlegen';
      setErrorMsg(msg);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { createBook, submitting, successMsg, errorMsg };
}
