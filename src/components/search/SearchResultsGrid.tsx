import { Box } from '@mui/material';
import { alpha, keyframes } from '@mui/material/styles';
import type { BookItems } from '../../types/book';
import { BookMediaMUI } from '../MediaComponent';

const shimmer = keyframes`
  0% {
    transform: translateX(-40%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(40%);
  }
`;

type ViewMode = 'cards' | 'list';

type Props = {
  books: BookItems[];
  loadingMore: boolean;
  viewMode: ViewMode;
  onSelect: (book: BookItems) => void;
};

export const SearchResultsGrid = ({
  books,
  loadingMore,
  viewMode,
  onSelect,
}: Props) => (
  <Box
    sx={(theme) => {
      const shimmerGradient = `linear-gradient(120deg, ${alpha(
        theme.palette.background.paper,
        0,
      )} 0%, ${alpha(
        theme.palette.mode === 'dark'
          ? theme.palette.primary.dark
          : theme.palette.grey[200],
        0.9,
      )} 55%, ${alpha(theme.palette.background.paper, 0)} 100%)`;

      return {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: viewMode === 'cards' ? 3.5 : 1.5,
        mt: 3,
        ...(loadingMore && {
          '& .book-card': {
            position: 'relative',
            isolation: 'isolate',
            filter: 'grayscale(1) saturate(0.4) brightness(0.93)',
            opacity: 0.86,
            transition: 'filter 850ms ease, opacity 850ms ease',
          },
          '& .book-card::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background: shimmerGradient,
            animation: `${shimmer} 2s ease-in-out infinite`,
            pointerEvents: 'none',
          },
        }),
      };
    }}
  >
    {books.map((book) => (
      <Box
        key={book.isbn}
        onClick={() => onSelect(book)}
        sx={{ cursor: 'pointer', height: '100%' }}
      >
        <BookMediaMUI book={book} />
      </Box>
    ))}
  </Box>
);
