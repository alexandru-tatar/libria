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
import { isAxiosError } from 'axios';
import type { BuchDTO } from '../types/book';
import { api } from '../api/axios';
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

export function BookManagement({
  open,
  onClose,
}: {
  canEditBooks?: boolean;
  open: boolean;
  onClose: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BuchDTO>({
    defaultValues: { titel: { titel: '', untertitel: '' } },
  });

  const closeDialog = () => {
    onClose();
    reset();
  };

  const onCreate = async (data: BuchDTO) => {
    setSubmitting(true);
    try {
      const rawIsbn = data.isbn?.trim();
      const isbnDigits = rawIsbn?.replace(/[-\s]/g, '') ?? '';
      if (!isbnDigits || isbnDigits.length !== 13)
        throw new Error('ISBN muss 13 Stellen haben');

      const valid =
        (10 -
          (isbnDigits
            .slice(0, 12)
            .split('')
            .reduce((s, d, i) => s + +d * (i % 2 ? 3 : 1), 0) %
            10)) %
          10 ===
        +isbnDigits[12];

      if (!valid) throw new Error('Ungültige ISBN-13 Prüfsumme');

      const payload: BuchDTO = {
        ...data,
        isbn: isbnDigits,
        rating: Number(data.rating),
        preis: Number(data.preis),
        rabatt: data.rabatt != null ? Number(data.rabatt) : undefined,
        lieferbar: Boolean(data.lieferbar),
        datum: data.datum
          ? new Date(`${data.datum}T00:00:00Z`).toISOString()
          : undefined,
        schlagwoerter: data.schlagwoerter?.filter(Boolean) ?? [],
      };

      await api.post('/', payload);
      const title = data.titel?.titel ?? data.isbn ?? 'Buch';
      setSuccessMsg(`${title} erfolgreich angelegt.`);
      setSuccessDialogOpen(true);
      closeDialog();
    } catch (err) {
      const msg = isAxiosError(err)
        ? `Fehler: ${err.response?.status ?? ''} ${JSON.stringify(err.response?.data) || err.message}`
        : 'Unbekannter Fehler beim Anlegen';
      setErrorMsg(msg);
      setErrorDialogOpen(true);
    } finally {
      setSubmitting(false);
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
            <RatingField<BuchDTO>
              name="rating"
              control={control}
              errors={errors}
            />
            <ArtField<BuchDTO> name="art" control={control} errors={errors} />
            <PreisField<BuchDTO>
              name="preis"
              control={control}
              errors={errors}
            />
            <RabattField<BuchDTO>
              name="rabatt"
              control={control}
              errors={errors}
            />
            <LieferbarField<BuchDTO>
              name="lieferbar"
              control={control}
              errors={errors}
            />
            <DatumField<BuchDTO>
              name="datum"
              control={control}
              errors={errors}
            />
            <HomepageField<BuchDTO>
              name="homepage"
              control={control}
              errors={errors}
            />
            <SchlagwoerterField<BuchDTO>
              name="schlagwoerter"
              control={control}
              errors={errors}
            />
            <TitelFields<BuchDTO> control={control} errors={errors} />
            <AbbildungField<BuchDTO>
              name="abbildungen"
              control={control}
              errors={errors}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} disabled={submitting}>
            Abbrechen
          </Button>
          <Button
            form="book-form"
            type="submit"
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Bitte warten...' : 'Anlegen'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Erfolg-Dialog */}
      <Dialog
        open={successDialogOpen}
        TransitionComponent={Fade}
        onClose={() => setSuccessDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            maxWidth: 480,
            mx: 1.5,
            boxShadow: 12,
            border: '1px solid rgba(76, 175, 80, 0.2)',
            position: 'relative',
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(76, 175, 80, 0.12)',
            color: 'success.main',
            px: 2,
            py: 0.5,
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: 0.4,
          }}
        >
          ERFOLG
        </Box>
        <DialogTitle sx={{ fontWeight: 700, textAlign: 'center', pt: 5 }}>
          Alles erledigt
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{ textAlign: 'center', mb: 1.5, color: 'success.main' }}
          >
            {successMsg || 'Aktion erfolgreich abgeschlossen.'}
          </Typography>
          <Divider sx={{ my: 1.5 }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            Du kannst jetzt ein weiteres Buch anlegen oder das Fenster
            schließen.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            variant="contained"
            onClick={() => setSuccessDialogOpen(false)}
            sx={{ borderRadius: 999, px: 3 }}
            color="success"
          >
            Weiter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fehler-Dialog */}
      <Dialog
        open={errorDialogOpen}
        TransitionComponent={Fade}
        onClose={() => setErrorDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            maxWidth: 480,
            mx: 1.5,
            boxShadow: 12,
            border: '1px solid rgba(244, 67, 54, 0.2)',
            position: 'relative',
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(244, 67, 54, 0.12)',
            color: 'error.main',
            px: 2,
            py: 0.5,
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: 0.4,
          }}
        >
          FEHLER
        </Box>
        <DialogTitle sx={{ fontWeight: 700, textAlign: 'center', pt: 5 }}>
          Hinweis
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{ textAlign: 'center', mb: 1.5, color: 'error.main' }}
          >
            {errorMsg || 'Es ist ein Fehler aufgetreten.'}
          </Typography>
          <Divider sx={{ my: 1.5 }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            Bitte prüfe deine Eingaben und versuche es erneut.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            variant="contained"
            onClick={() => setErrorDialogOpen(false)}
            sx={{ borderRadius: 999, px: 3 }}
          >
            Verstanden
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
