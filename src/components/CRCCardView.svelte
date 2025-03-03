<script>
  import { createBubbler, stopPropagation } from "svelte/legacy";

  const bubble = createBubbler();
  import { crcCards } from "../stores.js";
  import { onMount } from "svelte";
  import MemberListView from "./MemberListView.svelte";
  import EditableText from "./EditableText.svelte";

  let { card = $bindable() } = $props();

  const deleteCard = () => {
    $crcCards = $crcCards.filter((c) => c !== card);
  };

  // const removeEmpty = list => list.filter(s => s && s.trim() !== "");

  // const updateCard = _ =>  {
  //     console.log("update card");
  //     card.responsibilities = removeEmpty(card.responsibilities)
  //     card.collaborators = removeEmpty(card.collaborators)
  //     refresh();
  // }

  // const addResponsibility = (newResponsibility) => {
  //     card.responsibilities = [...card.responsibilities, newResponsibility]
  //     refresh();
  // }

  // const addCollaborator = (newCollaborator) => {
  //   card.collaborators = [...card.collaborators, newCollaborator];
  //   refresh();
  // };

  // const save = (newTitle) => {
  //   // if(newTitle) card.title = newTitle;
  //   // $crcCards = $crcCards;
  // };
</script>

<div class="card">
  <div
    class="ignore-pointer-down"
    onpointerdown={stopPropagation(bubble("pointerdown"))}
  >
    <span class="delete" onclick={deleteCard}>&times;</span>
    <div class="title-area">
      <EditableText bind:text={card.name} classes="title" />{card.id}
    </div>
    <div class="body">
      <MemberListView
        bind:items={card.responsibilities}
        newMemberPlaceholder={"+responsibility"}
      />
      <div class="vline"></div>
      <MemberListView
        bind:items={card.collaborators}
        newMemberPlaceholder={"+collaborator"}
      />
    </div>
  </div>
</div>

<style>
  .card {
    user-select: none;
    display: inline-block;
    padding: 2rem;
    background: linear-gradient(to left bottom, #d4fc78, #99e5a2);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    color: #00243f;
    box-sizing: border-box;
    background-clip: padding-box;
    border-radius: 0.5rem;
  }

  .card:hover,
  .card:active {
    border: 2rem solid #99e5a2dd;
    padding: 0;
  }

  .delete {
    color: #0085e8;
    cursor: pointer;
    font-size: 2rem;
    position: absolute;
    right: 0.4rem;
    top: -0.5rem;
  }

  .card .title-area {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :global(.title) {
    text-align: center;
    cursor: text;
    margin: 0rem;
    font-size: 2rem;
    font-weight: 700;
    display: block;
  }

  .card .body {
    display: flex;
    gap: 1rem;
    padding-top: 1rem;
  }

  .vline {
    display: inline-block;
    border-left: 1px solid black;
    width: 0px;
  }

  .ignore-pointer-down {
    cursor: default;
  }
</style>
