import type { Request, Response } from 'express';

import { CreateUserUsecase } from '@/domain/use-cases/user/create-user-usecase';
import { UserMongoRepository } from '@/infrastructure/repositories/user/user-mongodb-repository';
import { SecurtityBcryptService } from '@/infrastructure/services/security-bcrypt-service';
import { ERROR_MESSAGES } from '@/config/constants';

export const signupController = async (req: Request, res: Response) => {
  const userMongoRepository = new UserMongoRepository();
  const securityBcryptService = new SecurtityBcryptService();
  const createUserUseCase = new CreateUserUsecase(userMongoRepository, securityBcryptService);

  try {
    if (!req.body || typeof req.body !== 'object') {
      throw new Error(ERROR_MESSAGES.EMAIL_AND_PASSWORD_REQUIRED);
    }
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      throw new Error(ERROR_MESSAGES.EMAIL_AND_PASSWORD_REQUIRED);
    }
    await createUserUseCase.execute({
      email: email as string,
      password: password as string,
    });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof Error && error.message === ERROR_MESSAGES.EMAIL_AND_PASSWORD_REQUIRED) {
      res.status(400).json({ message: error.message });
    } else if (error instanceof Error && error.message === ERROR_MESSAGES.USER_ALREADY_EXISTS) {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).json({
        message: ERROR_MESSAGES.SERVER_ERROR,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
};
