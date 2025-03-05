<script>
  import { onMount } from "svelte";
  import { DBfetchProjects } from "../lib/crcProject.svelte.js";

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

<h1>CRC Project List</h1>
<ul>
  {#each projects as project}
    <li onclick={() => setProjectId(project.id)}>
      {project.id}: {project.name}
    </li>
  {/each}
</ul>
