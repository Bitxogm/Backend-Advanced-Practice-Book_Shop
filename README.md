# BookShop Backend - Arquitectura Hexagonal

API REST desarrollada con **TypeScript**, **Express**, **MongoDB** y **Arquitectura Hexagonal**.

## 📋 Descripción

BookShop es una plataforma backend para compra y venta de libros en línea. Implementa los principios de arquitectura hexagonal para mantener la lógica de negocio independiente de las implementaciones técnicas.

### Características principales:

✅ **Autenticación de usuarios** - Sign up y login con JWT
✅ **Gestión de libros** - Crear, actualizar, eliminar y consultar libros
✅ **Sistema de compra** - Los usuarios pueden comprar libros de otros vendedores
✅ **Emails automáticos** - Notificaciones al vender y sugerencias de precio
✅ **Cron Jobs** - Tarea automática semanal para sugerir reducción de precio
✅ **Persistencia en MongoDB** - Base de datos NoSQL con Mongoose

---

## 🏛️ Arquitectura Hexagonal

El proyecto sigue los principios de **arquitectura hexagonal** (puertos y adaptadores):

```
src/
├── domain/                    # 🎯 Núcleo de negocio (nunca cambia)
│   ├── entities/              # Entidades del dominio
│   ├── repositories/          # Interfaces de repositorios
│   ├── services/              # Interfaces de servicios
│   ├── types/                 # Tipos y DTOs
│   └── use-cases/             # Lógica de negocio
│
├── infrastructure/            # 🔌 Adaptadores técnicos
│   ├── repositories/          # Implementaciones con MongoDB
│   ├── services/              # Implementaciones reales (Email, Security)
│   ├── jobs/                  # Cron jobs
│   └── models/                # Modelos de Mongoose
│
├── ui/                        # 🎨 Capa de presentación
│   ├── controllers/           # Controllers de Express
│   ├── routes/                # Rutas de Express
│   ├── middlewares/           # Middlewares (autenticación)
│   └── dto/                   # DTOs para validación
│
├── config/                    # ⚙️ Configuración
├── test/                      # 🧪 Tests
└── server.ts                  # Punto de entrada
```

**Ventajas:**

- 🎯 Lógica de negocio aislada y testeable
- 🔌 Fácil cambiar adaptadores (BD, email, etc)
- 📦 Dependencias apuntan hacia el domain
- ♻️ Código reutilizable y mantenible

---

## 🛠️ Requisitos del Sistema

Antes de empezar, asegúrate de tener instalado:

