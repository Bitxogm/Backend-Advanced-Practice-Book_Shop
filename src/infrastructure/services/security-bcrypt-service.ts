import bcrypt from 'bcryptjs';

import type SecurityServices from '@/domain/services/SecurityServices';

export class SecurtityBcryptService implements SecurityServices {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
