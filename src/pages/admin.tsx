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
import './admin.css';

export const AdminPage = () => {
  const { roles } = useAuth();

  const [visibleCount, setVisibleCount] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  if (!roles.includes('admin')) {
    return <Navigate to='/' />;
  }

  const totalBooks = 128;

  return (
    <Container maxWidth='lg' className='adminPage'>
      <Typography variant='h4' fontWeight={700} className='adminHeader'>
        Admin Panel
      </Typography>

      <Box className='adminGrid'>
        <Paper className='adminCard'>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems='center'
            justifyContent='space-between'
            className='adminTableTopRow'
            spacing={2}
          >
            <Typography variant='h6' fontWeight={700}>
              Bücherverwaltung
            </Typography>

            <Stack direction='row' spacing={1}>
              <Button
                variant='contained'
                size='small'
                onClick={() => setCreateOpen(true)}
              >
                Buch anlegen
              </Button>
              <Button variant='outlined' size='small'>
                Buch ändern
              </Button>
            </Stack>
          </Stack>

          <Typography
            variant='subtitle1'
            fontWeight={700}
            className='adminFoundCount'
          >
            Gefundene Bücher: {visibleCount ?? totalBooks}
          </Typography>

          <BookTable pageSize={10} onCountChange={setVisibleCount} />
        </Paper>

        {/* neu: Sticky Sidebar */}
        <Paper className='adminCard adminStatsSticky'>
          <BookStatistics />
        </Paper>
      </Box>

      <BookManagement open={createOpen} onClose={() => setCreateOpen(false)} />
    </Container>
  );
};

export default AdminPage;
