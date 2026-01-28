import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: MongoMemoryServer;

// 1 vez antes de todos los tests
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);
});

// n veces, despues de cada test
afterEach(async () => {
  const collections = (await mongoose.connection.db?.collections()) ?? [];

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

// 1 vez, después de los tests
afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});
