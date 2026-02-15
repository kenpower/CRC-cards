import { json } from '@sveltejs/kit';
import { projectRepository } from '$lib/server/repositories/ProjectRepository';

export async function GET({ url }) {
  const id = url.searchParams.get('id');
  const owner_id = url.searchParams.get('owner_id');

  try {
    if (id) {
      const project = await projectRepository.getById(id);
      if (!project) return json({ error: 'Project not found' }, { status: 404 });
      return json(project);
    }

    const projects = await projectRepository.getAll(owner_id);
    return json(projects);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const projectData = await request.json();
    const project = await projectRepository.create(projectData);
    return json(project);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE({ url }) {
  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'Missing id' }, { status: 400 });

  try {
    const result = await projectRepository.delete(id);
    return json(result);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
