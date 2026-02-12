import { app } from '@/server';
import { BookModelMongoose as Book } from '@infrastructure/models/book.model';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { createRandomUser } from '../authentication/helpers/create-random-user';
import { createRandomBook } from './helpers/create-random-book';

describe('GET /books/me', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    // Crear usuario y obtener token
    const user = createRandomUser();
    const res = await request(app).post('/auth/signup').send(user);
    token = res.body.token;

    // Decodificar userId del token
    const decoded = jwt.decode(token) as { userId: string };
    userId = decoded.userId;
  });

  beforeEach(async () => {
    // Limpiar libros antes de cada test
    await Book.deleteMany({});
  });

  it('debe devolver todos mis libros (incluyendo vendidos)', async () => {
    // Crear 2 libros míos: 1 publicado, 1 vendido
    const myBook1 = createRandomBook({
      ownerId: userId,
      status: 'PUBLISHED',
    });
    const myBook2 = createRandomBook({
      ownerId: userId,
      status: 'SOLD',
      soldAt: new Date(),
    });

    // Crear 1 libro de otro usuario
    const otherUserId = '507f1f77bcf86cd799439011';
    const otherBook = createRandomBook({
      ownerId: otherUserId,
      status: 'PUBLISHED',
    });

    await Book.insertMany([myBook1, myBook2, otherBook]);

    const response = await request(app).get('/books/me').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(2); // Solo mis 2 libros
    expect(response.body.items).toHaveLength(2);

    // Verificar que incluye el libro vendido
    const soldBook = response.body.items.find((b: any) => b.status === 'SOLD');
    expect(soldBook).toBeDefined();
    expect(soldBook.soldAt).not.toBeNull();

    // Verificar que NO incluye libros de otros usuarios
    const otherUserBook = response.body.items.find((b: any) => b.ownerId === otherUserId);
    expect(otherUserBook).toBeUndefined();
  });

  it('debe devolver array vacío si no tengo libros', async () => {
    // Crear libro de otro usuario
    await Book.create(createRandomBook({ ownerId: '507f1f77bcf86cd799439011' }));

    const response = await request(app).get('/books/me').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(0);
    expect(response.body.items).toEqual([]);
  });

  it('debe fallar sin autenticación', async () => {
    const response = await request(app).get('/books/me');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('debe fallar con token inválido', async () => {
    const response = await request(app)
      .get('/books/me')
      .set('Authorization', 'Bearer token-invalido');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid token');
  });

  it('debe incluir todos los campos del libro', async () => {
    const myBook = createRandomBook({ ownerId: userId });
    await Book.create(myBook);

    const response = await request(app).get('/books/me').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    const returnedBook = response.body.items[0];

    expect(returnedBook).toHaveProperty('id');
    expect(returnedBook).toHaveProperty('title');
    expect(returnedBook).toHaveProperty('description');
    expect(returnedBook).toHaveProperty('price');
    expect(returnedBook).toHaveProperty('author');
    expect(returnedBook).toHaveProperty('status');
    expect(returnedBook).toHaveProperty('ownerId');
    expect(returnedBook).toHaveProperty('soldAt');
  });
});
