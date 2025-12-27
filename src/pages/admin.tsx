import { Box, Container, Typography, Paper } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { BookManagement } from '../components/BookManagement';
import { UserManagement } from '../components/UserManagement';
import { BookStatistics } from '../components/BookStatistics';

export function AdminPage() {
  const { roles } = useAuth();

  if (!roles.includes('admin')) {
    return <Navigate to="/" />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Verwaltungsbereich für Administratoren
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Buch-Statistiken
        </Typography>
        <Box sx={{ mt: 2, mb: 2 }}>
          <BookStatistics />
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Bücherverwaltung
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Bücher hinzufügen und verwalten
        </Typography>
        <Box sx={{ mt: 2 }}>
          <BookManagement canEditBooks={roles.includes('admin')} />
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Benutzerverwaltung
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Rollen, Konten und Berechtigungen verwalten
        </Typography>
        <Box sx={{ mt: 2 }}>
          <UserManagement />
        </Box>
      </Paper>
    </Container>
  );
}

export default AdminPage;
