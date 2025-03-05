<script>
  import { onMount } from "svelte";
  import { DBfetchProjects } from "../lib/crcProject.svelte.js";
  import ProjectInfoCard from "./ProjectInfoCard.svelte";

  var { projectId = $bindable() } = $props();

  var projects = $state([]);

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
</main>

<style>
  main {
    margin-left: auto;
    margin-right: auto;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    cursor: pointer;
    padding: 0.5rem;
    margin: 0.5rem 0;
    background-color: #f0f0f0;
    border-radius: 8px;
  }
</style>
