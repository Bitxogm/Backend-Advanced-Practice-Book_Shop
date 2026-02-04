import { type Request, type Response } from 'express';
import type { AuthenticatedRequest } from '../../middlewares/authentication-middleware';
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from '@config/constants';
import { DeleteBookUseCase } from '@domain/use-cases/book/delete-book-usecase';
import { BookMongodbRepository } from '@/infrastructure/repositories/book/book-mongodb-repository';
import type { BookResponseDTO } from '../../dto/book.dto';

export const deleteBookController = async (request: Request, response: Response) => {
  try {
    const { bookId } = request.params;

    // Buscar y eliminar el libro
    const bookMongodbRepository = new BookMongodbRepository();
    const deleteBookUseCase = new DeleteBookUseCase(bookMongodbRepository);
    const { user } = request as AuthenticatedRequest;
    if (!user || !user.id) {
      response.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }
    const deletedBook = await deleteBookUseCase.execute(bookId, user.id);
    if (!deletedBook) {
      response.status(HTTP_STATUS.NOT_FOUND).json({ message: ERROR_MESSAGES.BOOK_NOT_FOUND });
      return;
    }
    // Mapear Book a BookResponseDTO si se desea retornar el libro eliminado
    const responseDTO: BookResponseDTO = {
      id: deletedBook.id,
      title: deletedBook.title,
      description: deletedBook.description,
      price: deletedBook.price,
      author: deletedBook.author,
      status: deletedBook.status,
      ownerId: deletedBook.ownerId,
      soldAt: deletedBook.soldAt,
    };
    response.status(HTTP_STATUS.OK).json({
      message: SUCCESS_MESSAGES.BOOK_DELETED,
      item: responseDTO,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Book not found') {
        response.status(HTTP_STATUS.NOT_FOUND).json({ message: ERROR_MESSAGES.BOOK_NOT_FOUND });
        return;
      }
      if (error.message === 'You are not authorized to delete this book') {
        response.status(HTTP_STATUS.FORBIDDEN).json({ message: error.message });
        return;
      }
    }
    response
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};
