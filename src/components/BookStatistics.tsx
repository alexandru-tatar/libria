import React, { useEffect, useMemo } from 'react';
import {
  Avatar,
  Box,
  Card,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import EuroIcon from '@mui/icons-material/Euro';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PercentIcon from '@mui/icons-material/Percent';
import StarIcon from '@mui/icons-material/Star';
import { defaultFilters, useBookSearch } from '../hooks/useBookSearch';
import type { Book } from '../types/book';

const toTime = (value?: unknown): number => {
  if (!value) {
    return 0;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value !== 'string') {
    return 0;
  }

  const dateStr = value.trim();
  if (!dateStr) {
    return 0;
  }

  // Nur dd.mm.yyyy als "deutsches Datum" behandeln.
  // ISO-Datum wie 2025-02-01T00:00:00.000Z enthält auch '.', darf aber NICHT hier reinfallen.
  const isGermanDate = /^\d{1,2}\.\d{1,2}\.\d{4}$/.test(dateStr);
  if (isGermanDate) {
    const [dayStr, monthStr, yearStr] = dateStr.split('.');
    const day = parseInt(dayStr ?? '', 10);
    const month = parseInt(monthStr ?? '', 10);
    const year = parseInt(yearStr ?? '', 10);

    if (Number.isFinite(day) && Number.isFinite(month) && Number.isFinite(year)) {
      return new Date(year, month - 1, day).getTime();
    }

    return 0;
  }

  const time = Date.parse(dateStr);
  return Number.isFinite(time) ? time : 0;
};

const formatDate = (value?: unknown): string => {
  const time = toTime(value);
  if (!time) {
    return typeof value === 'string' ? value : '';
  }
  return new Date(time).toLocaleDateString('de-DE');
};

export const BookStatistics: React.FC = () => {
  const theme = useTheme();
  const pageSize = 50;

  const {
    visible: books,
    hasMore,
    loadMore,
    loading,
    error,
  } = useBookSearch(defaultFilters, pageSize);

  useEffect(() => {
    if (hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  const latestBooks = useMemo((): Book[] => {
    return [...books]
      .filter(({ datum }) => Boolean(datum))
      .sort((a, b) => toTime(b.datum) - toTime(a.datum))
      .slice(0, 5);
  }, [books]);

  if (loading && books.length === 0) {
    return <div>Statistiken werden geladen…</div>;
  }

  if (error) {
    return <div>{`Fehler: ${error}`}</div>;
  }

  const anzahl = books.length;

  const preisSumme = books.reduce((sum, { preis }) => {
    const preisZahl = Number(preis);
    return Number.isFinite(preisZahl) ? sum + preisZahl : sum;
  }, 0);

  const durchschnittspreis = anzahl > 0 ? (preisSumme / anzahl).toFixed(2) : '–';

  const ratingSumme = books.reduce((sum, { rating }) => {
    const ratingZahl = Number(rating);
    return Number.isFinite(ratingZahl) ? sum + ratingZahl : sum;
  }, 0);

  const durchschnittsbewertung = anzahl > 0 ? (ratingSumme / anzahl).toFixed(2) : '–';

  const lieferbar = books.filter(({ lieferbar: isLieferbar }) => isLieferbar === true).length;
  const nichtLieferbar = books.filter(({ lieferbar: isLieferbar }) => isLieferbar === false).length;
  const mitRabatt = books.filter(({ rabatt }) => typeof rabatt === 'number' && rabatt > 0).length;

  const stats = [
    {
      label: 'Gefundene Bücher',
      value: anzahl,
      icon: <LocalLibraryIcon fontSize='medium' />,
      color: theme.palette.primary.main,
      valueColor: theme.palette.primary.main,
    },
    {
      label: 'Ø Preis',
      value: `${durchschnittspreis} €`,
      icon: <EuroIcon fontSize='medium' />,
      color: theme.palette.success.main,
      valueColor: theme.palette.success.dark,
    },
    {
      label: 'Ø Bewertung',
      value: (
        <>
          {durchschnittsbewertung}{' '}
          <StarIcon
            sx={{
              fontSize: 20,
              mb: '-3px',
              color: theme.palette.warning.dark,
            }}
          />
        </>
      ),
      icon: <StarIcon fontSize='medium' />,
      color: theme.palette.warning.main,
      valueColor: theme.palette.warning.dark,
    },
    {
      label: 'Lieferbar',
      value: lieferbar,
      icon: <LocalShippingIcon fontSize='medium' />,
      color: theme.palette.info.main,
      valueColor: theme.palette.info.main,
    },
    {
      label: 'Nicht lieferbar',
      value: nichtLieferbar,
      icon: <BlockIcon fontSize='medium' />,
      color: theme.palette.error.main,
      valueColor: theme.palette.error.main,
    },
    {
      label: 'Bücher mit Rabatt',
      value: mitRabatt,
      icon: <PercentIcon fontSize='medium' />,
      color: theme.palette.secondary.main,
      valueColor: theme.palette.secondary.main,
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        background: 'linear-gradient(135deg, #f7f7fa 60%, #e3eafc 100%)',
        borderRadius: 4,
      }}
    >
      <Typography variant='h4' fontWeight={700} mb={1}>
        Buch-Statistiken
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: { xs: 1.5, sm: 2 },
          mb: 2,
        }}
      >
        {stats.map(({ label, value, icon, color, valueColor }, i) => (
          <Card
            key={label}
            sx={{
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
              animation: `fadeInUp 0.7s ease ${(0.1 + i * 0.07).toFixed(2)}s both`,
              '@keyframes fadeInUp': {
                from: { opacity: 0, transform: 'translateY(20px)' },
                to: { opacity: 1, transform: 'none' },
              },
            }}
          >
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
              <Typography color='text.secondary' fontWeight={500} fontSize={13}>
                {label}
              </Typography>

              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: valueColor,
                  lineHeight: 1.1,
                }}
              >
                {value}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant='subtitle1' fontWeight={600} gutterBottom>
        Die 5 zuletzt hinzugefügte Bücher
      </Typography>

      <List dense>
        {latestBooks.map(({ id, titel, datum }) => (
          <ListItem key={id} disableGutters>
            <ListItemText
              primary={<span style={{ fontWeight: 600 }}>{titel?.titel}</span>}
              secondary={datum ? formatDate(datum) : ''}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
