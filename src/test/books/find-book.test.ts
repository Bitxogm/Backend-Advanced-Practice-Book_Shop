/**
 * TESTS E2E PARA RUTAS DE LIBROS
 *
 * Tests end-to-end que prueban las rutas de la API de libros
 * usando datos falsos generados con Ngneat/falso
 */

import request from 'supertest';
import { app } from '@/server';
import { BookModelMongoose as Book } from '@infrastructure/models/book.model';
import { createRandomBooks, createRandomBook } from './helpers/create-random-book';

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
  it('debe filtrar libros por author', async () => {
    const libroA = createRandomBook({ title: 'Libro A', author: 'Autor1' });
    const libroB = createRandomBook({ title: 'Libro B', author: 'Autor2' });
    await Book.insertMany([libroA, libroB]);
    const response = await request(app)
      .get('/books')
      .query({ page: 1, limit: 10, author: 'Autor1' });
    expect(response.status).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.items[0].author).toBe('Autor1');
  });

  it('debe filtrar libros por title', async () => {
    const libroUnico = createRandomBook({ title: 'TituloFiltradoTest', author: 'AutorX' });
    const otroLibro = createRandomBook({ title: 'OtroTitulo', author: 'AutorY' });
    await Book.insertMany([libroUnico, otroLibro]);
    const response = await request(app)
      .get('/books')
      .query({ page: 1, limit: 10, title: 'TituloFiltradoTest' });
    expect(response.status).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.items[0].title).toBe('TituloFiltradoTest');
  });
  it('debe devolver un array vacío cuando no hay libros', async () => {
    const response = await request(app).get('/books').query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(0);
    expect(response.body.items).toEqual([]);
  });

  it('debe devolver todos los libros publicados', async () => {
    // Crear 3 libros falsos en la BD
    const booksData = createRandomBooks(3);
    await Book.insertMany(booksData);

    const response = await request(app).get('/books').query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(3);
    expect(response.body.items).toHaveLength(3);
    expect(response.body.items[0]).toHaveProperty('title');
    expect(response.body.items[0]).toHaveProperty('author');
  });
});
