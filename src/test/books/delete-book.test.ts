/**
 * TESTS E2E PARA RUTAS DE LIBROS
 *
 * Tests end-to-end que prueban las rutas de la API de libros
 * usando datos falsos generados con Ngneat/falso
 */

import request from 'supertest';
import { app } from '../../server';
import { BookModelMongoose as Book } from '../../infrastructure/models/book.model';
import { createRandomBook } from './helpers/create-random-book';

// ============================================
// ANTES DE TODOS LOS TESTS
// ============================================
beforeEach(async () => {
  // Limpiar la base de datos antes de cada test
  await Book.deleteMany({});
});

// ============================================
// TESTS DELETE /books/:bookId - Eliminar un libro
// ============================================
describe('DELETE /books/:bookId', () => {
  it('debe eliminar un libro correctamente', async () => {
    // Crear un libro
    const bookData = createRandomBook();
    const book = await Book.create(bookData);

    const response = await request(app).delete(`/books/${book._id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Libro eliminado con éxito');

    // Verificar que realmente se eliminó
    const deletedBook = await Book.findById(book._id);
    expect(deletedBook).toBeNull();
  });

  it('debe devolver 404 si el libro no existe', async () => {
    const fakeId = '507f1f77bcf86cd799439011';

    const response = await request(app).delete(`/books/${fakeId}`);

    expect(response.status).toBe(404);
  });
});
