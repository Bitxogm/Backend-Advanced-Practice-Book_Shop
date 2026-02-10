import request from 'supertest';
import { app } from '@/server';
import { BookModelMongoose as Book } from '@infrastructure/models/book.model';
import { createRandomBook } from './helpers/create-random-book';
import User from '@infrastructure/models/user-model';

const signupAndLogin = async (email: string, password: string) => {
  await request(app).post('/auth/signup').send({ email, password });
  const res = await request(app).post('/auth/signin').send({ email, password });
  return res.body.token;
};

describe('POST /books/:id/buy', () => {
  let sellerToken: string;
  let buyerToken: string;
  let sellerId: string;
  let buyerId: string;

  beforeEach(async () => {
    await Book.deleteMany({});
    await User.deleteMany({});
    sellerToken = await signupAndLogin('seller@test.com', 'password123');
    buyerToken = await signupAndLogin('buyer@test.com', 'password123');
    const seller = await User.findOne({ email: 'seller@test.com' });
    if (!seller) throw new Error('No se pudo crear el usuario seller');
    const buyer = await User.findOne({ email: 'buyer@test.com' });
    if (!buyer) throw new Error('No se pudo crear el usuario buyer');
    sellerId = (seller._id as unknown as string).toString();
    buyerId = (buyer._id as unknown as string).toString();
  });

  it('compra exitosa de un libro', async () => {
    const book = await Book.create(createRandomBook({ ownerId: sellerId, status: 'PUBLISHED' }));
    const res = await request(app)
      .post(`/books/${book._id}/buy`)
      .set('Authorization', `Bearer ${buyerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SOLD');
    expect(res.body.soldAt).not.toBeNull();
  });

  it('no puedes comprar tu propio libro', async () => {
    const book = await Book.create(createRandomBook({ ownerId: sellerId, status: 'PUBLISHED' }));
    const res = await request(app)
      .post(`/books/${book._id}/buy`)
      .set('Authorization', `Bearer ${sellerToken}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/own book/i);
  });

  it('no puedes comprar un libro ya vendido', async () => {
    const book = await Book.create(
      createRandomBook({ ownerId: sellerId, status: 'SOLD', soldAt: new Date() })
    );
    const res = await request(app)
      .post(`/books/${book._id}/buy`)
      .set('Authorization', `Bearer ${buyerToken}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already sold/i);
  });

  it('no puedes comprar un libro inexistente', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app)
      .post(`/books/${fakeId}/buy`)
      .set('Authorization', `Bearer ${buyerToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });
});
