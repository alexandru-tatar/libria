import { test, expect } from '@playwright/test';

type Buch = {
  id?: number;
  isbn: string;
  titel: { titel: string; untertitel?: string };
  art?: 'EPUB' | 'HARDCOVER' | 'PAPERBACK';
  preis?: number;
  lieferbar?: boolean;
  rabatt?: number;
  rating?: number;
  schlagwoerter?: string[];
  datum?: string;
  homepage?: string;
};

const pageSize = 5;
const totalPages = 2;

const firstPage: Buch[] = [
  {
    id: 1,
    isbn: '9780000000001',
    titel: { titel: 'JavaScript Grundlagen', untertitel: 'Pragmatischer Einstieg' },
    art: 'PAPERBACK',
    preis: 29.9,
    lieferbar: true,
    rabatt: 0.1,
    rating: 4,
    schlagwoerter: ['JavaScript', 'Bestseller'],
  },
  {
    id: 2,
    isbn: '9780000000002',
    titel: { titel: 'Clean Architecture', untertitel: 'Software strukturieren' },
    art: 'HARDCOVER',
    preis: 44.9,
    lieferbar: true,
    rabatt: 0.05,
    rating: 5,
    schlagwoerter: ['Bestseller'],
    homepage: 'https://example.com/clean-architecture',
  },
  {
    id: 3,
    isbn: '9780000000003',
    titel: { titel: 'Python Crashkurs', untertitel: 'Schnellstart für Projekte' },
    art: 'PAPERBACK',
    preis: 24.5,
    lieferbar: true,
    rabatt: 0.15,
    rating: 4,
    schlagwoerter: ['Python'],
  },
  {
    id: 4,
    isbn: '9780000000004',
    titel: { titel: 'Domain-Driven Design kompakt' },
    art: 'HARDCOVER',
    preis: 39.5,
    lieferbar: false,
    rating: 5,
    schlagwoerter: ['Neu'],
  },
  {
    id: 5,
    isbn: '9780000000005',
    titel: { titel: 'Rust kompakt' },
    art: 'EPUB',
    preis: 19.5,
    lieferbar: true,
    rabatt: 0.2,
    rating: 4,
    schlagwoerter: ['Neu'],
  },
];

const secondPage: Buch[] = [
  {
    id: 6,
    isbn: '9780000000006',
    titel: { titel: 'Node.js Patterns', untertitel: 'Best Practices' },
    art: 'PAPERBACK',
    preis: 32.9,
    lieferbar: true,
    rabatt: 0,
    rating: 5,
    schlagwoerter: ['JavaScript'],
  },
];

const totalElements = firstPage.length + secondPage.length;

function buildResponse(items: Buch[], page: number) {
  const hasItems = items.length > 0;
  const pages = hasItems ? totalPages : 0;

  return {
    content: items,
    page: {
      number: page,
      size: pageSize,
      totalElements: hasItems ? totalElements : 0,
      totalPages: pages,
    },
    totalPages: pages,
  };
}

test.describe('BookSearchFormMUI', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/rest**', async (route) => {
      const url = new URL(route.request().url());
      const pageParam = Number(url.searchParams.get('page') ?? '0');
      const searchTerm = url.searchParams.get('titel') ?? '';

      if (searchTerm.toUpperCase().includes('NORESULT')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(buildResponse([], pageParam)),
        });
      }

      if (pageParam === 1) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(buildResponse(secondPage, pageParam)),
        });
      }

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(buildResponse(firstPage, pageParam)),
      });
    });

    await page.goto('/suche');
    await expect(page.getByRole('heading', { name: 'Bücher suchen' })).toBeVisible();
  });

  test('zeigt initiale Ergebnisse', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Ergebnisse' })).toBeVisible();
    await expect(page.getByText('JavaScript Grundlagen')).toBeVisible();
    await expect(page.getByText('Clean Architecture')).toBeVisible();
  });

  test('Filter öffnen und Quick-Tag aktivieren', async ({ page }) => {
    await page.getByRole('button', { name: /filter einblenden/i }).click();
    await expect(page.getByRole('heading', { name: 'Filter' })).toBeVisible();

    await page.getByRole('button', { name: 'JavaScript' }).click();
    await expect(page.getByText('1 Tags aktiv')).toBeVisible();

    await page.getByRole('button', { name: /filter ausblenden/i }).click();
    await expect(page.getByText(/^1 Tags$/)).toBeVisible();
  });

  test('Reset stellt Ergebnisse wieder her', async ({ page }) => {
    await page.getByLabel('Suche').fill('NORESULT');
    await page.getByRole('button', { name: 'Suchen' }).click();
    await expect(page.getByText('Keine Bücher gefunden')).toBeVisible();

    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(page.getByText('JavaScript Grundlagen')).toBeVisible();
  });

  test('Load more lädt weitere Bücher', async ({ page }) => {
    await expect(page.getByText('JavaScript Grundlagen')).toBeVisible();

    const loadMoreButton = page.getByRole('button', { name: /mehr laden/i });
    await expect(loadMoreButton).toBeEnabled();
    await loadMoreButton.click();

    await expect(page.getByText('Node.js Patterns')).toBeVisible();
  });

  test('öffnet BookDetail beim Klick', async ({ page }) => {
    await page.getByText('Clean Architecture').click();
    await expect(page.getByRole('link', { name: 'Zur Homepage' })).toBeVisible();
  });
});
