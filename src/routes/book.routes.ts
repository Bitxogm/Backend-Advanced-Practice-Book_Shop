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

import express from "express";
import type { Request, Response } from "express";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../config/constants";
import { Book } from "../models/book.model";

// ============================================
// TIPOS PARA LAS PETICIONES
// ============================================
// Define qué datos esperamos recibir en cada petición

interface CreateBookBody {
  title: string;
  description: string;
  price: number;
  author: string;
  ownerId: string;
}

interface UpdateBookBody {
  title?: string; // El ? significa opcional
  description?: string;
  price?: number;
  author?: string;
}

// ============================================
// CREAR EL ROUTER
// ============================================
const bookRouter: express.Router = express.Router();

// ============================================
// GET /books - Listar todos los libros publicados
// ============================================
// Ruta pública que devuelve todos los libros disponibles
bookRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    // Busca solo libros con status PUBLISHED, ordenados del más nuevo al más viejo
    const books = await Book.find({ status: "PUBLISHED" }).sort({
      createdAt: -1,
    });

    res.json({
      count: books.length,
      items: books,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
});

// ============================================
// GET /books/:bookId - Obtener un libro específico
// ============================================
bookRouter.get(
  "/:bookId",
  async (req: Request<{ bookId: string }>, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;

      // Validar que el ID tenga formato MongoDB (24 caracteres hexadecimales)
      if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: ERROR_MESSAGES.BOOK_NOT_FOUND });
        return;
      }

      const book = await Book.findById(bookId);

      // Si no existe el libro
      if (!book) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: ERROR_MESSAGES.BOOK_NOT_FOUND });
        return;
      }

      // Solo mostrar si está publicado (no mostrar libros vendidos)
      if (book.status !== "PUBLISHED") {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: ERROR_MESSAGES.BOOK_NOT_AVAILABLE });
        return;
      }

      res.json({
        count: 1,
        items: [book],
      });
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  },
);

// ============================================
// POST /books - Crear un nuevo libro
// ============================================
// TODO: Cuando implementes autenticación, el ownerId vendrá del token JWT
bookRouter.post(
  "/",
  async (req: Request<CreateBookBody>, res: Response): Promise<void> => {
    try {
      const { title, description, price, author, ownerId } = req.body;

      // Validar que vengan todos los campos obligatorios
      if (!title || !description || price === undefined || !author) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
        return;
      }

      // Crear el nuevo libro
      const newBook = new Book({
        title,
        description,
        price,
        author,
        ownerId: ownerId || "000000000000000000000000", // ID temporal hasta tener auth
        status: "PUBLISHED",
      });

      // Guardarlo en la base de datos
      const savedBook = await newBook.save();

      // Responder con el libro creado
      res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_MESSAGES.BOOK_CREATED,
        item: savedBook,
      });
    } catch (error: unknown) {
      // Verificar si es un error de tipo Error
      const errorMessage =
        error instanceof Error ? error.message : ERROR_MESSAGES.DATABASE_ERROR;
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: errorMessage,
      });
    }
  },
);

// ============================================
// PATCH /books/:bookId - Actualizar un libro
// ============================================
// Solo permite actualizar: título, descripción, precio y autor
bookRouter.patch(
  "/:bookId",
  async (
    req: Request<{ bookId: string }, UpdateBookBody>,
    res: Response,
  ): Promise<void> => {
    try {
      const { bookId } = req.params;
      const { title, description, price, author } = req.body;

      // Construir un objeto solo con los campos que vienen en la petición
      // Partial<UpdateBookBody> significa que puede tener algunos o ninguno de los campos
      const updateData: Partial<UpdateBookBody> = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (price !== undefined) updateData.price = price;
      if (author) updateData.author = author;

      // Actualizar el libro en la BD y devolver el libro actualizado (new: true)
      const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, {
        new: true,
      });

      if (!updatedBook) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: ERROR_MESSAGES.BOOK_NOT_FOUND });
        return;
      }

      res.json({
        message: SUCCESS_MESSAGES.BOOK_UPDATED,
        item: updatedBook,
      });
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  },
);

// ============================================
// DELETE /books/:bookId - Eliminar un libro
// ============================================
bookRouter.delete(
  "/:bookId",
  async (req: Request<{ bookId: string }>, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;

      // Buscar y eliminar el libro
      const deletedBook = await Book.findByIdAndDelete(bookId);

      if (!deletedBook) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: ERROR_MESSAGES.BOOK_NOT_FOUND });
        return;
      }

      res.json({ message: SUCCESS_MESSAGES.BOOK_DELETED });
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  },
);

// ============================================
// EXPORTAR EL ROUTER
// ============================================
export default bookRouter;
