<script>
  import Fab, { Label, Icon } from "@smui/fab";
  import Moveable from "./Moveable.svelte";
  import CRCCardView from "./CRCCardView.svelte";
  import Draggable from "./Draggable.svelte";
  import Draggable2 from "./Draggable2.svelte";
  import { onMount } from "svelte";

  let { crcProject } = $props();

  const randomPositionNearCentreScreen = () => ({
    left: innerWidth / 2 - (-100 + Math.round(Math.random() * 100)),

    top: innerHeight / 2 - (-100 + Math.round(Math.random() * 100)),
  });

  const createCRCCard = () =>
    crcProject.addCard("New Card", randomPositionNearCentreScreen());

  const updateCardPosition = (card) => (pos) => {
    card.style.position.left = pos.left;
    card.style.position.top = pos.top;
    console.log("updateCardPosition", card);
    console.log("updateCardPosition", pos);
  };

  const updateCard = (card) => (x, y) => {
    card.style.position.left = x;
    card.style.position.top = y;
    console.log("updateCardPosition", $state.snapshot(card));
    crcProject.updateCard(card);
  };

  onMount(() => {
    console.log("CardArea mounted", crcProject);
    const newUrl = `/?id=${crcProject.base32_id}`;
    window.history.replaceState({}, "", newUrl);
  });
</script>

<div class="flexor-content card-area">
  <div class="sticky-form flexy margins">
    <Fab color="secondary-variant" onclick={createCRCCard} extended>
      <Icon class="material-icons">add_circle_outline</Icon>
      <Label>New Card</Label>
    </Fab>
  </div>

  {#each crcProject.cards as card, index}
    <!-- <Moveable
      pos={{
        left: card.style.position.left,
        top: card.style.position.top,
      }}
      updateDrag={updateCardPosition(card)}
      dropped={() => crcProject.updateCard(card)}
    >
      <CRCCardView
        bind:card={crcProject.cards[index]}
        deleteCard={() => crcProject.deleteCard(card.id)}
      />
    </Moveable> -->
    <Draggable2 dropped={updateCard(card)} {card}>
      <CRCCardView
        bind:card={crcProject.cards[index]}
        deleteCard={() => crcProject.deleteCard(card.id)}
      />
    </Draggable2>
  {/each}
</div>

<style>
  .sticky-form {
    left: 1rem;
    position: absolute;
    top: 5rem;
  }
  .flexor-content {
    flex-basis: 0;
    height: 0;
    flex-grow: 1;
    overflow: auto;
  }

  .flexy {
    display: flex;
    flex-wrap: wrap;
  }
  .card-area {
    background: linear-gradient(to left bottom, #41d8dd, #5583ee);
    /* padding: 0px; */
    /* margin: 0; */
    /* position: relative; */

    /* overflow: hidden; */
  }
</style>
