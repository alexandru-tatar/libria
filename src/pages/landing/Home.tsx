import React, { useMemo, useRef } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
  useTheme,
  Divider,
  type SxProps,
  type Theme,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import ApiRoundedIcon from '@mui/icons-material/ApiRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { ComponentType } from 'react';

const MotionBox = motion(Box as ComponentType<any>);
const MotionPaper = motion(Paper as ComponentType<any>);

const featureDeck = [
  {
    title: 'Keycloak',
    desc: 'Password Grant, Refresh-Flow, Rollen-Auswertung im Frontend.',
    icon: <AutoAwesomeRoundedIcon />,
    tag: 'AUTH',
  },
  {
    title: 'Password Reset',
    desc: 'Passwort-Reset über Keycloak-Reset-Seite (Link im Login-Formular).',
    icon: <AutoAwesomeRoundedIcon />,
    tag: 'AUTH',
  },
  {
    title: 'Suche + Paginierung',
    desc: 'Axios mit Bearer-Token, Tag-Mapping und Auto-Load bei leeren Seiten.',
    icon: <BoltRoundedIcon />,
    tag: 'SEARCH',
  },
  {
    title: 'UI Details',
    desc: 'Dark/Light Toggle, Motion, Tilt, radials – alles in MUI gehalten.',
    icon: <TuneRoundedIcon />,
    tag: 'UI/UX',
  },
  {
    title: 'Admin-Funktionen',
    desc: 'Infinite Scroll Tabelle, Buch-Form mit ISBN-Check & Fehlermeldungen.',
    icon: <ShieldRoundedIcon />,
    tag: 'ADMIN',
  },
];

const backendDeck = [
  {
    title: 'NestJS + Prisma',
    desc: 'ESM Nest 11 mit Prisma Client 6.19 auf PostgreSQL 18. Das Schema liegt in prisma/schema.prisma und der Client wird über pnpm prisma generate gebaut.',
    icon: <StorageRoundedIcon />,
    tag: 'STACK',
  },
  {
    title: 'REST + GraphQL',
    desc: 'Express 5 und Apollo liefern REST und GraphQL, DTOs setzen auf class validator, Swagger und OpenAPI sind bereits eingebunden.',
    icon: <ApiRoundedIcon />,
    tag: 'API',
  },
  {
    title: 'Auth & Security',
    desc: 'Keycloak Rollen mit nest keycloak connect, JWT, Helmet, CORS und CSP, Logging mit Pino.',
    icon: <SecurityRoundedIcon />,
    tag: 'SECURITY',
  },
  {
    title: 'Ops & Tests',
    desc: 'Docker Compose für Postgres, Health und Metrics mit Terminus und prom client, Vitest und k6 für Checks.',
    icon: <ScienceRoundedIcon />,
    tag: 'OPS',
  },
];

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
      transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1], delay }}
    >
      {children}
    </MotionBox>
  );
}

