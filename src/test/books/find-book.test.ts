/**
 * TESTS E2E PARA RUTAS DE LIBROS
 *
 * Tests end-to-end que prueban las rutas de la API de libros
 * usando datos falsos generados con Ngneat/falso
 */

import request from 'supertest';
import { app } from '@/server';
import { BookModelMongoose as Book } from '@infrastructure/models/book.model';
import { createRandomBook, createRandomBooks } from './helpers/create-random-book';

// ============================================
// ANTES DE TODOS LOS TESTS
// ============================================
beforeEach(async () => {
  // Limpiar la base de datos antes de cada test
  await Book.deleteMany({});
});

// ============================================
// TESTS GET /books - Listar todos los libros
// ============================================
describe('GET /books', () => {
  it('debe devolver un array vacío cuando no hay libros', async () => {
    const response = await request(app).get('/books');

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(0);
    expect(response.body.items).toEqual([]);
  });

  it('debe devolver todos los libros publicados', async () => {
    // Crear 3 libros falsos en la BD
    const booksData = createRandomBooks(3);
    await Book.insertMany(booksData);

    const response = await request(app).get('/books');

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(3);
    expect(response.body.items).toHaveLength(3);
    expect(response.body.items[0]).toHaveProperty('title');
    expect(response.body.items[0]).toHaveProperty('author');
  });
});

// ============================================
// TESTS GET /books/:bookId - Obtener un libro específico
// ============================================
describe('GET /books/:bookId', () => {
  it('debe devolver un libro específico por su ID', async () => {
    // Crear un libro en la BD
    const bookData = createRandomBook();
    const book = await Book.create(bookData);

    const response = await request(app).get(`/books/${book._id}`);

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.items[0].title).toBe(book.title);
  });

  it('debe devolver 404 si el libro no existe', async () => {
    const fakeId = '507f1f77bcf86cd799439011'; // ID válido pero inexistente

    const response = await request(app).get(`/books/${fakeId}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Libro no encontrado');
  });

  it('debe devolver 404 si el ID no es válido', async () => {
    const invalidId = 'id-invalido';

    const response = await request(app).get(`/books/${invalidId}`);

    expect(response.status).toBe(404);
  });
});
