import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Button,
} from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';
import BookTable from '../components/BookTable';
import { BookManagement } from '../components/BookManagement';
import { BookStatistics } from '../components/BookStatistics';
import { getAllBooks } from '../api/books';
import type { Book } from '../types/book';

export function AdminPage() {
  const { roles } = useAuth();
  const [visibleCount, setVisibleCount] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllBooks();
        setBooks(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Fehler beim Laden');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

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

      {/* Statistiken unten */}
      <Paper sx={{ p: 3, mb: 3 }}>
        {loading ? (
          <div>Statistiken werden geladen…</div>
        ) : error ? (
          <div>Fehler: {error}</div>
        ) : (
          <BookStatistics books={books} />
        )}
        {!loading && !error && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Zuletzt hinzugefügte Bücher
            </Typography>
            <ul>
              {books.slice(0, 5).map((b) => (
                <li key={b.id}>
                  <strong>{b.titel?.titel}</strong>
                  {b.datum ? ` (${b.datum})` : ''}
                </li>
              ))}
            </ul>
          </Box>
        )}
      </Paper>

      <BookManagement
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </Container>
  );
}

export default AdminPage;