function TiltCard({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rx = useSpring(useTransform(y, [-50, 50], [6, -6]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(x, [-50, 50], [-8, 8]), { stiffness: 180, damping: 18 });

  function onMove(e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    x.set(px - rect.width / 2);
    y.set(py - rect.height / 2);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <MotionBox
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: 900 } as any}
      sx={sx}
    >
      <MotionBox
        style={
          {
            rotateX: rx,
            rotateY: ry,
            transformStyle: 'preserve-3d',
          } as any
        }
      >
        {children}
      </MotionBox>
    </MotionBox>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const primaryCta = () => navigate(isAuthenticated ? '/app' : '/login');
  const secondaryCta = () => navigate('/suche');

  const hairline = useMemo(() => `1px solid ${theme.palette.divider}`, [theme.palette.divider]);

  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const glowXS = useSpring(glowX, { stiffness: 120, damping: 20 });
  const glowYS = useSpring(glowY, { stiffness: 120, damping: 20 });

  const glowBg = useTransform<number, string>([glowXS, glowYS], ([gx, gy]: number[]) => {
    const x = 50 + gx * 0.03;
    const y = 30 + gy * 0.03;
    return isDark
      ? `radial-gradient(900px 520px at ${x}% ${y}%, rgba(233,84,32,0.22), transparent 62%)`
      : `radial-gradient(1000px 580px at ${x}% ${y}%, rgba(25,118,210,0.20), transparent 64%)`;
  });

  function onHeroMove(e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    glowX.set(e.clientX - (rect.left + rect.width / 2));
    glowY.set(e.clientY - (rect.top + rect.height / 2));
  }

  return (
    <Box sx={{ bgcolor: theme.palette.background.default }}>
      {/* HERO */}
      <Box
        onMouseMove={onHeroMove}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderBottom: hairline,
        }}
      >
        {/* animated glow layer */}
        <MotionBox
          style={{ backgroundImage: glowBg as unknown as string }}
          sx={{ position: 'absolute', inset: 0 }}
        />

        {/* static layered background */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: isDark
              ? `
                radial-gradient(900px 520px at 85% 25%, rgba(255,255,255,0.06), transparent 64%),
                linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.00))
              `
              : `
                radial-gradient(900px 520px at 85% 30%, rgba(17,24,39,0.06), transparent 66%),
                linear-gradient(180deg, rgba(245,245,247,0.65), rgba(245,245,247,0.00))
              `,
          }}
        />

        {/* subtle grid texture */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: isDark
              ? 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)'
              : 'linear-gradient(rgba(17,24,39,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,0.04) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            opacity: 0.18,
            pointerEvents: 'none',
            maskImage:
              'radial-gradient(700px 420px at 20% 20%, black 35%, transparent 70%)',
          }}
        />

        {/* angled glass slab with entrance animation */}
        <MotionBox
          initial={{ opacity: 0, x: 120, rotateZ: -2 }}
          animate={{ opacity: 0.95, x: 0, rotateZ: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          sx={{
            position: 'absolute',
            right: { xs: '-50%', md: '-20%' },
            top: { xs: '-35%', md: '-40%' },
            width: { xs: '120%', md: '70%' },
            height: { xs: 520, md: 720 },
            transform: 'skewX(-18deg)',
            borderRadius: 6,
            border: hairline,
            background: isDark
              ? 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))'
              : 'linear-gradient(135deg, rgba(255,255,255,0.88), rgba(255,255,255,0.30))',
            boxShadow: isDark
              ? '0 36px 120px rgba(0,0,0,0.60)'
              : '0 36px 120px rgba(17,24,39,0.14)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              pt: { xs: 6, md: 9 },
              pb: { xs: 5, md: 7 },
              display: 'grid',
              gap: { xs: 4, md: 5 },
              gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' },
              alignItems: 'start',
            }}
          >
            {/* Left: hero copy */}
            <Stack spacing={3.2}>
              <Reveal>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Chip
                    label="LIBRIA · RUHIGE BIBLIOTHEK"
                    variant="outlined"
                    sx={{
                      borderRadius: 999,
                      fontSize: 12,
                      letterSpacing: 1.1,
                      textTransform: 'uppercase',
                      borderColor: theme.palette.divider,
                      bgcolor: theme.palette.background.paper,
                    }}
                  />
                  <MotionBox
                    initial={{ scale: 0.9, opacity: 0.6 }}
                    animate={{ scale: [0.9, 1.0, 0.95, 1.0], opacity: 1 }}
                    transition={{ duration: 1.4, ease: 'easeInOut' }}
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      bgcolor: theme.palette.primary.main,
                      boxShadow: isDark
                        ? '0 0 0 6px rgba(233,84,32,0.14)'
                        : '0 0 0 6px rgba(25,118,210,0.12)',
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.text.secondary, letterSpacing: 0.8 }}
                  >
                    Focus · Speed · Craft
                  </Typography>
                </Stack>
              </Reveal>

              <Reveal delay={0.08}>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 950,
                      letterSpacing: -1.2,
                      lineHeight: 1.02,
                      color: theme.palette.text.primary,
                      fontSize: { xs: '2.35rem', sm: '2.95rem', md: '3.6rem' },
                    }}
                  >
                    Features, die laufen.
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 950,
                      letterSpacing: -1.2,
                      lineHeight: 1.02,
                      color: theme.palette.text.primary,
                      fontSize: { xs: '2.35rem', sm: '2.95rem', md: '3.6rem' },
                    }}
                  >
                    <Box component="span" sx={{ color: theme.palette.primary.main }}>
                      Schon umgesetzt.
                    </Box>
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1.6,
                      color: theme.palette.text.secondary,
                      maxWidth: 680,
                      lineHeight: 1.75,
                      fontSize: { xs: 14.8, md: 16.2 },
                    }}
                  >
                    Keycloak-Auth mit Refresh, Light/Dark-Toggle, tag-basierte Suche mit Auto-Load,
                    Admin-Table mit unendlichem Scroll und validierten Buch-Formularen.
                  </Typography>
                </Box>
              </Reveal>

              <Reveal delay={0.14}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.3}>
                  <MotionBox whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={primaryCta}
                      endIcon={<ArrowForwardRoundedIcon />}
                      sx={{
                        borderRadius: 999,
                        px: 3.2,
                        py: 1.2,
                        fontWeight: 900,
                        boxShadow: isDark
                          ? '0 18px 40px rgba(0,0,0,0.35)'
                          : '0 18px 40px rgba(25,118,210,0.20)',
                      }}
                    >
                      {isAuthenticated ? 'Zur App' : 'Anmelden & Starten'}
                    </Button>
                  </MotionBox>

                  <MotionBox whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={secondaryCta}
                      startIcon={<SearchRoundedIcon />}
                      sx={{
                        borderRadius: 999,
                        px: 3,
                        py: 1.2,
                        fontWeight: 900,
                        borderColor: theme.palette.divider,
                        bgcolor: theme.palette.background.paper,
                        '&:hover': {
                          bgcolor: isDark ? 'rgba(255,255,255,0.04)' : theme.palette.grey[50],
                          borderColor: isDark ? 'rgba(255,255,255,0.22)' : theme.palette.grey[300],
                        },
                      }}
                    >
                      Direkt suchen
                    </Button>
                  </MotionBox>
                </Stack>
              </Reveal>

              {/* spec row */}
              <Reveal delay={0.18}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                    gap: 1.2,
                    pt: { xs: 1.5, md: 2 },
                  }}
                >
                  {[
                    { k: 'AUTH', v: 'Keycloak · Refresh · Rollen' },
                    { k: 'SEARCH', v: 'Tag-Mapping · Pagination' },
                    { k: 'UI', v: 'Dark/Light Toggle · Motion' },
                  ].map((s) => (
                    <MotionPaper
                      key={s.k}
                      elevation={0}
                      whileHover={{ y: -3 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: hairline,
                        bgcolor: theme.palette.background.paper,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 950,
                          letterSpacing: 1.0,
                          textTransform: 'uppercase',
                          fontSize: 12,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {s.k}
                      </Typography>
                      <Typography sx={{ mt: 0.5, color: theme.palette.text.secondary }}>
                        {s.v}
                      </Typography>
                    </MotionPaper>
                  ))}
                </Box>
              </Reveal>
            </Stack>

            {/* Right: showcase with tilt */}
            <Reveal delay={0.12}>
              <TiltCard>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.2, md: 3 },
                    borderRadius: 4,
                    border: hairline,
                    bgcolor: theme.palette.background.paper,
                    boxShadow: isDark
                      ? '0 30px 90px rgba(0,0,0,0.55)'
                      : '0 30px 90px rgba(17,24,39,0.12)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* sweep highlight */}
                  <MotionBox
                    initial={{ x: '-120%', opacity: 0 }}
                    animate={{ x: '120%', opacity: 0.22 }}
                    transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.4 }}
                    sx={{
                      position: 'absolute',
                      top: -60,
                      left: 0,
                      width: '60%',
                      height: 240,
                      transform: 'skewX(-18deg)',
                      background: isDark
                        ? 'linear-gradient(90deg, transparent, rgba(233,84,32,0.22), transparent)'
                        : 'linear-gradient(90deg, transparent, rgba(25,118,210,0.20), transparent)',
                      pointerEvents: 'none',
                    }}
                  />

                  <Stack spacing={2} sx={{ position: 'relative' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography
                        sx={{
                          fontWeight: 950,
                          letterSpacing: 1.1,
                          textTransform: 'uppercase',
                          fontSize: 12,
                          color: theme.palette.text.secondary,
                        }}
                      >
                        Libria Showcase
                      </Typography>
                      <Chip
                        label="PREMIUM"
                        size="small"
                        sx={{
                          borderRadius: 999,
                          fontWeight: 950,
                          letterSpacing: 1.0,
                          bgcolor: isDark ? 'rgba(233,84,32,0.14)' : 'rgba(25,118,210,0.12)',
                        }}
                      />
                    </Stack>

                    <Typography
                      sx={{
                        fontWeight: 950,
                        letterSpacing: -0.6,
                        fontSize: { xs: 18, md: 20 },
                        color: theme.palette.text.primary,
                      }}
                    >
                      “Scroll · Filter · Find”
                    </Typography>

                    <Typography sx={{ color: theme.palette.text.secondary, lineHeight: 1.75 }}>
                      Ein kompromisslos ruhiger Flow: schnell, klar, verlässlich.
                    </Typography>

                    <Divider sx={{ borderColor: theme.palette.divider }} />

                    <Stack spacing={1.2}>
                      {[
                        { a: 'Login/Refresh', b: 'Keycloak + Rollen', i: <SearchRoundedIcon /> },
                        { a: 'Suche', b: 'Tag-Mapping + Auto-Load', i: <TuneRoundedIcon /> },
                        { a: 'Admin', b: 'Infinite Table + Validierungen', i: <ArrowForwardRoundedIcon /> },
                      ].map((row, idx) => (
                        <MotionBox
                          key={row.a}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 + idx * 0.08, duration: 0.45 }}
                          sx={{
                            display: 'flex',
                            gap: 1.4,
                            alignItems: 'center',
                            p: 1.5,
                            borderRadius: 3,
                            border: hairline,
                            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : theme.palette.grey[50],
                          }}
                        >
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: 3,
                              display: 'grid',
                              placeItems: 'center',
                              bgcolor: isDark ? 'rgba(233,84,32,0.14)' : 'rgba(25,118,210,0.12)',
                            }}
                          >
                            {row.i}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 950, color: theme.palette.text.primary }}>
                              {row.a}
                            </Typography>
                            <Typography sx={{ color: theme.palette.text.secondary, fontSize: 13.5 }}>
                              {row.b}
                            </Typography>
                          </Box>
                        </MotionBox>
                      ))}
                    </Stack>

                    <MotionBox whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outlined"
                        onClick={secondaryCta}
                        endIcon={<ArrowForwardRoundedIcon />}
                        sx={{
                          mt: 0.5,
                          borderRadius: 999,
                          fontWeight: 950,
                          borderColor: theme.palette.divider,
                          bgcolor: theme.palette.background.paper,
                          '&:hover': {
                            bgcolor: isDark ? 'rgba(255,255,255,0.04)' : theme.palette.grey[50],
                          },
                        }}
                      >
                        Jetzt ausprobieren
                      </Button>
                    </MotionBox>
                  </Stack>
                </Paper>
              </TiltCard>
            </Reveal>
          </Box>
        </Container>

        {/* Bottom angled cut */}
        <Box
          sx={{
            height: { xs: 56, md: 86 },
            bgcolor: theme.palette.background.default,
            clipPath: 'polygon(0 45%, 100% 0, 100% 100%, 0 100%)',
            borderTop: hairline,
          }}
        />
      </Box>

      {/* FEATURE DECK (stagger reveal) */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Reveal>
          <Stack spacing={2.2} sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontWeight: 950,
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                fontSize: 12,
                color: theme.palette.text.secondary,
              }}
            >
              Experience
            </Typography>
            <Typography
              sx={{
                fontWeight: 950,
                letterSpacing: -0.5,
                fontSize: { xs: '1.65rem', md: '2.1rem' },
                color: theme.palette.text.primary,
                lineHeight: 1.15,
              }}
            >
              Animationen, die sich premium anfühlen.
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, maxWidth: 760, lineHeight: 1.75 }}>
              Subtle, aber high-end: reveal, tilt, hover-lift, sweep highlights.
            </Typography>
          </Stack>
        </Reveal>

        <MotionBox
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07 } },
          }}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          {featureDeck.map((f) => (
            <MotionPaper
              key={f.title}
              elevation={0}
              variants={{
                hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
                show: { opacity: 1, y: 0, filter: 'blur(0px)' },
              }}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              sx={{
                p: 2.2,
                borderRadius: 4,
                border: hairline,
                bgcolor: theme.palette.background.paper,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* angled highlight */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 58%)'
                    : 'linear-gradient(135deg, rgba(25,118,210,0.12), rgba(25,118,210,0) 58%)',
                  clipPath: 'polygon(0 0, 100% 0, 55% 100%, 0 100%)',
                  opacity: isDark ? 0.28 : 0.20,
                  pointerEvents: 'none',
                }}
              />

              <Stack spacing={1.3} sx={{ position: 'relative' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Chip
                    label={f.tag}
                    size="small"
                    sx={{
                      borderRadius: 999,
                      fontWeight: 950,
                      letterSpacing: 1.0,
                      bgcolor: isDark ? 'rgba(233,84,32,0.14)' : 'rgba(25,118,210,0.12)',
                    }}
                  />
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 3,
                      display: 'grid',
                      placeItems: 'center',
                      border: hairline,
                      bgcolor: isDark ? 'rgba(255,255,255,0.03)' : theme.palette.grey[50],
                    }}
                  >
                    {f.icon}
                  </Box>
                </Stack>

                <Typography sx={{ fontWeight: 950, letterSpacing: -0.2 }}>
                  {f.title}
                </Typography>
                <Typography sx={{ color: theme.palette.text.secondary, lineHeight: 1.7, fontSize: 14 }}>
                  {f.desc}
                </Typography>
              </Stack>
            </MotionPaper>
          ))}
        </MotionBox>
      </Container>

      {/* BACKEND STACK */}
      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
        <Reveal>
          <Stack spacing={2.2} sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontWeight: 950,
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                fontSize: 12,
                color: theme.palette.text.secondary,
              }}
            >
              Backend
            </Typography>
            <Typography
              sx={{
                fontWeight: 950,
                letterSpacing: -0.5,
                fontSize: { xs: '1.65rem', md: '2.1rem' },
                color: theme.palette.text.primary,
                lineHeight: 1.15,
              }}
            >
              NestJS, Prisma und PostgreSQL sind schon verkabelt.
            </Typography>
          </Stack>
        </Reveal>

        <MotionBox
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07 } },
          }}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          {backendDeck.map((f) => (
            <MotionPaper
              key={f.title}
              elevation={0}
              variants={{
                hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
                show: { opacity: 1, y: 0, filter: 'blur(0px)' },
              }}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              sx={{
                p: 2.2,
                borderRadius: 4,
                border: hairline,
                bgcolor: theme.palette.background.paper,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 58%)'
                    : 'linear-gradient(135deg, rgba(25,118,210,0.12), rgba(25,118,210,0) 58%)',
                  clipPath: 'polygon(0 0, 100% 0, 55% 100%, 0 100%)',
                  opacity: isDark ? 0.28 : 0.2,
                  pointerEvents: 'none',
                }}
              />

              <Stack spacing={1.3} sx={{ position: 'relative' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Chip
                    label={f.tag}
                    size="small"
                    sx={{
                      borderRadius: 999,
                      fontWeight: 950,
                      letterSpacing: 1.0,
                      bgcolor: isDark ? 'rgba(233,84,32,0.14)' : 'rgba(25,118,210,0.12)',
                    }}
                  />
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 3,
                      display: 'grid',
                      placeItems: 'center',
                      border: hairline,
                      bgcolor: isDark ? 'rgba(255,255,255,0.03)' : theme.palette.grey[50],
                    }}
                  >
                    {f.icon}
                  </Box>
                </Stack>

                <Typography sx={{ fontWeight: 950, letterSpacing: -0.2 }}>
                  {f.title}
                </Typography>
                <Typography sx={{ color: theme.palette.text.secondary, lineHeight: 1.7, fontSize: 14 }}>
                  {f.desc}
                </Typography>
              </Stack>
            </MotionPaper>
          ))}
        </MotionBox>
      </Container>

      {/* FINAL CTA (sweep + pop) */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          borderTop: hairline,
          background: isDark
            ? 'radial-gradient(900px 420px at 70% 0%, rgba(233,84,32,0.16), transparent 60%)'
            : 'radial-gradient(900px 420px at 70% 0%, rgba(25,118,210,0.14), transparent 60%)',
        }}
      >
        <Container maxWidth="lg">
          <Reveal>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 4 },
                borderRadius: 4,
                border: hairline,
                bgcolor: theme.palette.background.paper,
                boxShadow: isDark
                  ? '0 28px 90px rgba(0,0,0,0.55)'
                  : '0 28px 90px rgba(17,24,39,0.10)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <MotionBox
                initial={{ x: '-140%', opacity: 0 }}
                whileInView={{ x: '140%', opacity: 0.22 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
                sx={{
                  position: 'absolute',
                  top: -80,
                  left: 0,
                  width: '60%',
                  height: 260,
                  transform: 'skewX(-18deg)',
                  background: isDark
                    ? 'linear-gradient(90deg, transparent, rgba(233,84,32,0.22), transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(25,118,210,0.18), transparent)',
                  pointerEvents: 'none',
                }}
              />

              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                alignItems={{ md: 'center' }}
                justifyContent="space-between"
                sx={{ position: 'relative' }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 950,
                      letterSpacing: -0.4,
                      fontSize: { xs: '1.3rem', md: '1.65rem' },
                      color: theme.palette.text.primary,
                    }}
                  >
                    Bereit für eine ruhige Suche?
                  </Typography>
                  <Typography sx={{ mt: 0.8, color: theme.palette.text.secondary, maxWidth: 720, lineHeight: 1.75 }}>
                    Starte jetzt – und erlebe Filter & Suche, die sich wie Premium anfühlen.
                  </Typography>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
                  <MotionBox whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={primaryCta}
                      endIcon={<ArrowForwardRoundedIcon />}
                      sx={{ borderRadius: 999, px: 3.2, py: 1.2, fontWeight: 950 }}
                    >
                      {isAuthenticated ? 'Zur App' : 'Login'}
                    </Button>
                  </MotionBox>

                  <MotionBox whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={secondaryCta}
                      sx={{
                        borderRadius: 999,
                        px: 3,
                        py: 1.2,
                        fontWeight: 950,
                        borderColor: theme.palette.divider,
                        bgcolor: theme.palette.background.paper,
                      }}
                    >
                      Suche öffnen
                    </Button>
                  </MotionBox>
                </Stack>
              </Stack>
            </Paper>
          </Reveal>
        </Container>
      </Box>
    </Box>
  );
}
