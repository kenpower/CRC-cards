<script>
  /**
   * @typedef {Object} Project
   * @property {string} name - Project name
   * @property {string} secondaryInfo - Secondary information (e.g., description)
   * @property {string} owner - Project owner
   * @property {number} cardCount - Number of cards in the project
   * @property {string} lastEdit - Date of most recent edit (ISO string or formatted date)
   */

  /** @type {Project} */
  let { project, onclick } = $props();

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
</script>

<div role="button" class="project-card" {onclick}>
  <div class="card-content">
    <i class="material-symbols-outlined project_icon">note_stack</i>
    <div class="text-content">
      <h3 class="project-name">{project.name}</h3>

      <p class="details">
        Owner: {project.owner} | Cards: {project.cardCount} | Last Edit: {formattedLastEdit}
      </p>
    </div>
    <i class="material-symbols-outlined">more_horiz</i>
  </div>
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
    width: 100%;
    max-width: 40rem; /* Adjust based on design needs */
    min-width: 20rem;
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
</style>
