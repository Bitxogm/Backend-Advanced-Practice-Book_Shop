import { IBookRepository } from '@domain/repositories/BookRepository';
import Book from '@domain/entities/Book';

export class GetBookByIdUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  public async execute(bookId: string): Promise<Book | null> {
    const book = await this.bookRepository.findById(bookId);

    // Si no existe el libro
    if (!book) {
      return null;
    }

    // Regla de negocio: Solo mostrar libros publicados (no mostrar vendidos)
    if (book.status !== 'PUBLISHED') {
      return null;
    }

    return book;
  }
}
