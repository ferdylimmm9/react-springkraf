import React from 'react';

export default function usePaginateData<T>(data: T[], limit = 15) {
  const [page, setPage] = React.useState(1);
  const items = data.slice(0, page * 15);

  const hasNextPage = React.useMemo(() => {
    return page * limit < data.length;
  }, [data.length, limit, page]);

  const loadNextPage = React.useCallback(() => {
    setPage((page) => page + 1);
  }, []);

  const resetPage = React.useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    setPage,
    items,
    loadNextPage,
    hasNextPage,
    resetPage,
  };
}
