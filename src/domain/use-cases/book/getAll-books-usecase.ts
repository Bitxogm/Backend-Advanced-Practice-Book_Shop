import { IBookRepository } from '@domain/repositories/BookRepository';
import Book from '@domain/entities/Book';

export class GetAllbooksUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  public async execute(): Promise<Book[]> {
    const books = await this.bookRepository.getAll();
    return books;
  }
}
