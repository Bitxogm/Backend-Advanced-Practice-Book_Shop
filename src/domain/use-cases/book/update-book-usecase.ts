import { BookMongodbRepository } from '@/infrastructure/repositories/book/book-mongodb-repository';
import Book from '@domain/entities/Book';
import { BookUpdateQuery } from '@domain/types/BookUpdateQuery';

export class UpdateBookUseCase {
  constructor(private readonly bookRepository: BookMongodbRepository) {}

  public async execute(id: string, userId: string, update: BookUpdateQuery): Promise<Book | null> {
    // Validación de negocio: precio no puede ser negativo (si se provee)
    if (update.price !== undefined && update.price < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    // Obtener el libro actual de la base de datos
    const bookFromDb = await this.bookRepository.findById(id);
    if (!bookFromDb) {
      throw new Error('Book not found');
    }

    if (bookFromDb.ownerId !== userId) {
      throw new Error('You are not authorized to update this book');
    }

    // Crear instancia de Book con los campos actualizados
    const bookToUpdate = new Book({
      ...bookFromDb,
      ...update,
      id: id,
    });

    // Guardar en la base de datos a través del repositorio
    const updatedBook = await this.bookRepository.update(bookToUpdate);
    return updatedBook;
  }
}
