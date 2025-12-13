 import { Box, Typography } from '@mui/material';

export function UserManagement() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Benutzerverwaltung
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Hier können Sie Benutzer verwalten.
      </Typography>
    </Box>
  );
}
