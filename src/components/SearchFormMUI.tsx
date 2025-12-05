import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
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

  const handleSearch = async () => {
    const baseUrl = 'https://localhost:3000/rest';

    setLoading(true);
    setError(null);

    try {
      // Suchparameter: ISBN, Buchart, Schlagwort oder Titel
      const params: Record<string, string> = {};
      const queryLower = query.toLowerCase();

      // ISBN-Suche (Format: 978-..., nur Zahlen mit Bindestrichen)
      if (/^\d{3}-\d/.test(query)) {
        params.isbn = query;
      }
      // Buchart-Suche
      else if (['epub', 'hardcover', 'paperback'].includes(queryLower)) {
        params.art = queryLower.toUpperCase();
      }
      // Bekannte Schlagwörter als eigene Parameter
      else if (['javascript', 'typescript', 'java', 'python'].includes(queryLower)) {
        params[queryLower] = 'true';
      } else if (query) {
        // Sonst als Titel-Suche
        params.titel = query;
      }

      const { data } = await axios.get(baseUrl, { params });

      // Backend kann HAL-Format oder direktes Array zurückgeben
      const booksArray = data._embedded?.buecher || data.content || data;

      setBooks(Array.isArray(booksArray) ? booksArray : []);
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

  const handleSuggestionClick = async (s: string) => {
    setQuery(s);

    setLoading(true);
    setError(null);

    try {
      // Suchparameter: Buchart, Schlagwort oder Titel
      const params: Record<string, string> = {};
      const sLower = s.toLowerCase();

      // Buchart als art-Parameter
      if (['epub', 'hardcover', 'paperback'].includes(sLower)) {
        params.art = sLower.toUpperCase();
      }
      // Schlagwörter
      else if (['javascript', 'typescript', 'java', 'python'].includes(sLower)) {
        params[sLower] = 'true';
      } else {
        params.titel = s;
      }

      const { data } = await axios.get('https://localhost:3000/rest', { params });

      const booksArray = data._embedded?.buecher || data.content || data;
      setBooks(Array.isArray(booksArray) ? booksArray : []);
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

  // Simple suggestions
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
        <div className="book-results-grid">
          {books.map((book) => (
            <BookMediaMUI key={book.isbn} book={book} />
          ))}
        </div>
      )}

      {!loading && !error && books.length === 0 && query && (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Keine Bücher gefunden.
        </Typography>
      )}
    </Box>
  );
};
