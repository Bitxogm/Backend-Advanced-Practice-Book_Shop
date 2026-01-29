/**
 * CONFIGURACIÓN DE LA BASE DE DATOS
 *
 * Este archivo se encarga de conectar nuestra aplicación a MongoDB.
 * MongoDB es nuestra base de datos donde guardamos todos los libros.
 */

import mongoose from "mongoose";
import { env } from "./environment";

/**
 * Función que conecta a la base de datos MongoDB
 * Es async porque conectarse a la BD toma tiempo
 */
export const connectDB = async (): Promise<void> => {
  try {
    // Intentamos conectarnos usando la URI del archivo environment
    console.log("🔍 Conectando a MongoDB...");
    await mongoose.connect(env.MONGODB_URI);
    console.log("✅ MongoDB conectado correctamente");
  } catch (error) {
    // Si hay un error, lo mostramos y detenemos la aplicación
    console.error("❌ Error al conectar a MongoDB:", error);
    process.exit(1); // Detiene la aplicación con código de error
  }
};
