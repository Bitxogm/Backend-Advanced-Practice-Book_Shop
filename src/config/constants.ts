export const HTTP_STATUS = {
  OK: 200, // Todo salió bien
  CREATED: 201, // Se creó algo nuevo
  NO_CONTENT: 204, // Éxito pero sin datos que devolver
  BAD_REQUEST: 400, // La petición está mal hecha
  UNAUTHORIZED: 401, // No estás autenticado
  FORBIDDEN: 403, // No tienes permiso
  NOT_FOUND: 404, // No se encontró lo que buscabas
  CONFLICT: 409, // Conflicto, recurso ya existe
  INTERNAL_SERVER_ERROR: 500, // Error en nuestro servidor
} as const;

export const ERROR_MESSAGES = {
  NO_BOOKS_FOUND: 'No books found',
  BOOK_NOT_FOUND: 'Book not found',
  BOOK_NOT_AVAILABLE: 'Book not available',
  INVALID_REQUEST: 'Invalid request data',
  REQUIRED_FIELDS: 'Required fields are missing',
  DATABASE_ERROR: 'Database error',
  SERVER_ERROR: 'Internal server error',
  CANNOT_BUY_OWN_BOOK: 'You cannot buy your own book',
  BOOK_ALREADY_SOLD: 'The book is already sold',
  USER_NOT_FOUND: 'User not found',
  INVALID_PASSWORD: 'Invalid password',
  EMAIL_AND_PASSWORD_REQUIRED: 'Email and password are required',
  USER_ALREADY_EXISTS: 'A user with this email already exists',
} as const;

export const SUCCESS_MESSAGES = {
  BOOK_CREATED: 'Book created successfully',
  BOOK_UPDATED: 'Book updated successfully',
  BOOK_DELETED: 'Book deleted successfully',
  BOOK_PURCHASED: 'Book purchased successfully',
  USER_CREATED: 'User created successfully',
} as const;
