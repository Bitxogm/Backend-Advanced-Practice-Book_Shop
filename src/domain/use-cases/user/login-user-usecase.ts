import type { UserRepository } from '@/domain/repositories/UserRepository';
import type SecurityServices from '@/domain/services/SecurityServices';
import { ERROR_MESSAGES } from '@/config/constants';

export class LoginUserUseCase {
  private readonly userRepository: UserRepository;

  private readonly securityService: SecurityServices;

  constructor(userRepository: UserRepository, securityService: SecurityServices) {
    this.userRepository = userRepository;
    this.securityService = securityService;
  }

  async execute({ email, password }: { email: string; password: string }): Promise<void> {
    const existingUser = await this.userRepository.findUserByEmail(email);

    if (!existingUser) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND ?? 'Usuario no encontrado');
    }

    const isPasswordValid = await this.securityService.comparePasswords(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      throw new Error(ERROR_MESSAGES.INVALID_PASSWORD ?? 'Contraseña incorrecta');
    } else {
      await this.securityService.generateJWT(existingUser);
    }
  }
}
