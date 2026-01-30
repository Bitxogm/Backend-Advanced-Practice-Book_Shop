# Arquitectura Hexagonal: Guía para Mortales 🏗️

## ¿Qué demonios es esto? 🤯

La **arquitectura hexagonal** (también llamada **Ports & Adapters**) es una forma de organizar tu código para que la lógica de negocio no dependa de nada externo.

### Analogía simple: La Pizzería 🍕

Imagina que tienes una pizzería:

- **El centro (negocio)**: El pizzero que hace pizzas. Solo sabe hacer pizzas, no le importa cómo llegaron los pedidos ni cómo se entregan.
- **Los puertos**: Las formas de comunicarse (teléfono, app móvil, mostrador)
- **Los adaptadores**: Las personas/sistemas que traducen los pedidos a un formato que el pizzero entiende

```
┌─────────────────────────────────────────┐
│         MUNDO EXTERIOR                  │
│  (Bases de datos, APIs, UI, etc.)      │
└─────────────────────────────────────────┘
                    ↕
        ┌───────────────────────┐
        │    ADAPTADORES        │  ← Traducen entre el mundo y tu app
        │  (Implementaciones)   │
        └───────────────────────┘
                    ↕
        ┌───────────────────────┐
        │      PUERTOS          │  ← Contratos/Interfaces
        │    (Interfaces)       │
        └───────────────────────┘
                    ↕
    ┌───────────────────────────────┐
    │    LÓGICA DE NEGOCIO         │  ← ¡Lo importante!
    │  (Domain/Application)        │     No depende de nada
    └───────────────────────────────┘
```

## ¿Backend o Frontend? 🤔

**Principalmente BACKEND**, pero los principios se pueden aplicar al frontend también.

- **Backend**: Es donde más se usa. Tiene más sentido porque tienes muchas integraciones (BD, APIs externas, colas de mensajes, etc.)
- **Frontend**: Se puede usar, pero es menos común. En React, por ejemplo, ya tienes cierta separación con hooks y componentes.

## Conceptos Clave (en cristiano) 📚

### 1. Domain (Dominio) - El corazón ❤️

Es la **lógica de negocio pura**. Las reglas de tu aplicación.

**Ejemplo**: Si estás haciendo una app de tareas:

- "Una tarea no puede tener título vacío"
- "Una tarea completada no se puede editar"
- "El usuario puede tener máximo 100 tareas"

```javascript
// domain/Task.js
class Task {
  constructor(title, description) {
    if (!title || title.trim() === '') {
      throw new Error('El título no puede estar vacío');
    }
    this.id = generateId();
    this.title = title;
    this.description = description;
    this.completed = false;
    this.createdAt = new Date();
  }

  complete() {
    if (this.completed) {
      throw new Error('La tarea ya está completada');
    }
    this.completed = true;
  }

  // ¡NO HAY NADA DE BASE DE DATOS AQUÍ!
  // ¡NO HAY NADA DE EXPRESS AQUÍ!
  // Solo lógica pura
}
```

### 2. Ports (Puertos) - Los contratos 📋

Son **interfaces** que definen CÓMO tu aplicación se comunica con el exterior, pero NO definen CON QUÉ.

Piénsalo como un enchufe: defines la forma del enchufe, pero no qué aparato vas a conectar.

```javascript
// application/ports/TaskRepository.js
// Esto es una INTERFAZ (en JS usamos clases abstractas o comentarios)

class TaskRepository {
  async save(task) {
    throw new Error('Método no implementado');
  }

  async findById(id) {
    throw new Error('Método no implementado');
  }

  async findAll() {
    throw new Error('Método no implementado');
  }

  async delete(id) {
    throw new Error('Método no implementado');
  }
}

// Esto es un PUERTO: define QUÉ operaciones necesitas
// pero NO dice SI es MongoDB, PostgreSQL, un archivo JSON, etc.
```

### 3. Adapters (Adaptadores) - Las implementaciones 🔌

Son las **implementaciones concretas** de los puertos. El "aparato" que conectas al enchufe.

```javascript
// infrastructure/adapters/MongoTaskRepository.js
import { TaskRepository } from '../../application/ports/TaskRepository.js';

class MongoTaskRepository extends TaskRepository {
  constructor(mongoClient) {
    super();
    this.collection = mongoClient.db('myapp').collection('tasks');
  }

  async save(task) {
    await this.collection.insertOne({
      _id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt,
    });
  }

  async findById(id) {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;
    return new Task(doc.title, doc.description);
  }

  // ... más métodos
}
```

¿Quieres cambiar a PostgreSQL? ¡Solo creas otro adaptador! Tu lógica de negocio NO CAMBIA.

```javascript
// infrastructure/adapters/PostgresTaskRepository.js
class PostgresTaskRepository extends TaskRepository {
  constructor(pgPool) {
    super();
    this.pool = pgPool;
  }

  async save(task) {
    await this.pool.query(
      'INSERT INTO tasks (id, title, description, completed, created_at) VALUES ($1, $2, $3, $4, $5)',
      [task.id, task.title, task.description, task.completed, task.createdAt]
    );
  }

  // ... más métodos
}
```

### 4. Application (Aplicación) - Los casos de uso 🎯

Son las **acciones** que tu aplicación puede hacer. También llamados "servicios" o "use cases".

