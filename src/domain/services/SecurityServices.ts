import type { User } from '../entities/User';

export interface SecurityServices {
  hashPassword(password: string): Promise<string>;
  comparePasswords(password: string, hashedPassword: string): Promise<boolean>;
  generateJWT(user: User): Promise<string>;
  verifyJWT(token: string): string;
}

export default SecurityServices;
