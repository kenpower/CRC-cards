<script>
  import Menu from '@smui/menu';
  import List, { Item, Separator, Text, PrimaryText, SecondaryText } from '@smui/list';
  import {user} from "../lib/stores.js";


  let menu;
  let anchor;
  /**
   * @typedef {Object} Project
   * @property {string} name - Project name
   * @property {string} secondaryInfo - Secondary information (e.g., description)
   * @property {string} owner - Project owner
   * @property {number} cardCount - Number of cards in the project
   * @property {string} lastEdit - Date of most recent edit (ISO string or formatted date)
   */

  /** @type {Project} */
  let { project, onclick, deleteProject } = $props();

  // Format the last edit date for display
  let formattedLastEdit = $derived(
    project.lastEdit
      ? new Date(project.lastEdit).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : ""
  );



  let deleteMenuEnabled = $derived( $user?.id == project.owner_id);

  $effect(() => {
    if (menu) {
      console.log("Menu is bound:", menu);
    }
    if (anchor) {
      console.log("Anchor is bound:", anchor);
    }
  });

  // Function to open and position the menu
  function openMenu(e) {
    e.stopPropagation();
    if (menu && anchor) {
      menu.setOpen(true);
      // Use setTimeout to ensure the menu is rendered before positioning
      setTimeout(() => {
        const menuEl = menu.getElement();// Access the DOM element of the menu
        const anchorRect = anchor.getBoundingClientRect(); // Get button's position
        // Position the menu to the right of the button
        console.log("Menu:", menuEl);
        menuEl.style.position = 'absolute';
        menuEl.style.left = `${anchorRect.left}px`; // 10px right of button
        menuEl.style.top = `${anchorRect.top}px`; // Align with button top
        console.log("Menu positioned at:", menuEl.style.left, menuEl.style.top);
      }, 0);
    } else {
      console.error("Menu or anchor not initialized:", { menu, anchor });
    }
    console.log("Project:", $state.snapshot(project));
    console.log("User:",$user); 
    console.log("Delete enabled:", deleteMenuEnabled);

  }

  function deleteHandler() {
    if (menu) {
      menu.setOpen(false);
    }
    deleteProject(project.id) 
  } 
</script>

<div role="button" tabindex="0" class="project-card" {onclick} >
  <div class="card-content">
    <i class="material-symbols-outlined project_icon">note_stack</i>
    <div class="text-content">
      <h3 class="project-name">{project.name}</h3>

      <p class="details">
        Owner: {project.users?.display_name ?? 'Unknown'} | Cards: {project.cardCount} 
      </p>
    </div>
    <span>
    <button bind:this={anchor} onclick={(e) => openMenu(e)}>
      <i class="material-symbols-outlined">more_horiz</i>
    </button>

    </span>
  </div>
  

</div>
<div class = "menu_container">
<Menu bind:this={menu} anchor={false} anchorElement={anchor}  anchorCorner="TOP_END"
quick={true}>
  <List>
    <Item onSMUIAction={() => (alert("Cut"))} disabled>
      <Text>Share</Text>
    </Item>
    <Item onSMUIAction={() => (alert("Cut"))} disabled>
      <Text>Clone</Text>
    </Item>
    <Item onSMUIAction={() => (alert("Cut"))} disabled>
      <Text>Export</Text>
    </Item>
    <Separator />
    <Item  onSMUIAction={deleteHandler} disabled = {!deleteMenuEnabled} class = "delete">
      <Text>
        <PrimaryText>Delete</PrimaryText>
        <SecondaryText class = "delete">Remove project forever</SecondaryText>
      </Text>
      <i class="material-symbols-outlined delete">delete</i>
    </Item>
  </List>
</Menu>

</div>

<style>
  .project-card {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 0.5rem;
    margin: 0.5rem 0;
    display: flex;
    align-items: center;
    max-width: 40rem; /* Adjust based on design needs */
    min-width: 30rem;
    overflow: hidden;
    border: 1px solid #e0e0e0;
    box-shadow: 0px 8px 8px 0px rgba(33, 36, 44, 0.08);
  }

  .card-content {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 0.5rem;
  }

  .icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }

  .text-content {
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .project-name {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .secondary-info {
    margin: 0.25rem 0 0;
    font-size: 0.9rem;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .details {
    margin: 0.25rem 0 0;
    font-size: 0.8rem;
    color: #777;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ellipsis {
    font-size: 2rem;
    color: #666;
    margin-left: 0.5rem;
    flex-shrink: 0;
  }

  .project_icon {
    font-size: 3rem;
    font-variation-settings:
      "FILL" 0,
      /* 0 = outlined, 1 = filled */ "wght" 700,
      /* Weight (100 to 700) */ "GRAD" 0,
      /* Gradient (-50 to 200) */ "opsz" 80; /* Optical size (20 to 48) */
  }

  .material-symbols-outlined {
    color: #333;
  }

  .menu_container{
    text-align: left; 
  }

  /* Accessing the class with "*" in front limits
    the scope to anything under this component's
    elements. */
  * :global(.delete) {
    color: red;
  }
</style>
