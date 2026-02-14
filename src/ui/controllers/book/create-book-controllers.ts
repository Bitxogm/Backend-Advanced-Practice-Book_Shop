import type { Request, Response } from 'express';

import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from '@config/constants';
import { CreateBookUseCase } from '@domain/use-cases/book/create-book-usecase';
import { BookMongodbRepository } from '@/infrastructure/repositories/book/book-mongodb-repository';
import { SecurityBcryptService } from '@/infrastructure/services/security-bcrypt-service';

import type { BookRequestDTO, BookResponseDTO } from '../../dto/book.dto';

export const createBookController = async (
  req: Request<object, object, BookRequestDTO>,
  res: Response
): Promise<void> => {
  try {
    const { title, description, price, author } = req.body;

    if (!title || !description || price === undefined || !author) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
      return;
    }

    if (price < 0) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'El precio no puede ser negativo' });
      return;
    }

    const authenticationHeader = req.headers.authorization;
    if (!authenticationHeader || !authenticationHeader.startsWith('Bearer ')) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }
    const token = authenticationHeader.split(' ')[1];
    const securityService = new SecurityBcryptService();
    let userId: string;
    try {
      userId = securityService.verifyJWT(token);
    } catch (err) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid token' });
      return;
    }

    const bookMongodbRepository = new BookMongodbRepository();
    const createBookUseCase = new CreateBookUseCase(bookMongodbRepository);

    const newBook = await createBookUseCase.execute({
      title,
      description,
      price,
      author,
      ownerId: userId,
      userId,
    });

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
