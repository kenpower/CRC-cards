<script>
  import { onMount } from "svelte";
  import { DBfetchProjects } from "../lib/crcProject.svelte.js";
  import ProjectInfoCard from "./ProjectInfoCard.svelte";
  import AddProjectModal from "./AddProjectModal.svelte";



  var { createNewProject } = $props();

  var projects = $state([]);

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
    projectId = id;
  };

  onMount(async () => {
    projects = await DBfetchProjects();
  });
</script>

<main>
  <h1>Existing CRC Card Projects</h1>
  {#each projects as project}
    <ProjectInfoCard {project} onclick={() => setProjectId(project.id)} />
  {/each}
  <button id="add_button" on:click={openNewProjectModal}>
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
