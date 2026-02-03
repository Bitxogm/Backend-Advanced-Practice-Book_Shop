import { BookMongodbRepository } from '@/infrastructure/repositories/book/book-mongodb-repository';
import Book from '@domain/entities/Book';
import { BookCreatePayload } from '@domain/types/BookCreatePayload';

// Aqui vivira la logica de negocio para crear un libro

export class CreateBookUseCase {
  constructor(private readonly bookRepository: BookMongodbRepository) {}
  public async execute(payload: BookCreatePayload): Promise<Book> {
    // Validación de negocio: precio no puede ser negativo
    if (payload.price < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    // Guardar en la base de datos a través del repositorio
    const savedBook = await this.bookRepository.createOneBook(payload);
    return savedBook;
  }
}
