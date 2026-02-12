// src/ui/routes/book.routes.ts
import { buyBookController } from '@ui/controllers/book/buy-book-controller';
import express from 'express';
import { createBookController } from '@ui/controllers/book/create-book-controllers';
import { getAllBooksController } from '@ui/controllers/book/getAll-books-controller';
import { getBookByIdController } from '@ui/controllers/book/getBook-byId-controller';
import { deleteBookController } from '@ui/controllers/book/delete-book-controller';
import { updateBookController } from '@ui/controllers/book/update-book-controller';
import { getMyBooksController } from '@ui/controllers/book/get-my-books-controller';
import { authenticationMiddleware } from '../middlewares/authentication-middleware';

const bookRouter: express.Router = express.Router();

// ============================================
// ORDEN CRÍTICO: /me DEBE IR ANTES DE /:bookId
// ============================================

// GET /books - Listar todos públicos
bookRouter.get('/', getAllBooksController);

// POST /books - Crear libro (privado)
bookRouter.post('/', [authenticationMiddleware], createBookController);

// GET /books/me - Mis libros (privado)
bookRouter.get('/me', [authenticationMiddleware], getMyBooksController);

// POST /books/:bookId/buy - Comprar libro (privado)
bookRouter.post('/:bookId/buy', [authenticationMiddleware], buyBookController);

// GET /books/:bookId - Ver libro específico
bookRouter.get('/:bookId', getBookByIdController);

// PATCH /books/:bookId - Actualizar libro (privado)
bookRouter.patch('/:bookId', [authenticationMiddleware], updateBookController);

// DELETE /books/:bookId - Eliminar libro (privado)
bookRouter.delete('/:bookId', [authenticationMiddleware], deleteBookController);

export default bookRouter;
