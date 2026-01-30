import { BookModelMongoose as BookModel } from '../models/book.model';
import { IBookRepository } from '../../domain/repositories/BookRepository';
import { Book } from '../../domain/entities/Book';

export class BookMongodbRepository implements IBookRepository {
  // Aquí irán los métodos para interactuar con la base de datos
  // Por ejemplo: create, findById, update, delete, etc.

  async createOneBook({
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
    ownerId?: string;
  }): Promise<Book> {
    // Lógica para agregar un libro a la base de datos
    // Crear el nuevo libro en MongoDB
    const newBook = new BookModel({
      title,
      description,
      price,
      author,
      ownerId: ownerId || '000000000000000000000000', // ID temporal hasta tener auth
      status: 'PUBLISHED',
    });

    // Guardarlo en la base de datos
    const savedBook = await newBook.save();

    // Convertir el documento de Mongoose a entidad de dominio
    return new Book({
      id: savedBook._id.toString(),
      title: savedBook.title,
      description: savedBook.description,
      price: savedBook.price,
      author: savedBook.author,
      status: savedBook.status,
      ownerId: savedBook.ownerId.toString(),
      soldAt: savedBook.soldAt,
    });
  }
}
