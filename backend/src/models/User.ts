import { pool } from '../database/connection';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  username: string;
  full_name?: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static async findById(id: number): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  static async findByUsername(username: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  }

  static async create(data: {
    email: string;
    password_hash: string;
    username: string;
    full_name?: string;
    role?: string;
  }): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, username, full_name, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [
        data.email,
        data.password_hash,
        data.username,
        data.full_name || null,
        data.role || 'user',
      ]
    );
    return result.rows[0];
  }

  static async update(id: number, data: Partial<User>): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  static async findAll(limit = 50, offset = 0): Promise<User[]> {
    const result = await pool.query(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }
}
