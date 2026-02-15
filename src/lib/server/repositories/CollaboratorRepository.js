import db from '../db';

export class CollaboratorRepository {
  async create(collaborator) {
    const { name, display_order, card_id, project_id } = collaborator;
    const id = crypto.randomUUID();
    await db.execute(
      'INSERT INTO collaborators (id, name, display_order, card_id, project_id) VALUES (?, ?, ?, ?, ?)',
      [id, name, display_order || 0, card_id, project_id]
    );
    const [rows] = await db.execute('SELECT * FROM collaborators WHERE id = ?', [id]);
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
    await db.execute(`UPDATE collaborators SET ${fields.join(', ')} WHERE id = ?`, values);
    const [rows] = await db.execute('SELECT * FROM collaborators WHERE id = ?', [id]);
    return rows[0];
  }

  async delete(id) {
    await db.execute('DELETE FROM collaborators WHERE id = ?', [id]);
    return { success: true };
  }
}

export const collaboratorRepository = new CollaboratorRepository();
