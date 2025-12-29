import { Box, Container, Typography, Paper, Stack, Button } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import BookTable from "../components/BookTable"; // Import der Tabelle

export function AdminPage() {
  const { roles } = useAuth();

  if (!roles.includes("admin")) {
    return <Navigate to="/" />;
  }

  // Optional: Anzahl Bücher aus der Datenbank via Hook oder Dummy
  const bookCount = 128;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>

      {/* Bücherverwaltung */}
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Bücherverwaltung
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button variant="contained" size="small">
              Buch anlegen
            </Button>
            <Button variant="outlined" size="small">
              Buch ändern
            </Button>
            <Button variant="outlined" size="small">
              Buch löschen
            </Button>
          </Stack>

          <Typography variant="subtitle1" fontWeight={700}>
            Anzahl Bücher: {bookCount}
          </Typography>
        </Stack>

        {/* BookTable einbinden */}
        <Box sx={{ mt: 2 }}>
          <BookTable pageSize={10} /> {/* optional Filter props übergeben */}
        </Box>
      </Paper>
    </Container>
  );
}

export default AdminPage;
