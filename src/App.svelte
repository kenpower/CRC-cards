<script>
  import Signin from "./Signin.svelte";
  import { onMount } from "svelte";
  import { getProject, listenForProjectChanges, stopListeningForProjectChanges } from "./lib/crcProject.svelte.js";
  import {loginUser} from "./lib/login.js";
  import TopBar from "./components/TopBar.svelte";
  import CardArea from "./components/CardArea.svelte";
  import ProjectList from "./components/ProjectList.svelte";

  import { DBinsertProject } from "./lib/crcProject.svelte.js";

  let projectId = $state(null);
  let crcProject = $state(null);

  let projectNeedsUpdate = $state(false);

  const updateProject = () => {
    projectNeedsUpdate = true;
  };

  const createNewProject = async (projectName) => {
    console.log("Creating new project with name", projectName);
    const newProject = await DBinsertProject({ name: projectName , owner_id: user.id});
    console.log("New project created", newProject);
    if (newProject) {
      projectId = newProject.id;
    }
  };

  const gotoProject = (id) => {
    projectId = id;
  };

  $effect(() => {
    console.log("Project ID changed to", projectId);
    if (projectId != null) {
      getProject(projectId, updateProject)
        .then((project) => {
          console.log("Project fetched", project);
          listenForProjectChanges(projectId, updateProject);
          crcProject = project;
        });
    } else {
      crcProject = null;
      stopListeningForProjectChanges();
    }
  });

  $effect(() => {
    console.log("Project updated");
    if (projectNeedsUpdate) {
      getProject(projectId, updateProject)
        .then((project) => {
          console.log("Project fetched", project);
          crcProject = project;
          projectNeedsUpdate = false;
        });
    }
  });

  let innerWidth = $state();
  let innerHeight = $state();

  const clean = (s) => s.replace(/<\/?[^>]+(>|$)/g, "");
  const split = (s) => s.split(/\r\n|\r|\n/g);


  let userName = $state();
  let profileIcon = $state();

  let user = $state(null);
  
  
  onMount(async () => {

    console.log("App mounted, user is", user);
    user = await loginUser();
    if (user) {
      console.log("User logged in", user);
      userName = user.name;
      profileIcon = user.profileIcon;
    }
   


  });

  function setProjectId(value) {
    console.log("Setting project ID to", value);
    projectId = value;
  }

</script>

<svelte:window bind:innerWidth bind:innerHeight />

{#if !user}
  Redirecting to authentication...
{:else}
  <div class="flexy full-screen">
    <TopBar {user} {profileIcon} {setProjectId} />

    {#if crcProject}
      <CardArea {crcProject} />
    {:else}
      <ProjectList {createNewProject} {gotoProject}/>
    {/if}
  </div>
{/if}

<svelte:head>
  <!-- Fonts -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
  />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
  />

  <!-- Material Typography -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/@material/typography@13.0.0/dist/mdc.typography.css"
  />

  <!-- SMUI -->
  <link rel="stylesheet" href="https://unpkg.com/svelte-material-ui/bare.css" />
</svelte:head>

<style>
  :global(html) {
    box-sizing: border-box;
    font-family: "Courier New", Courier, monospace;
  }

  .full-screen {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>
