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
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect } from 'react';
import { useBookSearch, defaultFilters } from '../hooks/useBookSearch';
import { useBookDelete } from '../hooks/useBookDelete';
import type { Filters } from '../hooks/useBookSearch';
import type { BuchDTO } from '../types/book';

type BookTableProps = {
  filters?: Filters;
  pageSize?: number;
  onCountChange?: (count: number) => void;
};

const cell = {
  px: 0.5,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export function BookTable({
  filters = defaultFilters,
  pageSize = 10,
  onCountChange,
}: BookTableProps) {
  const { visible, loading, error, loadMore, hasMore, refetch } = useBookSearch(
    filters,
    pageSize,
  );
  const { deleteBook, loading: deleting } = useBookDelete();

  useEffect(() => onCountChange?.(visible.length), [visible.length, onCountChange]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) loadMore();
  };

  const formatDate = (d?: string) =>
    d ? d.split('T')[0].split('-').reverse().join('.') : '-';

  const handleDelete = (id: number) => {
    deleteBook(id).then(() => refetch());
  };

  const handleEditPlaceholder = (b: BuchDTO) => {
    console.log('Bearbeiten-Button geklickt für ISBN:', b.isbn);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 400 }} onScroll={handleScroll}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {[
                'ISBN',
                'Titel',
                'Art',
                'Preis',
                'Rabatt',
                'Rating',
                'Lieferbar',
                'Schlagwörter',
                'Datum',
                'Homepage',
              ].map((h) => (
                <TableCell key={h} sx={h === 'ISBN' ? { px: 1 } : cell}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.map((b: BuchDTO) => (
              <TableRow key={b.isbn} sx={{ '& .MuiTableCell-root': { py: 0.5 } }}>
                <TableCell sx={{ px: 1 }}>{b.isbn}</TableCell>
                <TableCell sx={{ ...cell, maxWidth: 150 }}>
                  <Tooltip title={b.titel?.titel ?? '-'}>
                    <span>{b.titel?.titel ?? '-'}</span>
                  </Tooltip>
                </TableCell>
                <TableCell sx={cell}>{b.art}</TableCell>
                <TableCell sx={cell}>{b.preis ?? '-'}</TableCell>
                <TableCell sx={cell}>{b.rabatt ?? '-'}</TableCell>
                <TableCell sx={cell}>{b.rating ?? '-'}</TableCell>
                <TableCell sx={cell}>{b.lieferbar ? 'Ja' : 'Nein'}</TableCell>
                <TableCell sx={{ ...cell, maxWidth: 120 }}>
                  <Tooltip title={b.schlagwoerter?.join(', ') ?? '-'}>
                    <span>{b.schlagwoerter?.join(', ') ?? '-'}</span>
                  </Tooltip>
                </TableCell>
                <TableCell sx={cell}>{formatDate(b.datum)}</TableCell>
                <TableCell
                  sx={{
                    ...cell,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minWidth: 150,
                    maxWidth: 200,
                  }}
                >
                  <Tooltip title={b.homepage ?? '-'}>
                    <Box
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {b.homepage ?? '-'}
                    </Box>
                  </Tooltip>

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {/* Bearbeiten-Button als Info (hellblau), placeholder */}
                    <Tooltip title="Bearbeiten">
                      <IconButton
                        size="small"
                        sx={{ color: 'info.main' }}
                        onClick={() => handleEditPlaceholder(b)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {/* Löschen-Button */}
                    <Tooltip title="Löschen">
                      <IconButton
                        size="small"
                        color="error"
                        disabled={deleting}
                        onClick={() => handleDelete(b.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ textAlign: 'center', py: 1 }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
}

export default BookTable;
