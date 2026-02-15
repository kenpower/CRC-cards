import { json } from '@sveltejs/kit';
import { collaboratorRepository } from '$lib/server/repositories/CollaboratorRepository';

export async function POST({ request }) {
  try {
    const data = await request.json();
    const collaborator = await collaboratorRepository.create(data);
    return json(collaborator);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH({ request }) {
  try {
    const { id, ...updates } = await request.json();
    const collaborator = await collaboratorRepository.update(id, updates);
    return json(collaborator);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE({ url }) {
  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'Missing id' }, { status: 400 });

  try {
    const result = await collaboratorRepository.delete(id);
    return json(result);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
