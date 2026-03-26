<script>
  import { base } from '$app/paths';
  import ProjectInfoCard from '../../components/ProjectInfoCard.svelte';
  import { user } from '$lib/stores.js';
  import { loginUser } from '$lib/login.js';
  import { onMount } from 'svelte';

  let { data } = $props();
  let projects = $derived(data.projects);

  onMount(async () => {
    user.set(await loginUser());
  });

  const gotoProject = (id) => {
    window.location.href = `${base}/?id=${id}`;
  };
</script>

{#if !$user}
  Redirecting to authentication...
{:else}
  <div class="all-projects">
    <h1>All Projects</h1>
    {#each projects as project (project.id)}
      <ProjectInfoCard
        {project}
        onclick={() => gotoProject(project.id)}
        deleteProject={() => {}}
      />
    {/each}
    {#if projects.length === 0}
      <p class="empty">No projects found.</p>
    {/if}
  </div>
{/if}

<style>
  .all-projects {
    margin-left: auto;
    margin-right: auto;
    padding: 1rem;
  }

  h1 {
    padding: 2px 6px;
    border-radius: 4px;
    text-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
    line-height: 1.5;
  }

  .empty {
    color: #666;
    font-style: italic;
  }
</style>
