import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import type { User } from '@/domain/entities/User';
import type SecurityServices from '@/domain/services/SecurityServices';

export class SecurityBcryptService implements SecurityServices {
  private readonly jwtSecret: string = 'werikufghweyu8uur';

  generateJWT(user: User): Promise<string> {
    const token = jwt.sign({ userId: user.id }, this.jwtSecret, {
      expiresIn: '1h',
    });
    return Promise.resolve(token);
  }
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
