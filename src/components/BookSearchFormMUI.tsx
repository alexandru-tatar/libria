import { useCallback } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { BookMediaMUI } from './MediaMUI';
import './SearchForm.css';
import { LoadMoreBar } from './LoadMoreBar';
import { type BookArt, useBookFilters, useBookSearch } from '../hooks/useBookSearch';

const quickTags = ['JavaScript', 'TypeScript', 'Java', 'Python', 'Bestseller', 'Neu'];
const pageSize = 5;

export const BookSearchFormMUI = () => {
  const { filters, setFilterValue, toggleTag, resetFilters } = useBookFilters();
  const { visible, loading, loadingMore, error, hasMore, loadMore, refetch, isEmpty } = useBookSearch(filters, pageSize);

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleReset = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const handleToggleTag = useCallback(
    (tag: string) => {
      toggleTag(tag);
    },
    [toggleTag],
  );

  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 3, px: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Bücher filtern
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Titel / Untertitel"
            value={filters.titel}
            onChange={(e) => setFilterValue('titel', e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField label="ISBN" value={filters.isbn} onChange={(e) => setFilterValue('isbn', e.target.value)} fullWidth />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Buchart</InputLabel>
            <Select label="Buchart" value={filters.art} onChange={(e) => setFilterValue('art', e.target.value as BookArt)}>
              <MenuItem value="">Alle</MenuItem>
              <MenuItem value="EPUB">EPUB</MenuItem>
              <MenuItem value="HARDCOVER">HARDCOVER</MenuItem>
              <MenuItem value="PAPERBACK">PAPERBACK</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField label="Preis von" type="number" value={filters.preisVon} onChange={(e) => setFilterValue('preisVon', e.target.value)} fullWidth />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField label="Preis bis" type="number" value={filters.preisBis} onChange={(e) => setFilterValue('preisBis', e.target.value)} fullWidth />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            label="Rabatt ab"
            type="number"
            inputProps={{ step: 0.05, min: 0, max: 1 }}
            value={filters.rabattAb}
            onChange={(e) => setFilterValue('rabattAb', e.target.value)}
            fullWidth
            helperText="0–1 (z.B. 0.2 = 20%)"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Bewertung ab: {filters.ratingMin} ★
          </Typography>
          <Slider value={filters.ratingMin} min={0} max={5} step={1} valueLabelDisplay="auto" onChange={(_, v) => setFilterValue('ratingMin', v as number)} />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel control={<Switch checked={filters.lieferbar} onChange={(e) => setFilterValue('lieferbar', e.target.checked)} />} label="Nur lieferbar" />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Sortierung</InputLabel>
            <Select label="Sortierung" value={filters.sort} onChange={(e) => setFilterValue('sort', e.target.value)}>
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
      </Grid>

      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
        {quickTags.map((tag) => {
          const active = filters.schlagwoerter.includes(tag);
          return (
            <Chip
              key={tag}
              label={tag}
              color={active ? 'primary' : 'default'}
              variant={active ? 'filled' : 'outlined'}
              onClick={() => handleToggleTag(tag)}
              sx={{ mb: 1 }}
            />
          );
        })}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={handleSearch} startIcon={<SearchIcon />}>
          Suchen
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset} startIcon={<RefreshIcon />}>
          Zurücksetzen
        </Button>
      </Stack>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && visible.length > 0 && (
        <Stack spacing={2} sx={{ alignItems: 'center', mt: 2 }}>
          <div className={`book-results-grid${loadingMore ? ' loading-more' : ''}`}>
            {visible.map((book) => (
              <BookMediaMUI key={book.isbn} book={book} />
            ))}
          </div>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <LoadMoreBar loading={loadingMore} hasMore={hasMore} onLoadMore={handleLoadMore} />
          </Box>
        </Stack>
      )}

      {!loading && !error && isEmpty && <Typography sx={{ mt: 2, textAlign: 'center' }}>Keine Bücher gefunden.</Typography>}
    </Box>
  );
};
