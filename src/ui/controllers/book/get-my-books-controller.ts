import { BookMongodbRepository } from '@/infrastructure/repositories/book/book-mongodb-repository';
import { ERROR_MESSAGES, HTTP_STATUS } from '@config/constants';
import { GetMyBooksUseCase } from '@domain/use-cases/book/get-my-books-usecase';
import type { AuthenticatedRequest } from '@ui/middlewares/authentication-middleware';
import type { Response } from 'express';
import type { BookResponseDTO } from '../../dto/book.dto';

export const getMyBooksController = async (request: AuthenticatedRequest, response: Response) => {
  try {
    const { user } = request;

    if (!user || !user.id) {
      response.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }

    const bookMongodbRepository = new BookMongodbRepository();
    const getMyBooksUseCase = new GetMyBooksUseCase(bookMongodbRepository);

    const myBooks = await getMyBooksUseCase.execute(user.id);

    const responseDTOs: BookResponseDTO[] = myBooks.map(book => ({
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
    response
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};
