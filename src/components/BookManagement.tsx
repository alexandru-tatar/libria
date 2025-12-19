import { useState } from 'react';
import { isAxiosError } from 'axios';
import {
  Box, Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Snackbar, Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
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
import type { BuchDTO } from '../types/book';
import { api } from '../api/axios';

export function BookManagement({ canEditBooks }: { canEditBooks?: boolean }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { control, handleSubmit, reset, formState: { errors } } = useForm<BuchDTO>({
    defaultValues: { titel: { titel: '', untertitel: '' } },
  });
  const showCreate = canEditBooks ?? true;

  const openCreate = () => setCreateOpen(true);
  const closeCreate = () => {
    setCreateOpen(false);
    reset();
  };

  const onCreate = async (data: BuchDTO) => {
    setSubmitting(true);
    try {
      await api.post('/', data);
      const title = (data as Partial<BuchDTO>)?.titel?.titel ?? data.isbn ?? 'Buch';
      setSuccessMsg(`${title} erfolgreich angelegt.`);
      setSuccessOpen(true);
      closeCreate();
    } catch (err) {
      const msg = isAxiosError(err)
        ? `Fehler: ${err.response?.status ?? ''} ${err.response?.data ?? err.message}`
        : 'Unbekannter Fehler beim Anlegen';
      setErrorMsg(msg);
      setErrorOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        {showCreate && <Button variant="contained" onClick={openCreate}>Buch anlegen</Button>}
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Das Anlegen von Büchern
      </Typography>

      <Dialog open={createOpen} onClose={closeCreate} fullWidth maxWidth="md">
        <DialogTitle>Buch anlegen</DialogTitle>
        <DialogContent>
          <Box component="form" id="book-form" onSubmit={handleSubmit(onCreate)} sx={{ mt: 1, '& .MuiFormControl-root': { mb: 2 } }}>
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
          <Button onClick={closeCreate} disabled={submitting}>Abbrechen</Button>
          <Button form="book-form" type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Bitte warten...' : 'Anlegen'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
          {successMsg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorOpen}
        autoHideDuration={6000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setErrorOpen(false)} severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
