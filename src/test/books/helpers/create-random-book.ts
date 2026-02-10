/**
 * HELPER PARA CREAR LIBROS FALSOS EN TESTS
 *
 * Usar @ngneat/falso para generar datos aleatorios realistas.
 * Esta librería es moderna, TypeScript-native y compatible con Jest.
 */

import { randBook, randFullName, randNumber, randParagraph } from '@ngneat/falso';

/**
 * Interfaz para crear un libro (sin ID, MongoDB lo genera)
 */
export interface CreateRandomBookData {
  title: string;
  description: string;
  price: number;
  author: string;
  ownerId: string;
  status: 'PUBLISHED' | 'SOLD';
  soldAt: Date | null;
}

/**
 * Crea datos de un libro aleatorio
 *
 * @param overrides - Permite sobrescribir campos específicos
 * @returns Objeto con datos de libro falso
 *
 * @example
 * // Libro completamente aleatorio
 * const book = createRandomBook();
 *
 * @example
 * // Libro con precio específico
 * const book = createRandomBook({ price: 19.99 });
 */
export const createRandomBook = (
  overrides?: Partial<CreateRandomBookData>
): CreateRandomBookData => {
  return {
    title: randBook().title, // Título de libro realista
    description: randParagraph(), // Párrafo de descripción
    price: randNumber({ min: 5, max: 100, precision: 0.01 }), // Precio entre 5 y 100
    author: randFullName(), // Nombre completo aleatorio
    ownerId: '000000000000000000000000', // ID temporal (cambiar cuando tengas auth)
    status: 'PUBLISHED',
    soldAt: null,
    ...overrides, // Sobrescribe los campos que vengan en overrides
  };
};

/**
 * Crea un array de libros aleatorios
 *
 * @param count - Número de libros a crear (default: 5)
 * @returns Array de libros falsos
 *
 * @example
 * const books = createRandomBooks(10); // Crea 10 libros
 */
export const createRandomBooks = (count: number = 5): CreateRandomBookData[] => {
  return Array.from({ length: count }, () => createRandomBook());
};
