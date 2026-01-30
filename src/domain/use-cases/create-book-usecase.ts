import { BookMongodbRepository } from '../../infrastructure/repositories/book-repository';
import Book from '../entities/Book';

// Aqui vivira la logica de negocio para crear un libro

export class CreateBookUseCase {
  readonly BookRepository: BookMongodbRepository;

  constructor(bookRepository: BookMongodbRepository) {
    this.BookRepository = bookRepository;
  }
  public async execute({
    title,
    description,
    price,
    author,
    ownerId,
  }: {
    title: string;
    description: string;
    price: number;
    author: string;
    ownerId: string;
  }): Promise<Book> {
    // Validación de negocio: precio no puede ser negativo
    if (price < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    // Guardar en la base de datos a través del repositorio
    const savedBook = await this.BookRepository.createOneBook({
      title,
      description,
      price,
      author,
      ownerId,
    });

    return savedBook;
  }
}
