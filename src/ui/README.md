# 🎨 UI Layer (Capa de Interfaz de Usuario)

## ¿Qué es la capa UI?

La **capa UI** (User Interface) es el punto de entrada de la aplicación. En un backend REST API, esta capa maneja las peticiones HTTP, valida datos de entrada, llama a los casos de uso y formatea las respuestas.

### Principios clave

- ✅ **Controllers** - Manejan peticiones HTTP y respuestas
- ✅ **Validación de entrada** - Verifican datos antes de pasarlos al dominio
- ✅ **Formateo de respuestas** - Estructuran JSON para el cliente
- ✅ **Gestión de errores HTTP** - Códigos de estado apropiados (200, 400, 404, 500)
- ✅ **Sin lógica de negocio** - Solo coordinación y presentación

## 📁 Estructura actual

```
ui/
└── controllers/
    └── create-book-controllers.ts  # Controller para crear libros
```

## 🎮 Controllers

Los controllers son **adaptadores** entre HTTP y tu aplicación.

### CreateBookController

Maneja las peticiones `POST /books` para crear libros.

**Responsabilidades:**

1. Extraer datos del request body (`req.body`)
2. Validar campos requeridos
3. Validar reglas de negocio simples (precio no negativo)
4. Crear instancias de repositorio y use case
5. Ejecutar el use case
6. Devolver respuesta HTTP formateada

**Flujo:**

```
HTTP Request → Controller → Use Case → Domain → Repository → DB
                    ↓
             HTTP Response
```

**Ejemplo de request:**

```json
POST /books
{
  "title": "Clean Architecture",
  "description": "A Craftsman's Guide to Software Structure",
  "price": 34.99,
  "author": "Robert C. Martin"
}
```

**Ejemplo de response:**

```json
201 Created
{
  "message": "Libro creado con éxito",
  "item": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Clean Architecture",
    "description": "A Craftsman's Guide to Software Structure",
    "price": 34.99,
    "author": "Robert C. Martin",
    "status": "PUBLISHED",
    "ownerId": "000000000000000000000000",
    "soldAt": null
  }
}
```

## 🔍 Validaciones en el Controller

### Validaciones básicas (Controller)

- ✅ Campos requeridos presentes
- ✅ Tipos de datos correctos
- ✅ Formato básico

### Validaciones de negocio (Use Case)

- ✅ Reglas de negocio complejas
- ✅ Consistencia de datos
- ✅ Permisos y autorización

**Ejemplo:**

```typescript
// ❌ MAL - Validación de negocio en controller
if (book.price > user.budget) {
  return res.status(400).json({ message: 'Presupuesto insuficiente' });
}

// ✅ BIEN - Solo validación de entrada en controller
if (!title || !description || price === undefined) {
  return res.status(400).json({ message: 'Faltan campos requeridos' });
}
```

## 📦 Inyección de dependencias

El controller **no debe conocer** qué base de datos usas. Recibe el repositorio como dependencia.

**Actualmente:**

```typescript
// Crear dependencias dentro del controller (acoplado)
const repository = new BookMongodbRepository();
const useCase = new CreateBookUseCase(repository);
```

**Mejor práctica (futuro):**

```typescript
// Inyectar dependencias desde fuera (desacoplado)
export const makeCreateBookController = (bookRepository: IBookRepository) => {
  return async (req: Request, res: Response) => {
    const useCase = new CreateBookUseCase(bookRepository);
    // ... resto del código
  };
};
```

## 🚀 Futuras expansiones

```
ui/
├── controllers/
│   ├── book/
│   │   ├── create-book.controller.ts
│   │   ├── find-books.controller.ts
│   │   ├── update-book.controller.ts
│   │   └── delete-book.controller.ts
│   └── user/
│       ├── register.controller.ts
│       └── login.controller.ts
├── middlewares/
│   ├── auth.middleware.ts      # Verificar JWT
│   └── validate.middleware.ts  # Validación con Zod/Joi
└── dto/                        # Data Transfer Objects
    ├── create-book.dto.ts
    └── update-book.dto.ts
```

## 🎯 ¿Por qué separar UI?

**Ventajas:**

- Puedes cambiar Express por Fastify sin tocar el dominio
- Puedes agregar GraphQL junto a REST
- Testear controllers independientemente
- Reutilizar use cases en CLI, workers, cron jobs

**Ejemplo práctico:**

```typescript
// Mismo use case, diferentes interfaces
// 1. REST API (Express)
app.post('/books', createBookController);

// 2. GraphQL
createBook: (_, args) => createBookUseCase.execute(args);

// 3. CLI
program.command('create-book').action(async options => {
  await createBookUseCase.execute(options);
});
```

## 📝 Códigos de estado HTTP comunes

| Código             | Significado        | Cuándo usar                    |
| ------------------ | ------------------ | ------------------------------ |
| 200 OK             | Éxito              | GET, PATCH exitosos            |
| 201 Created        | Recurso creado     | POST exitoso                   |
| 400 Bad Request    | Datos inválidos    | Validación fallida             |
| 401 Unauthorized   | No autenticado     | Sin token JWT                  |
| 403 Forbidden      | No autorizado      | Token válido pero sin permisos |
| 404 Not Found      | No existe          | Recurso no encontrado          |
| 500 Internal Error | Error del servidor | Error inesperado               |

## 🛡️ Manejo de errores

```typescript
try {
  const book = await createBookUseCase.execute(data);
  res.status(201).json({ message: 'Libro creado', item: book });
} catch (error) {
  // Errores de validación → 400
  if (error instanceof ValidationError) {
    res.status(400).json({ message: error.message });
  }
  // Errores de negocio → 422
  else if (error instanceof BusinessRuleError) {
    res.status(422).json({ message: error.message });
  }
  // Errores desconocidos → 500
  else {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}
```
