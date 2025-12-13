import { Box, Card, CardContent, Container, Divider, Typography, Chip, Stack } from '@mui/material';
import { useAuth } from '../auth/useAuth';

export function ProfilePage() {
  const { profile, roles } = useAuth();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mein Profil
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Benutzerinformationen
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Benutzername
              </Typography>
              <Typography variant="body1">
                {profile?.username || 'Nicht verfügbar'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                E-Mail
              </Typography>
              <Typography variant="body1">
                {profile?.email || 'Nicht verfügbar'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Vor- und Nachname
              </Typography>
              <Typography variant="body1">
                {profile?.firstName} {profile?.lastName}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Rollen
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                {roles.map((role) => (
                  <Chip
                    key={role}
                    label={role}
                    size="small"
                    color={role === 'admin' ? 'error' : 'primary'}
                  />
                ))}
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ProfilePage;
