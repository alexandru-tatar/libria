import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { alpha, keyframes } from '@mui/material/styles';

import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';

import { BookMediaMUI } from './MediaMUI';
import { LoadMoreBar } from './LoadMoreBar';
import {
  type BookArt,
  useBookFilters,
  useBookSearch,
} from '../hooks/useBookSearch';
import type { BookItems } from '../types/book';
import { BookDetail } from './BookDetail';
import { EntryCount } from './EntryCount';

const shimmer = keyframes`
  0% {
    transform: translateX(-40%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(40%);
  }
`;

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
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            mb: 2,
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Typography variant="h6" fontWeight={900}>
                Filter
              </Typography>
              <Chip
                label={
                  filters.schlagwoerter.length
                    ? `${filters.schlagwoerter.length} Tags aktiv`
                    : 'Keine Tags'
                }
                color={filters.schlagwoerter.length ? 'primary' : 'default'}
                variant={filters.schlagwoerter.length ? 'filled' : 'outlined'}
                sx={{ borderRadius: 999 }}
              />
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="ISBN"
                  value={filters.isbn}
                  onChange={(e) => setFilterValue('isbn', e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel id="art-label">Buchart</InputLabel>
                  <Select
                    labelId="art-label"
                    label="Buchart"
                    value={filters.art}
                    onChange={(e) =>
                      setFilterValue('art', e.target.value as BookArt)
                    }
                  >
                    <MenuItem value="">Alle</MenuItem>
                    <MenuItem value="EPUB">EPUB</MenuItem>
                    <MenuItem value="HARDCOVER">HARDCOVER</MenuItem>
                    <MenuItem value="PAPERBACK">PAPERBACK</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel id="sort-label">Sortierung</InputLabel>
                  <Select
                    labelId="sort-label"
                    label="Sortierung"
                    value={filters.sort}
                    onChange={(e) => setFilterValue('sort', e.target.value)}
                  >
                    <MenuItem value="titel,asc">Titel A–Z</MenuItem>
                    <MenuItem value="titel,desc">Titel Z–A</MenuItem>
                    <MenuItem value="preis,asc">Preis aufsteigend</MenuItem>
                    <MenuItem value="preis,desc">Preis absteigend</MenuItem>
                    <MenuItem value="datum,desc">Neueste zuerst</MenuItem>
                    <MenuItem value="datum,asc">Älteste zuerst</MenuItem>
                    <MenuItem value="rating,desc">Beste Bewertung</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Preis von (€)"
                  type="number"
                  value={filters.preisVon}
                  onChange={(e) => setFilterValue('preisVon', e.target.value)}
                  fullWidth
                  slotProps={{ htmlInput: { min: 0 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Preis bis (€)"
                  type="number"
                  value={filters.preisBis}
                  onChange={(e) => setFilterValue('preisBis', e.target.value)}
                  fullWidth
                  slotProps={{ htmlInput: { min: 0 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Rabatt ab"
                  type="number"
                  value={filters.rabattAb}
                  onChange={(e) => setFilterValue('rabattAb', e.target.value)}
                  fullWidth
                  helperText="0–1 (z.B. 0.2 = 20%)"
                  slotProps={{ htmlInput: { step: 0.05, min: 0, max: 1 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="baseline"
                  >
                    <Typography variant="body2" color="text.secondary">
                      Mindestbewertung
                    </Typography>
                    <Typography variant="body2" fontWeight={800}>
                      {filters.ratingMin} ★
                    </Typography>
                  </Stack>
                  <Slider
                    value={filters.ratingMin}
                    min={0}
                    max={5}
                    step={1}
                    valueLabelDisplay="auto"
                    onChange={(_, v) =>
                      setFilterValue('ratingMin', v as number)
                    }
                  />
                </Stack>
              </Grid>

              <Grid
                size={{ xs: 12, md: 6 }}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.lieferbar}
                      onChange={(e) =>
                        setFilterValue('lieferbar', e.target.checked)
                      }
                    />
                  }
                  label="Nur lieferbar"
                />
              </Grid>
            </Grid>

             <Grid
                size={{ xs: 12, md: 6 }}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <FormControl>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Ansicht
                  </Typography>
                  <RadioGroup
                    row
                    value={viewMode}
                    onChange={(e) => {
                      setViewMode(e.target.value as 'cards' | 'list');
                    }}
                  >
                    <FormControlLabel value="cards" control={<Radio />} label="Karten" />
                    <FormControlLabel value="list" control={<Radio />} label="Liste" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" fontWeight={900} sx={{ mb: 1 }}>
              Quick-Tags
            </Typography>

            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              {quickTags.map((tag) => {
                const active = filters.schlagwoerter.includes(tag);
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    clickable
                    onClick={() => toggleTag(tag)}
                    color={active ? 'primary' : 'default'}
                    variant={active ? 'filled' : 'outlined'}
                    sx={{ mb: 1, borderRadius: 999 }}
                  />
                );
              })}
            </Stack>
          </CardContent>
        </Card>
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
        <Card
          elevation={0}
          sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
        >
          <CardContent sx={{ py: 6 }}>
            <Stack alignItems="center" spacing={1}>
              <Typography variant="h6" fontWeight={900}>
                Keine Bücher gefunden
              </Typography>
              <Typography
                color="text.secondary"
                align="center"
                sx={{ maxWidth: 520 }}
              >
                Passe Suche, Filter oder Tags an und versuche es erneut.
              </Typography>
              <Button
                onClick={handleReset}
                variant="outlined"
                startIcon={<RefreshIcon />}
                sx={{ mt: 1, borderRadius: 2 }}
              >
                Filter zurücksetzen
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {!loading && !error && visible.length > 0 && (
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={900}>
              Ergebnisse
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              {loadingMore && <CircularProgress size={18} />}
              <EntryCount
                count={totalItems ?? visible.length}
                label="Bücher"
              />
            </Stack>
          </Stack>

          <Box
            sx={(theme) => {
              const shimmerGradient = `linear-gradient(120deg, ${alpha(
                theme.palette.background.paper,
                0,
              )} 0%, ${alpha(
                theme.palette.mode === 'dark'
                  ? theme.palette.primary.dark
                  : theme.palette.grey[200],
                0.9,
              )} 55%, ${alpha(theme.palette.background.paper, 0)} 100%)`;

              return {
                display: 'grid',
                gridTemplateColumns:
                  viewMode === 'cards'
                    ? 'repeat(auto-fit, minmax(260px, 1fr))'
                    : '1fr',
                gap: viewMode === 'cards' ? 3.5 : 1.5,
                mt: 3,
                ...(loadingMore && {
                  '& .book-card': {
                    position: 'relative',
                    isolation: 'isolate',
                    filter: 'grayscale(1) saturate(0.4) brightness(0.93)',
                    opacity: 0.86,
                    transition: 'filter 850ms ease, opacity 850ms ease',
                  },
                  '& .book-card::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                    background: shimmerGradient,
                    animation: `${shimmer} 2s ease-in-out infinite`,
                    pointerEvents: 'none',
                  },
                }),
              };
            }}
          >
            {visible.map((book) => (
              <Box
                key={book.isbn}
                onClick={() => setSelectedBook(book)}
                sx={{ cursor: 'pointer', height: '100%' }}
              >
                <BookMediaMUI book={book} />
              </Box>
            ))}
          </Box>

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
