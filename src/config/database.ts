import mongoose from 'mongoose';
import { env } from './environment';

export const connectDB = async (): Promise<void> => {
  try {
    console.log('🔍 Conectando a MongoDB...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ MongoDB conectado correctamente');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};
