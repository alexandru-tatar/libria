import { useEffect, useMemo } from 'react';
import { Avatar, Box, Card, Stack, Typography, useTheme } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import EuroIcon from '@mui/icons-material/Euro';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PercentIcon from '@mui/icons-material/Percent';
import StarIcon from '@mui/icons-material/Star';
import { defaultFilters, useBookSearch } from '../../hooks/useBookSearch';

const pageSize = 50;

const cardSx = (delaySeconds: number) => ({
  display: 'flex',
  alignItems: 'center',
  p: 1.2,
  boxShadow: 3,
  borderRadius: 3,
  minHeight: 80,
  transition: 'transform 0.18s, box-shadow 0.18s',
  background: 'rgba(255,255,255,0.98)',
  cursor: 'default',
  '&:hover': {
    transform: 'translateY(-3px) scale(1.018)',
    boxShadow: 6,
  },
  animation: `fadeInUp 0.7s ease ${delaySeconds}s both`,
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'none' },
  },
} as const);

export function BookStatistics() {
  const theme = useTheme();

  const { visible: books, hasMore, loadMore, loading, error } = useBookSearch(
    defaultFilters,
    pageSize,
  );

  useEffect(() => {
    if (hasMore && !loading) loadMore();
  }, [hasMore, loading, loadMore]);

  const computed = useMemo(() => {
    let count = 0;
    let preisSumme = 0;
    let ratingSumme = 0;
    let lieferbar = 0;
    let nichtLieferbar = 0;
    let mitRabatt = 0;

    for (const b of books) {
      count += 1;

      const preisZahl = Number(b.preis);
      if (Number.isFinite(preisZahl)) preisSumme += preisZahl;

      const ratingZahl = Number(b.rating);
      if (Number.isFinite(ratingZahl)) ratingSumme += ratingZahl;

      if (b.lieferbar === true) lieferbar += 1;
      if (b.lieferbar === false) nichtLieferbar += 1;

      if (typeof b.rabatt === 'number' && b.rabatt > 0) mitRabatt += 1;
    }

    const durchschnittspreis = count > 0 ? (preisSumme / count).toFixed(2) : '–';
    const durchschnittsbewertung =
      count > 0 ? (ratingSumme / count).toFixed(2) : '–';

    return {
      count,
      lieferbar,
      nichtLieferbar,
      mitRabatt,
      durchschnittspreis,
      durchschnittsbewertung,
    };
  }, [books]);

  const anzahlText = loading ? '…' : String(computed.count);

  if (loading && books.length === 0) return <div>Statistiken werden geladen…</div>;
  if (error) return <div>{`Fehler: ${error}`}</div>;

  const stats = [
    {
      label: 'Gefundene Bücher',
      value: anzahlText,
      icon: <LocalLibraryIcon fontSize="medium" />,
      color: theme.palette.primary.main,
      valueColor: theme.palette.primary.main,
    },
    {
      label: 'Ø Preis',
      value: `${computed.durchschnittspreis} €`,
      icon: <EuroIcon fontSize="medium" />,
      color: theme.palette.success.main,
      valueColor: theme.palette.success.dark,
    },
    {
      label: 'Ø Bewertung',
      value: (
        <>
          {computed.durchschnittsbewertung}{' '}
          <StarIcon sx={{ fontSize: 20, mb: '-3px', color: theme.palette.warning.dark }} />
        </>
      ),
      icon: <StarIcon fontSize="medium" />,
      color: theme.palette.warning.main,
      valueColor: theme.palette.warning.dark,
    },
    {
      label: 'Lieferbar',
      value: String(computed.lieferbar),
      icon: <LocalShippingIcon fontSize="medium" />,
      color: theme.palette.info.main,
      valueColor: theme.palette.info.main,
    },
    {
      label: 'Nicht lieferbar',
      value: String(computed.nichtLieferbar),
      icon: <BlockIcon fontSize="medium" />,
      color: theme.palette.error.main,
      valueColor: theme.palette.error.main,
    },
    {
      label: 'Bücher mit Rabatt',
      value: String(computed.mitRabatt),
      icon: <PercentIcon fontSize="medium" />,
      color: theme.palette.secondary.main,
      valueColor: theme.palette.secondary.main,
    },
  ];

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" fontWeight={700}>
          Buch-Statistiken
        </Typography>
      </Stack>

      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        {`Gefundene Bücher: ${anzahlText}`}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 2,
        }}
      >
        {stats.map(({ label, value, icon, color, valueColor }, i) => (
          <Card key={label} sx={cardSx(Number((0.1 + i * 0.07).toFixed(2)))}>
            <Avatar
              sx={{
                bgcolor: color,
                width: 38,
                height: 38,
                mr: 1.5,
                boxShadow: 1,
              }}
            >
              {icon}
            </Avatar>

            <Box>
              <Typography color="text.secondary" fontWeight={500} fontSize={13}>
                {label}
              </Typography>
              <Typography sx={{ fontSize: 24, fontWeight: 700, color: valueColor, lineHeight: 1.1 }}>
                {value}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
