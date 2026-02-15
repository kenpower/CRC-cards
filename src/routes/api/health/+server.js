import { json } from '@sveltejs/kit';
import pool from '$lib/server/db';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return json({ status: 'ok', message: 'Database connection successful' });
  } catch (error) {
    console.error('Health check failed:', error);
    return json(
      { status: 'error', message: error.message },
      { status: 503 }
    );
  }
}
