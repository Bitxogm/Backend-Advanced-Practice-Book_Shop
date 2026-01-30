import { IBookRepository } from '../repositories/BookRepository';
import Book from '../entities/Book';

export class GetAllbooksUseCase {
  private readonly bookRepository: IBookRepository;

  constructor(bookRepository: IBookRepository) {
    this.bookRepository = bookRepository;
  }

  public async execute(): Promise<Book[]> {
    const books = await this.bookRepository.getAll();
    return books;
  }
}
