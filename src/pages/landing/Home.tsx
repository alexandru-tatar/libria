import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
      <Container maxWidth="lg">
        <Stack
          spacing={{ xs: 6, md: 8 }}
          direction={{ xs: 'column', md: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          sx={{ py: { xs: 6, md: 10 } }}
        >
          {/* Linke Seite: Text / CTA */}
          <Stack spacing={3} maxWidth={520}>
            <Chip
              label="Libria · Deine ruhige Bibliothek"
              variant="outlined"
              sx={{
                alignSelf: 'flex-start',
                borderRadius: 999,
                borderColor: theme.palette.grey[300],
                fontSize: 13,
                letterSpacing: 0.3,
                bgcolor: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(10px)',
              }}
            />

            <Typography
              variant="h3"
              fontWeight={700}
              letterSpacing={-0.5}
              sx={{
                fontSize: { xs: '2.1rem', md: '2.8rem' },
              }}
            >
              Alles im Blick.
              <br />
              Klar, ruhig, fokussiert.
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              lineHeight={1.7}
              sx={{ fontSize: { xs: '0.98rem', md: '1.05rem' } }}
            >
              Libria bündelt deine Bibliothek, bringt Ordnung in deine Titel
              und hält dich im Flow. Minimal, leicht und ohne visuelle
              Störgeräusche – genau das, was du gerade lesen willst.
            </Typography>

            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(isAuthenticated ? '/app' : '/login')}
                sx={{
                  px: 3.5,
                  py: 1.3,
                  borderRadius: 999,
                  textTransform: 'none',
                  fontSize: 15,
                  boxShadow: '0 18px 40px rgba(15, 23, 42, 0.18)',
                  transition: 'transform 150ms ease, box-shadow 150ms ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 22px 50px rgba(15, 23, 42, 0.22)',
                  },
                }}
              >
                {isAuthenticated ? 'Zum Dashboard' : 'Jetzt starten'}
              </Button>
              <Button
                variant="text"
                size="large"
                onClick={() => navigate('/app')}
                sx={{
                  px: 2,
                  textTransform: 'none',
                  fontSize: 15,
                }}
              >
                Mehr erfahren
              </Button>
            </Stack>

            <Stack
              direction="row"
              spacing={3}
              sx={{ mt: 1 }}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Stack spacing={0.3}>
                <Typography variant="subtitle2" fontWeight={600}>
                  0 Ablenkung
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Fokus auf Text & Struktur
                </Typography>
              </Stack>
              <Stack spacing={0.3}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Intuitiv
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Alles da, wo du es erwartest
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Rechte Seite: „Mockup“ / Card */}
          <Box
            sx={{
              width: { xs: '100%', md: 420 },
              maxWidth: 480,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                aspectRatio: '4 / 3',
                borderRadius: 5,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: `linear-gradient(145deg,
                  rgba(255,255,255,0.95),
                  rgba(245,248,255,0.96)
                )`,
                border: `1px solid ${theme.palette.grey[200]}`,
                boxShadow:
                  '0 18px 45px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(18px)',
              }}
            >
              {/* Header */}
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack spacing={0.2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Heute
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    Deine Bibliothek, neu gedacht.
                  </Typography>
                </Stack>
                <Chip
                  label="Im Flow"
                  size="small"
                  sx={{
                    borderRadius: 999,
                    fontSize: 11,
                    bgcolor: theme.palette.grey[900],
                    color: theme.palette.common.white,
                  }}
                />
              </Stack>

              {/* Content / „Cards“ */}
              <Stack spacing={2.2} sx={{ mt: 1.5 }}>
                {/* Aktuell lesen */}
                <Box
                  sx={{
                    borderRadius: 3,
                    p: 1.6,
                    background: `linear-gradient(135deg,
                      ${theme.palette.grey[50]},
                      ${theme.palette.grey[100]}
                    )`,
                    border: `1px solid ${theme.palette.grey[200]}`,
                  }}
                >
                  <Typography variant="overline" color="text.secondary">
                    Aktuell
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    „Deep Work“ · Cal Newport
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.6 }}
                  >
                    Kapitel 4 · 62% gelesen
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={62}
                    sx={{
                      mt: 1.2,
                      height: 6,
                      borderRadius: 999,
                      bgcolor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 999,
                      },
                    }}
                  />
                </Box>

                {/* Kleine Übersichtskacheln */}
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ mt: 0.5 }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      borderRadius: 3,
                      p: 1.4,
                      border: `1px solid ${theme.palette.grey[200]}`,
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Gesamt
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      128
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Titel in deiner Bibliothek
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      borderRadius: 3,
                      p: 1.4,
                      border: `1px solid ${theme.palette.grey[200]}`,
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Warteliste
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      7
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Als Nächstes eingeplant
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              {/* Footer Text */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, textAlign: 'right' }}
              >
                Ruhige Oberfläche. Starke Struktur.
              </Typography>
            </Paper>
          </Box>
        </Stack>
      </Container>
  );
}

export default Home;