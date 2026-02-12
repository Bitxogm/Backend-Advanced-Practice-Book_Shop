import Book from '../entities/Book';
import { bookFindQuery } from '../types/BookFindQuery';

// Aqui deefinimo la interfaz del repositorio de libros

export interface IBookRepository {
  createOneBook({
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
  }): Promise<Book>;

  getAll(query: bookFindQuery): Promise<Book[]>;

  findByOwnerId(ownerId: string): Promise<Book[]>;

  update(book: Book): Promise<Book | null>;

  delete(id: string): Promise<Book | null>;

  findById(id: string): Promise<Book | null>;
}

export default IBookRepository;
