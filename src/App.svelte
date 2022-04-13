<script>
  import Fab, { Label, Icon } from '@smui/fab';
  import Moveable from "./components/Moveable.svelte";
  import CRCCardView from "./components/CRCCardView.svelte";
  import CRCCard from "./components/CRCCard.js";
  import { crcCards } from "./stores.js";
  import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
  import IconButton from '@smui/icon-button';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';



  let prominent = false;
  let dense = false;
  let secondaryColor = true;

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

</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="flexy full-screen ">
  <div class="top-app-bar-container flexor">
    <TopAppBar
      variant="static"
      {prominent}
      {dense}
      color={secondaryColor ? 'secondary-variant' : 'primary'}
    >
    <Row>
      <Section>
        <IconButton class="material-icons">menu</IconButton>
        <Title>Flex Static</Title>
      </Section>
      <Section align="end" toolbar>
        <IconButton class="material-icons" aria-label="Download"
          >file_download</IconButton
        >
        <IconButton class="material-icons" aria-label="Print this page"
          >print</IconButton
        >
        <IconButton class="material-icons" aria-label="Bookmark this page"
          >bookmark</IconButton
        >
      </Section>
    </Row>
    </TopAppBar>

 
      <div
        class="flexor-content">
          <div class="sticky-form flexy margins">
            <Fab color="secondary-variant" on:click={createCRCFromForm} extended>
              <Icon class="material-icons">add_circle_outline</Icon>
              <Label>New Card</Label>
            </Fab>
          </div>
          {#each $crcCards as card}
            <Moveable
              pos={{ left: card.left, top: card.top }}
              updateDrag={updateCardPosition(card)}
            >
              <CRCCardView bind:card />
            </Moveable>
          {/each}
      </div>

      <!-- <div class="sticky-form">
        <button class="button" id="createsticky" on:click={createCRCFromForm}
          >New Card!</button
        >
      -->



  </div>
</div>

<svelte:head>
  <!-- Fonts -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
  />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
  />

  <!-- Material Typography -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/@material/typography@13.0.0/dist/mdc.typography.css"
  />

  <!-- SMUI -->
  <link rel="stylesheet" href="https://unpkg.com/svelte-material-ui/bare.css" />
</svelte:head>
<style>
  :global(html) {
    box-sizing: border-box;
    font-family: "Courier New", Courier, monospace;
  }
  :global(body) {
    background: linear-gradient(to left bottom, #41d8dd, #5583ee);
    padding: 0px;
    margin: 0;
    position: relative;
    
    /* overflow: hidden; */
  }
  #stickies-container {
    padding: 0rem;
  }

  .sticky-form {
    left: 1rem;
    position: absolute;
    top: 5rem;
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
    font-size: 2rem;
    font-weight: 600;
    line-height: 1.5;
    padding: 0.375rem 0.75rem;
    text-align: center;
    user-select: none;
    vertical-align: middle;
  }

  .top-app-bar-container {
    width: 100%;
		background-color: var(--mdc-theme-background, #fff);
    display: inline-block;
    position: relative;
  }

  .flexy {
    display: flex;
    flex-wrap: wrap;
  }
  .flexor {
    display: inline-flex;
    flex-direction: column;
  }
  .flexor-content {
    flex-basis: 0;
    height: 0;
    flex-grow: 1;
    overflow: auto;
  }
</style>
