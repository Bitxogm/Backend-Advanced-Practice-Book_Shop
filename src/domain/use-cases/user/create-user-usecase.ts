import type { UserRepository } from '@/domain/repositories/UserRepository';
import type { SecurityServices } from '@/domain/services/SecurityServices';
import type { UserCreationQuery } from '@/domain/types/UserCreationQuery';
import { ERROR_MESSAGES } from '@/config/constants';

export class CreateUserUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly securityService: SecurityServices
  ) {}

  async execute(query: UserCreationQuery) {
    if (!query.email || !query.password) {
      throw new Error(ERROR_MESSAGES.EMAIL_AND_PASSWORD_REQUIRED);
    }
    const user = await this.userRepository.findUserByEmail(query.email);

    if (user) {
      throw new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    const hashedPassword = this.securityService.hashPassword(query.password);

    const createdUser = await this.userRepository.createOne({
      email: query.email,
      password: await hashedPassword,
    });

    return createdUser;
  }
}
