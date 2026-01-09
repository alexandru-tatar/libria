import { test, expect } from '@playwright/test';
import {
    seedAdminAuth,
    mockBooksApi,
    defaultBooks,
    type Buch,
} from './utils/booksTest';

const cloneBooks = (books: Buch[]) =>
    books.map((book) => ({
        ...book,
        titel: { ...book.titel },
        schlagwoerter: book.schlagwoerter ? [...book.schlagwoerter] : undefined,
        abbildungen: book.abbildungen
            ? book.abbildungen.map((img) => ({ ...img }))
            : undefined,
    }));

test.describe('BookDelete', () => {
    test.beforeEach(async ({ page }) => {
        const books = cloneBooks(defaultBooks);

        await seedAdminAuth(page);
        await mockBooksApi(page, {
            books,
            onDelete: async (route, request) => {
                const url = new URL(request.url());
                const id = Number(url.pathname.split('/').pop());
                const index = books.findIndex((book) => book.id === id);
                if (index >= 0) books.splice(index, 1);

                await route.fulfill({
                    status: 204,
                    contentType: 'application/json',
                    body: JSON.stringify({}),
                });
            },
        });

        await page.goto('/admin');
        await expect(
            page.getByRole('heading', { name: 'Admin Panel' }),
        ).toBeVisible();
    });

    test('löscht ein Buch', async ({ page }) => {
        const row = page.getByRole('row', { name: /Admin Seed Book/ });
        await expect(row).toBeVisible();

        const deleteButton = row.locator('button').nth(1);
        const deleteRequest = page.waitForRequest(
            (request) =>
                request.method() === 'DELETE' &&
                request.url().includes('/rest/1'),
        );

        await deleteButton.click();
        await deleteRequest;

        await expect(
            page.getByRole('row', { name: /Admin Seed Book/ }),
        ).toHaveCount(0);
    });
});
