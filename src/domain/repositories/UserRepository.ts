import UserModel from '@/infrastructure/models/user-model';

import { User } from '../entities/User';
import type { UserCreationQuery } from '../types/UserCreationQuery';

export interface UserRepository {
  createOne(query: UserCreationQuery): Promise<User>;

  findUserByEmail(email: string): Promise<User | null>;

  findById(id: string): Promise<User | null>;
}

export async function createOne(query: UserCreationQuery): Promise<User> {
  const newUser = new UserModel({
    email: query.email,
    password: query.password,
  });
  await newUser.save();
  return new User(newUser._id.toString(), newUser.email, newUser.password, newUser.createdAt);
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const userDb = await UserModel.findOne({ email });
  if (!userDb) {
    return null;
  }
  return new User(userDb._id.toString(), userDb.email, userDb.password, userDb.createdAt);
}

export async function findById(id: string): Promise<User | null> {
  const userDb = await UserModel.findById(id);
  if (!userDb) {
    return null;
  }
  return new User(userDb._id.toString(), userDb.email, userDb.password, userDb.createdAt);
}
