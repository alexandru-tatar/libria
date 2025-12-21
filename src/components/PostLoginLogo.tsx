import { Box, Fade, Typography } from '@mui/material';
import logoImage from '../assets/logo/logo.png';

export function PostLoginLogo() {
  return (
    <Fade in timeout={280}>
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          gap: 2.2,
          py: 2,
          '@keyframes popIn': {
            '0%': { opacity: 0, transform: 'translateY(14px) scale(0.95)' },
            '65%': { opacity: 1, transform: 'translateY(0) scale(1.03)' },
            '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
          },
          '@keyframes haloSpin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
          '@keyframes orbit': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
          '@keyframes breathe': {
            '0%': { transform: 'scale(0.985)' },
            '50%': { transform: 'scale(1.035)' },
            '100%': { transform: 'scale(0.985)' },
          },
          '@keyframes shimmer': {
            '0%': { transform: 'translateX(-140%) rotate(18deg)', opacity: 0 },
            '22%': { opacity: 0.55 },
            '42%': { opacity: 0 },
            '100%': { transform: 'translateX(200%) rotate(18deg)', opacity: 0 },
          },
          '@media (prefers-reduced-motion: reduce)': {
            '*': { animation: 'none !important' },
          },
        }}
      >
        {/* LOGO STACK */}
        <Box
          sx={{
            position: 'relative',
            width: 212,
            height: 212,
            display: 'grid',
            placeItems: 'center',
            animation: 'popIn 600ms cubic-bezier(0.2, 0.9, 0.2, 1) both',
          }}
        >
          {/* Deep ambient glow */}
          <Box
            sx={{
              position: 'absolute',
              inset: -18,
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 35% 28%, rgba(25,118,210,0.34), rgba(25,118,210,0.10) 50%, transparent 72%)',
              filter: 'blur(16px)',
              opacity: 0.95,
            }}
          />

          {/* Conic halo */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background:
                'conic-gradient(from 0deg, rgba(25,118,210,0), rgba(25,118,210,0.36), rgba(245,245,247,0.28), rgba(25,118,210,0))',
              maskImage: 'radial-gradient(circle, transparent 62%, #000 66%)',
              animation: 'haloSpin 14s linear infinite',
            }}
          />

          {/* Orbit ring */}
          <Box
            sx={{
              position: 'absolute',
              inset: 10,
              borderRadius: '50%',
              maskImage: 'radial-gradient(circle, transparent 70%, #000 74%)',
              opacity: 0.55,
              animation: 'orbit 22s linear infinite',
              background:
                'radial-gradient(circle at 22% 38%, rgba(245,245,247,0.85) 0 1.2px, transparent 2px), radial-gradient(circle at 76% 28%, rgba(245,245,247,0.65) 0 1.2px, transparent 2px), radial-gradient(circle at 84% 74%, rgba(245,245,247,0.55) 0 1.2px, transparent 2px), radial-gradient(circle at 30% 82%, rgba(245,245,247,0.75) 0 1.2px, transparent 2px)',
            }}
          />

          {/* Glass shell */}
          <Box
            sx={{
              position: 'absolute',
              inset: 22,
              borderRadius: '50%',
              background:
                'linear-gradient(135deg, rgba(245,245,247,0.12), rgba(245,245,247,0.05))',
              border: '1px solid rgba(245,245,247,0.18)',
              backdropFilter: 'blur(14px)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.28)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '-35%',
                left: '-45%',
                width: '70%',
                height: '170%',
                background:
                  'linear-gradient(90deg, transparent, rgba(245,245,247,0.55), transparent)',
                animation: 'shimmer 3.2s ease-in-out infinite',
              }}
            />
          </Box>

          {/* Core logo */}
          <Box
            sx={{
              width: 128,
              height: 128,
              borderRadius: 26,
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(145deg, #1976d2, #63a4ff)',
              boxShadow:
                '0 22px 64px rgba(25,118,210,0.42), inset 0 1px 0 rgba(245,245,247,0.38)',
              animation: 'breathe 2200ms ease-in-out infinite',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at 28% 22%, rgba(245,245,247,0.30), transparent 56%)',
              }}
            />
            <Box
              component="img"
              src={logoImage}
              alt="Libria"
              sx={{
                width: '74%',
                height: '74%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 12px 22px rgba(0,0,0,0.22))',
              }}
            />
          </Box>
        </Box>

        {/* TEXT */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            letterSpacing: 0.4,
            animation: 'popIn 600ms cubic-bezier(0.2, 0.9, 0.2, 1) both',
            animationDelay: '120ms',
          }}
        >
          Willkommen zurück
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            letterSpacing: 0.2,
            animation: 'popIn 600ms cubic-bezier(0.2, 0.9, 0.2, 1) both',
            animationDelay: '200ms',
          }}
        >
          Du wirst gleich weitergeleitet.
        </Typography>
      </Box>
    </Fade>
  );
}