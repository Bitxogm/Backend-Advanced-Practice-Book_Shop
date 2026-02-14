import { BookMongodbRepository } from '@/infrastructure/repositories/book/book-mongodb-repository';
import Book from '@domain/entities/Book';
import { BookUpdateQuery } from '@domain/types/BookUpdateQuery';

export class UpdateBookUseCase {
  constructor(private readonly bookRepository: BookMongodbRepository) {}

  public async execute(id: string, userId: string, update: BookUpdateQuery): Promise<Book | null> {
    if (update.price !== undefined && update.price < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    const bookFromDb = await this.bookRepository.findById(id);
    if (!bookFromDb) {
      throw new Error('Book not found');
    }

    if (bookFromDb.ownerId !== userId) {
      throw new Error('You are not authorized to update this book');
    }

    const bookToUpdate = new Book({
      ...bookFromDb,
      ...update,
      id: id,
    });

    const updatedBook = await this.bookRepository.update(bookToUpdate);
    return updatedBook;
  }
}
