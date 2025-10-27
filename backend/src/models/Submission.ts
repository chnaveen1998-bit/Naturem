import { pool } from '../database/connection';

export interface Submission {
  id: number;
  user_id: number;
  remedy_id?: number;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  category: string;
  tags: string[];
  status: string;
  admin_notes?: string;
  submitted_at: Date;
  reviewed_at?: Date;
  reviewed_by?: number;
}

export class SubmissionModel {
  static async findById(id: number): Promise<Submission | null> {
    const result = await pool.query(
      'SELECT * FROM submissions WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async findAll(
    limit = 50,
    offset = 0,
    filters?: {
      status?: string;
      user_id?: number;
    }
  ): Promise<Submission[]> {
    let query = 'SELECT * FROM submissions WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.status) {
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    if (filters?.user_id) {
      query += ` AND user_id = $${paramCount}`;
      params.push(filters.user_id);
      paramCount++;
    }

    query += ` ORDER BY submitted_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async create(data: Partial<Submission>): Promise<Submission> {
    const result = await pool.query(
      `INSERT INTO submissions (user_id, title, description, ingredients, instructions, category, tags) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        data.user_id,
        data.title,
        data.description,
        data.ingredients,
        data.instructions,
        data.category,
        data.tags || [],
      ]
    );
    return result.rows[0];
  }

  static async update(id: number, data: Partial<Submission>): Promise<Submission | null> {
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

    values.push(id);

    const result = await pool.query(
      `UPDATE submissions SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM submissions WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
