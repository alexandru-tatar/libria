import type { BuchDTO } from '../../types/book';

export type BookArt = '' | 'EPUB' | 'HARDCOVER' | 'PAPERBACK';

type SortField = 'titel' | 'preis' | 'datum' | 'rating';
type SortDir = 'asc' | 'desc';
export type Sort = `${SortField},${SortDir}`;

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

export const normalizeIsbn = (value: string) =>
  value.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();

const parseNumber = (value: string) =>
  value.trim() ? Number(value) : undefined;

const normalizeSubtitle = (value?: string | null): string | undefined => {
  if (value == null) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.toLowerCase() === 'null') return undefined;
  return trimmed;
};

export const normalizeBook = (book: BuchDTO): BuchDTO => {
  const normalizedTitle = book.titel
    ? { ...book.titel, untertitel: normalizeSubtitle(book.titel.untertitel) }
    : book.titel;
  return { ...book, titel: normalizedTitle };
};

export const sortBooks = (items: BuchDTO[], sort: Sort): BuchDTO[] => {
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
      return (
        aVal.toString().localeCompare(bVal.toString(), 'de', {
          sensitivity: 'base',
        }) * direction
      );
    }
    if (aVal === bVal) return 0;
    return aVal > bVal ? direction : -direction;
  });
};

export const filterBooks = (items: BuchDTO[], filters: Filters): BuchDTO[] => {
  const selectedTags = filters.schlagwoerter.map((s) => s.toLowerCase());
  const minPrice = parseNumber(filters.preisVon);
  const maxPrice = parseNumber(filters.preisBis);
  const minDiscount = parseNumber(filters.rabattAb);
  const minRating = filters.ratingMin ? Number(filters.ratingMin) : undefined;
  const isbnNeedle = filters.isbn.trim()
    ? normalizeIsbn(filters.isbn.trim())
    : '';

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

export const dedupeById = (items: BuchDTO[]) =>
  Array.from(items.reduce((m, b) => m.set(b.id, b), new Map<number, BuchDTO>()).values());
