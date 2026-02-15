import db from '../db';

export class CardRepository {
  async getByProjectId(projectId) {
    const [cards] = await db.execute('SELECT * FROM cards WHERE project_id = ?', [projectId]);

    const [responsibilities] = await db.execute('SELECT * FROM responsibilities WHERE project_id = ?', [projectId]);
    const [collaborators] = await db.execute('SELECT * FROM collaborators WHERE project_id = ?', [projectId]);

    return cards.map(card => ({
      ...card,
      style: typeof card.style === 'string' ? JSON.parse(card.style) : card.style,
      responsibilities: responsibilities.filter(r => r.card_id === card.id),
      collaborators: collaborators.filter(c => c.card_id === card.id)
    }));
  }

  async create(card) {
    const { name, style, project_id } = card;
    const id = crypto.randomUUID();
    await db.execute(
      'INSERT INTO cards (id, name, style, project_id) VALUES (?, ?, ?, ?)',
      [id, name, JSON.stringify(style), project_id]
    );
    const [rows] = await db.execute('SELECT * FROM cards WHERE id = ?', [id]);
    const inserted = rows[0];
    return {
      ...inserted,
      style: typeof inserted.style === 'string' ? JSON.parse(inserted.style) : inserted.style,
      responsibilities: [],
      collaborators: []
    };
  }

  async update(id, updates) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(updates)) {
      if (key === 'id') continue;
      fields.push(`${key} = ?`);
      values.push(key === 'style' ? JSON.stringify(value) : value);
    }
    values.push(id);
    await db.execute(`UPDATE cards SET ${fields.join(', ')} WHERE id = ?`, values);
    const [rows] = await db.execute('SELECT * FROM cards WHERE id = ?', [id]);
    const updated = rows[0];
    if (updated && updated.style && typeof updated.style === 'string') {
        updated.style = JSON.parse(updated.style);
    }
    return updated;
  }

  async delete(id) {
    await db.execute('DELETE FROM cards WHERE id = ?', [id]);
    return { success: true };
  }
}

export const cardRepository = new CardRepository();
