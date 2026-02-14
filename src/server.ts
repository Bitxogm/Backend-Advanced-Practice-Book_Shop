import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '@config/database';
import { env } from '@config/environment';
import bookRouter from '@ui/routes/book.routes';
import type { Application } from 'express';
import express from 'express';
import authenticationRouter from './ui/routes/authentication.routes';
import { startPriceReductionCron } from './infrastructure/jobs/price-reduction-cron'; // ⬅️ AÑADIDO

// ============================================
// 1. CREAR LA APLICACIÓN EXPRESS
// ============================================
export const app: Application = express();

// ============================================
// 2. MIDDLEWARES
// ============================================
app.use(express.json());
app.use('/auth', authenticationRouter);

// ============================================
// 3. RUTAS
// ============================================
app.get('/', (req, res) => {
  res.send('API de libros. Visita /books para ver los endpoints.');
});
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

    // Paso 3: Arrancar cron jobs
    startPriceReductionCron(); // ⬅️ AÑADIDO
  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
  }
};

// ============================================
// 6. EJECUTAR LA APLICACIÓN
// ============================================
if (require.main === module) {
  executeApp();
}
