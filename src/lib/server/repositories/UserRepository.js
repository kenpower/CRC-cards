import db from '../db';

export class UserRepository {
  async upsert(user) {
    const { email, forename, surname, display_name } = user;

    const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (existing.length > 0) {
      await db.execute(
        'UPDATE users SET forename = ?, surname = ?, display_name = ? WHERE email = ?',
        [forename, surname, display_name, email]
      );
      const [updated] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      return updated[0];
    } else {
      const id = crypto.randomUUID();
      await db.execute(
        'INSERT INTO users (id, email, forename, surname, display_name) VALUES (?, ?, ?, ?, ?)',
        [id, email, forename, surname, display_name]
      );
      const [inserted] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
      return inserted[0];
    }
  }

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }
}

export const userRepository = new UserRepository();
