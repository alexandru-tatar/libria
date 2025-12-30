import { Box, Container, Typography, Paper, Stack, Button } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import BookTable from "../components/BookTable";
import { BookManagement } from "../components/BookManagement";

export function AdminPage() {
  const { roles } = useAuth();
  const [visibleCount, setVisibleCount] = useState<number | null>(null); // Anzahl sichtbarer Bücher
  const [createOpen, setCreateOpen] = useState(false); // BuchManagement Dialog

  if (!roles.includes("admin")) {
    return <Navigate to="/" />;
  }

  // Gesamtzahl als Fallback, falls keine Filter aktiv
  const totalBooks = 128;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>

      {/* Bücherverwaltung */}
      <Paper sx={{ p: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
          spacing={2}
        >
          <Typography variant="h6" fontWeight={700}>
            Bücherverwaltung
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button variant="contained" size="small" onClick={() => setCreateOpen(true)}>
              Buch anlegen
            </Button>
            <Button variant="outlined" size="small">
              Buch ändern
            </Button>
            <Button variant="outlined" size="small">
              Buch löschen
            </Button>
          </Stack>
        </Stack>

        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          Gefundene Bücher: {visibleCount !== null ? visibleCount : totalBooks}
        </Typography>

        {/* BookTable mit Callback zur Anzahl */}
        <Box sx={{ mt: 2 }}>
          <BookTable pageSize={10} onCountChange={setVisibleCount} />
        </Box>
      </Paper>

      {/* BuchManagement Dialog */}
      <BookManagement canEditBooks={true} open={createOpen} onClose={() => setCreateOpen(false)} />
    </Container>
  );
}

export default AdminPage;
