import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'naturem',
    user: process.env.DB_USER || 'naturem_user',
    password: process.env.DB_PASSWORD || 'naturem_password',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@naturem.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },
};
