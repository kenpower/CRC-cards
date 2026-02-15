import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

const pool = mysql.createPool({
  host: env.DB_HOST || 'localhost',
  user: env.DB_USER || 'root',
  password: env.DB_PASSWORD || '',
  database: env.DB_NAME || 'crc_cards',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
