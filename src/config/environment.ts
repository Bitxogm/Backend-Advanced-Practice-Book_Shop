export const env = {
  PORT: Number(process.env.PORT) || 3000,

  MONGODB_URI:
    process.env.MONGO_URI || 'mongodb://admin:admin123@localhost:27019/mydb?authSource=admin',

  NODE_ENV: process.env.NODE_ENV || 'development',

  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
};
