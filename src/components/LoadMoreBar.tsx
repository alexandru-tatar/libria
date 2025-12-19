import React from 'react';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';

type Props = {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
};

export const LoadMoreBar: React.FC<Props> = ({ loading, hasMore, onLoadMore }) => {
  const handleClick = () => {
    if (!loading && hasMore) onLoadMore();
  };

  return (
    <Stack spacing={1} alignItems="center" sx={{ width: '100%' }}>
      <Button variant="contained" color="primary" disabled={loading || !hasMore} onClick={handleClick}>
        {loading ? 'Lade weitere Bücher …' : 'Mehr laden'}
      </Button>
      <Box sx={{ minHeight: 22, display: 'flex', alignItems: 'center', gap: 1 }}>
        {loading && <CircularProgress size={18} thickness={5} />}
        {!hasMore && !loading && (
          <Typography variant="body2" color="text.secondary">
            Keine weiteren Ergebnisse
          </Typography>
        )}
      </Box>
    </Stack>
  );
};
