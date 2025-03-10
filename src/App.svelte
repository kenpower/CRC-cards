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

  let user = $state(null);
  
  const user_from_login_token = (event) => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      console.log('token found, decoding'); //decode the jwt token
      const AUTH_SERVICE_JWT_SECRET_KEY = import.meta.env.AUTH_SERVICE_JWT_SECRET_KEY;

      try {
        const user = jwt.verify(token, AUTH_SERVICE_JWT_SECRET_KEY);

        user.auth_service_id = user.user_id; //rename user_id to auth_service_id to match the database schema and avoid confusion over which id is which
        delete user.user_id;
        return user;
      } catch (error) {
        console.log('Error decoding login token:', error);
        console.log('token:', token);
      }
    }
    console.log('No token found in URL');
    console.log('url', window.location);

    return null;
};
  onMount(() => {

    const user = localStorage.getItem("user");
    
    if (!user) {
      console.log('No user found in local storage');
      const user = user_from_login_token();
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = window.location.origin;
      }
      else{
        console.log('No auth token found, redirecting to login');
        const home_url = import.meta.env.PUBLIC_URL || window.location.origin;
        const redirect_url = home_url;
        window.location.href = `https://compucore.itcarlow.ie/auth/sign_in?redirect=${redirect_url}`;
      }
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
