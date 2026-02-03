import { randEmail, randPassword } from '@ngneat/falso';

export interface CreateRandomUserData {
  email: string;
  password: string;
}

/**
 * Crea datos de un usuario aleatorio
 * @param overrides - Permite sobrescribir campos específicos
 * @returns Objeto con datos de usuario falso
 */
export const createRandomUser = (
  overrides?: Partial<CreateRandomUserData>
): CreateRandomUserData => {
  return {
    email: randEmail(),
    password: randPassword(),
    ...overrides,
  };
};
