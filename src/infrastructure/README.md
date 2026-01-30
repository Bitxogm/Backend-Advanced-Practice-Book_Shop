# 🔧 Infrastructure Layer (Capa de Infraestructura)

## ¿Qué es la capa de infraestructura?

La **capa de infraestructura** contiene todas las implementaciones técnicas que conectan tu aplicación con el mundo exterior: bases de datos, APIs externas, sistemas de archivos, etc.

### Principios clave

- ✅ **Implementaciones concretas** - Aquí viven los detalles técnicos
- ✅ **Dependencias externas** - Mongoose, drivers de BD, librerías de terceros
- ✅ **Adaptadores** - Implementa las interfaces definidas en el dominio
- ✅ **Intercambiable** - Puedes cambiar MongoDB por PostgreSQL sin afectar el dominio

## 📁 Estructura actual

```
infrastructure/
├── models/              # Modelos de Mongoose (esquemas de MongoDB)
│   └── book.model.ts   # Esquema de libro en MongoDB
└── repositories/        # Implementaciones de repositorios
    └── book-repository.ts  # BookRepository usando MongoDB
```

## 🗄️ Modelos de Mongoose

### BookModelMongoose

Define el esquema de cómo se almacena un libro en MongoDB.

**Características:**

- Validaciones a nivel de base de datos
- Índices para optimizar búsquedas
- Timestamps automáticos (`createdAt`, `updatedAt`)
- Schema types de Mongoose

**Ejemplo:**

```typescript
const book = new BookModelMongoose({
  title: 'El Quijote',
  description: 'Novela clásica',
  price: 25.99,
  author: 'Miguel de Cervantes',
  status: 'PUBLISHED',
  ownerId: '507f1f77bcf86cd799439011',
});
await book.save();
```

## 🔌 Repositorios

### BookMongodbRepository

Implementa `IBookRepository` (interfaz del dominio) usando MongoDB.

**Responsabilidades:**

- Traducir entre entidades de dominio (`Book`) y modelos de Mongoose (`BookModelMongoose`)
- Ejecutar queries de MongoDB
- Manejar conversiones de tipos
- Gestionar errores de base de datos

**Métodos implementados:**

- `createOneBook()` - Crea un libro en MongoDB

**Ejemplo de uso:**

```typescript
const repository = new BookMongodbRepository();
const newBook = await repository.createOneBook({
  title: 'Clean Code',
  description: 'A Handbook of Agile Software Craftsmanship',
  price: 39.99,
  author: 'Robert C. Martin',
  ownerId: '507f1f77bcf86cd799439011',
});
// Retorna una entidad Book de dominio
```

## 🔄 Flujo de datos

```
Controller → Use Case → Repository → MongoDB
                ↓           ↓
           Domain Book ← Mongoose Model
```

1. **Controller** llama al **Use Case**
2. **Use Case** llama al **Repository**
3. **Repository** convierte entidad → modelo Mongoose
4. **Repository** guarda en MongoDB
5. **Repository** convierte modelo Mongoose → entidad
6. **Repository** retorna entidad al **Use Case**

## 🚀 Futuras expansiones

```
infrastructure/
├── models/
│   ├── book.model.ts
│   └── user.model.ts
├── repositories/
│   ├── book-repository.ts
│   └── user-repository.ts
├── services/              # Servicios externos
│   ├── email-service.ts  # SendGrid, Mailgun, etc.
│   └── payment-service.ts # Stripe, PayPal, etc.
└── cache/
    └── redis-cache.ts    # Caché con Redis
```

## 🎯 Por qué separar infraestructura

**Ventajas:**

- Cambiar de MongoDB a PostgreSQL solo afecta esta capa
- Testear el dominio sin necesidad de base de datos
- Lógica de negocio desacoplada de detalles técnicos
- Facilita TDD (Test-Driven Development)

**Ejemplo práctico:**
Si mañana decides usar PostgreSQL en vez de MongoDB, solo necesitas:

1. Crear un nuevo repositorio `BookPostgresRepository`
2. Actualizar la inyección de dependencias
3. **El dominio y los use cases no cambian nada**
