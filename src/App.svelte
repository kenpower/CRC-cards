<script>
  import Signin from "./Signin.svelte";
  import { onMount } from "svelte";
  import { setContext } from 'svelte';
  import { getProject, listenForProjectChanges, stopListeningForProjectChanges, deleteProject , DBfetchProjects} from "./lib/crcProject.svelte.js";
  import {loginUser} from "./lib/login.js";
  import {user} from "./lib/stores.js";
  import TopBar from "./components/TopBar.svelte";
  import CardArea from "./components/CardArea.svelte";
  import ProjectList from "./components/ProjectList.svelte";

  import { DBinsertProject } from "./lib/crcProject.svelte.js";

  let projectId = $state(null);
  let crcProject = $state(null);
  let projects= $state([]);

  let projectNeedsUpdate = $state(false);
  
  const updateProject = () => {
    projectNeedsUpdate = true;
  };

  const createNewProject = async (projectName) => {
    console.log("Creating new project with name", projectName);
    DBinsertProject({ name: projectName , owner_id: $user.id})
      .then((newProject) => {  
        console.log("New project created", newProject);
        if (newProject) {
          projectId = newProject.id;
        }
        DBfetchProjects($user.id).then((_projects) => {
          projects = _projects;
        });
    });
    //TODO: what if create fails?
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

  let userName = $state();
  let profileIcon = $state();

  //let user = $state(null);
  //setContext('user', user); 
  
  onMount(async () => {
    
    console.log("App mounted, user is", $user);
    $user = await loginUser();
    if ($user) {
      console.log("User logged in", $user);
      userName = $user.name;
      profileIcon = $user.profileIcon;
      projects = await DBfetchProjects($user.id);

    }
  });

  function showProjectList() {
    console.log("Setting project ID to", null);
    crcProject = null;
    projectId = null;
  }


  $inspect(crcProject, "crcProject");

</script>

<svelte:window bind:innerWidth bind:innerHeight />

{#if !user}
  Redirecting to authentication...
{:else}
  <div class="flexy full-screen">
    <TopBar project={crcProject} {user} {profileIcon} {showProjectList} />

    {#if crcProject}
      <CardArea {crcProject} />
    {:else}
      <ProjectList {projects} {createNewProject} {gotoProject} {deleteProject}/>
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
