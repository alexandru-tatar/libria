import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Stack,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { BookItems } from '../types/book';

export const BookMediaMUI: React.FC<{ book: BookItems }> = ({ book }) => {
  const {
    titel,
    abbildungen,
    rating,
    preis,
    art,
    isbn,
    schlagwoerter,
    datum,
    lieferbar,
  } = book;

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const cardShadow = isDark
    ? '0 18px 50px rgba(0,0,0,0.45)'
    : '0 12px 40px rgba(15,23,42,0.12)';
  const hoverShadow = isDark
    ? '0 22px 58px rgba(0,0,0,0.55)'
    : '0 14px 44px rgba(15,23,42,0.16)';
  const mediaBg = alpha(theme.palette.primary.main, isDark ? 0.1 : 0.05);
  const subtitleColor = theme.palette.text.secondary;
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.7 : 1);

  const coverImage = abbildungen?.[0];
  const coverUrl = coverImage
    ? `data:${coverImage.contentType};base64,...`
    : undefined;
  const priceLabel = preis !== undefined ? `€${Number(preis).toFixed(2)}` : '';
  const ratingLabel = rating !== undefined ? `${rating}/5` : undefined;

  return (
    <Card
      variant="outlined"
      className="book-card"
      sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: alpha(
          theme.palette.background.paper,
          isDark ? 0.96 : 1,
        ),
        color: theme.palette.text.primary,
        boxShadow: cardShadow,
        border: `1px solid ${alpha(
          theme.palette.divider,
          isDark ? 0.6 : 0.9,
        )}`,
        width: '100%',
        maxWidth: '100%',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: hoverShadow,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          bgcolor: mediaBg,
          width: { xs: '100%', sm: 260 },
          flexShrink: 0,
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
      >
        {coverUrl ? (
          <CardMedia
            component="img"
            image={coverUrl}
            alt={titel.titel}
            sx={{
              width: '100%',
              height: '100%',
              minHeight: 220,
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              minHeight: 220,
              background: `radial-gradient(circle at 20% 20%, ${alpha(
                theme.palette.primary.main,
                isDark ? 0.16 : 0.12,
              )}, transparent 35%), radial-gradient(circle at 80% 10%, ${alpha(
                theme.palette.info.main,
                isDark ? 0.16 : 0.12,
              )}, transparent 32%), radial-gradient(circle at 50% 80%, ${alpha(
                theme.palette.success.main,
                isDark ? 0.22 : 0.12,
              )}, transparent 30%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: subtitleColor,
              fontWeight: 600,
              textAlign: 'center',
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
              sx={{
                bgcolor: alpha(
                  theme.palette.warning.main,
                  isDark ? 0.22 : 0.14,
                ),
                color: theme.palette.warning.main,
                fontWeight: 700,
              }}
            />
          )}
          {art && (
            <Chip
              label={art}
              size="small"
              sx={{
                bgcolor: alpha(
                  theme.palette.primary.main,
                  isDark ? 0.24 : 0.14,
                ),
                color: isDark
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark,
                fontWeight: 600,
              }}
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
              background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: theme.palette.getContrastText(theme.palette.primary.main),
              fontWeight: 800,
              letterSpacing: 0.2,
              boxShadow: isDark
                ? '0 12px 30px rgba(0,0,0,0.35)'
                : '0 12px 30px rgba(21,101,192,0.25)',
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
          <Typography
            variant="subtitle1"
            component="h3"
            sx={{ fontWeight: 800, letterSpacing: 0.3 }}
          >
            {titel.titel}
          </Typography>
          {titel.untertitel && (
            <Typography
              variant="body2"
              sx={{ color: subtitleColor, lineHeight: 1.5 }}
            >
              {titel.untertitel}
            </Typography>
          )}
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={0.75}>
          {isbn && (
            <Chip
              label={`ISBN ${isbn}`}
              size="small"
              sx={{
                bgcolor: alpha(
                  theme.palette.text.primary,
                  isDark ? 0.2 : 0.06,
                ),
                color: theme.palette.text.primary,
                fontWeight: 600,
              }}
            />
          )}
          {datum && (
            <Chip
              label={new Date(datum).toLocaleDateString()}
              size="small"
              sx={{
                bgcolor: alpha(
                  theme.palette.info.main,
                  isDark ? 0.2 : 0.12,
                ),
                color: isDark
                  ? theme.palette.info.light
                  : theme.palette.info.dark,
                fontWeight: 600,
              }}
            />
          )}
          {lieferbar !== undefined && (
            <Chip
              label={lieferbar ? 'Lieferbar' : 'Nicht lieferbar'}
              size="small"
              sx={{
                bgcolor: alpha(
                  lieferbar
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                  isDark ? 0.18 : 0.14,
                ),
                color: lieferbar
                  ? isDark
                    ? theme.palette.success.light
                    : theme.palette.success.dark
                  : isDark
                    ? theme.palette.error.light
                    : theme.palette.error.dark,
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
                sx={{
                  bgcolor: alpha(
                    theme.palette.text.primary,
                    isDark ? 0.18 : 0.08,
                  ),
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                }}
              />
            ))}
          </Stack>
        ) : null}

        <Divider sx={{ borderColor: dividerColor }} />

        <Stack
          direction="row"
          spacing={1.25}
          alignItems="center"
          sx={{ mt: 'auto', color: subtitleColor }}
        >
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
