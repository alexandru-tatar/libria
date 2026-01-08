import { test, expect } from '@playwright/test';

type Buch = {
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

const books: Buch[] = [
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

const pageSize = 5;

function buildResponse(items: Buch[], page: number) {
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
}

test.describe('BookUpdate', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const stored = {
        accessToken: 'test-token',
        refreshToken: 'test-refresh',
        expiresAt: Date.now() + 60 * 60 * 1000,
        roles: ['admin'],
      };
      localStorage.setItem('libria.auth', JSON.stringify(stored));
    });

    await page.route('**/rest**', async (route) => {
      const request = route.request();
      if (request.method() === 'PUT') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({}),
        });
      }

      const url = new URL(request.url());
      const pageParam = Number(url.searchParams.get('page') ?? '0');
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(buildResponse(books, pageParam)),
      });
    });

    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'Admin Panel' })).toBeVisible();
  });

  test('aktualisiert ein Buch', async ({ page }) => {
    const row = page.getByRole('row', { name: /Admin Seed Book/ });
    const editButton = row.locator('button').first();

    await editButton.click();

    await expect(page.getByRole('heading', { name: 'Buch bearbeiten' })).toBeVisible();
    await expect(
      page.getByText('Hinweis: Titel und Untertitel werden derzeit serverseitig nicht aktualisiert.'),
    ).toBeVisible();

    await page.getByLabel('Bewertung').fill('3');
    await page.getByLabel('Preis').fill('33.5');
    await page.getByLabel('Rabatt (optional)').fill('0.2');
    await page.getByLabel('Lieferbar (optional)').uncheck();
    await page.getByLabel('Erscheinungsdatum (optional)').fill('2024-03-10');
    await page.getByLabel('Homepage (optional)').fill('https://example.com/updated');

    await page.getByLabel('Art (optional)').click();
    await page.getByRole('option', { name: 'EPUB' }).click();

    await page.getByLabel(/^Titel$/).fill('Admin Seed Book Updated');
    await page.getByLabel('Untertitel (optional)').fill('V2');

    await page.getByLabel('Abbildung Beschriftung').fill('New Cover');
    await page.getByLabel('Abbildung Content-Type').fill('image/jpeg');

    const updateRequest = page.waitForRequest(
      (request) => request.method() === 'PUT' && request.url().includes('/rest/1'),
    );

    await page.getByRole('button', { name: 'Ändern' }).click();

    const request = await updateRequest;
    const payload = request.postDataJSON() as Record<string, unknown>;

    expect(request.headers()['if-match']).toBe('"3"');
    expect(payload).toMatchObject({
      isbn: '9780306406157',
      rating: 3,
      preis: 33.5,
      art: 'EPUB',
      rabatt: 0.2,
      lieferbar: false,
      homepage: 'https://example.com/updated',
      schlagwoerter: ['Seed'],
      titel: { update: { titel: 'Admin Seed Book Updated', untertitel: 'V2' } },
      abbildungen: [{ beschriftung: 'New Cover', contentType: 'image/jpeg' }],
    });
    expect(payload.datum).toBe('2024-03-10T00:00:00.000Z');

    await expect(page.getByRole('heading', { name: 'Alles erledigt' })).toBeVisible();
    await expect(page.getByText(/erfolgreich aktualisiert\./)).toBeVisible();
  });
});
