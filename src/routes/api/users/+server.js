import { json } from '@sveltejs/kit';
import { userRepository } from '$lib/server/repositories/UserRepository';

export async function POST({ request }) {
  try {
    const userData = await request.json();
    const user = await userRepository.upsert(userData);
    return json(user);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
