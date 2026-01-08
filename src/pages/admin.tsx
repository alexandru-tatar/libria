import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import BookTable from '../components/BookTable';
import { BookManagement } from '../components/BookManagement';
import { BookStatistics } from '../components/BookStatistics';

export const AdminPage = () => {
  const { roles } = useAuth();

  const [visibleCount, setVisibleCount] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  if (!roles.includes('admin')) {
    return <Navigate to='/' />;
  }

  const totalBooks = 128;

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 2.5, sm: 3, md: 4 },
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{ mb: { xs: 2, md: 3 } }}
      >
        Admin Panel
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: { xs: 2, md: 3 },
          alignItems: 'start',
        }}
      >
        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent='space-between'
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Typography variant='h6' fontWeight={700}>
              Bücherverwaltung
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <Button
                variant='contained'
                size='small'
                onClick={() => setCreateOpen(true)}
                sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
              >
                Buch anlegen
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
              >
                Buch ändern
              </Button>
            </Stack>
          </Stack>

          <Typography
            variant='subtitle1'
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            Gefundene Bücher: {visibleCount ?? totalBooks}
          </Typography>

          <BookTable pageSize={10} onCountChange={setVisibleCount} />
        </Paper>

        {/* neu: Sticky Sidebar */}
        <Paper
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            position: { xs: 'static', lg: 'sticky' },
            top: { lg: 88 },
          }}
        >
          <BookStatistics />
        </Paper>
      </Box>

      <BookManagement open={createOpen} onClose={() => setCreateOpen(false)} />
    </Container>
  );
};

export default AdminPage;
