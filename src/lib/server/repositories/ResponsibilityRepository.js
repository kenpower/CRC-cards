import db from '../db';

export class ResponsibilityRepository {
  async create(responsibility) {
    const { name, display_order, card_id, project_id } = responsibility;
    const id = crypto.randomUUID();
    await db.execute(
      'INSERT INTO responsibilities (id, name, display_order, card_id, project_id) VALUES (?, ?, ?, ?, ?)',
      [id, name, display_order || 0, card_id, project_id]
    );
    const [rows] = await db.execute('SELECT * FROM responsibilities WHERE id = ?', [id]);
    return rows[0];
  }

  async update(id, updates) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(updates)) {
        if (key === 'id') continue;
        fields.push(`${key} = ?`);
        values.push(value);
    }
    values.push(id);
    await db.execute(`UPDATE responsibilities SET ${fields.join(', ')} WHERE id = ?`, values);
    const [rows] = await db.execute('SELECT * FROM responsibilities WHERE id = ?', [id]);
    return rows[0];
  }

  async delete(id) {
    await db.execute('DELETE FROM responsibilities WHERE id = ?', [id]);
    return { success: true };
  }
}

export const responsibilityRepository = new ResponsibilityRepository();
