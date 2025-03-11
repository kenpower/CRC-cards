<script>
  import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
  import IconButton from "@smui/icon-button";
  import Avatar from "./Avatar.svelte";
  import ProfileCircle from "./ProfileCircle.svelte";

  var { showProject, user, profileIcon = null } = $props();

  let prominent = false;
  let dense = false;
  let secondaryColor = true;
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
        <IconButton onclick={() => showProject(null)}>
          <i class="material-icons custom-icon-button">dashboard_customize</i>
        </IconButton>
        <Title>CRC Cards</Title>
      </Section>
      <Section align="end" toolbar>
        <IconButton class="material-icons" aria-label="Download"
          >save</IconButton
        >
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
