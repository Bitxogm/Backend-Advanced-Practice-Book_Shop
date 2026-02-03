import type { Request, Response } from 'express';

import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from '@config/constants';
import { CreateBookUseCase } from '@domain/use-cases/book/create-book-usecase';
import { BookMongodbRepository } from '@/infrastructure/repositories/book/book-mongodb-repository';

// ============================================
// TIPOS PARA LAS PETICIONES
// ============================================
import type { BookRequestDTO, BookResponseDTO } from '../../dto/book.dto';

export const createBookController = async (
  req: Request<object, object, BookRequestDTO>,
  res: Response
): Promise<void> => {
  try {
    const { title, description, price, author, ownerId } = req.body;

    // Validar que vengan todos los campos obligatorios
    if (!title || !description || price === undefined || !author || !ownerId) {
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
      ownerId,
    });

    // Responder con el libro creado
    // Mapear Book (entidad de dominio) a BookResponseDTO
    const response: BookResponseDTO = {
      id: newBook.id,
      title: newBook.title,
      description: newBook.description,
      price: newBook.price,
      author: newBook.author,
      status: newBook.status,
      ownerId: newBook.ownerId,
      soldAt: newBook.soldAt,
    };
    res.status(HTTP_STATUS.CREATED).json({
      message: SUCCESS_MESSAGES.BOOK_CREATED,
      item: response,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.DATABASE_ERROR;
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: errorMessage,
    });
  }
};
