import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

const features = [
  'Placeholder Feature',
  'Placeholder Feature',
  'Placeholder Feature',
];

function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ px: { xs: 1, md: 2 }, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 6, md: 8 }}>
          <Stack spacing={4}>
            <Stack spacing={2} maxWidth={620}>
              <Chip
                label="Libria · Ruhige Bibliothek"
                variant="outlined"
                sx={{
                  alignSelf: 'flex-start',
                  borderRadius: 999,
                  borderColor: theme.palette.grey[300],
                  fontSize: 12,
                  letterSpacing: 0.2,
                }}
              />

              <Stack spacing={2}>
                <Typography
                  variant="h3"
                  fontWeight={800}
                  letterSpacing={-0.6}
                  sx={{
                    fontSize: { xs: '2.1rem', md: '2.7rem' },
                    lineHeight: 1.05,
                  }}
                >
                  Platzhalter Headline. Zweite Zeile.
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  lineHeight={1.7}
                  maxWidth={520}
                >
                  Platzhalter-Text für die Beschreibung. Kürzer halten, damit
                  der Fokus klar bleibt.
                </Typography>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate(isAuthenticated ? '/app' : '/login')}
                  sx={{
                    px: 3.2,
                    py: 1.1,
                    borderRadius: 999,
                    textTransform: 'none',
                    fontSize: 15,
                  }}
                >
                  {isAuthenticated ? 'CTA Platzhalter' : 'CTA Platzhalter'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/suche')}
                  sx={{
                    px: 3,
                    py: 1.1,
                    borderRadius: 999,
                    textTransform: 'none',
                    fontSize: 15,
                    borderColor: theme.palette.grey[300],
                  }}
                >
                  CTA Platzhalter
                </Button>
              </Stack>
            </Stack>
          </Stack>

          <Stack spacing={2.5} maxWidth={520}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              letterSpacing={0.3}
            >
              Abschnitt Platzhalter
            </Typography>
            <Stack spacing={1.2}>
              {features.map((item) => (
                <Paper
                  key={item}
                  elevation={0}
                  sx={{
                    p: 1.6,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.grey[200]}`,
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <Typography variant="body1" fontWeight={700}>
                    {item}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Home;
