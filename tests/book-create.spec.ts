import { test, expect } from '@playwright/test';
import { seedAdminAuth, mockBooksApi } from './utils/booksTest';

test.describe('BookCreate', () => {
    test.beforeEach(async ({ page }) => {
        await seedAdminAuth(page);
        await mockBooksApi(page);

        await page.goto('/admin');
        await expect(
            page.getByRole('heading', { name: 'Admin Panel' }),
        ).toBeVisible();
    });

    test('legt ein Buch an', async ({ page }) => {
        await page.getByRole('button', { name: 'Buch anlegen' }).click();
        await expect(
            page.getByRole('heading', { name: 'Buch anlegen' }),
        ).toBeVisible();

        await page.getByLabel('ISBN-13').fill('9780306406157');
        await page.getByLabel('Bewertung').fill('4');
        await page.getByLabel('Preis').fill('12.99');
        await page.getByLabel(/^Titel/).fill('Playwright Buch');
        await page.getByLabel('Untertitel').fill('UI Tests');

        await page.getByLabel('Art').click();
        await page.getByRole('option', { name: 'Paperback' }).click();

        await page.getByLabel('Rabatt').fill('0.15');
        await page.getByLabel('Lieferbar').check();
        await page
            .getByLabel('Erscheinungsdatum')
            .fill('2024-02-14');
        await page.getByLabel('Homepage').fill('https://example.com/new');

        await page.getByRole('button', { name: 'Abbildung hinzufügen' }).click();
        await page.getByLabel('Beschriftung').fill('Cover');
        await page.getByLabel('Content-Type').click();
        await page.getByRole('option', { name: 'image/png' }).click();

        const createRequest = page.waitForRequest(
            (request) =>
                request.url().includes('/rest') && request.method() === 'POST',
        );

        await page.getByRole('button', { name: 'Anlegen' }).click();

        const request = await createRequest;
        const payload = request.postDataJSON() as Record<string, unknown>;

        expect(payload).toMatchObject({
            isbn: '9780306406157',
            rating: 4,
            preis: 12.99,
            art: 'PAPERBACK',
            rabatt: 0.15,
            lieferbar: true,
            homepage: 'https://example.com/new',
            titel: { titel: 'Playwright Buch', untertitel: 'UI Tests' },
            abbildungen: [{ beschriftung: 'Cover', contentType: 'image/png' }],
        });
        expect(payload.datum).toBe('2024-02-14T00:00:00.000Z');

        await expect(
            page.getByRole('heading', { name: 'Alles erledigt' }),
        ).toBeVisible();
        await expect(
            page.getByText('Playwright Buch erfolgreich angelegt.'),
        ).toBeVisible();
    });
});
