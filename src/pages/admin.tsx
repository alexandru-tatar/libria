import { Box, Container, Typography, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { BookManagement } from '../components/BookManagement';
import { UserManagement } from '../components/UserManagement';
import { BookStatistics } from '../components/BookStatistics';
import { getAllBooks } from '../api/books';
import type { Book } from '../types/book';


function getLastBooks(books: Book[], count = 5) {
  return books.slice(0, count);
}
export function AdminPage() {
  const { roles } = useAuth();
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
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Fehler beim Laden der Buchdaten');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

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
          {loading ? (
            <div>Statistiken werden geladen…</div>
          ) : error ? (
            <div>Fehler: {error}</div>
          ) : (
            <BookStatistics books={books} />
          )}
        </Box>
        {!loading && !error && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Zuletzt hinzugefügte Bücher
            </Typography>
            <ul>
              {getLastBooks(books).map((book) => (
                <li key={book.id}>
                  <strong>{book.titel?.titel}</strong>
                  {book.datum ? ` (${book.datum})` : ''}
                </li>
              ))}
            </ul>
          </Box>
        )}
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
