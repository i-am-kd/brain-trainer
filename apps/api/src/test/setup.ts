import { beforeAll, afterAll, afterEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection?.deleteMany({});
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState != 0) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
  }
});


