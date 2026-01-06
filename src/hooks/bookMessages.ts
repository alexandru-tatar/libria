import { isAxiosError } from 'axios';
import type { BuchDTO } from '../types/book';

const getBookTitle = (payload: BuchDTO) => payload.titel?.titel ?? payload.isbn ?? 'Buch';

export const buildSuccessMessage = (payload: BuchDTO, action: 'angelegt' | 'aktualisiert') =>
  `${getBookTitle(payload)} erfolgreich ${action}.`;

export const buildErrorMessage = (error: unknown, action: 'Anlegen' | 'Aktualisieren') => {
  return isAxiosError(error)
    ? `Fehler: ${error.response?.status ?? ''} ${JSON.stringify(error.response?.data) || error.message}`
    : `Unbekannter Fehler beim ${action}`;
};
