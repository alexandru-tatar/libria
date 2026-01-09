import type { Filters } from '../../domain/books/search';

export const buildQueryParams = (filters: Filters, pageSize: number) => {
    const params: Record<string, string | number | boolean> = {
        size: pageSize,
    };
    if (filters.titel) params.titel = filters.titel;
    if (filters.art) params.art = filters.art;
    if (filters.lieferbar) params.lieferbar = true;
    if (filters.schlagwoerter.length)
        params.schlagwoerter = filters.schlagwoerter.join(',');
    return params;
};
