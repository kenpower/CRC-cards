import { runMigrations } from '$lib/server/migrate.js';

const migrationsComplete = runMigrations();

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  await migrationsComplete;
  return resolve(event);
}
