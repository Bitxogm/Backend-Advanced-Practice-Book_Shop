import { User } from '@/domain/entities/User';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        // Puedes agregar más campos si tu middleware los añade
      };
    }
  }
}
export {};
