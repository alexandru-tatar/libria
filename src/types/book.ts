// src/types/book.ts - KOMPLETTE Version basierend auf deinen Backend-DTOs

export type Buchart = 'EPUB' | 'HARDCOVER' | 'PAPERBACK';

export interface TitelDTO {
  titel: string;
  untertitel?: string;
}

export interface AbbildungDTO {
  beschriftung: string;
  contentType: string;
}

export interface BuchDtoOhneRef {
  isbn: string;                    // REQUIRED
  rating: number;                  // 0-5
  art?: Buchart;
  preis: number;                   // Decimal → number im Frontend
  rabatt?: number;                 // 0-1
  lieferbar?: boolean;
  datum?: string;                  // ISO8601 string
  homepage?: string;               // URL
  schlagwoerter?: string[];
}

export interface BuchDTO extends BuchDtoOhneRef {
  titel: TitelDTO;
  abbildungen?: AbbildungDTO[];
}

// Alias für Kompatibilität (falls du es woanders verwendest)
export type BookItems = BuchDTO;
export type Book = BuchDTO;
