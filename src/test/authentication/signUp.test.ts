import { createRandomUser } from './helpers/create-random-user';
import { describe, test, expect } from '@jest/globals';
import request from 'supertest';

import { app } from '@/server';

describe('Sign Up Authentication Tests', () => {
  test('should create user with email and password', async () => {
    const response = await request(app).post('/auth/signup').send();
    console.log(response.body);

    expect(response.status).toBe(400);
  });

  test('should fail to sign up with an existing email', async () => {
    const user = createRandomUser();

    const firstAttemptResponse = await request(app).post('/auth/signup').send(user);
    expect(firstAttemptResponse.status).toBe(201);

    const secondAttemptResponse = await request(app).post('/auth/signup').send(user);
    expect(secondAttemptResponse.status).toBe(409);
  });

  test('given a valid email and password a new user should be create', async () => {
    const user = createRandomUser();

    const newUserResponse = await request(app).post('/auth/signup').send(user);
    expect(newUserResponse.status).toBe(201);
  });
});
