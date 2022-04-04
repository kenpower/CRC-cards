<script>
  import Moveable from "./components/Moveable.svelte";
  import CRCCardView from "./components/CRCCardView.svelte";
  import CRCCard from "./components/CRCCard.js";
  import { crcCards } from "./stores.js";
  import { flip } from "svelte/animate";

  let crcTitle = "";
  let crcResponsibilities = "";
  let crcCollaborators = "";

  let innerWidth;
  let innerHeight;
  
  const clean = (s) => s.replace(/<\/?[^>]+(>|$)/g, "");
  const split = (s) => s.split(/\r\n|\r|\n/g);
  
  function createCRCFromForm() {

    createCRC(
      "New Card",
      [],
      []
    );
  }

  const createCRC = (title, responsibilities, collaborators) => {
    let newCRC = new CRCCard(title, responsibilities, collaborators);

    positionSticky(newCRC);

    $crcCards = [...$crcCards, newCRC];

    console.log(crcCards);
  };


  //todo rename and be more robust
  function positionSticky(sticky) {
    sticky.left =
      innerWidth / 2 -
      // sticky.clientWidth / 2 +
      (-100 + Math.round(Math.random() * 100));
    sticky.top =
      innerHeight / 2 -
      // sticky.clientHeight / 2 +
      (-100 + Math.round(Math.random() * 100));
  }

  const updateCardPosition = (card) => {
    //partial function
    const movedCardidx = $crcCards.findIndex((c) => c.id == card.id);
    return function (left, top) {
      
      $crcCards[movedCardidx].top = top;
      $crcCards[movedCardidx].left = left;
    };
  };

  $: console.log("refresh!", $crcCards);

  $: console.log(crcCards);

  const onDrop = (event) => {
    console.log("On Drop!");
    const { card } = JSON.parse(event.dataTransfer.getData("text/plain"));
    updateCardPosition(card)(event.clientX, event.clientY);

    //$crcCards = [...$crcCards];
    // //event.target.textContent = data;
    // const movedCardidx= $crcCards.findIndex(card => card.id == data.card.id);
    // console.log($crcCards[movedCardidx]);
    // //updateCardPosition(movedCard)(event.clientX, event.clientY);
    // //todo fix this so that it updates after the card is dropped
    // //right now need a browser refresh to see new position
    // $crcCards[movedCardidx].top = event.clientY;
    // $crcCards[movedCardidx].left = event.clientX;
    // console.log($crcCards[movedCardidx]);
  };

  // const dragStart = (event, data) => {
  // 	event.dataTransfer.effectAllowed = "move";
  // 	event.dataTransfer.setData('text/plain', JSON.stringify(data));
  // }

  // 	const getStyle = (top, left) =>
  // (top && left)
  // ? `left: ${left}px; top: ${top}px; position: absolute;}`
  // : "";

  const onDragOver = (event) => {
    const dragData = event.dataTransfer.getData("text/plain");
    if (dragData) {
      const { card } = JSON.parse(event.dataTransfer.getData("text/plain"));
      updateCardPosition(card)(event.clientX, event.clientY);
    }
    return false;
  };
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<main>
  <div
    id="stickies-container"
    class="full-screen"
    on:dragover|preventDefault={onDragOver}
    on:drop|preventDefault={onDrop}
  >
    {#each $crcCards as card}
      <Moveable
        pos={{ left: card.left, top: card.top }}
        updateDrag={updateCardPosition(card)}
      >
        <CRCCardView {card} />
      </Moveable>
    {/each}
  </div>

  <div class="sticky-form">
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

  .full-screen {
    min-height: 100vh;
  }
</style>
