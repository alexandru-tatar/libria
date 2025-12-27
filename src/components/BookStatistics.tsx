import React, { useEffect, useState } from 'react';
import { getAllBooks } from '../api/books';
import type { Book } from '../types/book';

export const BookStatistics: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllBooks();
        setBooks(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Fehler beim Laden der Buchdaten');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const anzahl = books.length;
  const durchschnittspreis =
    anzahl > 0
      ? (books.reduce((sum, b) => sum + Number(b.preis ?? 0), 0) / anzahl).toFixed(2)
      : '–';
  const durchschnittsbewertung =
    anzahl > 0
      ? (books.reduce((sum, b) => sum + (b.rating ?? 0), 0) / anzahl).toFixed(2)
      : '–';

  if (loading) return <div>Statistiken werden geladen…</div>;
  if (error) return <div>Fehler: {error}</div>;

  return (
    <div>
      <h2>Buch-Statistiken</h2>
      <p>Gefundene Bücher: {anzahl}</p>
      <p>Ø Preis: {durchschnittspreis} €</p>
      <p>Ø Bewertung: {durchschnittsbewertung} ★</p>
    </div>
  );
};
