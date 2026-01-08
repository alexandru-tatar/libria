import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { PostLogoutLogo } from '../components/PostLogoutLogoComponent';

function LogoutPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const run = async () => {
      await logout();
      if (!active) return;
      setTimeout(() => navigate('/login', { replace: true }), 1100);
    };
    run();
    return () => {
      active = false;
    };
  }, [logout, navigate]);

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
      <PostLogoutLogo />
    </Box>
  );
}

export default LogoutPage;
