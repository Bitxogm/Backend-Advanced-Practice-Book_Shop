/**
 * SERVIDOR PRINCIPAL (SERVER)
 *
 * Este es el archivo principal de la aplicación.
 * Aquí configuramos Express, conectamos la base de datos y arrancamos el servidor.
 *
 * Flujo de ejecución:
 * 1. Crear la app de Express
 * 2. Configurar middlewares (express.json)
 * 3. Registrar rutas (/books)
 * 4. Conectar a MongoDB
 * 5. Arrancar el servidor en el puerto especificado
 */

import express from 'express';
import type { Application } from 'express';
import { connectDB } from '@config/database';
import { env } from '@config/environment';
import bookRouter from '@ui/routes/book.routes';

// ============================================
// 1. CREAR LA APLICACIÓN EXPRESS
// ============================================
export const app: Application = express();

// ============================================
// 2. MIDDLEWARES
// ============================================
// Middleware para parsear JSON en las peticiones
// Sin esto, req.body estaría undefined
app.use(express.json());

// ============================================
// 3. RUTAS
// ============================================
// Todas las rutas de libros empiezan con /books
// Ejemplo: GET /books, POST /books, etc.
app.use('/books', bookRouter);

// ============================================
// 4. FUNCIÓN PARA ARRANCAR EL SERVIDOR HTTP
// ============================================
const startHttpApi = (): void => {
  app.listen(env.PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${env.PORT}`);
    console.log(`📚 Rutas disponibles: http://localhost:${env.PORT}/books`);
  });
};

// ============================================
// 5. FUNCIÓN PRINCIPAL DE LA APLICACIÓN
// ============================================
const executeApp = async (): Promise<void> => {
  try {
    console.log('🚀 Iniciando aplicación...');

    // Paso 1: Conectar a la base de datos
    await connectDB();

    // Paso 2: Arrancar el servidor HTTP
    startHttpApi();
  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1); // Detener la aplicación con código de error
  }
};

// ============================================
// 6. EJECUTAR LA APLICACIÓN
// ============================================
// Solo ejecutar si este archivo se ejecuta directamente (no en tests)
if (require.main === module) {
  executeApp();
}
