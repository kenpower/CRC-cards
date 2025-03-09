<script>
  import Signin from "./Signin.svelte";
  import { onMount } from "svelte";
  import { getProject, listenForProjectChanges, stopListeningForProjectChanges } from "./lib/crcProject.svelte.js";
  import TopBar from "./components/TopBar.svelte";
  import CardArea from "./components/CardArea.svelte";
  import ProjectList from "./components/ProjectList.svelte";

  let projectId = $state(null);
  let crcProject = $state(null);

  let projectNeedsUpdate = $state(false);

  const updateProject = () => {
    projectNeedsUpdate = true;
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

  let google_signed_in = $state(false);
  let userName = $state();
  let profileIcon = $state();

  let user = null;
  onMount(() => {
    const googleToken = localStorage.getItem("google-token");

    //fetchDocument();
    //listenForChanges();

    if (googleToken) {
      google_signed_in = true;
      user = JSON.parse(googleToken);
      profileIcon = user.picture;
      userName = user.name;
    }
  });

  // // Real-time subscription to listen for document changes
  // const listenForChanges = () => {
  //   const channel = supabase
  //     .channel("realtime:documents")
  //     .on(
  //       "postgres_changes",
  //       { event: "UPDATE", schema: "public", table: "documents" },
  //       (payload) => {
  //         if (payload.new.id === docId) {
  //           document = payload.new;
  //           text = document.content;
  //         }
  //         console.log("Change received!", payload);
  //       }
  //     )
  //     .subscribe();
  // };

  function handleKeyUp(event) {
    //   if (event.key === "Enter") {
    //     // Update on Enter key press
    //     console.log("Text updated:", text);
    //     document.content = text;
    //     updateDocument();
    //   } else if (event.key === "Escape") {
    //     // Undo typing on Escape key press
    //     text = document.content;
    //     console.log("Text reverted to original:", text);
    //   }
  }

  function setProjectId(value) {
    console.log("Setting project ID to", value);
    projectId = value;
  }
</script>

<svelte:window bind:innerWidth bind:innerHeight />

{#if !google_signed_in}
  <Signin />
{:else}
  <div class="flexy full-screen">
    <TopBar {userName} {profileIcon} {setProjectId} />

    {#if crcProject}
      <CardArea {crcProject} />
    {:else}
      <ProjectList bind:projectId />
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
