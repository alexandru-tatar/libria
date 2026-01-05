// components/EntryCount.tsx
import { Typography } from '@mui/material';

interface EntryCountProps {
  count: number; // Anzahl gefilterter Einträge
  total?: number; // Optional: Gesamtanzahl
  label?: string; // z.B. "Bücher"
}

export function EntryCount({
  count,
  total,
  label = 'Einträge',
}: EntryCountProps) {
  return (
    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
      {count} {label}
      {total !== undefined ? ` von ${total}` : ''} gefunden
    </Typography>
  );
}
