import jwt from 'jsonwebtoken';
/**
 * TESTS E2E PARA RUTAS DE LIBROS
 *
 * Tests end-to-end que prueban las rutas de la API de libros
 * usando datos falsos generados con Ngneat/falso
 */

import request from 'supertest';
import { app } from '@/server';
import { BookModelMongoose as Book } from '@infrastructure/models/book.model';
import { createRandomBook } from './helpers/create-random-book';
import { createRandomUser } from '../authentication/helpers/create-random-user';

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
  it('debe devolver 403 si el libro no me pertenece', async () => {
    // Crear usuario y libro con ownerId diferente
    const user1 = createRandomUser();
    const res1 = await request(app).post('/auth/signup').send(user1);
    const token1 = res1.body.token;
    const decoded1 = jwt.decode(token1) as { userId: string };
    const ownerId = decoded1.userId;

    // Crear libro con ownerId de user1
    const bookData = createRandomBook({ ownerId });
    const book = await Book.create(bookData);

    // Crear otro usuario (user2) que intentará borrar el libro
    const user2 = createRandomUser();
    const res2 = await request(app).post('/auth/signup').send(user2);
    const token2 = res2.body.token;

    // Intentar borrar el libro con el token de user2
    const response = await request(app)
      .delete(`/books/${book._id}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/not authorized|autorizad/i);
  });
  let token: string;
  let userId: string;
  beforeAll(async () => {
    const user = createRandomUser();
    const res = await request(app).post('/auth/signup').send(user);
    token = res.body.token;
    // Decodificar el userId del token JWT
    const decoded = jwt.decode(token) as { userId: string };
    userId = decoded.userId;
  });

  it('debe eliminar un libro correctamente', async () => {
    // Crear un libro con el ownerId correcto
    const bookData = createRandomBook({ ownerId: userId });
    const book = await Book.create(bookData);

    const response = await request(app)
      .delete(`/books/${book._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Book deleted successfully');

    // Verificar que realmente se eliminó
    const deletedBook = await Book.findById(book._id);
    expect(deletedBook).toBeNull();
  });

  it('debe devolver 404 si el libro no existe', async () => {
    const fakeId = '507f1f77bcf86cd799439011';

    const response = await request(app)
      .delete(`/books/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});
