/**
 * TESTS E2E PARA RUTAS DE LIBROS
 *
 * Tests end-to-end que prueban las rutas de la API de libros
 * usando datos falsos generados con Ngneat/falso.
 */

import request from 'supertest';
import { app } from '@/server';
import { BookModelMongoose as Book } from '@infrastructure/models/book.model';
import { createRandomBook } from './helpers/create-random-book';

// ============================================
// ANTES DE TODOS LOS TESTS
// ============================================
beforeEach(async () => {
  // Limpiar la base de datos antes de cada test
  await Book.deleteMany({});
});

// ============================================
// TESTS PATCH /books/:bookId - Actualizar un libro
// ============================================
describe('PATCH /books/:bookId', () => {
  it('debe actualizar el título de un libro', async () => {
    // Crear un libro
    const bookData = createRandomBook();
    const book = await Book.create(bookData);

    const newTitle = 'Título Actualizado';

    const response = await request(app).patch(`/books/${book._id}`).send({ title: newTitle });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Book updated successfully');
    expect(response.body.item.title).toBe(newTitle);
  });

  it('debe actualizar el precio de un libro', async () => {
    const bookData = createRandomBook();
    const book = await Book.create(bookData);

    const newPrice = 29.99;

    const response = await request(app).patch(`/books/${book._id}`).send({ price: newPrice });

    expect(response.status).toBe(200);
    expect(response.body.item.price).toBe(newPrice);
  });

  it('debe devolver 404 si el libro no existe', async () => {
    const fakeId = '507f1f77bcf86cd799439011';

    const response = await request(app).patch(`/books/${fakeId}`).send({ title: 'Nuevo título' });

    expect(response.status).toBe(404);
  });
});
