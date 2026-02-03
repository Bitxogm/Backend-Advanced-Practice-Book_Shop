import { User } from '@/domain/entities/User';
import type { UserRepository } from '@/domain/repositories/UserRepository';
import type { UserCreationQuery } from '@/domain/types/UserCreationQuery';
import UserModel from '@/infrastructure/models/user-model';

export class UserMongoRepository implements UserRepository {
  async createOne(query: UserCreationQuery): Promise<User> {
    const newUserDoc = new UserModel({
      email: query.email,
      password: query.password,
    });
    await newUserDoc.save();
    return new User(
      newUserDoc._id.toString(),
      newUserDoc.email,
      newUserDoc.password,
      newUserDoc.createdAt
    );
  }
  async findUserByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return null;
    }
    return new User(user._id.toString(), user.email, user.password, user.createdAt);
  }
}
