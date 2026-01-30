# 🧪 Tests E2E para API de Libros

## 📚 ¿Qué son estos tests?

Los tests **end-to-end (E2E)** prueban toda la aplicación desde el principio hasta el final, simulando peticiones HTTP reales a la API.

## 🛠️ Tecnologías usadas

- **Jest**: Framework de testing
- **Supertest**: Para hacer peticiones HTTP en los tests
- **Ngneat/falso**: Para generar datos falsos realistas
- **MongoDB Memory Server**: Base de datos en memoria para tests

## 📁 Estructura de los tests

```
src/test/
├── setup.ts                          # Configuración global de tests
└── books/
    ├── create-book.test.ts           # Tests para POST /books
    ├── find-book.test.ts             # Tests para GET /books y GET /books/:id
    ├── update-book.test.ts           # Tests para PATCH /books/:id
    ├── delete-book.test.ts           # Tests para DELETE /books/:id
    └── helpers/
        └── create-random-book.ts     # Helper para crear libros falsos
```

## 🚀 Cómo ejecutar los tests

### Ejecutar todos los tests una vez

```bash
npm test
```

### Ejecutar tests en modo watch (se re-ejecutan al cambiar código)

```bash
npm run test:watch
```

## 📖 Ejemplos de uso de @ngneat/falso

### Crear un libro aleatorio

```typescript
import { createRandomBook } from './helpers/create-random-book';

const book = createRandomBook();
// {
//   title: "The Great Gatsby",
//   description: "Lorem ipsum dolor sit amet...",
//   price: 24.99,
//   author: "John Doe",
//   ownerId: "000000000000000000000000"
// }
```

### Crear un libro con datos específicos

```typescript
const book = createRandomBook({
  price: 19.99,
  author: 'Jane Smith',
});
// Los demás campos se generan aleatoriamente
```

### Crear múltiples libros

```typescript
import { createRandomBooks } from './helpers/create-random-book';

const books = createRandomBooks(10); // Crea 10 libros aleatorios
```

## 🧪 Tests disponibles

### GET /books

- ✅ Devuelve array vacío cuando no hay libros
- ✅ Devuelve todos los libros publicados

### POST /books

- ✅ Crea un libro con datos válidos
- ✅ Falla si falta el título
- ✅ Falla si falta la descripción
- ✅ Falla si el precio es negativo

### GET /books/:bookId

- ✅ Devuelve un libro específico
- ✅ Devuelve 404 si no existe
- ✅ Devuelve 404 si el ID es inválido

### PATCH /books/:bookId

- ✅ Actualiza el título
- ✅ Actualiza el precio
- ✅ Devuelve 404 si no existe

### DELETE /books/:bookId

- ✅ Elimina un libro correctamente
- ✅ Devuelve 404 si no existe

## 💡 Consejos

1. **Antes de cada test** se limpia la base de datos
2. **MongoDB Memory Server** crea una BD temporal que se destruye al finalizar
3. **@ngneat/falso** genera datos diferentes cada vez, haciendo los tests más robustos
4. Los tests son **independientes** - el orden de ejecución no importa
5. Los tests están **organizados por operación** (crear, buscar, actualizar, eliminar)

## 🔧 Añadir nuevos tests

```typescript
describe('Nombre del grupo de tests', () => {
  it('debe hacer algo específico', async () => {
    // 1. Preparar datos de prueba
    const book = createRandomBook();

    // 2. Hacer la petición HTTP
    const response = await request(app).post('/books').send(book);

    // 3. Verificar el resultado
    expect(response.status).toBe(201);
    expect(response.body.item.title).toBe(book.title);
  });
});
```

## 🎯 Métodos de @ngneat/falso más útiles

```typescript
// Libros
randBook().title; // "The Great Gatsby"
randBook().author; // "F. Scott Fitzgerald"
randBook().genre; // "Fiction"

// Texto
randParagraph(); // Párrafo de texto
randSentence(); // Una frase
randWord({ length: 5 }); // 5 palabras aleatorias

// Personas
randFullName(); // "John Doe"
randFirstName(); // "Jane"
randLastName(); // "Smith"

// Números y precios
randNumber({ min: 1, max: 100 }); // Número entre 1 y 100
randNumber({ min: 5, max: 100, precision: 0.01 }); // Precio con decimales
```

## 🐛 Troubleshooting

### Error: "Cannot find module '@ngneat/falso'"

```bash
npm install --save-dev @ngneat/falso
```

### Tests no se ejecutan

Verificar que tienes jest.config.ts configurado correctamente

### Base de datos real se usa en tests

Asegúrate de que setup.ts está usando MongoMemoryServer
