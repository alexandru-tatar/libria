import { Box, Container, Typography, Paper } from '@mui/material';
import { useAuth } from '../auth/useAuth';
import { Navigate } from 'react-router-dom';

export function AdminPage() {
  const { roles } = useAuth();

  // Nur Admins dürfen diese Seite sehen
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

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Bücherverwaltung
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Bücher hinzufügen, bearbeiten und verwalten
        </Typography>
        <Box sx={{ mt: 2 }}>
          {/* Hier kommt später die Buchverwaltung */}
          <Typography variant="caption" color="text.disabled">
            In Entwicklung...
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default AdminPage;
