import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import BookTable from '../components/admin-panel/BookTableComponent';
import { BookManagement } from '../components/admin-panel/BookManagementComponent';
import { BookStatistics } from '../components/admin-panel/BookStatistics';

export const AdminPage = () => {
  const { roles } = useAuth();

  const [visibleCount, setVisibleCount] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  if (!roles.includes('admin')) return <Navigate to="/" />;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2.5, sm: 3, md: 4 } }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: { xs: 2, md: 3 } }}>
        Admin Panel
      </Typography>

      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" fontWeight={700}>
            Bücherverwaltung
          </Typography>

          <Button
            variant="contained"
            size="small"
            onClick={() => setCreateOpen(true)}
            sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
          >
            Buch anlegen
          </Button>
        </Stack>

        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          Angezeigte Bücher: {visibleCount ?? '–'}
        </Typography>

        <BookTable pageSize={10} onCountChange={setVisibleCount} />
      </Paper>

      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
        <BookStatistics />
      </Paper>

      <BookManagement open={createOpen} onClose={() => setCreateOpen(false)} />
    </Container>
  );
};

export default AdminPage;
