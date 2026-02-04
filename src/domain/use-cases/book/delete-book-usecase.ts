import IBookRepository from '@domain/repositories/BookRepository';
import Book from '@domain/entities/Book';

export class DeleteBookUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  public async execute(bookId: string, userId: string): Promise<Book | null> {
    //Necsitamos el producto
    const bookToRemove = await this.bookRepository.findById(bookId);
    if (!bookToRemove) {
      throw new Error('Book not found');
    }

    if (bookToRemove.ownerId !== userId) {
      throw new Error('You are not authorized to delete this book');
    }

    const deletedBook = await this.bookRepository.delete(bookId);

    if (!deletedBook) {
      return null;
    }

    return deletedBook;
  }
}

export default DeleteBookUseCase;
