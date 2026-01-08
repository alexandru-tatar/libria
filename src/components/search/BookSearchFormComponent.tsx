import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';

import { LoadMoreBar } from './LoadMoreBarComponent';
import {
  useBookFilters,
  useBookSearch,
} from '../../hooks/useBookSearch';
import type { BookItems } from '../../types/book';
import { BookDetail } from './BookDetailComponent';
import { BookSearchFiltersPanel } from './BookSearchFiltersPanel';
import { SearchResultsHeader } from './SearchResultsHeader';
import { SearchResultsGrid } from './SearchResultsGrid';
import { SearchEmptyState } from './SearchEmptyState';

const quickTags = [
  'JavaScript',
  'TypeScript',
  'Java',
  'Python',
  'Bestseller',
  'Neu',
];
const pageSize = 5;

export const BookSearchFormMUI = () => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookItems | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  const { filters, setFilterValue, toggleTag, resetFilters } = useBookFilters();
  const {
    visible,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
    isEmpty,
    totalItems,
  } = useBookSearch(filters, pageSize);
  const totalCount = totalItems ?? visible.length;
  const pageCount = visible.length;

  const handleSearch = useCallback(() => refetch(), [refetch]);
  const handleReset = useCallback(() => resetFilters(), [resetFilters]);
  const handleToggleFilters = useCallback(
    () => setFiltersOpen((prev) => !prev),
    [],
  );
  const handleLoadMore = useCallback(() => loadMore(), [loadMore]);

  const activeFilterSummary = useMemo(() => {
    const parts: string[] = [];
    if (filters.isbn?.trim()) parts.push('ISBN');
    if (filters.art) parts.push(`Art: ${filters.art}`);
    if (filters.lieferbar) parts.push('lieferbar');
    if (filters.preisVon) parts.push(`≥ ${filters.preisVon}€`);
    if (filters.preisBis) parts.push(`≤ ${filters.preisBis}€`);
    if (filters.rabattAb)
      parts.push(`Rabatt ≥ ${Math.round(Number(filters.rabattAb) * 100)}%`);
    if (filters.ratingMin > 0) parts.push(`Rating ≥ ${filters.ratingMin}★`);
    if (filters.schlagwoerter.length)
      parts.push(`${filters.schlagwoerter.length} Tags`);
    return parts.length ? parts.join(' · ') : 'Keine zusätzlichen Filter aktiv';
  }, [filters]);

  return (
    <Box
      sx={{
        maxWidth: 1160,
        mx: 'auto',
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
      }}
    >
      {/* Header */}
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography
          variant={mdUp ? 'h4' : 'h5'}
          fontWeight={900}
          letterSpacing={-0.5}
        >
          Bücher suchen
        </Typography>
      </Stack>

      {/* Search / Actions */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
          backgroundColor: (t) =>
            t.palette.mode === 'dark'
              ? 'rgba(18,18,18,0.72)'
              : 'rgba(255,255,255,0.78)',
          mb: 2,
        }}
      >
        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Grid container spacing={1.5} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                label="Suche"
                value={filters.titel}
                onChange={(e) => setFilterValue('titel', e.target.value)}
                placeholder="Titel, Untertitel, Autor …"
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                justifyContent="flex-end"
              >
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Suchen
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleReset}
                  startIcon={<RefreshIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Reset
                </Button>
                <Button
                  variant="text"
                  onClick={handleToggleFilters}
                  startIcon={<FilterListIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  {filtersOpen ? 'Filter ausblenden' : 'Filter einblenden'}
                </Button>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mt: 0.5 }}
              >
                <TuneRoundedIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {activeFilterSummary}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filters Panel */}
      <Collapse in={filtersOpen} timeout={240} unmountOnExit>
        <BookSearchFiltersPanel
          filters={filters}
          quickTags={quickTags}
          viewMode={viewMode}
          setFilterValue={setFilterValue}
          toggleTag={toggleTag}
          onViewModeChange={(mode) => setViewMode(mode)}
        />
      </Collapse>

      {/* States */}
      {loading && (
        <Card
          elevation={0}
          sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
        >
          <CardContent sx={{ py: 6 }}>
            <Stack alignItems="center" spacing={2}>
              <CircularProgress />
              <Typography color="text.secondary">Lade Bücher …</Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      {!loading && !!error && (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && isEmpty && (
        <SearchEmptyState onReset={handleReset} />
      )}

      {/* Results */}
      {!loading && !error && visible.length > 0 && (
        <Stack spacing={2} sx={{ mt: 1 }}>
          <SearchResultsHeader
            loadingMore={loadingMore}
            totalItems={totalItems}
            visibleCount={visible.length}
          />

          <SearchResultsGrid
            books={visible}
            loadingMore={loadingMore}
            viewMode={viewMode}
            onSelect={(book) => setSelectedBook(book)}
          />

          <Stack
            spacing={0.75}
            alignItems="center"
            sx={{ py: 1 }}
          >
            <LoadMoreBar
              loading={loadingMore}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
            />
            <Typography variant="caption" color="text.secondary">
              {pageCount} von {totalCount} Büchern
            </Typography>
          </Stack>
        </Stack>
      )}

      {selectedBook && (
        <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </Box>
  );
};
