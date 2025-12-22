import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import logoImage from '../assets/logo/logo.png';

export function AppShell() {
  const { isAuthenticated, profile, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', flexGrow: 1 }}
            onClick={() => navigate('/')}
          >
            <Box component="img" src={logoImage} alt="Libria" sx={{ height: 36, width: 'auto', borderRadius: 1 }} />
            <Typography variant="h6">Libria</Typography>
          </Box>
          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                {profile?.firstName ?? profile?.username ?? 'Account'}
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
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
