<script>
  import { run } from "svelte/legacy";
  import Signin from "./Signin.svelte";

  import Avatar from "./components/Avatar.svelte";
  import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
  import IconButton from "@smui/icon-button";
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  import { onMount } from "svelte";
  import { supabase } from "./lib/supabase";

  import { getProject } from "./lib/crcProject.svelte.js";
  import CardArea from "./components/CardArea.svelte";

  import ProjectList from "./components/ProjectList.svelte";

  let projectId = $state(0);
  let crcProject = $state(null);

  $effect(() => {
    if (projectId != null) {
      getProject(projectId).then((project) => {
        crcProject = project;
      });
    } else {
      crcProject = null;
    }
  });

  let prominent = false;
  let dense = false;
  let secondaryColor = true;

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
</script>

<svelte:window bind:innerWidth bind:innerHeight />

{#if !google_signed_in}
  <Signin />
{:else}
  <!-- <h1>{document.title}</h1>
  <textarea bind:value={text} onkeyup={handleKeyUp}></textarea> -->
  <div class="flexy full-screen">
    <div class="top-app-bar-container flexor">
      <TopAppBar
        variant="static"
        {prominent}
        {dense}
        color={secondaryColor ? "secondary-variant" : "primary"}
      >
        <Row>
          <Section>
            <IconButton onclick={() => (projectId = null)}
              ><i class="material-icons custom-icon-button"
                >dashboard_customize</i
              ></IconButton
            >
            <Title>CRC Cards</Title>
          </Section>
          <Section align="end" toolbar>
            <IconButton class="material-icons" aria-label="Download"
              >save</IconButton
            >
            <Avatar
              width="48"
              round={true}
              userFullName={userName}
              src={profileIcon}
            />
          </Section>
        </Row>
      </TopAppBar>

      {#if crcProject}
        <CardArea {crcProject} />
      {:else}
        <ProjectList />
      {/if}
    </div>
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
  :global(body) {
    background: linear-gradient(to left bottom, #41d8dd, #5583ee);
    padding: 0px;
    margin: 0;
    position: relative;

    /* overflow: hidden; */
  }

  #stickies-container {
    padding: 0rem;
  }

  .top-app-bar-container {
    width: 100%;
    background-color: var(--mdc-theme-background, #fff);
    display: inline-block;
    position: relative;
  }

  .flexy {
    display: flex;
    flex-wrap: wrap;
  }
  .flexor {
    display: inline-flex;
    flex-direction: column;
  }

  .custom-icon-button {
    font-size: 48px; /* Controls icon size */
  }
</style>
