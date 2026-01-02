import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useBookSearch, defaultFilters } from '../hooks/useBookSearch';
import type { Filters } from '../hooks/useBookSearch';
import type { BuchDTO } from '../types/book';

type BookTableProps = {
  filters?: Filters;
  pageSize?: number;
  onCountChange?: (count: number) => void; // Anzahl zurückgeben
};

export function BookTable({ filters = defaultFilters, pageSize = 10, onCountChange }: BookTableProps) {
  const { visible, loading, error, loadMore, hasMore } = useBookSearch(filters, pageSize);

  // ✔ Problem 1 behoben: nur triggern, wenn sich die Anzahl ändert
  useEffect(() => {
    if (onCountChange) onCountChange(visible.length);
  }, [visible.length, onCountChange]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
      loadMore();
    }
  };

  const formatDate = (raw: string | undefined) => {
    if (!raw) return '-';
    const [year, month, day] = raw.split('T')[0].split('-');
    return `${day}.${month}.${year}`;
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 400 }} onScroll={handleScroll}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>ISBN</TableCell>
              <TableCell>Titel</TableCell>
              <TableCell>Art</TableCell>
              <TableCell>Preis</TableCell>
              <TableCell>Rabatt</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Lieferbar</TableCell>
              <TableCell>Schlagwörter</TableCell>
              <TableCell sx={{ width: 100 }}>Datum</TableCell>
              <TableCell sx={{ width: 150 }}>Homepage</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visible.map((book: BuchDTO) => (
              <TableRow key={book.isbn}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{book.isbn}</TableCell>
                <TableCell>{book.titel?.titel}</TableCell>
                <TableCell>{book.art}</TableCell>
                <TableCell>{book.preis ?? '-'}</TableCell>
                <TableCell>{book.rabatt ?? '-'}</TableCell>
                <TableCell>{book.rating ?? '-'}</TableCell>
                <TableCell>{book.lieferbar ? 'Ja' : 'Nein'}</TableCell>
                <TableCell>{book.schlagwoerter?.join(', ') ?? '-'}</TableCell>
                <TableCell>{formatDate(book.datum)}</TableCell>
                <TableCell>{book.homepage ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ textAlign: 'center', py: 2 }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
}

export default BookTable;
