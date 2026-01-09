import { Box, Button, Container, Stack, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toApp = () => navigate(isAuthenticated ? '/app' : '/login');
  const toSearch = () => navigate('/suche');

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Stack spacing={3}>
          <Typography
            variant="overline"
            color="text.secondary"
            letterSpacing={1}
          >
            Libria
          </Typography>

          <Stack spacing={1}>
            <Typography variant="h3" fontWeight={800}>
              Willkommen bei Libria
            </Typography>
            <Typography color="text.secondary">
              Entspannt stöbern, schnell finden und sicher verwalten – alles in
              einer Oberfläche.
            </Typography>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              size="large"
              onClick={toApp}
              endIcon={<ArrowForwardRoundedIcon />}
            >
              {isAuthenticated ? 'Zur App' : 'Jetzt anmelden'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={toSearch}
              startIcon={<SearchRoundedIcon />}
            >
              Suche öffnen
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
