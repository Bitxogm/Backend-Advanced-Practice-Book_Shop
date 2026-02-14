import { BookMongodbRepository } from '@/infrastructure/repositories/book/book-mongodb-repository';
import Book from '@domain/entities/Book';
import { BookCreatePayload } from '@domain/types/BookCreatePayload';

export class CreateBookUseCase {
  constructor(private readonly bookRepository: BookMongodbRepository) {}
  public async execute(payload: BookCreatePayload): Promise<Book> {
    if (payload.price < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    const savedBook = await this.bookRepository.createOneBook(payload);
    return savedBook;
  }
}
