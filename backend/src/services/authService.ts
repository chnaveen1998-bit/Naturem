import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { config } from '../config';

export class AuthService {
  static async register(data: {
    email: string;
    password: string;
    username: string;
    full_name?: string;
  }) {
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const existingUsername = await UserModel.findByUsername(data.username);
    if (existingUsername) {
      throw new Error('Username is already taken');
    }

    // Hash password
    const password_hash = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await UserModel.create({
      email: data.email,
      password_hash,
      username: data.username,
      full_name: data.full_name,
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  static async login(email: string, password: string) {
    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new Error('Account is disabled');
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  static generateToken(user: { id: number; email: string; role: string }) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  static sanitizeUser(user: any) {
    const { password_hash, ...sanitized } = user;
    return sanitized;
  }
}
