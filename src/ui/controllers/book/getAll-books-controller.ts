import type { Request, Response } from 'express';
import { ERROR_MESSAGES, HTTP_STATUS } from '@config/constants';

import { BookMongodbRepository } from '@/infrastructure/repositories/book/book-mongodb-repository';

import { GetAllBooksUseCase } from '@domain/use-cases/book/getAll-books-usecase';
import type { BookResponseDTO } from '../../dto/book.dto';

import * as z from 'zod';

const paginationValidator = z.object({
  page: z.coerce
    .number()
    .int('page debe ser un número entero')
    .positive('page debe ser un número positivo'),
  limit: z.coerce
    .number()
    .int('limit debe ser un número entero')
    .positive('limit debe ser un número positivo')
    .max(100, 'limit no puede exceder 100'),
});

export const getAllBooksController = async (request: Request, response: Response) => {
  try {
    const { page, limit } = paginationValidator.parse(request.query);
    const booksMongodbRepository = new BookMongodbRepository();
    const getAllBooksUseCase = new GetAllBooksUseCase(booksMongodbRepository);
    const books = await getAllBooksUseCase.execute({ page, limit });

    if (!books || books.length === 0) {
      return response.status(HTTP_STATUS.OK).json({
        message: ERROR_MESSAGES.NO_BOOKS_FOUND,
        count: 0,
        items: [],
      });
    }

    const responseDTOs: BookResponseDTO[] = books.map(book => ({
      id: book.id,
      title: book.title,
      description: book.description,
      price: book.price,
      author: book.author,
      status: book.status,
      ownerId: book.ownerId,
      soldAt: book.soldAt,
    }));
    response.status(HTTP_STATUS.OK).json({
      count: responseDTOs.length,
      items: responseDTOs,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return response.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Validación fallida',
        details: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    // Manejo de otros errores inesperados
    return response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
