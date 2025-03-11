<script>
  import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
  import IconButton from "@smui/icon-button";
  import Avatar from "./Avatar.svelte";
  import ProfileCircle from "./ProfileCircle.svelte";


  var { project, showProjectList, user, profileIcon = null } = $props();

  let prominent = false;
  let dense = false;
  let secondaryColor = true;

  let projectName = $derived(project ? project.name : "No project selected");

  $inspect(project, "project");
  $inspect(projectName, "projectName");

</script>

<div class="top-app-bar-container flexor">
  <TopAppBar
    variant="static"
    {prominent}
    {dense}
    color={secondaryColor ? "secondary-variant" : "primary"}
  >
    <Row>
      <Section>
        <IconButton onclick={showProjectList}>
          <i class="material-icons custom-icon-button">dashboard_customize</i>
        </IconButton>
        <Title>Project: {projectName}</Title>
      </Section>
      <Section align="end" toolbar>

        {#if profileIcon}
          <Avatar
            width="48"
            round={true}
            userFullName={userName}
            src={profileIcon}
          />
        {:else}
          <ProfileCircle  fullname={user.display_name} forename={user.foreanme} surname={user.surname} email={user.email}/>
        {/if}
      </Section>
    </Row>
  </TopAppBar>
</div>

<style>
  .top-app-bar-container {
    width: 100%;
    background-color: var(--mdc-theme-background, #fff);
    display: inline-block;
    position: relative;
  }
  .flexor {
    display: inline-flex;
    flex-direction: column;
  }
  .custom-icon-button {
    font-size: 48px; /* Controls icon size */
  }
</style>
