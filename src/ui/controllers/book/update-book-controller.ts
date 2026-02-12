import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from '@config/constants';
import type { AuthenticatedRequest } from '@ui/middlewares/authentication-middleware';
import type { Response } from 'express';

import { BookMongodbRepository } from '@/infrastructure/repositories/book/book-mongodb-repository';
import { UpdateBookUseCase } from '@domain/use-cases/book/update-book-usecase';
import type { BookResponseDTO, UpdateBookDTO } from '../../dto/book.dto';

export const updateBookController = async (request: AuthenticatedRequest, response: Response) => {
  try {
    const { bookId } = request.params;
    const updateData: UpdateBookDTO = request.body;

    // Validar que haya al menos un campo para actualizar y que el body sea un objeto válido
    if (
      !updateData ||
      typeof updateData !== 'object' ||
      Array.isArray(updateData) ||
      Object.keys(updateData).length === 0
    ) {
      response.status(HTTP_STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
      return;
    }

    // Crear dependencias
    const bookMongodbRepository = new BookMongodbRepository();
    const updateBookUseCase = new UpdateBookUseCase(bookMongodbRepository);

    // Obtener userId autenticado
    const { user } = request as AuthenticatedRequest;
    if (!user || !user.id) {
      response.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }
    // Ejecutar caso de uso con argumentos en orden correcto
    const updatedBook = await updateBookUseCase.execute(bookId, user.id, updateData);

    if (!updatedBook) {
      response.status(HTTP_STATUS.NOT_FOUND).json({ message: ERROR_MESSAGES.BOOK_NOT_FOUND });
      return;
    }

    // Mapear Book a BookResponseDTO
    const responseDTO: BookResponseDTO = {
      id: updatedBook.id,
      title: updatedBook.title,
      description: updatedBook.description,
      price: updatedBook.price,
      author: updatedBook.author,
      status: updatedBook.status,
      ownerId: updatedBook.ownerId,
      soldAt: updatedBook.soldAt,
    };

    response.status(HTTP_STATUS.OK).json({
      message: SUCCESS_MESSAGES.BOOK_UPDATED,
      item: responseDTO,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Book not found') {
        response.status(HTTP_STATUS.NOT_FOUND).json({ message: ERROR_MESSAGES.BOOK_NOT_FOUND });
        return;
      }
      if (error.message === 'You are not authorized to update this book') {
        response.status(HTTP_STATUS.FORBIDDEN).json({ message: error.message });
        return;
      }
    }
    response
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};
