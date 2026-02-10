import { IBookRepository } from '@domain/repositories/BookRepository';
import Book from '@domain/entities/Book';
import { Pagination } from '@/domain/types/Pagination';

export class GetAllBooksUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  public async execute({ page, limit }: Pagination): Promise<Book[]> {
    const books = await this.bookRepository.getAll({ page, limit });
    return books;
  }
}
