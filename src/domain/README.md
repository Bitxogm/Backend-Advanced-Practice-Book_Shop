# 🎯 Domain Layer (Capa de Dominio)

## ¿Qué es la capa de dominio?

La **capa de dominio** es el corazón de la aplicación. Contiene la lógica de negocio pura y las entidades fundamentales del sistema, **completamente independientes** de tecnologías externas como bases de datos, frameworks web o librerías de terceros.

### Principios clave

- ✅ **Solo TypeScript puro** - Sin dependencias externas
- ✅ **Inmutable** - Las propiedades son `readonly`
- ✅ **Sin acoplamiento** - No conoce MongoDB, Express, ni otras tecnologías
- ✅ **Lógica de negocio centralizada** - Las reglas del negocio viven aquí
- ✅ **Fácil de testear** - Sin necesidad de mocks complejos

## 📁 Estructura

```
domain/
└── entities/
    └── Book.ts          # Entidad de libro
```

### Futuras expansiones

```
domain/
├── entities/           # Entidades de dominio
│   ├── Book.ts
│   └── User.ts
├── repositories/       # Interfaces de repositorios (ports)
│   └── IBookRepository.ts
└── use-cases/          # Casos de uso de negocio
    ├── CreateBook.ts
    └── SellBook.ts
```

## 🏗️ Entidades

### Book (Libro)

Representa un libro en el sistema de compra/venta.

**Propiedades:**

- `id` - Identificador único
- `title` - Título del libro
- `description` - Descripción del contenido
- `price` - Precio de venta
- `author` - Autor del libro
- `status` - Estado: `PUBLISHED` (disponible) o `SOLD` (vendido)
- `ownerId` - ID del propietario
- `soldAt` - Fecha de venta (null si no está vendido)

**Ejemplo de uso:**

```typescript
import { Book } from './entities/Book';

const book = new Book({
  id: '123',
  title: 'Clean Architecture',
  description: 'A guide to software architecture',
  price: 29.99,
  author: 'Robert C. Martin',
  status: 'PUBLISHED',
  ownerId: 'user-456',
  soldAt: null,
});

console.log(book.title); // "Clean Architecture"
console.log(book.status); // "PUBLISHED"
```

## 🔄 Flujo de datos

```
UI Layer (routes)
    ↓
Application Layer (use-cases) [FUTURO]
    ↓
DOMAIN LAYER (entities) ← Estamos aquí
    ↓
Infrastructure Layer (MongoDB, repositories) [FUTURO]
```

## 💡 ¿Por qué separar el dominio?

### Ventajas

1. **Portabilidad** - Puedes cambiar de MongoDB a PostgreSQL sin tocar el dominio
2. **Testeable** - Tests unitarios sin necesidad de base de datos
3. **Mantenible** - La lógica de negocio está en un solo lugar
4. **Escalable** - Fácil añadir nuevas reglas de negocio
5. **Claridad** - Refleja claramente las reglas del negocio

### Ejemplo de migración

Si mañana decides cambiar de MongoDB a PostgreSQL, solo necesitas:

- ✅ Mantener `domain/entities/Book.ts` igual
- 🔄 Cambiar la implementación en `infrastructure/`
- ✅ Las rutas y la lógica de negocio siguen igual

## 🚫 Lo que NO debe estar aquí

- ❌ Imports de Mongoose, MongoDB
- ❌ Imports de Express, HTTP
- ❌ Lógica de persistencia
- ❌ Validaciones de entrada HTTP
- ❌ Formateo de respuestas JSON

## 🎓 Patrones relacionados

- **Clean Architecture** (Robert C. Martin)
- **Hexagonal Architecture** (Ports & Adapters)
- **Domain-Driven Design (DDD)**

## 📚 Recursos

- [The Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
