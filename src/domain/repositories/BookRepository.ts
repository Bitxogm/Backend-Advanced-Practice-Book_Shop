import Book from '../entities/Book';
import { bookFindQuery } from '../types/BookFindQuery';

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

  findOldPublishedBooks(daysOld: number): Promise<Book[]>;

  update(book: Book): Promise<Book | null>;

  delete(id: string): Promise<Book | null>;

  findById(id: string): Promise<Book | null>;
}

export default IBookRepository;
