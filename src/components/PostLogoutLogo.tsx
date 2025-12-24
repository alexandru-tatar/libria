import { Box, Fade, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import logoImage from '../assets/logo/logo.png';

const slideAway = keyframes`
  0% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-10px) scale(0.96); }
`;

const halo = keyframes`
  0% { transform: scale(0.9); opacity: 0.18; }
  50% { transform: scale(1.08); opacity: 0.3; }
  100% { transform: scale(0.95); opacity: 0.18; }
`;

const ringDrift = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
`;

export function PostLogoutLogo() {
  return (
    <Fade in timeout={180}>
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          gap: 2,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: 144,
            height: 144,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 16,
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 30% 30%, rgba(25,118,210,0.25), transparent 60%)',
              animation: `${halo} 1800ms ease-in-out infinite`,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.12)',
              animation: `${ringDrift} 10s linear infinite`,
              maskImage:
                'radial-gradient(circle at center, transparent 45%, black 55%)',
            }}
          />
          <Box
            sx={{
              width: 104,
              height: 104,
              borderRadius: '26%',
              background: 'linear-gradient(145deg, #0f5ca8, #4f92e6)',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 10px 32px rgba(15,92,168,0.32)',
              animation: `${slideAway} 1100ms ease-in-out forwards`,
            }}
          >
            <Box
              component="img"
              src={logoImage}
              alt="Libria"
              sx={{ width: '68%', height: '68%', objectFit: 'contain' }}
            />
          </Box>
        </Box>
        <Typography variant="h6" fontWeight={700}>
          Bis bald
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Du wirst abgemeldet.
        </Typography>
      </Box>
    </Fade>
  );
}
