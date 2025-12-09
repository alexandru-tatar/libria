import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import type { BookItems } from '../types/book';

export const BookMediaMUI: React.FC<{ book: BookItems }> = ({ book }) => {
  const { titel, abbildungen, rating, preis, art } = book;

  // Get cover image from abbildungen if available
  const coverImage = abbildungen?.[0];
  const coverUrl = coverImage ? `data:${coverImage.contentType};base64,...` : undefined; // adjust as needed

  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {coverUrl ? (
        <CardMedia
          component="img"
          image={coverUrl}
          alt={titel.titel}
          sx={{ width: '100%', height: 180, objectFit: 'cover' }}
        />
      ) : (
        <Box sx={{ width: '100%', height: 180, background: '#f4f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">Keine Abbildung</Typography>
        </Box>
      )}

      <CardContent sx={{ flex: '1 1 auto' }}>
        <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 700 }}>
          {titel.titel}
        </Typography>
        {titel.untertitel && (
          <Typography variant="body2" color="text.secondary">
            {titel.untertitel}
          </Typography>
        )}
        {rating && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            ⭐ {rating}/5
          </Typography>
        )}
        {preis && (
          <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
            €{Number(preis).toFixed(2)}
          </Typography>
        )}
        {art && (
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
            {art}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
