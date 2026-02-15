import { json } from '@sveltejs/kit';
import { responsibilityRepository } from '$lib/server/repositories/ResponsibilityRepository';

export async function POST({ request }) {
  try {
    const data = await request.json();
    const responsibility = await responsibilityRepository.create(data);
    return json(responsibility);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH({ request }) {
  try {
    const { id, ...updates } = await request.json();
    const responsibility = await responsibilityRepository.update(id, updates);
    return json(responsibility);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE({ url }) {
  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'Missing id' }, { status: 400 });

  try {
    const result = await responsibilityRepository.delete(id);
    return json(result);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
