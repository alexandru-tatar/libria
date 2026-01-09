import { api } from './axios';
import type { Book } from '../types/book';

export async function getAllBooks(): Promise<Book[]> {
    const response = await api.get('/');
    return response.data.content ?? [];
}
