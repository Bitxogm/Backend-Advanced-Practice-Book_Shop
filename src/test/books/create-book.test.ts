import request from 'supertest';
import { app } from '@/server';
import { BookModelMongoose as Book } from '@infrastructure/models/book.model';
import { createRandomBook, CreateRandomBookData } from './helpers/create-random-book';
import { createRandomUser } from '../authentication/helpers/create-random-user';

/**
 * TESTS E2E PARA RUTAS DE LIBROS
 *
 * Tests end-to-end que prueban las rutas de la API de libros
 * usando datos falsos generados con Ngneat/falso
 */

// ============================================
// ANTES DE TODOS LOS TESTS
// ============================================
beforeEach(async () => {
  // Limpiar la base de datos antes de cada test
  await Book.deleteMany({});
});

// ============================================
// TESTS POST /books - Crear un libro
// ============================================
describe('POST /books', () => {
  let token: string;
  beforeAll(async () => {
    // Crear usuario y obtener token
    const user = createRandomUser();
    const res = await request(app).post('/auth/signup').send(user);
    token = res.body.token;
  });

  it('debe crear un libro correctamente con datos válidos', async () => {
    const newBook = createRandomBook();
    // Eliminar ownerId, ya que ahora viene del token
    const { ...bookData } = newBook;
    const response = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send(bookData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Book created successfully');
    expect(response.body.item).toHaveProperty('id');
    expect(response.body.item.title).toBe(newBook.title);
    expect(response.body.item.author).toBe(newBook.author);
    expect(response.body.item.status).toBe('PUBLISHED');
  }, 10000);

  it('debe fallar si falta el título', async () => {
    const bookWithoutTitle = createRandomBook();
    delete (bookWithoutTitle as Partial<CreateRandomBookData>).title;
    const { ...bookData } = bookWithoutTitle;
    const response = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send(bookData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Required fields are missing');
  }, 10000);

  it('debe fallar si falta la descripción', async () => {
    const bookWithoutDescription = createRandomBook();
    delete (bookWithoutDescription as Partial<CreateRandomBookData>).description;
    const { ...bookData } = bookWithoutDescription;
    const response = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send(bookData);

    expect(response.status).toBe(400);
  }, 10000);

  it('debe fallar si el precio es negativo', async () => {
    const bookWithNegativePrice = createRandomBook({ price: -10 });
    const { ...bookData } = bookWithNegativePrice;
    const response = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send(bookData);

    expect(response.status).toBe(400);
  }, 10000);

  it('debe fallar si el token no es válido', async () => {
    const newBook = createRandomBook();
    const { ...bookData } = newBook;
    const invalidToken = 'Bearer invalid.token.value';
    const response = await request(app)
      .post('/books')
      .set('Authorization', invalidToken)
      .send(bookData);

    expect([401, 403]).toContain(response.status);
    expect(response.body.message).toMatch(/token|autorizad|inval/i);
  });
});
