import React, { useEffect, useMemo } from 'react';
import {
  Avatar,
  Box,
  Card,
  List,
  ListItem,
  ListItemText,
  Stack,
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
import './bookStatistics.css';

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

  const anzahl = books.length;

  const preisSumme = useMemo((): number => {
    return books.reduce((sum, { preis }) => {
      const preisZahl = Number(preis);
      return Number.isFinite(preisZahl) ? sum + preisZahl : sum;
    }, 0);
  }, [books]);

  const ratingSumme = useMemo((): number => {
    return books.reduce((sum, { rating }) => {
      const ratingZahl = Number(rating);
      return Number.isFinite(ratingZahl) ? sum + ratingZahl : sum;
    }, 0);
  }, [books]);

  const lieferbar = useMemo((): number => {
    return books.filter(({ lieferbar: isLieferbar }) => isLieferbar === true).length;
  }, [books]);

  const nichtLieferbar = useMemo((): number => {
    return books.filter(({ lieferbar: isLieferbar }) => isLieferbar === false).length;
  }, [books]);

  const mitRabatt = useMemo((): number => {
    return books.filter(({ rabatt }) => typeof rabatt === 'number' && rabatt > 0).length;
  }, [books]);

  const durchschnittspreis = anzahl > 0 ? (preisSumme / anzahl).toFixed(2) : '–';
  const durchschnittsbewertung = anzahl > 0 ? (ratingSumme / anzahl).toFixed(2) : '–';

  const anzahlText = loading ? '…' : `${anzahl}`;

  if (loading && books.length === 0) {
    return <div>Statistiken werden geladen…</div>;
  }

  if (error) {
    return <div>{`Fehler: ${error}`}</div>;
  }

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
          <StarIcon sx={{ fontSize: 20, mb: '-3px', color: theme.palette.warning.dark }} />
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
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems='center'
        justifyContent='space-between'
        className='bookStatsTopRow'
        spacing={2}
      >
        <Typography variant='h6' fontWeight={700}>
          Buch-Statistiken
        </Typography>
      </Stack>

      <Typography variant='subtitle1' fontWeight={700} className='bookStatsCount'>
        Gefundene Bücher: {anzahlText}
      </Typography>

      <Box className='bookStatsGrid'>
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

      <Typography variant='subtitle1' fontWeight={700} className='bookStatsLatestTitle'>
        Die 5 zuletzt hinzugefügten Bücher
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
