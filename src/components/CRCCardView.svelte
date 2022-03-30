<script>
  import { crcCards } from "../stores.js";
  import MemberList from "./MemberList.svelte";
  import EditableText from "./EditableText.svelte";

  export let card;

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

  const addCollaborator = (newCollaborator) => {
    card.collaborators = [...card.collaborators, newCollaborator];
    refresh();
  };

  const save = (newTitle) => {
    card.title = newTitle;
    $crcCards = $crcCards;
  };
</script>

<div class="card">
  <span class="delete" on:click={deleteCard}>&times;</span>
  <div class="title-area">
    <EditableText text={card.title} edit={save} classes="title" />
  </div>
  <div class="body">
    <MemberList
      halfCard={card.responsibilities}
      newMemberPlaceholder={"+responsibility"}
      {save}
    />
    <div class="vline" />
    <MemberList
      halfCard={card.collaborators}
      newMemberPlaceholder={"+collaborator"}
      {save}
    />
  </div>
</div>

<style>
  .card {
    user-select: none;
    display: inline-block;
    padding: 1rem;
    background: linear-gradient(to left bottom, #d4fc78, #99e5a2);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    color: #00243f;
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
</style>
