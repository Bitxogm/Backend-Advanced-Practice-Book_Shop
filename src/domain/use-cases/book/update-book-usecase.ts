import { BookMongodbRepository } from '@/infrastructure/repositories/book/book-mongodb-repository';
import Book from '@domain/entities/Book';
import { BookUpdateQuery } from '@domain/types/BookUpdateQuery';

export class UpdateBookUseCase {
  constructor(private readonly bookRepository: BookMongodbRepository) {}

  public async execute(id: string, update: BookUpdateQuery): Promise<Book | null> {
    // Validación de negocio: precio no puede ser negativo (si se provee)
    if (update.price !== undefined && update.price < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    // Obtener el libro actual
    const currentBook = await this.bookRepository.findById(id);
    if (!currentBook) {
      return null;
    }

    // Crear instancia de Book con los campos actualizados
    const bookToUpdate = new Book({
      ...currentBook,
      ...update,
      id: id,
    });

    // Guardar en la base de datos a través del repositorio
    const updatedBook = await this.bookRepository.update(bookToUpdate);
    return updatedBook;
  }
}
