import type { Request, Response } from 'express';

import { LoginUserUseCase } from '@/domain/use-cases/user/login-user-usecase';
import { UserMongoRepository } from '@/infrastructure/repositories/user/user-mongodb-repository';
import { SecurityBcryptService } from '@/infrastructure/services/security-bcrypt-service';

export const signinController = async (req: Request, res: Response) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const userMongoRepository = new UserMongoRepository();
    const securityService = new SecurityBcryptService();
    const loginUserUseCase = new LoginUserUseCase(userMongoRepository, securityService);

    // Autenticar usuario y obtener la entidad User
    const user = await userMongoRepository.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    await loginUserUseCase.execute({ email, password });
    // Generar token JWT
    const token = await securityService.generateJWT(user);
    return res.status(200).json({ message: 'User signed in successfully.', token });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
