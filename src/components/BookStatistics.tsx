import React from 'react';
import { Box, Typography, Divider, List, ListItem, ListItemText, Card, Avatar, useTheme } from '@mui/material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import EuroIcon from '@mui/icons-material/Euro';
import StarIcon from '@mui/icons-material/Star';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BlockIcon from '@mui/icons-material/Block';
import PercentIcon from '@mui/icons-material/Percent';
import type { Book } from '../types/book';

type BookStatisticsProps = {
  books: Book[];
};

export const BookStatistics: React.FC<BookStatisticsProps> = ({ books }) => {
  const theme = useTheme();
  const anzahl = books.length;
  const durchschnittspreis =
    anzahl > 0
      ? (books.reduce((sum, b) => sum + Number(b.preis ?? 0), 0) / anzahl).toFixed(2)
      : '–';
  const durchschnittsbewertung =
    anzahl > 0
      ? (books.reduce((sum, b) => sum + (b.rating ?? 0), 0) / anzahl).toFixed(2)
      : '–';

  const lieferbar = books.filter(b => b.lieferbar === true).length;
  const nichtLieferbar = books.filter(b => b.lieferbar === false).length;
  const mitRabatt = books.filter(b => typeof b.rabatt === 'number' && b.rabatt > 0).length;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  };

  // Karten-Infos als Array für Mapping
  const stats = [
    {
      label: 'Gefundene Bücher',
      value: anzahl,
      icon: <LocalLibraryIcon fontSize="medium" />, color: '#1976d2',
      valueColor: theme.palette.primary.main,
    },
    {
      label: 'Ø Preis',
      value: `${durchschnittspreis} €`,
      icon: <EuroIcon fontSize="medium" />, color: '#388e3c',
      valueColor: theme.palette.success.dark,
    },
    {
      label: 'Ø Bewertung',
      value: <>{durchschnittsbewertung} <StarIcon sx={{ fontSize: 20, mb: '-3px', color: theme.palette.warning.dark }} /></>,
      icon: <StarIcon fontSize="medium" />, color: '#f57c00',
      valueColor: theme.palette.warning.dark,
    },
    {
      label: 'Lieferbar',
      value: lieferbar,
      icon: <LocalShippingIcon fontSize="medium" />, color: theme.palette.info.main,
      valueColor: theme.palette.info.main,
    },
    {
      label: 'Nicht lieferbar',
      value: nichtLieferbar,
      icon: <BlockIcon fontSize="medium" />, color: theme.palette.error.main,
      valueColor: theme.palette.error.main,
    },
    {
      label: 'Bücher mit Rabatt',
      value: mitRabatt,
      icon: <PercentIcon fontSize="medium" />, color: theme.palette.secondary.main,
      valueColor: theme.palette.secondary.main,
    },
  ];

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, background: 'linear-gradient(135deg, #f7f7fa 60%, #e3eafc 100%)', borderRadius: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={1}>
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
        {stats.map((stat, i) => (
          <Card
            key={stat.label}
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
            <Avatar sx={{ bgcolor: stat.color, width: 38, height: 38, mr: 1.5, boxShadow: 1 }}>
              {stat.icon}
            </Avatar>
            <Box>
              <Typography color="text.secondary" fontWeight={500} fontSize={13}>
                {stat.label}
              </Typography>
              <Typography sx={{ fontSize: 24, fontWeight: 700, color: stat.valueColor, lineHeight: 1.1 }}>
                {stat.value}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Zuletzt hinzugefügte Bücher</Typography>
      <List dense>
        {books.slice(0, 5).map((book) => (
          <ListItem key={book.id} disableGutters>
            <ListItemText
              primary={<span style={{ fontWeight: 600 }}>{book.titel?.titel}</span>}
              secondary={book.datum ? formatDate(book.datum) : ''}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
