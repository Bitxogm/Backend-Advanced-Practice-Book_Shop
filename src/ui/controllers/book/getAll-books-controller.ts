import type { Request, Response } from 'express';
import { ERROR_MESSAGES, HTTP_STATUS } from '@config/constants';

import { BookMongodbRepository } from '@/infrastructure/repositories/book/book-mongodb-repository';

import { GetAllbooksUseCase } from '@domain/use-cases/book/getAll-books-usecase';
import type { BookResponseDTO } from '../../dto/book.dto';

export const getAllBooksController = async (request: Request, response: Response) => {
  const booksMongodbRepository = new BookMongodbRepository();
  const getAllBooksUseCase = new GetAllbooksUseCase(booksMongodbRepository);
  const books = await getAllBooksUseCase.execute();

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
};
