<script>
    import { crcCards } from "../stores.js"
    import MemberList from "./MemberList.svelte"

    export let card;

    let newCollaborator;

    const deleteCard = () => {
        $crcCards = $crcCards.filter(c => c !== card);
    }

    const removeEmpty = list => list.filter(s => s.trim() !== "");

    const updateCard = _ =>  {
        card.responsibilities = removeEmpty(card.responsibilities)
        card.collaborators = removeEmpty(card.collaborators)
        refresh();
    }

    const addResponsibility = (newResponsibility) => {
        card.responsibilities = [...card.responsibilities, newResponsibility]
        refresh();
    }
    
    const addCollaborator = _ => {
        card.collaborators = [...card.collaborators, newCollaborator]
        refresh();
    }
    
    const refresh = _ => { 
        newCollaborator = "";

        $crcCards = $crcCards;
    }

    refresh();
</script>

<div class = "card" >
    <span class="delete" on:click="{deleteCard}">&times;</span>
    <div class="title">
        <h1 
            class="editable" contenteditable="true" bind:textContent={card.title} on:input="{updateCard}"
        ></h1>
    </div>
    <div class = "body">
        <MemberList 
            members={card.responsibilities}
            newMemberPlaceholder={"+responsibility"}
            addMember={addResponsibility}
            editMember={updateCard}/>
        <div class ="vline"/>
        <MemberList 
            members={card.collaborators}
            newMemberPlaceholder={"+collaborator"}
            addMember={addCollaborator}
            editMember={updateCard}/>
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
  .card .title{
    display: flex;
    justify-content: center;
    align-items: center;
}

    h1{
          text-align: center;
          margin: 0rem;
      }
  .card .body{
      display:flex;
      gap: 1rem; 
      padding-top: 1rem;  
  }

.vline {
  display: inline-block;
  border-left: 1px solid black;
  width: 0px;
}

h1.editable{
    min-width: 5rem;
    cursor: text;
}
h1.editable:hover{
    background-color: azure;
}

</style>