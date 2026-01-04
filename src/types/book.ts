
export type Buchart = 'EPUB' | 'HARDCOVER' | 'PAPERBACK';

export interface TitelDTO {
  id?: number;
  titel: string;
  untertitel?: string;
}

export interface AbbildungDTO {
  id?: number;
  beschriftung: string;
  contentType: string;
}

export interface BuchDtoOhneRef {
  id?: number;
  isbn: string;
  rating: number;
  art?: Buchart;
  preis: number;
  rabatt?: number;
  lieferbar?: boolean;
  datum?: string;
  homepage?: string;
  schlagwoerter?: string[];
}

export interface BuchDTO extends BuchDtoOhneRef {
  titel: TitelDTO;
  abbildungen?: AbbildungDTO[];
}

export type BookItems = BuchDTO;
export type Book = BuchDTO;
