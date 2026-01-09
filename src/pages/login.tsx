import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../auth/useAuth';
import { PostLoginLogo } from '../components/PostLoginLogoComponent';

function Login() {
  const { isAuthenticated, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    new URLSearchParams(location.search).get('redirectTo') ?? '/';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !loading && !showCelebration)
      navigate(redirectTo, { replace: true });
  }, [isAuthenticated, loading, navigate, redirectTo, showCelebration]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
      setShowCelebration(true);
      setTimeout(() => navigate(redirectTo, { replace: true }), 1300);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Login fehlgeschlagen';
      setError(message || 'Login fehlgeschlagen');
    } finally {
      setSubmitting(false);
    }
  };

  if (showCelebration) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
        <PostLoginLogo />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 460 }}>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LockOutlinedIcon color="primary" />
            <Typography variant="h5" fontWeight={600}>
              Anmelden
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Bitte gib deine Zugangsdaten ein, um dich anzumelden.
          </Typography>
          {error ? (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          ) : null}
          <TextField
            label="Benutzername"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Passwort"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((val) => !val)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography
            variant="body2"
            sx={{ mt: -1, mb: 1, textAlign: 'right' }}
          >
            <a
              href={`${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}/login-actions/reset-credentials`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'underline',
                color: '#1976d2',
                cursor: 'pointer',
              }}
            >
              Passwort vergessen?
            </a>
          </Typography>
          <Button
            variant="contained"
            size="large"
            type="submit"
            disabled={loading || submitting}
            sx={{ mt: 1, alignSelf: 'flex-end' }}
          >
            {submitting ? 'Wird geprüft…' : 'Login'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Login;
