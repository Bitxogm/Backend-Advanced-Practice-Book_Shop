import { BookModelMongoose as BookModel } from '@infrastructure/models/book.model';
import { IBookRepository } from '@domain/repositories/BookRepository';
import { Book } from '@domain/entities/Book';

export class BookMongodbRepository implements IBookRepository {
  async update(book: Book): Promise<Book | null> {
    const updatedBook = await BookModel.findByIdAndUpdate(
      book.id,
      {
        title: book.title,
        description: book.description,
        price: book.price,
        author: book.author,
        status: book.status,
        ownerId: book.ownerId,
        soldAt: book.soldAt,
      },
      { new: true } // Returns the updated document
    );

    if (!updatedBook) {
      return null;
    }

    return new Book({
      id: updatedBook._id.toString(),
      title: updatedBook.title,
      description: updatedBook.description,
      price: updatedBook.price,
      author: updatedBook.author,
      status: updatedBook.status,
      ownerId: updatedBook.ownerId.toString(),
      soldAt: updatedBook.soldAt,
    });
  }
  async delete(id: string): Promise<Book | null> {
    const deletedBook = await BookModel.findByIdAndDelete(id);

    if (!deletedBook) {
      return null;
    }

    return new Book({
      id: deletedBook._id.toString(),
      title: deletedBook.title,
      description: deletedBook.description,
      price: deletedBook.price,
      author: deletedBook.author,
      status: deletedBook.status,
      ownerId: deletedBook.ownerId.toString(),
      soldAt: deletedBook.soldAt,
    });
  }

  async findById(id: string): Promise<Book | null> {
    const bookFromDb = await BookModel.findById(id);

    if (!bookFromDb) {
      return null;
    }

    return new Book({
      id: bookFromDb._id.toString(),
      title: bookFromDb.title,
      description: bookFromDb.description,
      price: bookFromDb.price,
      author: bookFromDb.author,
      status: bookFromDb.status,
      ownerId: bookFromDb.ownerId.toString(),
      soldAt: bookFromDb.soldAt,
    });
  }

  async getAll(): Promise<Book[]> {
    const booksFromDb = await BookModel.find();

    return booksFromDb.map(book => {
      return new Book({
        id: book._id.toString(),
        title: book.title,
        description: book.description,
        price: book.price,
        author: book.author,
        status: book.status,
        ownerId: book.ownerId.toString(),
        soldAt: book.soldAt,
      });
    });
  }
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
