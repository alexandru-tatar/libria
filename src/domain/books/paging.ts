export type PagingState = {
    itemsLength: number;
    lastBatchSize?: number;
    page: number;
    totalPages: number;
};

export const computeHasMore = (
    state: PagingState,
    pageSize: number,
): boolean => {
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
    return state.itemsLength >= batchSize;
};
