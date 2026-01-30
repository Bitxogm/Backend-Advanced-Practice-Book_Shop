import { BookMongodbRepository } from '../../infrastructure/repositories/book-repository';
import Book from '../entities/Book';

export class UpdateBookUseCase {
  readonly bookRepository: BookMongodbRepository;

  constructor(bookRepository: BookMongodbRepository) {
    this.bookRepository = bookRepository;
  }

  public async execute({
    id,
    title,
    description,
    price,
    author,
    status,
    ownerId,
    soldAt,
  }: {
    id: string;
    title: string;
    description: string;
    price: number;
    author: string;
    status: 'PUBLISHED' | 'SOLD';
    ownerId: string;
    soldAt: Date | null;
  }): Promise<Book | null> {
    // Validación de negocio: precio no puede ser negativo
    if (price < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    // Crear instancia de Book para pasar al repositorio
    const bookToUpdate = new Book({
      id,
      title,
      description,
      price,
      author,
      status,
      ownerId,
      soldAt,
    });

    // Guardar en la base de datos a través del repositorio
    const updatedBook = await this.bookRepository.update(bookToUpdate);

    return updatedBook;
  }
}
