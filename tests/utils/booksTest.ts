import type { Page, Route, Request } from '@playwright/test';

export type Buch = {
  id: number;
  version?: number;
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
  abbildungen?: { id: number; beschriftung: string; contentType: string }[];
};

export const defaultBooks: Buch[] = [
  {
    id: 1,
    version: 3,
    isbn: '9780306406157',
    titel: { titel: 'Admin Seed Book', untertitel: 'Basis' },
    art: 'PAPERBACK',
    preis: 29.9,
    lieferbar: true,
    rabatt: 0.1,
    rating: 4,
    schlagwoerter: ['Seed'],
    datum: '2024-01-10',
    homepage: 'https://example.com/seed',
    abbildungen: [{ id: 11, beschriftung: 'Cover', contentType: 'image/png' }],
  },
  {
    id: 2,
    version: 1,
    isbn: '9780000000200',
    titel: { titel: 'Stats Book' },
    art: 'HARDCOVER',
    preis: 49.9,
    lieferbar: false,
    rating: 5,
    datum: '2024-02-01',
  },
];

const defaultPageSize = 5;

export const buildResponse = (items: Buch[], page: number, pageSize = defaultPageSize) => {
  const totalPages = 1;
  return {
    content: items,
    page: {
      number: page,
      size: pageSize,
      totalElements: items.length,
      totalPages,
    },
    totalPages,
  };
};

export const seedAdminAuth = async (page: Page) => {
  await page.addInitScript(() => {
    const stored = {
      accessToken: 'test-token',
      refreshToken: 'test-refresh',
      expiresAt: Date.now() + 60 * 60 * 1000,
      roles: ['admin'],
    };
    localStorage.setItem('libria.auth', JSON.stringify(stored));
  });
};

type MockOptions = {
  books?: Buch[];
  pageSize?: number;
  onPost?: (route: Route, request: Request) => Promise<void> | void;
  onPut?: (route: Route, request: Request) => Promise<void> | void;
};

export const mockBooksApi = async (page: Page, options: MockOptions = {}) => {
  const books = options.books ?? defaultBooks;
  const pageSize = options.pageSize ?? defaultPageSize;

  await page.route('**/rest**', async (route) => {
    const request = route.request();
    if (request.method() === 'POST') {
      if (options.onPost) {
        await options.onPost(route, request);
        return;
      }
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
      return;
    }

    if (request.method() === 'PUT') {
      if (options.onPut) {
        await options.onPut(route, request);
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
      return;
    }

    const url = new URL(request.url());
    const pageParam = Number(url.searchParams.get('page') ?? '0');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildResponse(books, pageParam, pageSize)),
    });
  });
};
