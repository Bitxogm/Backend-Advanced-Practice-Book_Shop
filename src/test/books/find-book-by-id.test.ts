import request from 'supertest';
import { app } from '@/server';
import { BookModelMongoose as Book } from '@infrastructure/models/book.model';
import { createRandomBook } from './helpers/create-random-book';

beforeEach(async () => {
  await Book.deleteMany({});
});

describe('GET /books/:bookId', () => {
  it('debe devolver un libro específico por su ID', async () => {
    const bookData = createRandomBook();
    const book = await Book.create(bookData);

    const response = await request(app).get(`/books/${book._id}`);

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.items[0].title).toBe(book.title);
  });

  it('debe devolver 404 si el libro no existe', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const response = await request(app).get(`/books/${fakeId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Book not found');
  });

  it('debe devolver 404 si el ID no es válido', async () => {
    const invalidId = 'id-invalido';
    const response = await request(app).get(`/books/${invalidId}`);
    expect(response.status).toBe(404);
  });
});
