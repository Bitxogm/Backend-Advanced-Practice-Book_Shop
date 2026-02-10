import Book from '../entities/Book';
import { Pagination } from '../types/Pagination';

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

  getAll({ page, limit }: Pagination): Promise<Book[]>;

  update(book: Book): Promise<Book | null>;

  delete(id: string): Promise<Book | null>;

  findById(id: string): Promise<Book | null>;
}

export default IBookRepository;
