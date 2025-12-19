 import { Box, Typography } from '@mui/material';

export function UserManagement() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Benutzerverwaltung
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Hier kann man Benutzerkonten, Rollen und Berechtigungen verwalten.
      </Typography>
    </Box>
  );
}
