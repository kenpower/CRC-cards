import { json } from '@sveltejs/kit';
import { cardRepository } from '$lib/server/repositories/CardRepository';

export async function GET({ url }) {
  const project_id = url.searchParams.get('project_id');
  if (!project_id) return json({ error: 'Missing project_id' }, { status: 400 });

  try {
    const cards = await cardRepository.getByProjectId(project_id);
    return json(cards);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const cardData = await request.json();
    const card = await cardRepository.create(cardData);
    return json(card);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH({ request }) {
  try {
    const { id, ...updates } = await request.json();
    const card = await cardRepository.update(id, updates);
    return json(card);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE({ url }) {
  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'Missing id' }, { status: 400 });

  try {
    const result = await cardRepository.delete(id);
    return json(result);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
