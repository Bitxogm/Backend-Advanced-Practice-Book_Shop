import { describe, test, expect, beforeEach } from '@jest/globals';
import { createRandomUser } from './helpers/create-random-user';
import request from 'supertest';
import { app } from '@/server';

describe('Sign In Authentication Tests', () => {
  // Generar nuevos valores para cada test
  let testUser: { email: string; password: string };

  beforeEach(async () => {
    testUser = createRandomUser();
    await request(app).post('/auth/signup').send(testUser);
  });

  test('should sign in with correct credentials', async () => {
    const response = await request(app).post('/auth/signin').send(testUser);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User signed in successfully.');
  });

  test('should fail with wrong password', async () => {
    // Primero, login exitoso para asegurar que el usuario existe
    const okResponse = await request(app).post('/auth/signin').send(testUser);
    expect(okResponse.status).toBe(200);
    // Ahora, probar con password incorrecto
    const response = await request(app)
      .post('/auth/signin')
      .send({ email: testUser.email, password: 'wrongpass' });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid password');
  });

  test('should fail with non-existent user', async () => {
    const response = await request(app)
      .post('/auth/signin')
      .send({ email: 'nouser@example.com', password: 'irrelevant' });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('User not found');
  });

  test('should fail with missing fields', async () => {
    const response = await request(app).post('/auth/signin').send({ email: testUser.email });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email and password are required.');
  });
});