- **Node.js** v18+ ([descargar](https://nodejs.org/))
- **npm** v9+ (viene con Node.js)
- **Docker Desktop** ([descargar](https://www.docker.com/products/docker-desktop))
- **Git** ([descargar](https://git-scm.com/))

Verifica las versiones:

```bash
node --version    # v18.0.0 o superior
npm --version     # v9.0.0 o superior
docker --version  # 20.10.0 o superior
```

---

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/otaku1944/Backend-Avanzado-Practica.git
cd Backend-Avanzado-Practica
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` y completa los valores:

```env
# Base de datos
MONGODB_URI=mongodb://mongo:27017/bookshop
MONGODB_USERNAME=root
MONGODB_PASSWORD=rootpassword

# Puerto servidor
PORT=3000

# Seguridad
JWT_SECRET=tu_clave_secreta_muy_segura

# Email (Ethereal para testing)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=tu_email_ethereal
EMAIL_PASS=tu_password_ethereal
```

> **Nota:** El archivo `.env` está en `.gitignore` y NO se debe comitear. Nunca compartas credenciales reales.

### 4. Levantar la base de datos

```bash
docker-compose up -d
```

Esto inicia:

- 🗄️ MongoDB en puerto 27017
- 📮 MongoDB Express (UI) en puerto 8081

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

---

## 📦 Scripts disponibles

```bash
# Desarrollo
npm run dev          # Modo desarrollo con nodemon (recarga automática)
npm start            # Ejecutar versión compilada

# Compilación
npm run build        # Compilar TypeScript a JavaScript

# Calidad de código
npm run lint         # Verificar código con ESLint
npm run lint:fix     # Corregir errores automáticamente

# Testing
npm test             # Ejecutar tests con Jest

# Docker
docker-compose up -d     # Levantar servicios
docker-compose down      # Detener servicios
docker-compose logs      # Ver logs
```

---

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm test -- --watch

# Tests con coverage
npm test -- --coverage
```

El proyecto incluye tests para:

- ✅ Autenticación (Sign up, Login)
- ✅ Gestión de libros (CRUD)
- ✅ Compra de libros
- ✅ Use cases con lógica de negocio

---

## 📚 Endpoints principales

### Autenticación

```
POST   /auth/signup            Crear usuario
POST   /auth/signin            Iniciar sesión
```

### Libros

```
GET    /books                  Obtener todos los libros
GET    /books/:id              Obtener libro por ID
POST   /books                  Crear nuevo libro
PUT    /books/:id              Actualizar libro
DELETE /books/:id              Eliminar libro
GET    /books/my-books         Mis libros (requiere auth)
```

### Compra

```
POST   /books/:id/buy          Comprar un libro
```

---

## 🔄 Flujos principales

### 1. Compra de libro

```
Usuario A compra libro de Usuario B
         ↓
  Actualizar estado: SOLD
         ↓
  Enviar email a Usuario B
```

### 2. Sugerencia de precio (Cron Job)

```
⏰ Cada lunes a las 9:00 AM
         ↓
Buscar libros con > 7 días publicados
         ↓
Enviar email a cada vendedor
```

---

## 🔑 Variables de entorno requeridas

| Variable           | Descripción             | Ejemplo                          |
| ------------------ | ----------------------- | -------------------------------- |
| `MONGODB_URI`      | URL de conexión MongoDB | `mongodb://mongo:27017/bookshop` |
| `MONGODB_USERNAME` | Usuario de MongoDB      | `root`                           |
| `MONGODB_PASSWORD` | Contraseña de MongoDB   | `rootpassword`                   |
| `PORT`             | Puerto del servidor     | `3000`                           |
| `JWT_SECRET`       | Clave para firmar JWTs  | `super_secret_key_123`           |
| `EMAIL_HOST`       | Host SMTP para emails   | `smtp.ethereal.email`            |
| `EMAIL_PORT`       | Puerto SMTP             | `587`                            |
| `EMAIL_USER`       | Usuario SMTP            | `usuario@ethereal.email`         |
| `EMAIL_PASS`       | Contraseña SMTP         | `password123`                    |

> 💡 Crea una cuenta gratuita en [Ethereal Email](https://www.ethereal.email/) para testing de emails.

---

## 📊 Stack Tecnológico

| Capa               | Tecnología         |
| ------------------ | ------------------ |
| **Runtime**        | Node.js            |
| **Lenguaje**       | TypeScript         |
| **Framework**      | Express.js         |
| **Base de datos**  | MongoDB + Mongoose |
| **Autenticación**  | JWT                |
| **Email**          | Nodemailer         |
| **Validación**     | Manual + DTO       |
| **Testing**        | Jest               |
| **Linting**        | ESLint             |
| **Task scheduler** | node-cron          |
| **Dev tools**      | Nodemon, ts-node   |

---

## 🐳 Docker

### Servicios incluidos

```yaml
mongo:
  - Imagen: mongo:latest
  - Puerto: 27017
  - Usuario: root
  - Contraseña: rootpassword

mongo-express:
  - Interfaz web para MongoDB
  - Puerto: 8081
  - URL: http://localhost:8081
```

### Comandos útiles

```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs mongo
docker-compose logs mongo-express

# Entrar a MongoDB desde terminal
docker-compose exec mongo mongosh

# Parar servicios
docker-compose down

# Limpiar todo (incluyendo volúmenes)
docker-compose down -v
```

---

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT para autenticación
- ✅ Validación de entrada en controllers
- ✅ Variables de entorno no commitidas
- ✅ Autorización en rutas protegidas

---

## 📝 Contribuir

1. Haz fork del proyecto
2. Crea una rama: `git checkout -b feature/tu-feature`
3. Commit cambios: `git commit -am 'Agregar feature'`
4. Push: `git push origin feature/tu-feature`
5. Abre un Pull Request

---

## 📞 Soporte

Para problemas, abre un issue en el repositorio.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
