/**
 * CONFIGURACIÓN DE VARIABLES DE ENTORNO
 *
 * Este archivo centraliza todas las variables de entorno que usa la aplicación.
 * Las variables de entorno son valores que pueden cambiar según dónde corra la app
 * (en tu computadora, en producción, en testing, etc.)
 */

// Configuración básica de la aplicación
export const env = {
  // El puerto donde corre el servidor (por defecto 3000)
  PORT: Number(process.env.PORT) || 3000,

  // La URL para conectarse a MongoDB
  MONGODB_URI:
    process.env.MONGO_URI || 'mongodb://admin:admin123@localhost:27019/mydb?authSource=admin',

  // El entorno en el que estamos (desarrollo, producción, test)
  NODE_ENV: process.env.NODE_ENV || 'development',

  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
};
