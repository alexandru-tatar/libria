import { useState } from 'react';
import type { BuchDTO } from '../types/book';
import { api } from '../api/axios';
import { isAxiosError } from 'axios';

export function useBookUpdate() {
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * Aktualisiert ein vorhandenes Buch.
   * @param id ID des Buches, das geaendert werden soll
   * @param payload Neue Daten des Buches
   * @param version Versionsnummer fuer If-Match
   * @returns true bei Erfolg, false bei Fehler
   */
  const updateBook = async (id: string, payload: BuchDTO, version?: number) => {
    setSubmitting(true);
    try {
      if (version === undefined || version === null) {
        setErrorMsg('Keine Versionsnummer vorhanden. Bitte erneut oeffnen und versuchen.');
        return false;
      }

      const etag = `"${version}"`;
      await api.put(`/${id}`, payload, { headers: { 'If-Match': etag } });

      const title = payload.titel?.titel ?? payload.isbn ?? 'Buch';
      setSuccessMsg(`${title} erfolgreich aktualisiert.`);
      return true;
    } catch (err) {
      const msg = isAxiosError(err)
        ? `Fehler: ${err.response?.status ?? ''} ${JSON.stringify(err.response?.data) || err.message}`
        : 'Unbekannter Fehler beim Aktualisieren';
      setErrorMsg(msg);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { updateBook, submitting, successMsg, errorMsg };
}
