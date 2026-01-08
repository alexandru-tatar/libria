import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

type Props = {
  onReset: () => void;
};

export const SearchEmptyState = ({ onReset }: Props) => (
  <Card
    elevation={0}
    sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
  >
    <CardContent sx={{ py: 6 }}>
      <Stack alignItems="center" spacing={1}>
        <Typography variant="h6" fontWeight={900}>
          Keine Bücher gefunden
        </Typography>
        <Typography color="text.secondary" align="center" sx={{ maxWidth: 520 }}>
          Passe Suche, Filter oder Tags an und versuche es erneut.
        </Typography>
        <Button
          onClick={onReset}
          variant="outlined"
          startIcon={<RefreshIcon />}
          sx={{ mt: 1, borderRadius: 2 }}
        >
          Filter zurücksetzen
        </Button>
      </Stack>
    </CardContent>
  </Card>
);
