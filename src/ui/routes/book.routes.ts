/**
 * RUTAS DE LIBROS (BOOK ROUTES)
 *
 * Este archivo define todas las rutas (endpoints) de la API para libros.
 * Cada ruta maneja una operación CRUD:
 * - GET    = Leer/Obtener datos
 * - POST   = Crear datos nuevos
 * - PATCH  = Actualizar datos parcialmente
 * - DELETE = Eliminar datos
 */

import express from 'express';

import { createBookController } from '../../ui/controllers/create-book-controllers';
import { getAllBooksController } from '../controllers/getAll-books-controller';
import { getBookByIdController } from '../controllers/getBook-byId-controller';
import { deleteBookController } from '../controllers/delete-book-controller';
import { updateBookController } from '../controllers/update-book-controller';

// ============================================
// TIPOS PARA LAS PETICIONES
// ============================================
// Define qué datos esperamos recibir en cada petición

// ============================================
// CREAR EL ROUTER
// ============================================
const bookRouter: express.Router = express.Router();

// ============================================
// GET /books - Listar todos los libros publicados
// ============================================
// Ruta pública que devuelve todos los libros disponibles
bookRouter.get('/', getAllBooksController);

// ============================================
// GET /books/:bookId - Obtener un libro específico
// ============================================
bookRouter.get('/:bookId', getBookByIdController);

// ============================================
// POST /books - Crear un nuevo libro
// ============================================
// TODO: Cuando implementes autenticación, el ownerId vendrá del token JWT
bookRouter.post('/', createBookController);

// ============================================
// PATCH /books/:bookId - Actualizar un libro
// ============================================
// Solo permite actualizar: título, descripción, precio y autor
bookRouter.patch('/:bookId', updateBookController);

// ============================================
// DELETE /books/:bookId - Eliminar un libro
// ============================================
bookRouter.delete('/:bookId', deleteBookController);

// ============================================
// EXPORTAR EL ROUTER
// ============================================
export default bookRouter;
