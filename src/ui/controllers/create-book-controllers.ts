import type { Request, Response } from 'express';

import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from '@config/constants';
import { CreateBookUseCase } from '@domain/use-cases/create-book-usecase';
import { BookMongodbRepository } from '@infrastructure/repositories/book-repository';

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

export const createBookController = async (
  req: Request<CreateBookBody>,
  res: Response
): Promise<void> => {
  try {
    const { title, description, price, author } = req.body;

    // Validar que vengan todos los campos obligatorios
    if (!title || !description || price === undefined || !author) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
      return;
    }

    // Validar que el precio no sea negativo
    if (price < 0) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'El precio no puede ser negativo' });
      return;
    }

    // Crear dependencias
    const bookMongodbRepository = new BookMongodbRepository();
    const createBookUseCase = new CreateBookUseCase(bookMongodbRepository);

    // Llamar al caso de uso para crear el libro
    const newBook = await createBookUseCase.execute({
      title,
      description,
      price,
      author,
      ownerId: '000000000000000000000000', // ID temporal hasta tener auth
    });

    // Responder con el libro creado
    res.status(HTTP_STATUS.CREATED).json({
      message: SUCCESS_MESSAGES.BOOK_CREATED,
      item: newBook,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.DATABASE_ERROR;
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: errorMessage,
    });
  }
};
