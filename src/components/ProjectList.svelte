<script>
  import { onMount } from "svelte";
  import ProjectInfoCard from "./ProjectInfoCard.svelte";
  import AddProjectModal from "./AddProjectModal.svelte";
  import { fade } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  var { projects, createNewProject, gotoProject, deleteProject : dBDeleteProject } = $props();

  const deleteProject = async (id) => {
    console.log("Deleting project with id", id);
    projects = projects.filter((p) => p.id !== id);
    dBDeleteProject(id);
    //TODO: what if delete fails?
  };

  let isNewProjectModalOpen = $state(false);

  const openNewProjectModal = () => {
    console.log("Opening new project modal");
    isNewProjectModalOpen = true;
  };

  $effect(() => {
    console.log("isNewProjectModalOpen changed", isNewProjectModalOpen);
  });

  const handleNewProjectSubmit = async (name) => {
    createNewProject(name);
    isNewProjectModalOpen = false;
  };

  const setProjectId = (id) => {
    console.log("Setting project ID to", id);
    gotoProject(id);
  };

  onMount(async () => {
  });
</script>

<main>
  <h1>Projects</h1>
  {#each projects as project (project.id)}
  <div animate:flip transition:fade>
        <ProjectInfoCard {project} onclick={() => setProjectId(project.id)} {deleteProject}  />
  </div>
  {/each}
  <button id="add_button" onclick={openNewProjectModal}>
    <i class="material-symbols-outlined project_icon">add_box</i>
    New CRC Card Project
  </button>
</main>
<AddProjectModal
  bind:isOpen={isNewProjectModalOpen}
  onSubmit={handleNewProjectSubmit}
  onCancel={() => {}}
/>

<style>
  main {
    margin-left: auto;
    margin-right: auto;
  }
  h1 {
    padding: 2px 6px;
    border-radius: 4px; /* Soft rounded edges */
    text-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
    display: inline;
    line-height: 1.5;
  }
  #add_button {
    display: flex;
    align-items: center;
    float: right;
    background-color: "secondary-variant";
  }
</style>
