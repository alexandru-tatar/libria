import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useAuth } from '../auth/useAuth';

function Login() {
  const { isAuthenticated, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = new URLSearchParams(location.search).get('redirectTo') ?? '/app';

  useEffect(() => {
    if (isAuthenticated && !loading) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, loading, navigate, redirectTo]);

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 420 }}>
        <Stack spacing={3}>
          <Typography variant="h5" fontWeight={600}>
            Willkommen
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bitte melde dich an, um fortzufahren.
          </Typography>
          <Button variant="contained" size="large" onClick={() => login(redirectTo)} disabled={loading}>
            Mit Keycloak anmelden
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Login;
