import { IBookRepository } from '@domain/repositories/BookRepository';
import Book from '@domain/entities/Book';
// import { Pagination } from '@/domain/types/Pagination';
import { bookFindQuery } from '@/domain/types/BookFindQuery';

// interface bookFindQuery extends Pagination {
//   author?: string;
//   title?: string;
// }
export class GetAllBooksUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  public async execute(query: bookFindQuery): Promise<Book[]> {
    const books = await this.bookRepository.getAll({ ...query });
    return books;
  }
}
