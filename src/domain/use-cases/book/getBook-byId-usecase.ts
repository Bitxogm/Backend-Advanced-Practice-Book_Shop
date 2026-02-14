import { IBookRepository } from '@domain/repositories/BookRepository';
import Book from '@domain/entities/Book';

export class GetBookByIdUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  public async execute(bookId: string): Promise<Book | null> {
    const book = await this.bookRepository.findById(bookId);

    if (!book) {
      return null;
    }

    if (book.status !== 'PUBLISHED') {
      return null;
    }

    return book;
  }
}
