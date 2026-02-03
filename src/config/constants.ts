/**
 * CONSTANTES DE LA APLICACIÓN
 *
 * Aquí guardamos valores que NUNCA cambian (constantes).
 * Los ponemos aquí para no repetirlos en todo el código.
 * Si necesitamos cambiar un mensaje, solo lo cambiamos aquí.
 */

/**
 * Códigos de estado HTTP
 * Son números estándar que indican el resultado de una petición:
 * - 200s = Todo bien ✅
 * - 400s = Error del cliente (el que hace la petición) ❌
 * - 500s = Error del servidor (nosotros) 💥
 */
export const HTTP_STATUS = {
  OK: 200, // Todo salió bien
  CREATED: 201, // Se creó algo nuevo
  NO_CONTENT: 204, // Éxito pero sin datos que devolver
  BAD_REQUEST: 400, // La petición está mal hecha
  UNAUTHORIZED: 401, // No estás autenticado
  FORBIDDEN: 403, // No tienes permiso
  NOT_FOUND: 404, // No se encontró lo que buscabas
  INTERNAL_SERVER_ERROR: 500, // Error en nuestro servidor
} as const;

/**
 * Mensajes de error
 * Los usamos para responder cuando algo sale mal
 */
export const ERROR_MESSAGES = {
  NO_BOOKS_FOUND: 'No se encontraron libros',
  BOOK_NOT_FOUND: 'Libro no encontrado',
  BOOK_NOT_AVAILABLE: 'Libro no disponible',
  INVALID_REQUEST: 'Datos de la petición inválidos',
  REQUIRED_FIELDS: 'Faltan campos requeridos',
  DATABASE_ERROR: 'Error en la base de datos',
  SERVER_ERROR: 'Error interno del servidor',
  CANNOT_BUY_OWN_BOOK: 'No puedes comprar tu propio libro',
  BOOK_ALREADY_SOLD: 'El libro ya está vendido',
  EMAIL_AND_PASSWORD_REQUIRED: 'Email y contraseña son requeridos',
  USER_ALREADY_EXISTS: 'Ya existe un usuario con este email',
} as const;

/**
 * Mensajes de éxito
 * Los usamos para responder cuando todo sale bien
 */
export const SUCCESS_MESSAGES = {
  BOOK_CREATED: 'Libro creado con éxito',
  BOOK_UPDATED: 'Libro actualizado con éxito',
  BOOK_DELETED: 'Libro eliminado con éxito',
  BOOK_PURCHASED: 'Libro comprado con éxito',
} as const;
