<script>
  import { fade } from "svelte/transition";
  /**
   * @typedef {Object} Props
   * @property {boolean} isOpen - Whether the modal is open
   * @property {function} onSubmit - Callback for when the user submits the form (receives project name)
   * @property {function} onCancel - Callback for when the user cancels
   */

  /** @type {Props} */
  let { isOpen = $bindable(false), onSubmit, onCancel } = $props();

  let projectName = $state(""); // State for the project name input
  let dialogRef = $state(null); // Reference to the dialog element

  // Open the dialog when isOpen becomes true
  $effect(() => {
    if (isOpen && dialogRef) {
      dialogRef.showModal(); // Native method to open the dialog as a modal
    } else if (!isOpen && dialogRef) {
      dialogRef.close(); // Native method to close the dialog
    }
    console.log("isOpen changed to", isOpen);
    console.log("dialogRef", dialogRef);
  });

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    if (projectName.trim()) {
      onSubmit(projectName.trim());
      projectName = ""; // Reset input
      isOpen = false; // Close modal
    }
  }

  // Handle cancel (either via button or dialog close)
  function handleCancel() {
    projectName = ""; // Reset input
    onCancel(); // Call cancel callback
    isOpen = false; // Close modal
  }

  // Handle dialog close (e.g., Esc key or clicking outside)
  function handleDialogClose() {
    handleCancel();
  }
</script>

<dialog
  bind:this={dialogRef}
  onclose={handleDialogClose}
  class="modal-dialog"
  transition:fade={{ duration: 200 }}
>
  <form method="dialog" onsubmit={handleSubmit}>
    <h2>Add New Project</h2>
    <label for="project-name">Project Name</label>
    <input
      type="text"
      id="project-name"
      bind:value={projectName}
      placeholder="Enter project name"
      class="project-name-input"
    />
    <div class="modal-actions">
      <button type="button" onclick={handleCancel} class="cancel-btn">
        Cancel
      </button>
      <button type="submit" class="ok-btn" disabled={!projectName.trim()}>
        OK
      </button>
    </div>
  </form>
</dialog>

<style>
  .modal-dialog {
    border: none;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    width: 100%;
    max-width: 400px;
    background: #ffffff;
  }

  .modal-dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }

  h2 {
    margin: 0 0 1rem;
    font-size: 1.5rem;
    color: #333;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    color: #555;
  }

  .project-name-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    margin-bottom: 1rem;
    box-sizing: border-box;
  }

  .project-name-input:focus {
    outline: none;
    border-color: #41d8dd;
    box-shadow: 0 0 4px rgba(65, 216, 221, 0.5);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .cancel-btn,
  .ok-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }

  .cancel-btn {
    background: #f0f0f0;
    color: #333;
  }

  .cancel-btn:hover {
    background: #e0e0e0;
  }

  .ok-btn {
    background: #41d8dd;
    color: white;
  }

  .ok-btn:hover {
    background: #5583ee;
  }

  .ok-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
</style>
