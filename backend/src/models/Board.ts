import { pool } from '../database/connection';

export interface Board {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

export class BoardModel {
  static async findById(id: number): Promise<Board | null> {
    const result = await pool.query(
      'SELECT * FROM boards WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByUserId(userId: number): Promise<Board[]> {
    const result = await pool.query(
      'SELECT * FROM boards WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  static async create(data: Partial<Board>): Promise<Board> {
    const result = await pool.query(
      `INSERT INTO boards (user_id, name, description, is_public) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [
        data.user_id,
        data.name,
        data.description || null,
        data.is_public || false,
      ]
    );
    return result.rows[0];
  }

  static async update(id: number, data: Partial<Board>): Promise<Board | null> {
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
      `UPDATE boards SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM boards WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  static async addRemedy(boardId: number, remedyId: number): Promise<void> {
    await pool.query(
      'INSERT INTO board_remedies (board_id, remedy_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [boardId, remedyId]
    );
  }

  static async removeRemedy(boardId: number, remedyId: number): Promise<void> {
    await pool.query(
      'DELETE FROM board_remedies WHERE board_id = $1 AND remedy_id = $2',
      [boardId, remedyId]
    );
  }

  static async getRemedies(boardId: number): Promise<any[]> {
    const result = await pool.query(
      `SELECT r.* FROM remedies r
       INNER JOIN board_remedies br ON r.id = br.remedy_id
       WHERE br.board_id = $1
       ORDER BY br.added_at DESC`,
      [boardId]
    );
    return result.rows;
  }
}
