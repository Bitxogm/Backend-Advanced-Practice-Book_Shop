import Book from '@domain/entities/Book';
import { IBookRepository } from '@domain/repositories/BookRepository';

export class GetMyBooksUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  public async execute(userId: string): Promise<Book[]> {
    // Obtener todos los libros del usuario (incluyendo vendidos)
    const myBooks = await this.bookRepository.findByOwnerId(userId);
    return myBooks;
  }
}
