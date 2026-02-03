import { type Request, type Response } from 'express';
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
    const deletedBook = await deleteBookUseCase.execute(bookId);

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
    response
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};
