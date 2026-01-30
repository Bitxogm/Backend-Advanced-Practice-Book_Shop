import IBookRepository from '../repositories/BookRepository';
import Book from '../entities/Book';

export class DeleteBookUseCase {
  private readonly bookRepository: IBookRepository;

  constructor(bookRepository: IBookRepository) {
    this.bookRepository = bookRepository;
  }

  public async execute(bookId: string): Promise<Book | null> {
    const deletedBook = await this.bookRepository.delete(bookId);

    if (!deletedBook) {
      return null;
    }

    return deletedBook;
  }
}

export default DeleteBookUseCase;
