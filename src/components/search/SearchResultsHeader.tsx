import { CircularProgress, Stack, Typography } from '@mui/material';
import { EntryCount } from '../EntryCountComponent';

type Props = {
  loadingMore: boolean;
  totalItems?: number;
  visibleCount: number;
};

export const SearchResultsHeader = ({
  loadingMore,
  totalItems,
  visibleCount,
}: Props) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center">
    <Typography variant="h6" fontWeight={900}>
      Ergebnisse
    </Typography>
    <Stack direction="row" spacing={1} alignItems="center">
      {loadingMore && <CircularProgress size={18} />}
      <EntryCount count={totalItems ?? visibleCount} label="Bücher" />
    </Stack>
  </Stack>
);
