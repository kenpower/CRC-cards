<script>

  /**
   * @typedef {Object} Props
   * @property {string} [text]
   * @property {any} edit
   * @property {string} [classes]
   */

  /** @type {Props} */
  let { text = $bindable(""), edit, classes = "" } = $props();

  let originalText = $state(text);
  let is_editing = false;

  function handleKeyUp(event) {
    if (event.keyCode === 13) {
      //event.preventDefault();
      event.target.blur();
    }
    if (event.keyCode === 27) {
      text = originalText;
      event.preventDefault();
      event.target.blur();
    }
  }
</script>

<input
  type="text"
  class={"editable " + classes}
  contenteditable="true"
  class:is_editing
  class:empty={!text}
  bind:value={text}
  onchange={(e) =>
    console.log(e, text != originalText && edit(e.target.value))}
  onkeyup={handleKeyUp}
  onfocus={() => (originalText = text)}
/>

<style>
  input {
    display: block;
    cursor: text;
    background-color: transparent;
    border: none;
    padding: 0.1rem;
    margin: 0;
    border: 0 none;
  }
input:hover {
    font-weight: 600;
}
  

  .empty {
    color: #777;
    /* visibility: hidden; */
  }
  .empty:hover,
  .empty:focus {
    visibility: visible;
  }

  input:focus {
    background-color: azure;
    box-shadow: inset 0 0 0 1px teal;
    border: 0 none !important;
    outline-style: none;
  }
</style>
