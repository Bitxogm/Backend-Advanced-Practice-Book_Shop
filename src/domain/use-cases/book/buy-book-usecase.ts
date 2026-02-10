import { Book } from '../../entities/Book';
import { IBookRepository } from '../../repositories/BookRepository';
import { ERROR_MESSAGES } from '../../../config/constants';

interface BuyBookInput {
  bookId: string;
  userId: string;
}

export class BuyBookUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  async execute({ bookId, userId }: BuyBookInput): Promise<Book> {
    const book = await this.bookRepository.findById(bookId);
    if (!book) throw new Error(ERROR_MESSAGES.BOOK_NOT_FOUND);
    if (book.ownerId === userId) throw new Error(ERROR_MESSAGES.CANNOT_BUY_OWN_BOOK);
    if (book.status === 'SOLD') throw new Error(ERROR_MESSAGES.BOOK_ALREADY_SOLD);
    const updatedBook = new Book({
      ...book,
      status: 'SOLD',
      soldAt: new Date(),
    });
    await this.bookRepository.update(updatedBook);
    // Aquí podrías notificar al vendedor (simulado)
    return updatedBook;
  }
}
