import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Tooltip,
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import logoImage from '../assets/logo/logo.png';
import { useThemeMode } from '../theme/themeMode';

export function AppShell() {
  const { isAuthenticated, profile, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { mode, toggleMode } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              flexGrow: 1,
            }}
            onClick={() => navigate('/')}
          >
            <Box
              component="img"
              src={logoImage}
              alt="Libria"
              sx={{ height: 36, width: 'auto', borderRadius: 1 }}
            />
            <Typography variant="h6">Libria</Typography>
          </Box>
          <Button
            color="inherit"
            onClick={() => navigate('/suche')}
            sx={{
              fontWeight: location.pathname === '/suche' ? 700 : undefined,
            }}
          >
            Suche
          </Button>
          <Tooltip title={mode === 'dark' ? 'Hellmodus' : 'Dunkelmodus'}>
            <IconButton color="inherit" onClick={toggleMode} sx={{ ml: 1 }}>
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                {profile?.firstName ?? profile?.username ?? 'Account'}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    navigate('/profile');
                  }}
                >
                  Profil
                </MenuItem>
                {isAdmin && (
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      navigate('/admin');
                    }}
                  >
                    Admin Panel
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    navigate('/logout');
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
