import { pool } from '../database/connection';

export interface Remedy {
  id: number;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  category: string;
  tags: string[];
  author_id: number;
  status: string;
  views: number;
  likes: number;
  is_featured: boolean;
  created_at: Date;
  updated_at: Date;
}

export class RemedyModel {
  static async findById(id: number): Promise<Remedy | null> {
    const result = await pool.query(
      'SELECT * FROM remedies WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async findAll(
    limit = 50,
    offset = 0,
    filters?: {
      status?: string;
      category?: string;
      author_id?: number;
    }
  ): Promise<Remedy[]> {
    let query = 'SELECT * FROM remedies WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.status) {
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    if (filters?.category) {
      query += ` AND category = $${paramCount}`;
      params.push(filters.category);
      paramCount++;
    }

    if (filters?.author_id) {
      query += ` AND author_id = $${paramCount}`;
      params.push(filters.author_id);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async create(data: Partial<Remedy>): Promise<Remedy> {
    const result = await pool.query(
      `INSERT INTO remedies (title, description, ingredients, instructions, category, tags, author_id, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        data.title,
        data.description,
        data.ingredients,
        data.instructions,
        data.category,
        data.tags || [],
        data.author_id,
        data.status || 'pending',
      ]
    );
    return result.rows[0];
  }

  static async update(id: number, data: Partial<Remedy>): Promise<Remedy | null> {
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
      `UPDATE remedies SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM remedies WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  static async incrementViews(id: number): Promise<void> {
    await pool.query('UPDATE remedies SET views = views + 1 WHERE id = $1', [id]);
  }

  static async search(query: string, limit = 50): Promise<Remedy[]> {
    const result = await pool.query(
      `SELECT *, 
        ts_rank(to_tsvector('english', title || ' ' || description), plainto_tsquery('english', $1)) as rank
       FROM remedies 
       WHERE to_tsvector('english', title || ' ' || description) @@ plainto_tsquery('english', $1)
       ORDER BY rank DESC, created_at DESC
       LIMIT $2`,
      [query, limit]
    );
    return result.rows;
  }
}
