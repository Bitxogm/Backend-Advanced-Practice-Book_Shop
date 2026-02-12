import { BookMongodbRepository } from '@/infrastructure/repositories/book/book-mongodb-repository';
import { ERROR_MESSAGES, HTTP_STATUS } from '@config/constants';
import { BuyBookUseCase } from '@domain/use-cases/book/buy-book-usecase';
import type { AuthenticatedRequest } from '@ui/middlewares/authentication-middleware';
import { Response } from 'express';

export const buyBookController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id; // Asumimos que el middleware de autenticación añade user al request
    const bookId = req.params.bookId;
    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }
    const booksRepo = new BookMongodbRepository();
    const buyBookUseCase = new BuyBookUseCase(booksRepo);
    const result = await buyBookUseCase.execute({ bookId, userId });
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === ERROR_MESSAGES.BOOK_NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: error.message });
      }
      if (
        error.message === ERROR_MESSAGES.CANNOT_BUY_OWN_BOOK ||
        error.message === ERROR_MESSAGES.BOOK_ALREADY_SOLD
      ) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.message });
      }
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};
