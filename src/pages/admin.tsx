import { Container, Typography, Paper, Stack, Button } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import BookTable from '../components/BookTable';
import { BookManagement } from '../components/BookManagement';
import { BookStatistics } from '../components/BookStatistics';

export function AdminPage() {
  const { roles } = useAuth();
  const [visibleCount, setVisibleCount] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  if (!roles.includes('admin')) return <Navigate to="/" />;

  const totalBooks = 128;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>

      {/* Verwaltung oben */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
          spacing={2}
        >
          <Typography variant="h6" fontWeight={700}>
            Bücherverwaltung
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              size="small"
              onClick={() => setCreateOpen(true)}
            >
              Buch anlegen
            </Button>
            <Button variant="outlined" size="small">
              Buch ändern
            </Button>
          </Stack>
        </Stack>

        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          Gefundene Bücher: {visibleCount ?? totalBooks}
        </Typography>

        <BookTable pageSize={10} onCountChange={setVisibleCount} />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <BookStatistics />
      </Paper>

      <BookManagement open={createOpen} onClose={() => setCreateOpen(false)} />
    </Container>
  );
}

export default AdminPage;
