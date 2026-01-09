import { useState } from 'react';
import type { BuchDTO } from '../types/book';
import { api } from '../api/axios';
import { buildErrorMessage, buildSuccessMessage } from './bookMessages';

export function useBookCreate() {
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const createBook = async (payload: BuchDTO): Promise<boolean> => {
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await api.post('/', payload);
      setSuccessMsg(buildSuccessMessage(payload, 'angelegt'));
      return true;
    } catch (err) {
      setErrorMsg(buildErrorMessage(err, 'Anlegen'));
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { createBook, submitting, successMsg, errorMsg };
}
