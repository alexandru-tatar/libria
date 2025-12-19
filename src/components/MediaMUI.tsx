import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Stack, Chip, Divider } from '@mui/material';
import type { BookItems } from '../types/book';

export const BookMediaMUI: React.FC<{ book: BookItems }> = ({ book }) => {
  const { titel, abbildungen, rating, preis, art, isbn, schlagwoerter, datum, lieferbar } = book;

  const coverImage = abbildungen?.[0];
  const coverUrl = coverImage ? `data:${coverImage.contentType};base64,...` : undefined;
  const priceLabel = preis !== undefined ? `€${Number(preis).toFixed(2)}` : '';
  const ratingLabel = rating !== undefined ? `${rating}/5` : undefined;

  return (
    <Card
      variant="outlined"
      className="book-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 3,
        overflow: 'hidden',
        background: '#ffffff',
        color: '#0f172a',
        boxShadow: '0 12px 40px rgba(15,23,42,0.12)',
        border: '1px solid rgba(15,23,42,0.05)',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      <Box sx={{ position: 'relative', bgcolor: '#f7f8fb', width: 260, flexShrink: 0 }}>
        {coverUrl ? (
          <CardMedia
            component="img"
            image={coverUrl}
            alt={titel.titel}
            sx={{ width: '100%', height: '100%', minHeight: 220, objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              minHeight: 220,
              background: 'radial-gradient(circle at 20% 20%, rgba(15,23,42,0.08), transparent 35%), radial-gradient(circle at 80% 10%, rgba(37,99,235,0.08), transparent 32%), radial-gradient(circle at 50% 80%, rgba(16,185,129,0.1), transparent 30%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: '#94a3b8',
              fontWeight: 600,
            }}
          >
            Keine Abbildung
          </Box>
        )}

        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            gap: 0.75,
            alignItems: 'center',
          }}
        >
          {ratingLabel && (
            <Chip
              label={`★ ${ratingLabel}`}
              size="small"
              sx={{ bgcolor: '#0f172a', color: '#fbbf24', fontWeight: 700 }}
            />
          )}
          {art && (
            <Chip
              label={art}
              size="small"
              sx={{ bgcolor: 'rgba(15,23,42,0.75)', color: '#e2e8f0', fontWeight: 600 }}
            />
          )}
        </Box>

        {priceLabel && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              px: 1.75,
              py: 0.65,
              borderRadius: 999,
              background: 'linear-gradient(120deg, #1976d2, #1565c0)',
              color: '#eaf3ff',
              fontWeight: 800,
              letterSpacing: 0.2,
              boxShadow: '0 12px 30px rgba(21,101,192,0.25)',
            }}
          >
            {priceLabel}
          </Box>
        )}
      </Box>

      <CardContent
        sx={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          p: 2.5,
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Stack spacing={0.75}>
          <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 800, letterSpacing: 0.3 }}>
            {titel.titel}
          </Typography>
          {titel.untertitel && (
            <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.5 }}>
              {titel.untertitel}
            </Typography>
          )}
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={0.75}>
          {isbn && (
            <Chip
              label={`ISBN ${isbn}`}
              size="small"
              sx={{ bgcolor: 'rgba(15,23,42,0.06)', color: '#0f172a', fontWeight: 600 }}
            />
          )}
          {datum && (
            <Chip
              label={new Date(datum).toLocaleDateString()}
              size="small"
              sx={{ bgcolor: 'rgba(37,99,235,0.08)', color: '#0f172a', fontWeight: 600 }}
            />
          )}
          {lieferbar !== undefined && (
            <Chip
              label={lieferbar ? 'Lieferbar' : 'Nicht lieferbar'}
              size="small"
              sx={{
                bgcolor: lieferbar ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                color: lieferbar ? '#065f46' : '#991b1b',
                fontWeight: 700,
              }}
            />
          )}
        </Stack>

        {schlagwoerter?.length ? (
          <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={0.5}>
            {schlagwoerter.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{ bgcolor: 'rgba(15,23,42,0.05)', color: '#0f172a', fontWeight: 600 }}
              />
            ))}
          </Stack>
        ) : null}

        <Divider sx={{ borderColor: 'rgba(15,23,42,0.07)' }} />

        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 'auto', color: '#475569' }}>
          {ratingLabel && (
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Rating: {ratingLabel}
            </Typography>
          )}
          {art && (
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {art}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
