import type { Document } from 'mongoose';
import mongoose from 'mongoose';

// Importamos mongoose y Document para definir la interfaz del producto y tener metodos de mongoose disponibles.
export interface IUser extends Document {
  email: string;
  password: string;
  createdAt?: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // Añadimos timestamps para tener createdAt y updatedAt automáticamente
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>('User', UserSchema, 'Users');

export default UserModel;
