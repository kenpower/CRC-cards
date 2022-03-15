<script>
  import Draggable from './components/Draggable.svelte';
  import CRCCard from './components/CRCCard.svelte';
  
  let crcCards = {};

  let crcTitle = "";
  let crcResponsibilities = "";
  let crcCollaborators = "";

  let innerWidth;
  let innerHeight;

  function createCRCFromForm() {
    const clean = s => s.replace(/<\/?[^>]+(>|$)/g,"");
    const split = s => s.split(/\r\n|\r|\n/g);

    createCRC(
      clean(crcTitle),
      split(clean(crcResponsibilities)),
      split(clean(crcCollaborators))
    ) 
    clearNewCRCForm();
  }  
  
  function createCRC(title, responsibilities, collaborators) {
    let id = self.crypto.randomUUID();
    let newCRC = {};
    
    newCRC.id = id;
    newCRC.title = title;
    newCRC.collaborators = collaborators;
    newCRC.responsibilities = responsibilities;

    positionSticky(newCRC);
    crcCards[id] = newCRC;

    crcCards = crcCards;
    console.log(crcCards);
  }

  function clearNewCRCForm() {
    //crcTitle = "";
    //crcText = "";
  }

  function positionSticky(sticky) {
    sticky.left =
      innerWidth / 2 -
      // sticky.clientWidth / 2 +
      (-100 + Math.round(Math.random() * 50));
    sticky.top =
      innerHeight / 2 -
      // sticky.clientHeight / 2 +
      (-100 + Math.round(Math.random() * 50));
  }

  const updateDrag = _ => crcCards = crcCards;
  

  createCRC("ClassA", ["Responsibility1", "Responsibility1"], ["Collaborator1", "Collaborator2"]);
  createCRC("ClassB", ["Responsibility1", "Responsibility1"], ["Collaborator1", "Collaborator2"]);

</script>

<svelte:window
  bind:innerWidth
  bind:innerHeight
/>

<main>
  <div id="stickies-container">
    {#each Object.values(crcCards) as card}
      <Draggable containedElement={card} {updateDrag}>
        <CRCCard 
          title = {card.title} 
          responsibilities = {card.responsibilities}
          collaborators = {card.collaborators}
        />
      </Draggable>
    {/each}
  </div>
  <div class="sticky-form">
    <label for="stickytitle">Class Name</label>
    <input
      type="text"
      name="stickytitle"
      id="stickytitle"
      bind:value={crcTitle}
    />
    <label for="stickytext">Responsibilities</label>
    <textarea
      name="stickytext"
      id="stickytext"
      cols="24"
      rows="5"
      bind:value={crcResponsibilities}
    />
    <label for="stickytext">Collaborators</label>
    <textarea
      name="stickytext"
      id="stickytext"
      cols="24"
      rows="5"
      bind:value={crcCollaborators}
    />
    <button class="button" id="createsticky" on:click={createCRCFromForm}
      >New Card!</button
    >
  </div>
</main>

<style>
  :global(html) {
    box-sizing: border-box;
    font-family: "Courier New", Courier, monospace;
  }
  :global(body) {
    background: linear-gradient(to left bottom, #41d8dd, #5583ee);
    min-height: 100vh;
    height: 100%;
    margin: 0;
    position: relative;
    /* overflow: hidden; */
  }
  #stickies-container {
    padding: 1rem;
  }

  .sticky-form {
    bottom: 1rem;
    position: absolute;
    right: 1rem;
  }
  .sticky-form label,
  .sticky-form input,
  .sticky-form textarea {
    color: #fff;
    display: block;
  }
  .sticky-form input,
  .sticky-form textarea {
    background-color: #f0f9ff44;
    background-clip: padding-box;
    border: 2px dashed #0065b3;
    border-radius: 0.25rem;
    color: #00243f;
    font-family: "Courier New", Courier, monospace;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    margin-bottom: 0.75rem;
    padding: 0.375rem 0.75rem;
    width: calc(100% - 1.5rem);
  }
  .sticky-form input:focus,
  .sticky-form textarea:focus {
    border: 2px dashed #ffffff;
    outline: none;
  }
  button.button {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    background-color: #d4fc78;
    border-radius: 0.25rem;
    border: 1px solid transparent;
    color: #0065b3;
    display: inline-block;
    font-family: "Courier New", Courier, monospace;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5;
    padding: 0.375rem 0.75rem;
    text-align: center;
    user-select: none;
    vertical-align: middle;
  }
</style>
