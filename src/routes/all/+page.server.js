import { projectRepository } from '$lib/server/repositories/ProjectRepository';

export async function load() {
  const projects = await projectRepository.getAll();
  return { projects };
}
