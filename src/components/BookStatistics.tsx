import React from 'react';
import type { Book } from '../types/book';

type BookStatisticsProps = {
  books: Book[];
};

export const BookStatistics: React.FC<BookStatisticsProps> = ({ books }) => {
  const anzahl = books.length;
  const durchschnittspreis =
    anzahl > 0
      ? (books.reduce((sum, b) => sum + Number(b.preis ?? 0), 0) / anzahl).toFixed(2)
      : '–';
  const durchschnittsbewertung =
    anzahl > 0
      ? (books.reduce((sum, b) => sum + (b.rating ?? 0), 0) / anzahl).toFixed(2)
      : '–';

  return (
    <div>
      <h2>Buch-Statistiken</h2>
      <p>Gefundene Bücher: {anzahl}</p>
      <p>Ø Preis: {durchschnittspreis} €</p>
      <p>Ø Bewertung: {durchschnittsbewertung} ★</p>
    </div>
  );
};
