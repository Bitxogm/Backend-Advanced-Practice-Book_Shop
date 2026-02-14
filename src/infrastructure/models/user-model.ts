import type { Document } from 'mongoose';
import mongoose from 'mongoose';

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
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>('User', UserSchema, 'Users');

export default UserModel;
