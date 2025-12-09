import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

import type { BuchDTO } from '../types/book';
import { BookMediaMUI } from './MediaMUI';
import './SearchForm.css';

interface BookSearchFormMUIProps {
  onSelect?: (book: BuchDTO) => void;
}

export const BookSearchFormMUI: React.FC<BookSearchFormMUIProps> = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [books, setBooks] = useState<BuchDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = Number(import.meta.env.VITE_PAGE_SIZE) || 5;
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/rest`;
  
  const buildParams = (value: string) => {
    const params: Record<string, string> = {};
    const valueLower = value.toLowerCase();

    if (/^\d{3}-\d/.test(value)) {
      params.isbn = value;
    } else if (['epub', 'hardcover', 'paperback'].includes(valueLower)) {
      params.art = valueLower.toUpperCase();
    } else if (['javascript', 'typescript', 'java', 'python'].includes(valueLower)) {
      params[valueLower] = 'true';
    } else if (value) {
      params.titel = value;
    }

    return params;
  };

  const fetchBooks = async (value: string, targetPage = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = buildParams(value);
      const { data } = await axios.get(baseUrl, {
        params: { ...params, page: targetPage, size: pageSize },
      });

      const booksArray = data._embedded?.buecher || data.content || data;
      const rawBooks = Array.isArray(booksArray) ? booksArray : [];
      const totalElementsFromResponse = data.page?.totalElements ?? data.totalElements;
      const totalPagesFromResponse = data.page?.totalPages ?? data.totalPages;
      const backendPageNumber = data.page?.number;
      const totalElements = totalElementsFromResponse ?? rawBooks.length;
      const pages = totalPagesFromResponse ?? Math.max(1, Math.ceil(totalElements / pageSize) || 1);
      const start = (targetPage - 1) * pageSize;
      const booksPage = totalPagesFromResponse ? rawBooks : rawBooks.slice(start, start + pageSize);
      const resolvedPage =
        backendPageNumber === undefined ? targetPage : backendPageNumber >= 0 ? backendPageNumber + 1 : targetPage;

      setBooks(booksPage);
      setTotalPages(pages);
      setPage(Math.min(resolvedPage, pages));
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

  const handleSearch = async () => {
    await fetchBooks(query, 1);
  };

  const handleSuggestionClick = async (s: string) => {
    setQuery(s);
    await fetchBooks(s, 1);
  };

  const updateSuggestions = (q: string) => {
    if (!q) {
      setSuggestions([]);
      return;
    }
    const s = ['EPUB', 'HARDCOVER', 'PAPERBACK', 'Bestseller', 'Neu']
      .filter((t) => t.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 5);
    setSuggestions(s);
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 3, px: 2 }}>
      <Box component="form" role="search" aria-label="Buchsuche" sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <TextField
          inputRef={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            updateSuggestions(e.target.value);
          }}
          placeholder="Teilstring des Titels, ISBN, Buchart (EPUB/HARDCOVER/PAPERBACK) oder Schlagwort"
          fullWidth
          size="medium"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="search now" onClick={handleSearch} size="small">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" onClick={handleSearch} sx={{ px: 3 }}>
          Suchen
        </Button>
      </Box>

      {suggestions.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {suggestions.map((s) => (
            <Chip key={s} label={s} onClick={() => handleSuggestionClick(s)} />
          ))}
        </Stack>
      )}

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
              onChange={(_, value) => fetchBooks(query, value)}
              disabled={loading}
            />
          )}
        </Stack>
      )}

      {!loading && !error && books.length === 0 && query && (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Keine Bücher gefunden.
        </Typography>
      )}
    </Box>
  );
};
