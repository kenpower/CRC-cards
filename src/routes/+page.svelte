<script>
  import { onMount } from "svelte";
  import {
    getProject,
    listenForProjectChanges,
    stopListeningForProjectChanges,
    deleteProject,
    DBfetchProjects,
    DBinsertProject,
  } from "$lib/crcProject.svelte.js";
  import { loginUser } from "$lib/login.js";
  import { user } from "$lib/stores.js";
  import TopBar from "../components/TopBar.svelte";
  import CardArea from "../components/CardArea.svelte";
  import ProjectList from "../components/ProjectList.svelte";

  let projectId = $state(null);
  let crcProject = $state(null);
  let projects = $state([]);

  let projectNeedsUpdate = $state(false);

  const updateProject = () => {
    projectNeedsUpdate = true;
  };

  const createNewProject = async (projectName) => {
    console.log("Creating new project with name", projectName);
    DBinsertProject({ name: projectName, owner_id: $user.id }).then(
      (newProject) => {
        console.log("New project created", newProject);
        if (newProject) {
          projectId = newProject.id;
        }
        DBfetchProjects($user.id).then((_projects) => {
          projects = _projects;
        });
      },
    );
    //TODO: what if create fails?
  };

  const gotoProject = (id) => {
    projectId = id;
  };

  $effect(() => {
    console.log("Project ID changed to", projectId);
    if (projectId != null) {
      getProject(projectId, updateProject).then((project) => {
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
      getProject(projectId, updateProject).then((project) => {
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

  onMount(async () => {
    console.log("App mounted, user is", $user);
    user.set(await loginUser());
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

{#if !$user}
  Redirecting to authentication...
{:else}
  <div class="flexy full-screen">
    <TopBar project={crcProject} user={$user} {profileIcon} {showProjectList} />

    {#if crcProject}
      <CardArea {crcProject} />
    {:else}
      <ProjectList
        {projects}
        {createNewProject}
        {gotoProject}
        {deleteProject}
      />
    {/if}
  </div>
{/if}

<style>
  .full-screen {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>
