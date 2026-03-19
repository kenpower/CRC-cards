import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

const MIGRATIONS_DIR = join(process.cwd(), 'database', 'migrations');

async function getConnection() {
  return mysql.createConnection({
    host: env.DB_HOST || '127.0.0.1',
    user: env.DB_USER || 'crc_user',
    password: env.DB_PASSWORD || 'crc_password',
    database: env.DB_NAME || 'crc_cards',
    multipleStatements: true,
  });
}

async function ensureMigrationsTable(connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getAppliedMigrations(connection) {
  const [rows] = await connection.execute(
    'SELECT name FROM schema_migrations ORDER BY name'
  );
  return new Set(rows.map((row) => row.name));
}

async function getMigrationFiles() {
  try {
    const files = await readdir(MIGRATIONS_DIR);
    return files.filter((f) => f.endsWith('.sql')).sort();
  } catch (err) {
    throw new Error(`Failed to read migrations directory (${MIGRATIONS_DIR}): ${err.message}`);
  }
}

export async function runMigrations() {
  console.log('[migrate] Starting database migrations...');
  const connection = await getConnection();
  try {
    await ensureMigrationsTable(connection);
    const applied = await getAppliedMigrations(connection);
    const files = await getMigrationFiles();

    let count = 0;
    for (const file of files) {
      if (!applied.has(file)) {
        const sql = await readFile(join(MIGRATIONS_DIR, file), 'utf8');
        console.log(`[migrate] Applying migration: ${file}`);
        try {
          await connection.beginTransaction();
          await connection.query(sql);
          await connection.execute(
            'INSERT INTO schema_migrations (name) VALUES (?)',
            [file]
          );
          await connection.commit();
        } catch (err) {
          await connection.rollback();
          throw new Error(`Failed to apply migration "${file}": ${err.message}`);
        }
        console.log(`[migrate] Applied migration: ${file}`);
        count++;
      }
    }

    if (count === 0) {
      console.log('[migrate] No pending migrations.');
    } else {
      console.log(`[migrate] ${count} migration(s) applied successfully.`);
    }
  } finally {
    await connection.end();
  }
}
