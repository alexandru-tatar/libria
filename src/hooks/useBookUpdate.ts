import { useState } from 'react';
import type { BuchDTO } from '../types/book';
import { api } from '../api/axios';
import { buildErrorMessage, buildSuccessMessage } from './bookMessages';

const normalizeSubtitle = (value?: string | null) => {
    const trimmed = value?.trim();
    if (!trimmed) return null;
    return trimmed.toLowerCase() === 'null' ? null : trimmed;
};

const buildUpdatePayload = (payload: BuchDTO) => {
    const { titel, ...rest } = payload;
    const titelUpdate = titel
        ? {
              update: {
                  titel: titel.titel,
                  untertitel: normalizeSubtitle(titel.untertitel),
              },
          }
        : undefined;

    return { ...rest, titel: titelUpdate };
};

export function useBookUpdate() {
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const updateBook = async (
        id: string,
        payload: BuchDTO,
        version?: number,
    ): Promise<boolean> => {
        setSubmitting(true);
        setSuccessMsg('');
        setErrorMsg('');

        try {
            if (version == null) {
                setErrorMsg(
                    'Keine Versionsnummer vorhanden. Bitte erneut öffnen und versuchen.',
                );
                return false;
            }

            const etag = `"${version}"`;
            const requestBody = buildUpdatePayload(payload);
            await api.put(`/${id}`, requestBody, {
                headers: { 'If-Match': etag },
            });

            setSuccessMsg(buildSuccessMessage(payload, 'aktualisiert'));
            return true;
        } catch (err) {
            setErrorMsg(buildErrorMessage(err, 'Aktualisieren'));
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    return { updateBook, submitting, successMsg, errorMsg };
}
