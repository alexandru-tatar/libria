import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import type { BuchDTO } from '../types/book';
import { BookMediaMUI } from './MediaMUI';
import './SearchForm.css';

type Filters = {
  titel: string;
  isbn: string;
  art: '' | 'EPUB' | 'HARDCOVER' | 'PAPERBACK';
  lieferbar: boolean;
  preisVon: string;
  preisBis: string;
  rabattAb: string;
  ratingMin: number;
  datumVon: string;
  datumBis: string;
  schlagwoerter: string[];
  sort: string;
};

const defaultFilters: Filters = {
  titel: '',
  isbn: '',
  art: '',
  lieferbar: false,
  preisVon: '',
  preisBis: '',
  rabattAb: '',
  ratingMin: 0,
  datumVon: '',
  datumBis: '',
  schlagwoerter: [],
  sort: 'titel,asc',
};

const quickTags = ['JavaScript', 'TypeScript', 'Java', 'Python', 'Bestseller', 'Neu'];

export const BookSearchFormMUI: React.FC = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [books, setBooks] = useState<BuchDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = Number(import.meta.env.VITE_PAGE_SIZE) || 5;
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/rest`;

  const params = useMemo(() => {
    const p: Record<string, string | number | boolean | string[]> = {
      page,
      size: pageSize,
      sort: filters.sort,
    };
    if (filters.titel) p.titel = filters.titel;
    if (filters.isbn) p.isbn = filters.isbn;
    if (filters.art) p.art = filters.art;
    if (filters.lieferbar) p.lieferbar = true;
    if (filters.preisVon) p.preisVon = filters.preisVon;
    if (filters.preisBis) p.preisBis = filters.preisBis;
    if (filters.rabattAb) p.rabattAb = filters.rabattAb;
    if (filters.ratingMin) p.ratingMin = filters.ratingMin;
    if (filters.datumVon) p.datumVon = filters.datumVon;
    if (filters.datumBis) p.datumBis = filters.datumBis;
    if (filters.schlagwoerter.length) p.schlagwoerter = filters.schlagwoerter;
    return p;
  }, [filters, page, pageSize]);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(baseUrl, { params });
      const booksArray = data._embedded?.buecher || data.content || data;
      const rawBooks = Array.isArray(booksArray) ? booksArray : [];
      const totalElementsFromResponse = data.page?.totalElements ?? data.totalElements ?? rawBooks.length;
      const totalPagesFromResponse =
        data.page?.totalPages ?? data.totalPages ?? Math.max(1, Math.ceil(totalElementsFromResponse / pageSize));
      setBooks(rawBooks);
      setTotalPages(totalPagesFromResponse);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`HTTP Error: ${err.response?.status || err.message}`);
      } else {
        setError(err instanceof Error ? err.message : 'Fehler beim Laden der Bücher');
      }
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleReset = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const toggleTag = (tag: string) => {
    setFilters((prev) => {
      const exists = prev.schlagwoerter.includes(tag);
      const schlagwoerter = exists ? prev.schlagwoerter.filter((t) => t !== tag) : [...prev.schlagwoerter, tag];
      return { ...prev, schlagwoerter };
    });
    setPage(1);
  };

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
            onChange={(e) => {
              setFilters((p) => ({ ...p, titel: e.target.value }));
              setPage(1);
            }}
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
          <TextField
            label="ISBN"
            value={filters.isbn}
            onChange={(e) => {
              setFilters((p) => ({ ...p, isbn: e.target.value }));
              setPage(1);
            }}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Buchart</InputLabel>
            <Select
              label="Buchart"
              value={filters.art}
              onChange={(e) => {
                setFilters((p) => ({ ...p, art: e.target.value as Filters['art'] }));
                setPage(1);
              }}
            >
              <MenuItem value="">Alle</MenuItem>
              <MenuItem value="EPUB">EPUB</MenuItem>
              <MenuItem value="HARDCOVER">HARDCOVER</MenuItem>
              <MenuItem value="PAPERBACK">PAPERBACK</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            label="Preis von"
            type="number"
            value={filters.preisVon}
            onChange={(e) => {
              setFilters((p) => ({ ...p, preisVon: e.target.value }));
              setPage(1);
            }}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            label="Preis bis"
            type="number"
            value={filters.preisBis}
            onChange={(e) => {
              setFilters((p) => ({ ...p, preisBis: e.target.value }));
              setPage(1);
            }}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            label="Rabatt ab"
            type="number"
            inputProps={{ step: 0.05, min: 0, max: 1 }}
            value={filters.rabattAb}
            onChange={(e) => {
              setFilters((p) => ({ ...p, rabattAb: e.target.value }));
              setPage(1);
            }}
            fullWidth
            helperText="0–1 (z.B. 0.2 = 20%)"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            label="Erscheinung ab"
            type="date"
            value={filters.datumVon}
            onChange={(e) => {
              setFilters((p) => ({ ...p, datumVon: e.target.value }));
              setPage(1);
            }}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            label="Erscheinung bis"
            type="date"
            value={filters.datumBis}
            onChange={(e) => {
              setFilters((p) => ({ ...p, datumBis: e.target.value }));
              setPage(1);
            }}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Bewertung ab: {filters.ratingMin} ★
          </Typography>
          <Slider
            value={filters.ratingMin}
            min={0}
            max={5}
            step={0.5}
            valueLabelDisplay="auto"
            onChange={(_, val) => {
              setFilters((p) => ({ ...p, ratingMin: val as number }));
              setPage(1);
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={filters.lieferbar}
                onChange={(e) => {
                  setFilters((p) => ({ ...p, lieferbar: e.target.checked }));
                  setPage(1);
                }}
              />
            }
            label="Nur lieferbar"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Sortierung</InputLabel>
            <Select
              label="Sortierung"
              value={filters.sort}
              onChange={(e) => {
                setFilters((p) => ({ ...p, sort: e.target.value }));
                setPage(1);
              }}
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
              onClick={() => toggleTag(tag)}
              sx={{ mb: 1 }}
            />
          );
        })}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => fetchBooks()} startIcon={<SearchIcon />}>
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

      {!loading && !error && books.length > 0 && (
        <Stack spacing={3} sx={{ alignItems: 'center', mt: 2 }}>
          <div className="book-results-grid">
            {books.map((book) => (
              <BookMediaMUI key={book.isbn} book={book} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              color="primary"
              onChange={(_, value) => setPage(value)}
              disabled={loading}
            />
          )}
        </Stack>
      )}

      {!loading && !error && books.length === 0 && (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>Keine Bücher gefunden.</Typography>
      )}
    </Box>
  );
};
