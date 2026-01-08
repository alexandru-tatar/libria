import { test, expect } from '@playwright/test';
import { seedAdminAuth, mockBooksApi } from './utils/adminBooks';

test.describe('BookUpdate', () => {
  test.beforeEach(async ({ page }) => {
    await seedAdminAuth(page);
    await mockBooksApi(page);

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
