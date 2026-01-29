# 🌐 BACKEND EXPLICADO SIMPLE

## ÍNDICE
1. [¿Qué es el Backend?](#qué-es-el-backend)
2. [¿Qué es una API?](#qué-es-una-api)
3. [¿Qué es un Endpoint?](#qué-es-un-endpoint)
4. [Rutas (Routes)](#rutas-routes)
5. [Métodos HTTP (Verbos)](#métodos-http-verbos)
6. [Request y Response](#request-y-response)
7. [JSON](#json)
8. [REST API](#rest-api)
9. [Status Codes](#status-codes)
10. [Headers, Query Params, Body](#headers-query-params-body)
11. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## ¿QUÉ ES EL BACKEND?

### Analogía del Restaurante

Imagina un restaurante:

```
FRONTEND (lo que ves):
- Mesa donde te sientas
- Menú que lees
- Camarero que te atiende

BACKEND (lo que NO ves):
- Cocina donde preparan la comida
- Almacén donde guardan ingredientes
- Base de datos de recetas
- Sistema de gestión de pedidos
```

**Backend = La cocina y todo lo que pasa detrás**

### En una aplicación web:

**FRONTEND:**
- Lo que ves en tu navegador
- Botones, formularios, colores
- React, HTML, CSS

**BACKEND:**
- Servidor que procesa peticiones
- Base de datos que guarda información
- Lógica de negocio (reglas)
- Node.js, Express, bases de datos

---

## ¿QUÉ ES UNA API?

**API = Application Programming Interface**

**Definición técnica:** Interfaz que permite comunicación entre aplicaciones.

**Definición REAL:** El "camarero" entre tu app y el servidor.

### Analogía del Camarero

```
TÚ (Frontend):
"Quiero una hamburguesa"
    ↓
CAMARERO (API):
Va a la cocina, trae tu hamburguesa
    ↓
COCINA (Backend/Base de datos):
Prepara la hamburguesa
```

**Sin API:** Tendrías que ir a la cocina tú mismo y preparar todo
**Con API:** Le pides al camarero y él hace el trabajo

### Ejemplo Real:

```javascript
// Frontend pide datos:
fetch('https://api.ejemplo.com/usuarios')

// API va al servidor:
// Servidor busca en base de datos
// API devuelve respuesta:
[
  { id: 1, nombre: "Ana" },
  { id: 2, nombre: "Juan" }
]
```

**API = El intermediario que maneja las peticiones**

---

## ¿QUÉ ES UN ENDPOINT?

**Endpoint = Dirección específica donde pides algo**

### Analogía del Centro Comercial

Imagina un centro comercial con diferentes tiendas:

```
CENTRO COMERCIAL (Servidor):
https://centro-comercial.com

TIENDAS (Endpoints):
/zapateria          → Tienda de zapatos
/libreria           → Tienda de libros
/cafeteria          → Cafetería
/electronica        → Tienda de electrónica
```

**Cada tienda = Un endpoint diferente**

Si quieres zapatos → Vas a `/zapateria`
Si quieres café → Vas a `/cafeteria`

### En una API Real:

```
SERVIDOR:
https://api.tienda.com

ENDPOINTS:
/usuarios           → Datos de usuarios
/productos          → Datos de productos
/pedidos            → Datos de pedidos
/carrito            → Datos del carrito
```

**Cada endpoint devuelve información diferente**

### Ejemplo Completo:

```javascript
// Endpoint para usuarios:
GET https://api.tienda.com/usuarios
// Devuelve: Lista de todos los usuarios

// Endpoint para un usuario específico:
GET https://api.tienda.com/usuarios/5
// Devuelve: Solo el usuario con id=5

// Endpoint para productos:
GET https://api.tienda.com/productos
// Devuelve: Lista de todos los productos
```

**Endpoint = URL específica que hace algo específico**

---

## RUTAS (ROUTES)

**Ruta = Camino para llegar a un endpoint**

### Analogía de Direcciones

```
DIRECCIÓN COMPLETA:
Calle Principal, Número 123, Piso 4, Puerta A

RUTA EN API:
https://api.ejemplo.com/usuarios/123/pedidos/5
         ^servidor^      ^usuario^ ^pedido^
```

### Partes de una Ruta:

```
https://api.tienda.com/productos/zapatos/nike
│      │              │         │       │
│      │              │         │       └─ Marca específica
│      │              │         └─────────── Categoría
│      │              └───────────────────── Recurso
│      └──────────────────────────────────── Dominio
└─────────────────────────────────────────── Protocolo
```

### Rutas Dinámicas:

```
/usuarios/:id
          ^^^
          Parte variable (puede ser cualquier número)

Ejemplos reales:
/usuarios/1    → Usuario con id=1
/usuarios/999  → Usuario con id=999
/usuarios/abc  → Usuario con id=abc
```

### En Express (Node.js):

```javascript
// Definir ruta:
app.get('/usuarios/:id', (req, res) => {
  const userId = req.params.id;  // Captura el id
  // Buscar usuario en base de datos...
  res.json({ id: userId, nombre: "Ana" });
});

// Cuando alguien visita:
// GET /usuarios/5
// → userId = 5
```

---

## MÉTODOS HTTP (VERBOS)

**Métodos HTTP = Acciones que quieres hacer**

### Analogía CRUD del Mundo Real

Imagina una biblioteca con fichas de libros:

```
CREATE (Crear):    Añadir nueva ficha de libro
READ (Leer):       Ver una ficha existente
UPDATE (Actualizar): Modificar una ficha
DELETE (Borrar):   Eliminar una ficha
```

### Los 4 Métodos Principales:

| Método | Acción | Analogía | Ejemplo |
|--------|--------|----------|---------|
| **GET** | Leer/Obtener | "Dame información" | Ver lista de usuarios |
| **POST** | Crear | "Añade esto nuevo" | Crear nuevo usuario |
| **PUT/PATCH** | Actualizar | "Cambia esto" | Modificar usuario |
| **DELETE** | Eliminar | "Borra esto" | Eliminar usuario |

### Explicación Detallada:

#### **GET - Obtener Datos**

```
Qué hace: Pide información
Cambia datos: NO
Ejemplo: Ver tu perfil de Facebook

GET /usuarios
→ Dame todos los usuarios

GET /usuarios/5
→ Dame el usuario con id=5
```

**Como preguntar:** "¿Qué hay aquí?"

---

#### **POST - Crear Nuevo**

```
Qué hace: Crea algo nuevo
Cambia datos: SÍ (añade)
Ejemplo: Publicar un tweet nuevo

POST /usuarios
Body: { nombre: "Ana", email: "ana@mail.com" }
→ Crea un usuario nuevo
```

**Como decir:** "Añade esto nuevo"

---

#### **PUT/PATCH - Actualizar**

```
Qué hace: Modifica algo existente
Cambia datos: SÍ (modifica)
Ejemplo: Cambiar tu foto de perfil

PUT /usuarios/5
Body: { nombre: "Ana María", email: "ana@mail.com" }
→ Actualiza TODO el usuario 5

PATCH /usuarios/5
Body: { nombre: "Ana María" }
→ Actualiza SOLO el nombre del usuario 5
```

**PUT = Reemplaza todo**
**PATCH = Cambia solo lo que envías**

**Como decir:** "Cambia esto"

---

#### **DELETE - Eliminar**

```
Qué hace: Borra algo
Cambia datos: SÍ (elimina)
Ejemplo: Borrar un comentario

DELETE /usuarios/5
→ Elimina el usuario con id=5
```

**Como decir:** "Borra esto"

---

### Tabla Resumen:

```
Recurso: /usuarios

GET    /usuarios      → Lista todos los usuarios
GET    /usuarios/5    → Ver usuario 5
POST   /usuarios      → Crear usuario nuevo
PUT    /usuarios/5    → Actualizar usuario 5 (completo)
PATCH  /usuarios/5    → Actualizar usuario 5 (parcial)
DELETE /usuarios/5    → Eliminar usuario 5
```

---

## REQUEST Y RESPONSE

**Request = Petición** (Lo que pides)
**Response = Respuesta** (Lo que recibes)

### Analogía del Pedido en Restaurante:

```
REQUEST (Tu pedido):
"Quiero una hamburguesa con queso, sin cebolla"
    ↓
PROCESAMIENTO:
Cocina prepara tu pedido
    ↓
RESPONSE (Lo que recibes):
🍔 Hamburguesa lista
```

### En una API:

```javascript
// REQUEST (Frontend pide):
fetch('https://api.ejemplo.com/usuarios/5', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})

// RESPONSE (Backend responde):
{
  "id": 5,
  "nombre": "Ana",
  "email": "ana@mail.com"
}
```

### Partes de un REQUEST:

```
REQUEST:
├─ URL: https://api.ejemplo.com/usuarios/5
├─ Método: GET
├─ Headers: { Content-Type: 'application/json' }
└─ Body: (si es POST/PUT/PATCH)
```

### Partes de un RESPONSE:

```
RESPONSE:
├─ Status Code: 200 (OK)
├─ Headers: { Content-Type: 'application/json' }
└─ Body: { id: 5, nombre: "Ana" }
```

---

## JSON

**JSON = JavaScript Object Notation**

**Definición:** Formato para enviar datos entre frontend y backend.

### ¿Por qué JSON?

Imagina que quieres enviar información de una persona:

```
❌ TEXTO PLANO (difícil de leer):
"Ana,25,España,Desarrolladora"

✅ JSON (fácil de leer):
{
  "nombre": "Ana",
  "edad": 25,
  "pais": "España",
  "profesion": "Desarrolladora"
}
```

### Tipos de Datos en JSON:

```json
{
  "texto": "Hola",           ← String
  "numero": 42,              ← Number
  "booleano": true,          ← Boolean
  "nulo": null,              ← Null
  "array": [1, 2, 3],        ← Array
  "objeto": {                ← Object
    "clave": "valor"
  }
}
```

### Ejemplo Real - Usuario:

```json
{
  "id": 1,
  "nombre": "Ana García",
  "email": "ana@ejemplo.com",
  "edad": 30,
  "activo": true,
  "direccion": {
    "calle": "Gran Vía 123",
    "ciudad": "Madrid",
    "codigoPostal": "28013"
  },
  "intereses": ["programación", "música", "deportes"]
}
```

### Cómo se Usa:

**Backend envía:**
```javascript
// JavaScript object
const usuario = {
  id: 1,
  nombre: "Ana"
};

// Convertir a JSON (string)
const json = JSON.stringify(usuario);
// → '{"id":1,"nombre":"Ana"}'
```

**Frontend recibe:**
```javascript
// JSON string
const json = '{"id":1,"nombre":"Ana"}';

// Convertir a JavaScript object
const usuario = JSON.parse(json);
console.log(usuario.nombre); // "Ana"
```

**JSON = Lenguaje común entre frontend y backend**

---

## REST API

**REST = Representational State Transfer**

**Definición técnica:** Estilo de arquitectura para APIs.

**Definición REAL:** Reglas para que las APIs sean ordenadas y predecibles.

### Principios REST:

#### 1. **URLs representan recursos (sustantivos, no verbos)**

```
✅ BIEN (REST):
GET /usuarios          → Obtener usuarios
GET /productos         → Obtener productos
GET /pedidos           → Obtener pedidos

❌ MAL (No REST):
GET /obtenerUsuarios
GET /conseguirProductos
GET /traerPedidos
```

#### 2. **Usar métodos HTTP correctos**

```
✅ BIEN:
GET    /usuarios       → Listar
POST   /usuarios       → Crear
PUT    /usuarios/5     → Actualizar
DELETE /usuarios/5     → Eliminar

❌ MAL:
GET /usuarios/crear    → Debería ser POST
GET /usuarios/5/borrar → Debería ser DELETE
```

#### 3. **URLs jerárquicas**

```
/usuarios              → Todos los usuarios
/usuarios/5            → Usuario específico
/usuarios/5/pedidos    → Pedidos del usuario 5
/usuarios/5/pedidos/3  → Pedido 3 del usuario 5
```

#### 4. **Sin estado (stateless)**

Cada petición es independiente, no guarda información de peticiones anteriores.

```
❌ MAL (con estado):
1. GET /login → Guarda "estás logueado"
2. GET /perfil → Usa info de paso 1

✅ BIEN (sin estado):
1. POST /login → Devuelve token
2. GET /perfil + token → Verifica token cada vez
```

#### 5. **Responses con códigos de estado**

```
200 → OK, todo bien
201 → Creado correctamente
400 → Error del cliente (datos mal)
404 → No encontrado
500 → Error del servidor
```

### Ejemplo API REST Completa:

```
RECURSO: Usuarios

GET    /usuarios           200  Lista de usuarios
GET    /usuarios/5         200  Usuario 5
POST   /usuarios           201  Usuario creado
PUT    /usuarios/5         200  Usuario actualizado
DELETE /usuarios/5         204  Usuario eliminado

GET    /usuarios/999       404  No encontrado
POST   /usuarios (mal)     400  Datos inválidos
```

---

## STATUS CODES

**Status Code = Código que indica resultado de la petición**

### Analogía del Semáforo:

```
🟢 2xx = Verde (Todo bien, adelante)
🟡 3xx = Amarillo (Redirección, ve a otro lugar)
🔴 4xx = Rojo (Error tuyo, algo hiciste mal)
⚫ 5xx = Avería (Error del servidor, no es tu culpa)
```

### Los Más Comunes:

#### **2xx - Éxito (Todo Bien)**

| Código | Nombre | Significado | Ejemplo |
|--------|--------|-------------|---------|
| 200 | OK | Petición exitosa | GET usuarios → devuelve lista |
| 201 | Created | Recurso creado | POST usuario → usuario creado |
| 204 | No Content | Éxito sin contenido | DELETE usuario → eliminado |

```javascript
// Ejemplo 200:
GET /usuarios
Response: 200 OK
Body: [{ id: 1, nombre: "Ana" }]

// Ejemplo 201:
POST /usuarios
Body: { nombre: "Juan" }
Response: 201 Created
Body: { id: 2, nombre: "Juan" }
```

---

#### **4xx - Error del Cliente (Tu Culpa)**

| Código | Nombre | Significado | Ejemplo |
|--------|--------|-------------|---------|
| 400 | Bad Request | Datos inválidos | Email mal formateado |
| 401 | Unauthorized | No autenticado | Sin token de login |
| 403 | Forbidden | Sin permisos | No eres admin |
| 404 | Not Found | No existe | Usuario 999 no existe |

```javascript
// Ejemplo 404:
GET /usuarios/999
Response: 404 Not Found
Body: { error: "Usuario no encontrado" }

// Ejemplo 400:
POST /usuarios
Body: { nombre: "" }  // Nombre vacío
Response: 400 Bad Request
Body: { error: "Nombre es requerido" }
```

---

#### **5xx - Error del Servidor (No es tu culpa)**

| Código | Nombre | Significado | Ejemplo |
|--------|--------|-------------|---------|
| 500 | Internal Server Error | Error genérico servidor | Base de datos caída |
| 503 | Service Unavailable | Servidor no disponible | Mantenimiento |

```javascript
// Ejemplo 500:
GET /usuarios
Response: 500 Internal Server Error
Body: { error: "Error en la base de datos" }
```

### Resumen Visual:

```
2xx = ✅ "Todo bien"
3xx = ↪️ "Ve a otro sitio"
4xx = ❌ "Tú lo hiciste mal"
5xx = 💥 "El servidor tiene problemas"
```

---

## HEADERS, QUERY PARAMS, BODY

### 1. HEADERS (Cabeceras)

**Headers = Información extra sobre la petición/respuesta**

**Analogía:** El sobre de una carta (tiene info sobre remitente, destinatario, pero no es el contenido)

```
REQUEST HEADERS (Lo que envías):
Content-Type: application/json    → "Envío JSON"
Authorization: Bearer token123     → "Mi credencial"
Accept: application/json           → "Quiero JSON"

RESPONSE HEADERS (Lo que recibes):
Content-Type: application/json     → "Te envío JSON"
Set-Cookie: session=abc123         → "Guarda esta cookie"
```

**Ejemplo:**
```javascript
fetch('https://api.ejemplo.com/usuarios', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer mi-token-secreto'
  }
});
```

---

### 2. QUERY PARAMS (Parámetros de Consulta)

**Query Params = Filtros/opciones en la URL**

**Analogía:** Opciones al pedir comida ("sin cebolla", "extra queso")

```
URL CON QUERY PARAMS:
https://api.tienda.com/productos?categoria=zapatos&precio=50

Parámetros:
├─ categoria=zapatos
└─ precio=50
```

**Estructura:**
```
/ruta?parametro1=valor1&parametro2=valor2&parametro3=valor3
      ^                ^                 ^
      empieza con ?    separados por &   clave=valor
```

**Ejemplos Reales:**

```
Buscar productos:
GET /productos?buscar=nike&color=rojo&talla=42

Paginar resultados:
GET /usuarios?page=2&limit=10

Ordenar:
GET /productos?ordenar=precio&direccion=asc

Filtrar por fecha:
GET /pedidos?desde=2024-01-01&hasta=2024-12-31
```

**En Express (Backend):**
```javascript
app.get('/productos', (req, res) => {
  const categoria = req.query.categoria;  // "zapatos"
  const precio = req.query.precio;        // "50"
  
  // Buscar productos con esos filtros...
});
```

---

### 3. URL PARAMS (Parámetros de Ruta)

**URL Params = Parte de la ruta (identifica recurso específico)**

**Analogía:** Número de casa en una dirección

```
/usuarios/5
          ^
          Este es un URL param (id del usuario)

/productos/zapatos/nike
           ^       ^
           URL params
```

**Diferencia con Query Params:**

```
URL PARAMS (identifican recurso):
/usuarios/5           → Usuario con id=5
/productos/zapatos    → Categoría zapatos

QUERY PARAMS (filtran/modifican):
/usuarios?activo=true       → Usuarios activos
/productos?precio_max=100   → Productos baratos
```

**En Express:**
```javascript
// URL Param:
app.get('/usuarios/:id', (req, res) => {
  const userId = req.params.id;  // 5
});

// Query Param:
app.get('/usuarios', (req, res) => {
  const activo = req.query.activo;  // true
});
```

---

### 4. BODY (Cuerpo)

**Body = Datos que envías en POST/PUT/PATCH**

**Analogía:** El contenido de la carta (no el sobre)

```
POST /usuarios
Body:
{
  "nombre": "Ana",
  "email": "ana@ejemplo.com",
  "edad": 25
}
```

**Solo en:** POST, PUT, PATCH (NO en GET o DELETE)

**Formato:** Normalmente JSON

**En Express:**
```javascript
app.post('/usuarios', (req, res) => {
  const nombre = req.body.nombre;     // "Ana"
  const email = req.body.email;       // "ana@ejemplo.com"
  
  // Crear usuario en base de datos...
});
```

---

### RESUMEN: Dónde Va Cada Cosa

```
GET /usuarios/5?incluir=pedidos
    │         │  │
    │         │  └─ QUERY PARAM (filtro)
    │         └──── URL PARAM (id específico)
    └────────────── RUTA

Headers: {
  Authorization: "Bearer token"
}

Body: (NO aplica en GET)
```

```
POST /usuarios?notificar=true
     │         │
     │         └─ QUERY PARAM (opción)
     └─────────── RUTA

Headers: {
  Content-Type: "application/json"
}

Body: {
  "nombre": "Ana",
  "email": "ana@ejemplo.com"
}
```

---

## EJEMPLOS PRÁCTICOS

### Ejemplo 1: Blog de Artículos

```javascript
// OBTENER todos los artículos
GET /articulos
Response: 200 OK
[
  { id: 1, titulo: "Aprende React", autor: "Ana" },
  { id: 2, titulo: "Node.js Básico", autor: "Juan" }
]

// OBTENER un artículo específico
GET /articulos/1
Response: 200 OK
{
  id: 1,
  titulo: "Aprende React",
  contenido: "React es una librería...",
  autor: "Ana",
  fecha: "2024-01-15"
}

// CREAR artículo nuevo
POST /articulos
Headers: { Content-Type: "application/json" }
Body: {
  titulo: "TypeScript Tips",
  contenido: "TypeScript es...",
  autor: "Pedro"
}
Response: 201 Created
{
  id: 3,
  titulo: "TypeScript Tips",
  mensaje: "Artículo creado correctamente"
}

// ACTUALIZAR artículo
PUT /articulos/1
Body: {
  titulo: "Aprende React 2024",
  contenido: "React es una librería..."
}
Response: 200 OK
{
  id: 1,
  titulo: "Aprende React 2024",
  mensaje: "Artículo actualizado"
}

// ELIMINAR artículo
DELETE /articulos/1
Response: 204 No Content
(Sin body)

// BUSCAR artículos
GET /articulos?autor=Ana&año=2024
Response: 200 OK
[
  { id: 1, titulo: "Aprende React", autor: "Ana" }
]
```

---

### Ejemplo 2: Tienda Online

```javascript
// VER todos los productos
GET /productos
Response: 200 OK

// VER productos de categoría específica
GET /productos?categoria=electronica&precio_max=500
Response: 200 OK

// VER producto específico
GET /productos/42
Response: 200 OK

// AÑADIR al carrito
POST /carrito
Body: { producto_id: 42, cantidad: 2 }
Response: 201 Created

// VER carrito
GET /carrito
Response: 200 OK

// CREAR pedido
POST /pedidos
Body: { items: [...], direccion: "..." }
Response: 201 Created

// VER mis pedidos
GET /usuarios/5/pedidos
Response: 200 OK

// VER pedido específico
GET /pedidos/100
Response: 200 OK
```

---

### Ejemplo 3: Red Social

```javascript
// VER mi perfil
GET /usuarios/yo
Headers: { Authorization: "Bearer token" }
Response: 200 OK

// ACTUALIZAR mi perfil
PATCH /usuarios/yo
Body: { bio: "Desarrollador web" }
Response: 200 OK

// VER posts de un usuario
GET /usuarios/5/posts
Response: 200 OK

// CREAR post nuevo
POST /posts
Body: { texto: "Mi primer post!", imagen: "url" }
Response: 201 Created

// DAR LIKE a post
POST /posts/42/likes
Response: 201 Created

// VER comentarios de post
GET /posts/42/comentarios
Response: 200 OK

// COMENTAR en post
POST /posts/42/comentarios
Body: { texto: "Muy bueno!" }
Response: 201 Created
```

---

## DIAGRAMA COMPLETO: Petición de Frontend a Backend

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND (React)                                       │
│                                                         │
│  Usuario hace click en "Ver usuarios"                  │
│      ↓                                                  │
│  fetch('https://api.ejemplo.com/usuarios')             │
│      ↓                                                  │
│  REQUEST enviado:                                      │
│  ├─ Método: GET                                        │
│  ├─ URL: /usuarios                                     │
│  └─ Headers: { Authorization: "Bearer token" }        │
└─────────────────────────────────────────────────────────┘
                            ↓
                    ┌───────────────┐
                    │   INTERNET    │
                    └───────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│  API (Express)                                          │
│                                                         │
│  app.get('/usuarios', (req, res) => {                  │
│      ↓                                                  │
│  Verifica token (autenticación)                        │
│      ↓                                                  │
│  Busca usuarios en base de datos                       │
│      ↓                                                  │
│  Envía RESPONSE:                                       │
│  ├─ Status: 200 OK                                     │
│  ├─ Headers: { Content-Type: "application/json" }     │
│  └─ Body: [{ id: 1, nombre: "Ana" }, ...]            │
│  })                                                     │
└─────────────────────────────────────────────────────────┘
                            ↓
                    ┌───────────────┐
                    │   INTERNET    │
                    └───────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│  FRONTEND (React)                                       │
│                                                         │
│  .then(response => response.json())                    │
│  .then(usuarios => {                                   │
│      // Muestra usuarios en pantalla               │
│      setUsuarios(usuarios)                             │
│  })                                                     │
└─────────────────────────────────────────────────────────┘
```

---

## GLOSARIO RÁPIDO

| Término | Significado Simple |
|---------|-------------------|
| **API** | Camarero entre frontend y backend |
| **Endpoint** | Dirección específica (como /usuarios) |
| **Ruta** | Camino completo a un endpoint |
| **GET** | Pedir datos (leer) |
| **POST** | Crear algo nuevo |
| **PUT/PATCH** | Actualizar algo |
| **DELETE** | Borrar algo |
| **Request** | Petición que haces |
| **Response** | Respuesta que recibes |
| **JSON** | Formato de datos |
| **Status Code** | Código de resultado (200, 404, 500) |
| **Header** | Información extra (como sobre de carta) |
| **Query Param** | Filtro en URL (?nombre=Ana) |
| **URL Param** | ID en URL (/usuarios/5) |
| **Body** | Datos que envías (POST/PUT) |
| **REST** | Estilo ordenado de hacer APIs |

---

## PREGUNTAS FRECUENTES

### ¿Cuándo usar GET vs POST?

```
GET:  Cuando solo LEES (no modificas nada)
POST: Cuando CREAS algo nuevo
```

### ¿Diferencia entre PUT y PATCH?

```
PUT:   Reemplaza TODO el recurso
PATCH: Cambia SOLO lo que envías

Ejemplo:
Usuario actual: { nombre: "Ana", email: "ana@mail.com", edad: 25 }

PUT { nombre: "Ana María" }
→ Resultado: { nombre: "Ana María" }  (perdió email y edad)

PATCH { nombre: "Ana María" }
→ Resultado: { nombre: "Ana María", email: "ana@mail.com", edad: 25 }
```

### ¿Query params o URL params?

```
URL PARAMS:   Identificar recurso específico
              /usuarios/5  (el usuario 5)

QUERY PARAMS: Filtrar, ordenar, paginar
              /usuarios?activo=true  (usuarios activos)
```

### ¿Dónde va la autenticación?

```
Normalmente en HEADERS:
Authorization: Bearer token123

A veces en QUERY PARAMS (menos seguro):
/usuarios?token=abc123
```

---

## CÓMO ESTUDIAR ESTO

### Semana 1:
- [ ] Lee todo el documento una vez
- [ ] Por cada concepto, dibuja un diagrama propio
- [ ] Explica cada concepto en voz alta

### Semana 2:
- [ ] Practica con API pública (JSONPlaceholder)
- [ ] Haz peticiones GET, POST, PUT, DELETE
- [ ] Observa respuestas y status codes

### Semana 3:
- [ ] Crea tu propia API simple con Express
- [ ] Define 3-4 endpoints básicos
- [ ] Pruébalos con Postman o fetch

### Antes de entrevista:
- [ ] Repasa analogías (restaurante, tienda, etc.)
- [ ] Recuerda: GET=leer, POST=crear, PUT=actualizar, DELETE=borrar
- [ ] Practica explicar qué es una API en 30 segundos

---

**Última recomendación:** 

No memorices definiciones técnicas. Entiende los conceptos y explícalos con tus palabras usando analogías del mundo real.

En entrevista, es mejor decir:
> "Una API es como un camarero que lleva peticiones del frontend al backend"

Que recitar:
> "Una API es una interfaz de programación de aplicaciones que permite..."

**Simple > Técnico** 💪
