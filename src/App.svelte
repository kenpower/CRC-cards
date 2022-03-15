<script>
  let isDragging = false;
  let dragTarget;
  let draggedSticky = null;

  let lastOffsetX = 0;
  let lastOffsetY = 0;

  let stickies = {};

  let stickyTitle = "";
  let stickyText = "";

  let innerWidth;
  let innerHeight;

  function createStickyFromForm() {
    createSticky(
      stickyTitle.replace(/<\/?[^>]+(>|$)/g,""),
      stickyText
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/\r\n|\r|\n/g,"<br />")
    ) 
    clearStickyForm();
  }  
  
  function createSticky(title, text) {
    let id = self.crypto.randomUUID();
    let newSticky = {};

    newSticky.html = `<h3>${title}</h3><p>${text}</p><span class="deletesticky">&times;</span>`;

    newSticky.style = {};
    positionSticky(newSticky);
    newSticky.id = id;
    stickies[id] = newSticky;
    stickies = stickies;
    console.log(stickies);

  }

  function clearStickyForm() {
    stickyTitle = "";
    stickyText = "";
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

  function mousedown(e) {
    console.log(e);
    if (!e.target.classList.contains("drag")) {
      return;
    }
    dragTarget = e.target;
    dragTarget.parentNode.append(dragTarget);
    lastOffsetX = e.offsetX;
    lastOffsetY = e.offsetY;
    // console.log(lastOffsetX, lastOffsetY);
    isDragging = true;
    draggedSticky = stickies[dragTarget.id];
  }

  function drag(e) {
    if (!isDragging) return;

    console.log(lastOffsetX);
    
    draggedSticky.left = e.clientX - lastOffsetX;
    draggedSticky.top = e.clientY - lastOffsetY;

    stickies = stickies;
    console.log(draggedSticky.left);
  }

  function mouseup() {
    if (!isDragging) return;

    isDragging = false;
    dragTarget.parentNode.append(dragTarget);
  }

  createSticky("Hello", "World"); 
</script>

<svelte:window
  bind:innerWidth
  bind:innerHeight
  on:mousedown={mousedown}
  on:mousemove={drag}
  on:mouseup={mouseup}
/>

<main>
  <div id="stickies-container">
    {#each Object.values(stickies) as sticky}
      <div
        class="drag sticky"
        style="left: {sticky.left}px; top: {sticky.top}px;"
        id={sticky.id}
      >
        {@html sticky.html}
        <span class="deletesticky">&times;</span>
      </div>
    {/each}
  </div>
  <div class="sticky-form">
    <label for="stickytitle">Class Name</label>
    <input
      type="text"
      name="stickytitle"
      id="stickytitle"
      bind:value={stickyTitle}
    />
    <label for="stickytext">Responsibilities</label>
    <textarea
      name="stickytext"
      id="stickytext"
      cols="24"
      rows="10"
      bind:value={stickyText}
    />
    <button class="button" id="createsticky" on:click={createStickyFromForm}
      >Stick it!</button
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
  .drag {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .sticky {
    background: linear-gradient(to left bottom, #d4fc78, #99e5a2);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    color: #00243f;
    /* 0 0 150px rgba(0, 0, 0, 0.2); */
    cursor: grab;
    display: inline-block;
    padding: 1rem;
    position: absolute;
    width: 12.5rem;
  }
  .sticky h3,
  .sticky p {
    /* color: #0065b3; */
    color: #00243f;
    pointer-events: none;
  }
  .sticky h3 {
    border-bottom: dashed 2px #0085e8;
    margin: 0 0 1rem;
    min-height: 1.3rem;
    padding: 0 1.5rem 0.25rem 0;
  }
  .sticky p {
    margin: 0;
    min-height: 9rem;
  }
  .sticky .deletesticky {
    color: #0085e8;
    cursor: pointer;
    font-size: 2rem;
    position: absolute;
    right: 0.8rem;
    top: 0.4rem;
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
