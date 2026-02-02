import IBookRepository from '@domain/repositories/BookRepository';
import Book from '@domain/entities/Book';

export class DeleteBookUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  public async execute(bookId: string): Promise<Book | null> {
    const deletedBook = await this.bookRepository.delete(bookId);

    if (!deletedBook) {
      return null;
    }

    return deletedBook;
  }
}

export default DeleteBookUseCase;
