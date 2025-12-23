import { useCallback, useEffect, useMemo, useRef, useState, useDeferredValue, useTransition } from 'react';
import axios from 'axios';
import type { BuchDTO } from '../types/book';
import { api } from '../api/axios';

export type BookArt = '' | 'EPUB' | 'HARDCOVER' | 'PAPERBACK';

type SortField = 'titel' | 'preis' | 'datum' | 'rating';
type SortDir = 'asc' | 'desc';
type Sort = `${SortField},${SortDir}`;

export type Filters = {
  titel: string;
  isbn: string;
  art: BookArt;
  lieferbar: boolean;
  preisVon: string;
  preisBis: string;
  rabattAb: string;
  ratingMin: number;
  schlagwoerter: string[];
  sort: Sort;
};

type ApiResponse = {
  _embedded?: { buecher?: BuchDTO[] };
  content?: BuchDTO[];
  page?: { totalPages?: number };
  totalPages?: number;
};

type FetchMode = 'replace' | 'append';

type SearchState = {
  items: BuchDTO[];
  page: number;
  totalPages: number;
  lastBatchSize?: number;
  loading: boolean;
  loadingMore: boolean;
  error?: string;
};

const initialState: SearchState = {
  items: [],
  page: 0,
  totalPages: 0,
  lastBatchSize: undefined,
  loading: false,
  loadingMore: false,
  error: undefined,
};

export const defaultFilters = {
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
} satisfies Filters;

const useLatestRef = <T,>(value: T) => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
};

const normalizeIsbn = (value: string) => value.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();
const parseNumber = (value: string) => (value.trim() ? Number(value) : undefined);

const isCanceledError = (error: unknown, signal: AbortSignal) =>
  signal.aborted ||
  (axios.isAxiosError(error) && error.code === 'ERR_CANCELED') ||
  (error instanceof DOMException && error.name === 'AbortError') ||
  (error instanceof Error && error.name === 'CanceledError');

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

const sortBooks = (items: BuchDTO[], sort: Sort): BuchDTO[] => {
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

export const useBookFilters = (initialFilters: Filters = defaultFilters) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const setFilterValue = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setFilters((prev) => {
      const exists = prev.schlagwoerter.includes(tag);
      const schlagwoerter = exists ? prev.schlagwoerter.filter((x) => x !== tag) : [...prev.schlagwoerter, tag];
      return { ...prev, schlagwoerter };
    });
  }, []);

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  return { filters, setFilterValue, toggleTag, resetFilters };
};

export const useBookSearch = (filters: Filters, pageSize: number) => {
  const [state, setState] = useState<SearchState>(initialState);

  const requestRef = useRef(0);
  const abortRef = useRef<AbortController | undefined>(undefined);

  // React 18 - https://react.dev/reference/react/useDeferredValue
  const deferredFilters = useDeferredValue(filters);
  const filtersRef = useLatestRef(deferredFilters);

  const queryParams = useMemo(() => buildQueryParams(deferredFilters, pageSize), [deferredFilters, pageSize]);
  const queryParamsRef = useLatestRef(queryParams);

  // React 18 - https://react.dev/reference/react/useTransition
  const [isPending, startTransition] = useTransition();

  const hasMore = useMemo(() => {
    if (state.lastBatchSize === 0) {
      return false;
    }
    if (state.lastBatchSize !== undefined && state.lastBatchSize < pageSize) {
      return false;
    }
    if (state.totalPages > 0) {
      return state.page + 1 < state.totalPages;
    }
    const batchSize = state.lastBatchSize ?? pageSize;
    return state.items.length >= batchSize;
  }, [pageSize, state.items.length, state.lastBatchSize, state.page, state.totalPages]);

  const beginFetch = useCallback((mode: FetchMode) => {
    setState((prev) => {
      if (mode === 'replace') return { ...initialState, loading: true };
      return { ...prev, error: undefined, loadingMore: true };
    });
  }, []);

  const endFetch = useCallback((requestId: number) => {
    if (requestId !== requestRef.current) return;
    setState((prev) => ({ ...prev, loading: false, loadingMore: false }));
  }, []);

  const apply404 = useCallback((mode: FetchMode, pageToLoad: number) => {
    setState((prev) => {
      if (mode === 'replace') return { ...initialState, page: pageToLoad, totalPages: 0, lastBatchSize: 0, error: undefined };
      return { ...prev, totalPages: prev.page + 1, lastBatchSize: 0, error: undefined };
    });
  }, []);

  const applyError = useCallback((error: unknown) => {
    const message = axios.isAxiosError(error)
      ? `HTTP Error: ${error.response?.status ?? error.message}`
      : error instanceof Error
      ? error.message
      : 'Fehler beim Laden der Bücher';

    setState((prev) => ({ ...prev, error: message }));
  }, []);

  const applySuccess = useCallback((data: ApiResponse, mode: FetchMode, pageToLoad: number) => {
    const activeFilters = filtersRef.current;

    const raw = extractBooks(data);
    const filtered = filterBooks(raw, activeFilters);
    const sorted = sortBooks(filtered, activeFilters.sort);

    setState((prev) => {
      const merged = mode === 'replace' ? sorted : [...prev.items, ...sorted];
      return {
        items: sortBooks(dedupeByIsbn(merged), activeFilters.sort),
        page: pageToLoad,
        totalPages: extractTotalPages(data),
        lastBatchSize: sorted.length,
        loading: prev.loading,
        loadingMore: prev.loadingMore,
        error: undefined,
      };
    });
  }, [filtersRef]);

  const fetchPage = useCallback((pageToLoad: number, mode: FetchMode) => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    beginFetch(mode);

    const activeQueryParams = queryParamsRef.current;

    api
      .get<ApiResponse>('/', {
        params: { ...activeQueryParams, page: pageToLoad },
        signal: controller.signal,
      })
      .then(({ data }) => {
        if (requestId !== requestRef.current) return;
        applySuccess(data, mode, pageToLoad);
      })
      .catch((error) => {
        if (requestId !== requestRef.current) return;
        if (isCanceledError(error, controller.signal)) return;

        if (axios.isAxiosError(error) && error.response?.status === 404) {
          apply404(mode, pageToLoad);
          return;
        }

        applyError(error);
      })
      .finally(() => {
        endFetch(requestId);
      });
  }, [apply404, applyError, applySuccess, beginFetch, endFetch, queryParamsRef]);

  useEffect(() => {
    startTransition(() => {
      fetchPage(0, 'replace');
    });
  }, [queryParams, startTransition, fetchPage]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const loadMore = useCallback(() => {
    if (state.loading || state.loadingMore || !hasMore) return;
    fetchPage(state.page + 1, 'append');
  }, [fetchPage, hasMore, state.loading, state.loadingMore, state.page]);

  const refetch = useCallback(() => {
    startTransition(() => {
      fetchPage(0, 'replace');
    });
  }, [fetchPage, startTransition]);

  const isEmpty = useMemo(() => !state.loading && !state.error && state.items.length === 0, [
    state.loading,
    state.error,
    state.items.length,
  ]);

  return {
    ...state,
    visible: state.items,
    hasMore,
    loadMore,
    refetch,
    isEmpty,
    isPending,
  };
};
