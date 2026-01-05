import { useEffect } from 'react';
import { Box, Typography, Stack, Divider, Chip } from '@mui/material';
import type { BookItems } from '../types/book';

export const BookDetail = ({
  book,
  onClose,
}: {
  book: BookItems;
  onClose: () => void;
}) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const imageUrl = book.abbildungen?.[0]
    ? `/api/books/${book.id}/image/${book.abbildungen[0].id}`
    : null;
  const subtitle = book.titel?.untertitel?.trim();
  const hasSubtitle = !!subtitle && subtitle.toLowerCase() !== 'null';

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
      }}
    >
      <Box onClick={onClose} sx={{ position: 'absolute', inset: 0 }} />

      <Box
        sx={{
          position: 'relative',
          width: { xs: '90%', md: '60%' },
          maxHeight: '85vh',
          bgcolor: 'background.paper',
          borderRadius: 3,
          p: 3,
          overflowY: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {/* Sticky X */}
        <Box
          onClick={onClose}
          sx={{
            position: 'sticky',
            top: 16,
            right: 16,
            ml: 'auto',
            cursor: 'pointer',
            fontSize: 22,
            fontWeight: 900,
            zIndex: 10,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          ✕
        </Box>

        {/* Header */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '180px 1fr' },
            gap: 2,
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: 220,
              bgcolor: '#eee',
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Buch"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Typography
                color="text.secondary"
                sx={{ ml: 2, textAlign: 'center' }}
              >
                Keine Abbildung verfügbar
              </Typography>
            )}
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {book.titel?.titel ?? 'Kein Titel'}
            </Typography>
            {hasSubtitle && (
              <Typography variant="subtitle1" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Details */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <Detail label="ISBN" value={book.isbn} />
          {book.art && <Detail label="Art" value={book.art} />}
          <Detail label="Preis" value={`${book.preis} €`} />
          <Detail label="Rating" value={`${book.rating} ⭐`} />
          <Detail label="Rabatt" value={`${book.rabatt} €`} />
          <Detail
            label="Erscheinungsdatum"
            value={book.datum ? new Date(book.datum).toLocaleDateString() : '—'}
          />
          <Typography
            sx={{ fontWeight: 700, color: book.lieferbar ? 'green' : 'red' }}
          >
            {book.lieferbar ? 'Verfügbar' : 'Derzeit nicht verfügbar'}
          </Typography>
          {book.homepage && (
            <a href={book.homepage} target="_blank" rel="noopener noreferrer">
              Zur Homepage
            </a>
          )}
        </Box>

        {/* Schlagwörter */}
        {Array.isArray(book.schlagwoerter) && book.schlagwoerter.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography fontWeight={600}>Schlagwörter</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {book.schlagwoerter.map((tag, i) => (
                <Chip key={i} label={tag} />
              ))}
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
};

const Detail = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <Box>
    <Typography fontWeight={600}>{label}</Typography>
    <Typography color="text.secondary">{value}</Typography>
  </Box>
);
