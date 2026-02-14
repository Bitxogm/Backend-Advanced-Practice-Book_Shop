export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}
import type { Request, Response, NextFunction } from 'express';

import { HTTP_STATUS } from '../../config/constants';
import { SecurityBcryptService } from '../../infrastructure/services/security-bcrypt-service';

export function authenticationMiddleware(request: Request, response: Response, next: NextFunction) {
  const authenticationHeader = request.headers.authorization;
  const token = authenticationHeader?.split(' ')[1];
  if (!authenticationHeader || !token) {
    response.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Unauthorized' });
    return;
  }

  const securityService = new SecurityBcryptService();
  try {
    const data = securityService.verifyJWT(token);
    (request as AuthenticatedRequest).user = {
      id: data,
    };
    next();
  } catch {
    response.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid token' });
  }
}
