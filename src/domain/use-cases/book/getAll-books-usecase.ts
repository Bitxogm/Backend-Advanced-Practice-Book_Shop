import { IBookRepository } from '@domain/repositories/BookRepository';
import Book from '@domain/entities/Book';
import { bookFindQuery } from '@/domain/types/BookFindQuery';

export class GetAllBooksUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  public async execute(query: bookFindQuery): Promise<Book[]> {
    const books = await this.bookRepository.getAll({ ...query });
    return books;
  }
}
