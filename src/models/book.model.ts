/**
 * MODELO DE LIBRO (BOOK)
 *
 * Este archivo define cómo se ve un libro en nuestra base de datos.
 * MongoDB es una BD de documentos, y Mongoose nos ayuda a darle estructura.
 */

import mongoose, { Document, Schema } from 'mongoose';

// ============================================
// 1. ESTRUCTURA DE UN LIBRO (TypeScript)
// ============================================
// Esta interfaz define qué campos tiene un libro
// Es como un "contrato" que dice qué propiedades debe tener
export interface IBook extends Document {
  title: string; // Título del libro
  description: string; // Descripción del libro
  price: number; // Precio (en número, ejemplo: 15.99)
  author: string; // Nombre del autor
  status: 'PUBLISHED' | 'SOLD'; // Estado: puede ser PUBLISHED o SOLD
  ownerId: mongoose.Types.ObjectId; // ID del usuario dueño del libro
  soldAt: Date | null; // Fecha de venta (null si no se ha vendido)
  createdAt: Date; // Mongoose lo crea automáticamente
  updatedAt: Date; // Mongoose lo actualiza automáticamente
}

// ============================================
// 2. ESQUEMA DE MONGODB (Reglas de validación)
// ============================================
// Aquí definimos las reglas que MongoDB debe validar al guardar un libro
const bookSchema = new Schema<IBook>(
  {
    // TÍTULO
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true, // Elimina espacios al inicio y final
      maxlength: [200, 'El título no puede superar los 200 caracteres'],
    },

    // DESCRIPCIÓN
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: [2000, 'La descripción no puede superar los 2000 caracteres'],
    },

    // PRECIO
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },

    // AUTOR
    author: {
      type: String,
      required: [true, 'El autor es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre del autor no puede superar los 100 caracteres'],
    },

    // ESTADO (PUBLISHED o SOLD)
    status: {
      type: String,
      enum: ['PUBLISHED', 'SOLD'], // Solo acepta estos dos valores
      default: 'PUBLISHED', // Por defecto está publicado
    },

    // ID DEL DUEÑO
    ownerId: {
      type: Schema.Types.ObjectId, // Es un ID de MongoDB
      ref: 'User', // Hace referencia a un usuario
      required: [true, 'El propietario es obligatorio'],
    },

    // FECHA DE VENTA
    soldAt: {
      type: Date,
      default: null, // Por defecto es null (no vendido)
    },
  },
  {
    // TIMESTAMPS AUTOMÁTICOS
    // Mongoose crea y actualiza automáticamente createdAt y updatedAt
    timestamps: true,
  }
);

// 3. EXPORTAR EL MODELO
// ============================================
// Esto crea el modelo "Book" que usaremos en toda la app
export const Book = mongoose.model<IBook>('Book', bookSchema);
