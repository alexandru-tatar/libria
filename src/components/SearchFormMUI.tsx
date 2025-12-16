import React, { useEffect, useMemo, useRef, useState } from 'react';
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

type Filters = {
  titel: string;
  isbn: string;
  art: '' | 'EPUB' | 'HARDCOVER' | 'PAPERBACK';
  lieferbar: boolean;
  preisVon: string;
  preisBis: string;
  rabattAb: string;
  ratingMin: number;
  schlagwoerter: string[];
  sort: string;
};

const sortBooksClient = (items: BuchDTO[], sort: string) => {
  if (!sort) return items;

  const [field, dir] = sort.split(',');
  const direction = dir === 'desc' ? -1 : 1;

  const getComparableValue = (book: BuchDTO) => {
    switch (field) {
      case 'preis':
        return book.preis ?? 0;
      case 'datum':
        return book.datum ? new Date(book.datum).getTime() : 0;
      case 'rating':
        return book.rating ?? 0;
      default:
        return book.titel?.titel ?? '';
    }
  };

  return [...items].sort((a, b) => {
    const aVal = getComparableValue(a);
    const bVal = getComparableValue(b);

    if (typeof aVal === 'string' || typeof bVal === 'string') {
      return aVal.toString().localeCompare(bVal.toString(), 'de', { sensitivity: 'base' }) * direction;
    }

    if (aVal === bVal) return 0;
    return aVal > bVal ? direction : -direction;
  });
};

const filterBooksClient = (items: BuchDTO[], filters: Filters) => {
  const selectedTags = filters.schlagwoerter.map((s) => s.toLowerCase());
  const minPrice = filters.preisVon ? Number(filters.preisVon) : undefined;
  const maxPrice = filters.preisBis ? Number(filters.preisBis) : undefined;
  const minDiscount = filters.rabattAb ? Number(filters.rabattAb) : undefined;
  const minRating = filters.ratingMin ? Number(filters.ratingMin) : undefined;
  const isbnSearch = filters.isbn.trim();
  const normalizeIsbn = (value: string) => value.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();
  const isbnNeedle = isbnSearch ? normalizeIsbn(isbnSearch) : '';

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

export const BookSearchFormMUI: React.FC = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [books, setBooks] = useState<BuchDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const fetchedPagesRef = useRef<Set<number>>(new Set());

  const pageSize = Number(import.meta.env.VITE_PAGE_SIZE) || 5;
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/rest`;

  const baseParams = useMemo(() => {
    const p: Record<string, string | number | boolean> = {
      size: pageSize,
    };
    if (filters.titel) p.titel = filters.titel;
    if (filters.art) p.art = filters.art;
    if (filters.lieferbar) p.lieferbar = true;
    if (filters.schlagwoerter.length) p.schlagwoerter = filters.schlagwoerter.join(',');
    return p;
  }, [filters, pageSize]);

  const fetchPage = async (pageToLoad: number) => {
    if (fetchedPagesRef.current.has(pageToLoad)) return;
    fetchedPagesRef.current.add(pageToLoad);

    const isFirstPage = pageToLoad === 0;
    if (isFirstPage) setLoading(true);
    else setLoadingMore(true);
    setError(null);
    try {
      const { data } = await axios.get(baseUrl, {
        params: { ...baseParams, page: pageToLoad },
      });
      const booksArray = data._embedded?.buecher || data.content || data;
      const rawBooks = Array.isArray(booksArray) ? booksArray : [];
      const filteredBooks = filterBooksClient(rawBooks, filters);
      setBooks((prev) => {
        const merged = isFirstPage ? filteredBooks : [...prev, ...filteredBooks];
        const deduped = Array.from(
          merged.reduce((map, book) => map.set(book.isbn, book), new Map<string, BuchDTO>()).values(),
        );
        return sortBooksClient(deduped, filters.sort);
      });

      const totalPagesFromResponse = data.page?.totalPages ?? data.totalPages;
      const more =
        typeof totalPagesFromResponse === 'number'
          ? pageToLoad + 1 < totalPagesFromResponse
          : rawBooks.length > 0;
      setHasMore(more);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`HTTP Error: ${err.response?.status || err.message}`);
      } else {
        setError(err instanceof Error ? err.message : 'Fehler beim Laden der Bücher');
      }
    } finally {
      if (isFirstPage) setLoading(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setBooks([]);
    fetchedPagesRef.current = new Set();
    fetchPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseParams, filters.sort]);

  useEffect(() => {
    if (page === 0) return;
    fetchPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: '200px 0px 0px 0px' },
    );

    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, loadingMore]);

  const handleReset = () => {
    setFilters(defaultFilters);
    setPage(0);
  };

  const toggleTag = (tag: string) => {
    setFilters((prev) => {
      const exists = prev.schlagwoerter.includes(tag);
      const schlagwoerter = exists ? prev.schlagwoerter.filter((t) => t !== tag) : [...prev.schlagwoerter, tag];
      return { ...prev, schlagwoerter };
    });
    setPage(0);
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

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Bewertung ab: {filters.ratingMin} ★
          </Typography>
          <Slider
            value={filters.ratingMin}
            min={0}
            max={5}
            step={1}
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
        <Button
          variant="contained"
          onClick={() => {
            setPage(0);
            setHasMore(true);
            setBooks([]);
            fetchPage(0);
          }}
          startIcon={<SearchIcon />}
        >
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
          <Box ref={sentinelRef} sx={{ height: 8, width: '100%' }} />
          {(loadingMore || hasMore) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              {loadingMore ? <CircularProgress size={26} /> : <Typography variant="body2">Weitere Bücher laden ...</Typography>}
            </Box>
          )}
          {!hasMore && <Typography variant="body2" color="text.secondary">Keine weiteren Bücher.</Typography>}
        </Stack>
      )}

      {!loading && !error && books.length === 0 && (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>Keine Bücher gefunden.</Typography>
      )}
    </Box>
  );
};
