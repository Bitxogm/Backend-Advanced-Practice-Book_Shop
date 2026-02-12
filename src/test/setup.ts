/**
 * CONFIGURACIÓN DE TESTS
 *
 * Este archivo configura el entorno de testing usando MongoDB Memory Server.
 * Crea una base de datos temporal en memoria para los tests.
 */

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: MongoMemoryServer | undefined;

// 1 vez antes de todos los tests
beforeAll(async () => {
  try {
    // Crear servidor MongoDB en memoria con configuración específica
    mongo = await MongoMemoryServer.create({
      binary: {
        version: '6.0.12', // Versión estable de MongoDB
      },
      instance: {
        dbName: 'test',
      },
    });

    const uri = mongo.getUri();
    await mongoose.connect(uri);

    // console.log('✅ MongoDB Memory Server iniciado correctamente');
  } catch (error) {
    console.error('❌ Error al iniciar MongoDB Memory Server:', error);
    throw error;
  }
}, 60000); // Timeout de 60 segundos para la primera vez

// Después de cada test, limpiar la base de datos
afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = await mongoose.connection.db?.collections();
    if (collections) {
      for (const collection of collections) {
        await collection.deleteMany({});
      }
    }
  }
});

// 1 vez, después de todos los tests
afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    if (mongo) {
      await mongo.stop();
    }
  } catch (error) {
    console.error('Error al cerrar conexiones:', error);
  }
});
