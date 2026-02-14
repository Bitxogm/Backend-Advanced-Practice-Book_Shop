import mongoose, { Document, Schema } from 'mongoose';

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
      enum: ['PUBLISHED', 'SOLD'],
      default: 'PUBLISHED',
    },

    // ID DEL DUEÑO
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El propietario es obligatorio'],
    },

    // FECHA DE VENTA
    soldAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const BookModelMongoose = mongoose.model<IBook>('Book', bookSchema);
