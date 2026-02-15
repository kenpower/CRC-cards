import db from "../db";

function generateBase32Id() {
  const chars = "0123456789abcdefghjkmnpqrstvwxyz";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * 32));
  }
  return result;
}

export class ProjectRepository {
  async getAll(owner_id) {
    let query = `
      SELECT p.*,
             u.display_name as ownerDisplayName,
             (SELECT COUNT(*) FROM cards c WHERE c.project_id = p.id) as cardCount
      FROM projects p
      LEFT JOIN users u ON p.owner_id = u.id
    `;
    let params = [];

    if (owner_id) {
      query += " WHERE p.owner_id = ?";
      params.push(owner_id);
    }

    query += " ORDER BY p.created_at DESC";

    const [rows] = await db.execute(query, params);
    return rows;
  }

  async getById(id) {
    // Attempt to find by UUID first, then by base32_id
    let [rows] = await db.execute(
      `
      SELECT p.*, u.display_name as ownerDisplayName
      FROM projects p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE p.id = ?
    `,
      [id],
    );

    if (rows.length === 0) {
      [rows] = await db.execute(
        `
        SELECT p.*, u.display_name as ownerDisplayName
        FROM projects p
        LEFT JOIN users u ON p.owner_id = u.id
        WHERE p.base32_id = ?
      `,
        [id],
      );
    }

    return rows[0];
  }

  async create(project) {
    const { name, description, owner_id } = project;
    const id = crypto.randomUUID();
    const base32_id = generateBase32Id();
    await db.execute(
      "INSERT INTO projects (id, name, description, owner_id, base32_id) VALUES (?, ?, ?, ?, ?)",
      [id, name, description || null, owner_id || null, base32_id],
    );
    return this.getById(id);
  }

  async delete(id) {
    await db.execute("DELETE FROM projects WHERE id = ?", [id]);
    return { success: true };
  }
}

export const projectRepository = new ProjectRepository();
