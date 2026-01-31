import { IBookRepository } from '@domain/repositories/BookRepository';
import Book from '@domain/entities/Book';

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
