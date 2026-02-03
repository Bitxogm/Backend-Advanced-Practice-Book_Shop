import UserModel from '@/infrastructure/models/user-model';

import { User } from '../entities/User';
import type { UserCreationQuery } from '../types/UserCreationQuery';

export interface UserRepository {
  createOne(query: UserCreationQuery): Promise<User>;

  findUserByEmail(email: string): Promise<User | null>;
}

export async function createOne(query: UserCreationQuery): Promise<User> {
  const newUser = new UserModel({
    email: query.email,
    password: query.password,
  });
  await newUser.save();
  return new User({
    email: newUser.email,
    password: newUser.password,
    id: newUser._id.toString(),
    createdAt: newUser.createdAt,
  });
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const userDb = await UserModel.findOne({ email });
  if (!userDb) {
    return null;
  }
  return new User({
    email: userDb.email,
    password: userDb.password,
    id: userDb._id.toString(),
    createdAt: userDb.createdAt,
  });
}
