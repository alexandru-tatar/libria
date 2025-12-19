// pages/HomePage.tsx
import { BookSearchFormMUI } from '../components/BookSearchFormMUI';

export function HomePage() {
  return (
    <div>
      <BookSearchFormMUI onSelect={(book) => console.log('Selected:', book)} />
    </div>
  );
}
