import request from 'supertest';
import { app } from '../../server';
import { Book } from '../../models/book.model';
import { createRandomBook, CreateRandomBookData } from './helpers/create-random-book';

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
  it('debe crear un libro correctamente con datos válidos', async () => {
    const newBook = createRandomBook();

    const response = await request(app).post('/books').send(newBook);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Libro creado con éxito');
    expect(response.body.item).toHaveProperty('_id');
    expect(response.body.item.title).toBe(newBook.title);
    expect(response.body.item.author).toBe(newBook.author);
    expect(response.body.item.status).toBe('PUBLISHED');
  });

  it('debe fallar si falta el título', async () => {
    const bookWithoutTitle = createRandomBook();
    delete (bookWithoutTitle as Partial<CreateRandomBookData>).title; // Quitar el título

    const response = await request(app).post('/books').send(bookWithoutTitle);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Faltan campos requeridos');
  });

  it('debe fallar si falta la descripción', async () => {
    const bookWithoutDescription = createRandomBook();
    delete (bookWithoutDescription as Partial<CreateRandomBookData>).description;

    const response = await request(app).post('/books').send(bookWithoutDescription);

    expect(response.status).toBe(400);
  });

  it('debe fallar si el precio es negativo', async () => {
    const bookWithNegativePrice = createRandomBook({ price: -10 });

    const response = await request(app).post('/books').send(bookWithNegativePrice);

    expect(response.status).toBe(400);
  });
});
