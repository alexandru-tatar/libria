// pages/HomePage.tsx
import { BookSearchFormMUI } from '../components/SearchFormMUI';

export function HomePage() {
  return (
    <div>
      <h1>Buna ziua Alexandru!</h1>
      <BookSearchFormMUI onSelect={(book) => console.log('Selected:', book)} />
    </div>
  );
}