```javascript
// application/CreateTask.js
class CreateTask {
  constructor(taskRepository) {
    this.taskRepository = taskRepository; // ← Inyección de dependencias
  }

  async execute(title, description) {
    // 1. Crear la tarea (lógica de dominio)
    const task = new Task(title, description);

    // 2. Guardarla (usando el puerto, sin saber CÓMO se guarda)
    await this.taskRepository.save(task);

    return task;
  }
}
```

## Estructura de Carpetas Típica 📁

```
src/
├── domain/                    ← Lógica de negocio pura
│   ├── Task.js
│   ├── User.js
│   └── errors/
│       └── DomainError.js
│
├── application/               ← Casos de uso
│   ├── CreateTask.js
│   ├── CompleteTask.js
│   ├── ListTasks.js
│   └── ports/                 ← Interfaces (puertos)
│       ├── TaskRepository.js
│       └── EmailService.js
│
└── infrastructure/            ← Todo lo técnico
    ├── adapters/              ← Implementaciones (adaptadores)
    │   ├── MongoTaskRepository.js
    │   ├── PostgresTaskRepository.js
    │   └── SendGridEmailService.js
    │
    └── http/                  ← Express, rutas, controladores
        ├── routes/
        │   └── taskRoutes.js
        └── controllers/
            └── TaskController.js
```

## Ejemplo Completo: Conectando Todo 🔗

```javascript
// infrastructure/http/server.js
import express from 'express';
import { MongoClient } from 'mongodb';
import { MongoTaskRepository } from '../adapters/MongoTaskRepository.js';
import { CreateTask } from '../../application/CreateTask.js';

const app = express();
app.use(express.json());

// 1. Configurar infraestructura (BD)
const mongoClient = new MongoClient('mongodb://localhost:27017');
await mongoClient.connect();

// 2. Crear el adaptador
const taskRepository = new MongoTaskRepository(mongoClient);

// 3. Crear el caso de uso con el adaptador
const createTask = new CreateTask(taskRepository);

// 4. Ruta HTTP (otro adaptador, pero de entrada)
app.post('/tasks', async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await createTask.execute(title, description);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000);
```

## ¿Por Qué Tanto Rollo? 🤷

### Ventajas ✅

1. **Testeable**: Puedes testear tu lógica sin base de datos real

   ```javascript
   // En tests, usas un adaptador falso
   class InMemoryTaskRepository extends TaskRepository {
     constructor() {
       super();
       this.tasks = [];
     }
     async save(task) {
       this.tasks.push(task);
     }
     // ...
   }

   const fakeRepo = new InMemoryTaskRepository();
   const createTask = new CreateTask(fakeRepo);
   // ¡Puedes testear sin BD!
   ```

2. **Flexible**: Cambias de MongoDB a PostgreSQL sin tocar la lógica
3. **Mantenible**: Cada cosa en su sitio
4. **Reutilizable**: Puedes usar la misma lógica desde HTTP, CLI, WebSockets, etc.

### Desventajas ❌

1. **Más código**: Muchas carpetas, interfaces, etc.
2. **Over-engineering**: Para proyectos pequeños puede ser excesivo
3. **Curva de aprendizaje**: Como estás viendo 😅

## ¿Cuándo Usarla? 🎓

✅ **SÍ úsala cuando:**

- Tu proyecto va a crecer mucho
- Necesitas cambiar tecnologías fácilmente
- Tienes lógica de negocio compleja
- Vas a trabajar en equipo
- Necesitas testear mucho

❌ **NO la uses cuando:**

- Es un proyecto pequeño/personal
- Es un prototipo rápido
- No tienes experiencia (¡primero aprende lo básico!)

## Comparación con MVC (que ya conoces) 🆚

```
MVC (Modelo-Vista-Controlador)
├── Model      ← Habla directamente con la BD
├── View       ← UI
└── Controller ← Une todo

Hexagonal
├── Domain              ← Lógica pura (como Model, pero SIN BD)
├── Application         ← Casos de uso
├── Infrastructure
│   ├── HTTP           ← Como Controller + View
│   └── Adapters       ← Implementaciones de BD, APIs, etc.
```

**Diferencia clave**: En MVC, el Model suele tener código de BD. En Hexagonal, el Domain NO sabe NADA de BD.

## Resumen para No Olvidarlo 📝

1. **Domain**: Tu lógica de negocio. Código limpio y puro.
2. **Ports**: Contratos (interfaces). "Necesito guardar datos", pero no digo cómo.
3. **Adapters**: Implementaciones. "Voy a usar MongoDB para guardar".
4. **Application**: Casos de uso. "Crear tarea", "Listar tareas", etc.
5. **Infrastructure**: Todo lo técnico (Express, MongoDB, etc.)

## Consejo Final 💡

**No te agobies**. La arquitectura hexagonal es avanzada. Es normal que te explote la cabeza al principio.

Enfoque progresivo:

1. Primero aprende a separar la lógica de la BD (aunque sea en el mismo archivo)
2. Luego separa en capas (domain, application, infrastructure)
3. Después añade puertos y adaptadores
4. Practica con proyectos pequeños

**Recuerda**: Es una herramienta, no una religión. No todos los proyectos la necesitan.

---

¿Necesitas ejemplos más específicos? ¿Algo no quedó claro? ¡Pregúntame! 🚀
