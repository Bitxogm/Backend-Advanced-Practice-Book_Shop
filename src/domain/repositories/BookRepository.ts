import Book from '../entities/Book';

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
  // Aquí irán otros métodos como:
  // findById(id: string): Promise<Book | null>;
  // update(book: Book): Promise<Book>;
  // delete(id: string): Promise<void>;
}

export default IBookRepository;
