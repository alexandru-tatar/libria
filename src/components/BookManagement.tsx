import { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Fade,
  Divider,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import type { BuchDTO } from '../types/book';
import { IsbnField } from './FormFields/IsbnField';
import { RatingField } from './FormFields/RatingField';
import { PreisField } from './FormFields/PreisField';
import { LieferbarField } from './FormFields/LieferbarField';
import { TitelFields } from './FormFields/TitelField';
import { AbbildungField } from './FormFields/AbbildungField';
import { ArtField } from './FormFields/ArtField';
import { SchlagwoerterField } from './FormFields/SchlagwoerterField';
import { RabattField } from './FormFields/RabattField';
import { HomepageField } from './FormFields/HomePageField';
import { DatumField } from './FormFields/DatumField';
import { useBookCreate } from '../hooks/useBookCreate';

export function BookManagement({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<BuchDTO>({
    defaultValues: { titel: { titel: '', untertitel: '' } },
  });

  const { createBook, submitting, successMsg, errorMsg } = useBookCreate();

  const closeDialog = () => {
    onClose();
    reset();
  };

  const onCreate = async (data: BuchDTO) => {
    // --- VALIDIERUNG & PAYLOAD AUFBEREITUNG ---
    const rawIsbn = data.isbn?.trim();
    const isbnDigits = rawIsbn?.replace(/[-\s]/g, '') ?? '';
    if (!isbnDigits || isbnDigits.length !== 13) {
      setErrorDialogOpen(true);
      return;
    }

    const valid =
      (10 -
        (isbnDigits
          .slice(0, 12)
          .split('')
          .reduce((s, d, i) => s + +d * (i % 2 ? 3 : 1), 0) %
          10)) %
        10 ===
      +isbnDigits[12];
    if (!valid) {
      setErrorDialogOpen(true);
      return;
    }

    const payload: BuchDTO = {
      ...data,
      isbn: isbnDigits,
      rating: Number(data.rating),
      preis: Number(data.preis),
      rabatt: data.rabatt != null ? Number(data.rabatt) : undefined,
      lieferbar: Boolean(data.lieferbar),
      datum: data.datum ? new Date(`${data.datum}T00:00:00Z`).toISOString() : undefined,
      schlagwoerter: data.schlagwoerter?.filter(Boolean) ?? [],
    };

    // --- API-CALL ÜBER HOOK ---
    const success = await createBook(payload);

    if (success) {
      setSuccessDialogOpen(true);
      closeDialog();
    } else {
      setErrorDialogOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="md">
        <DialogTitle>Buch anlegen</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            id="book-form"
            onSubmit={handleSubmit(onCreate)}
            sx={{ mt: 1, '& .MuiFormControl-root': { mb: 2 } }}
          >
            <IsbnField<BuchDTO> name="isbn" control={control} errors={errors} />
            <RatingField<BuchDTO> name="rating" control={control} errors={errors} />
            <ArtField<BuchDTO> name="art" control={control} errors={errors} />
            <PreisField<BuchDTO> name="preis" control={control} errors={errors} />
            <RabattField<BuchDTO> name="rabatt" control={control} errors={errors} />
            <LieferbarField<BuchDTO> name="lieferbar" control={control} errors={errors} />
            <DatumField<BuchDTO> name="datum" control={control} errors={errors} />
            <HomepageField<BuchDTO> name="homepage" control={control} errors={errors} />
            <SchlagwoerterField<BuchDTO> name="schlagwoerter" control={control} errors={errors} />
            <TitelFields<BuchDTO> control={control} errors={errors} />
            <AbbildungField<BuchDTO> name="abbildungen" control={control} errors={errors} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} disabled={submitting}>Abbrechen</Button>
          <Button form="book-form" type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Bitte warten...' : 'Anlegen'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Erfolg-Dialog */}
      <Dialog open={successDialogOpen} TransitionComponent={Fade} onClose={() => setSuccessDialogOpen(false)}>
        <DialogTitle sx={{ textAlign: 'center', pt: 5 }}>Alles erledigt</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 1.5, color: 'success.main' }}>
            {successMsg || 'Aktion erfolgreich abgeschlossen.'}
          </Typography>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Du kannst jetzt ein weiteres Buch anlegen oder das Fenster schließen.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button variant="contained" onClick={() => setSuccessDialogOpen(false)} color="success">
            Weiter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fehler-Dialog */}
      <Dialog open={errorDialogOpen} TransitionComponent={Fade} onClose={() => setErrorDialogOpen(false)}>
        <DialogTitle sx={{ textAlign: 'center', pt: 5 }}>Hinweis</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 1.5, color: 'error.main' }}>
            {errorMsg || 'Es ist ein Fehler aufgetreten.'}
          </Typography>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Bitte prüfe deine Eingaben und versuche es erneut.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button variant="contained" onClick={() => setErrorDialogOpen(false)}>
            Verstanden
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
