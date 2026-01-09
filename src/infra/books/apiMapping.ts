import type { BuchDTO } from '../../types/book';

type ApiResponse = {
    _embedded?: { buecher?: BuchDTO[] };
    content?: BuchDTO[];
    page?: { totalPages?: number; totalElements?: number };
    totalPages?: number;
    totalElements?: number;
};

export const extractBooks = (data: ApiResponse): BuchDTO[] => {
    const embedded = data._embedded?.buecher;
    if (Array.isArray(embedded)) return embedded;
    if (Array.isArray(data.content)) return data.content;
    return [];
};

export const extractTotalPages = (data: ApiResponse): number => {
    const fromPage = data.page?.totalPages;
    if (typeof fromPage === 'number') return fromPage;
    if (typeof data.totalPages === 'number') return data.totalPages;
    return 0;
};

export type { ApiResponse };
