import type { Request, Response } from 'express';
import { ERROR_MESSAGES, HTTP_STATUS } from '@config/constants';

import { BookMongodbRepository } from '@infrastructure/repositories/book-repository';

import { GetAllbooksUseCase } from '@domain/use-cases/getAll-books-usecase';

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

  response.status(HTTP_STATUS.OK).json({
    count: books.length,
    items: books,
  });
};
