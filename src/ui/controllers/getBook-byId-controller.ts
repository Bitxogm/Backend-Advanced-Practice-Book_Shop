import type { Request, Response } from 'express';
import { ERROR_MESSAGES, HTTP_STATUS } from '@config/constants';

import { BookMongodbRepository } from '@infrastructure/repositories/book-repository';
import { GetBookByIdUseCase } from '@domain/use-cases/getBook-byId-usecase';
import type { BookResponseDTO } from '../dto/book.dto';

export const getBookByIdController = async (request: Request, response: Response) => {
  try {
    const { bookId } = request.params;

    // Validación de infraestructura: ID válido de MongoDB (24 caracteres hexadecimales)
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
      return response.status(HTTP_STATUS.NOT_FOUND).json({
        message: ERROR_MESSAGES.BOOK_NOT_FOUND,
      });
    }

    const booksMongodbRepository = new BookMongodbRepository();
    const getBookByIdUseCase = new GetBookByIdUseCase(booksMongodbRepository);
    const book = await getBookByIdUseCase.execute(bookId);

    if (!book) {
      return response.status(HTTP_STATUS.NOT_FOUND).json({
        message: ERROR_MESSAGES.BOOK_NOT_FOUND,
      });
    }

    const responseDTO: BookResponseDTO = {
      id: book.id,
      title: book.title,
      description: book.description,
      price: book.price,
      author: book.author,
      status: book.status,
      ownerId: book.ownerId,
      soldAt: book.soldAt,
    };
    return response.status(HTTP_STATUS.OK).json({
      count: 1,
      items: [responseDTO],
    });
  } catch (error) {
    return response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};
