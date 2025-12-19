import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import axios from 'axios';
import type { BuchDTO } from '../types/book';
import { BookMediaMUI } from './MediaMUI';
import './SearchForm.css';
import { LoadMoreBar } from './LoadMoreBar';
import { api } from '../api/axios';

type BookArt = '' | 'EPUB' | 'HARDCOVER' | 'PAPERBACK';

type Filters = {
  titel: string;
  isbn: string;
  art: BookArt;
  lieferbar: boolean;
  preisVon: string;
  preisBis: string;
  rabattAb: string;
  ratingMin: number;
  schlagwoerter: string[];
  sort: string;
};

type ApiResponse = {
  _embedded?: { buecher?: BuchDTO[] };
  content?: BuchDTO[];
  page?: { totalPages?: number };
  totalPages?: number;
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
  schlagwoerter: [],
  sort: 'titel,asc',
};

const quickTags = ['JavaScript', 'TypeScript', 'Java', 'Python', 'Bestseller', 'Neu'];

const normalizeIsbn = (value: string) => value.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();
const parseNumber = (value: string) => (value.trim() ? Number(value) : undefined);

const extractBooks = (data: ApiResponse): BuchDTO[] => {
  const embedded = data._embedded?.buecher;
  if (Array.isArray(embedded)) return embedded;
  if (Array.isArray(data.content)) return data.content;
  return [];
};

const extractTotalPages = (data: ApiResponse): number => {
  const fromPage = data.page?.totalPages;
  if (typeof fromPage === 'number') return fromPage;
  if (typeof data.totalPages === 'number') return data.totalPages;
  return 0;
};

const sortBooks = (items: BuchDTO[], sort: string): BuchDTO[] => {
  if (!sort) return items;
  const [field, dir] = sort.split(',');
  const direction = dir === 'desc' ? -1 : 1;

  const valueOf = (book: BuchDTO): string | number => {
    switch (field) {
      case 'preis':
        return Number(book.preis ?? 0);
      case 'datum':
        return book.datum ? new Date(book.datum).getTime() : 0;
      case 'rating':
        return Number(book.rating ?? 0);
      default:
        return book.titel?.titel ?? '';
    }
  };

  return [...items].sort((a, b) => {
    const aVal = valueOf(a);
    const bVal = valueOf(b);

    if (typeof aVal === 'string' || typeof bVal === 'string') {
      return aVal.toString().localeCompare(bVal.toString(), 'de', { sensitivity: 'base' }) * direction;
    }

    if (aVal === bVal) return 0;
    return aVal > bVal ? direction : -direction;
  });
};

const filterBooks = (items: BuchDTO[], filters: Filters): BuchDTO[] => {
  const selectedTags = filters.schlagwoerter.map((s) => s.toLowerCase());
  const minPrice = parseNumber(filters.preisVon);
  const maxPrice = parseNumber(filters.preisBis);
  const minDiscount = parseNumber(filters.rabattAb);
  const minRating = filters.ratingMin ? Number(filters.ratingMin) : undefined;
  const isbnNeedle = filters.isbn.trim() ? normalizeIsbn(filters.isbn.trim()) : '';

  return items.filter((book) => {
    if (isbnNeedle) {
      const candidate = normalizeIsbn(book.isbn ?? '');
      if (!candidate.includes(isbnNeedle)) return false;
    }

    if (selectedTags.length) {
      if (!book.schlagwoerter?.length) return false;
      const bookTags = book.schlagwoerter.map((s) => s.toLowerCase());
      if (!selectedTags.every((tag) => bookTags.includes(tag))) return false;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const price = Number(book.preis);
      if (Number.isNaN(price)) return false;
      if (minPrice !== undefined && price < minPrice) return false;
      if (maxPrice !== undefined && price > maxPrice) return false;
    }

    if (minDiscount !== undefined) {
      const discount = Number(book.rabatt);
      if (Number.isNaN(discount) || discount < minDiscount) return false;
    }

    if (minRating !== undefined) {
      const rating = Number(book.rating);
      if (Number.isNaN(rating) || rating < minRating) return false;
    }

    return true;
  });
};

const toggleItem = (items: string[], item: string) =>
  items.includes(item) ? items.filter((x) => x !== item) : [...items, item];

const dedupeByIsbn = (items: BuchDTO[]) =>
  Array.from(items.reduce((m, b) => m.set(b.isbn, b), new Map<string, BuchDTO>()).values());

const buildQueryParams = (filters: Filters, pageSize: number) => {
  const params: Record<string, string | number | boolean> = { size: pageSize };
  if (filters.titel) params.titel = filters.titel;
  if (filters.art) params.art = filters.art;
  if (filters.lieferbar) params.lieferbar = true;
  if (filters.schlagwoerter.length) params.schlagwoerter = filters.schlagwoerter.join(',');
  return params;
};

export const BookSearchFormMUI: React.FC = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const [visible, setVisible] = useState<BuchDTO[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 5;

  const queryParams = useMemo(() => buildQueryParams(filters, pageSize), [filters, pageSize]);
  const hasMore = totalPages === 0 ? true : page + 1 < totalPages;

  const setFilterValue = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetResults = useCallback(() => {
    setVisible([]);
    setPage(0);
    setTotalPages(0);
    setError(null);
  }, []);

  const fetchPage = useCallback(
    async (pageToLoad: number, mode: 'replace' | 'append') => {
      const isReplace = mode === 'replace';
      isReplace ? setLoading(true) : setLoadingMore(true);
      setError(null);

      try {
        const { data } = await api.get<ApiResponse>('/', {
          params: { ...queryParams, page: pageToLoad },
        });

        const raw = extractBooks(data);
        const filtered = filterBooks(raw, filters);
        const sorted = sortBooks(filtered, filters.sort);

        setVisible((prev) => {
          const merged = isReplace ? sorted : [...prev, ...sorted];
          return sortBooks(dedupeByIsbn(merged), filters.sort);
        });

        setTotalPages(extractTotalPages(data));
        setPage(pageToLoad);
      } catch (e) {
        if (axios.isAxiosError(e)) setError(`HTTP Error: ${e.response?.status ?? e.message}`);
        else setError(e instanceof Error ? e.message : 'Fehler beim Laden der Bücher');
      } finally {
        isReplace ? setLoading(false) : setLoadingMore(false);
      }
    },
    [api, filters, queryParams],
  );

  useEffect(() => {
    resetResults();
    void fetchPage(0, 'replace');
  }, [queryParams, filters.sort, fetchPage, resetResults]);

  const handleSearch = () => {
    resetResults();
    void fetchPage(0, 'replace');
  };

  const handleReset = () => setFilters(defaultFilters);

  const handleToggleTag = (tag: string) => {
    setFilters((prev) => ({ ...prev, schlagwoerter: toggleItem(prev.schlagwoerter, tag) }));
  };

  const handleLoadMore = () => {
    if (loading || loadingMore) return;
    if (!hasMore) return;
    void fetchPage(page + 1, 'append');
  };

  const isEmpty = !loading && !error && visible.length === 0;

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
