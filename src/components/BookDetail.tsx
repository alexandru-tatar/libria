import { useEffect } from 'react';
import { Box } from '@mui/material';
import type { BookItems } from '../types/book';

export const BookDetail = ({ book, onClose }: { book: BookItems; onClose: () => void }) => {
  // Body scroll sperren
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // Scrollen verhindern
    return () => {
      document.body.style.overflow = originalOverflow; // wiederherstellen
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
      }}
    >
      {/* Klickbarer Hintergrund */}
      <Box onClick={onClose} sx={{ position: 'absolute', inset: 0, cursor: 'pointer' }} />

      {/* Modal */}
      <Box
        sx={{
          position: 'relative',
          width: { xs: '90%', md: '50%' },
          maxHeight: '85vh',
          bgcolor: 'background.paper',
          borderRadius: 3,
          p: 3,
          overflowY: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        }}
      >
        {/* Sticky X */}
        <Box
          onClick={onClose}
          sx={{
            position: 'sticky',
            top: 16,
            right: 16,
            float: 'right',
            cursor: 'pointer',
            fontSize: 22,
            fontWeight: 900,
            zIndex: 10,
          }}
        >
          ✕
        </Box>

        {/* Inhalte – vorerst JSON */}
        <pre>{JSON.stringify(book, null, 2)}</pre>
      </Box>
    </Box>
  );
};
